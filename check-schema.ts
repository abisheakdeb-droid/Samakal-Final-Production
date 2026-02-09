import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@vercel/postgres";

async function checkSchema() {
    const client = createClient({
        connectionString: process.env.POSTGRES_URL_NON_POOLING
    });
    await client.connect();
    
    try {
        console.log("Checking for push_subscriptions table...");
        const result = await client.sql`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'push_subscriptions'
            );
        `;
        console.log("Table exists:", result.rows[0].exists);
        
        if (result.rows[0].exists) {
            const columns = await client.sql`
                SELECT column_name, data_type, column_default
                FROM information_schema.columns 
                WHERE table_name = 'push_subscriptions';
            `;
            console.log("Columns:", columns.rows);
        } else {
            console.log("Creating push_subscriptions table...");
            await client.sql`
                CREATE TABLE push_subscriptions (
                    id SERIAL PRIMARY KEY,
                    user_id UUID,
                    endpoint TEXT UNIQUE NOT NULL,
                    p256dh TEXT NOT NULL,
                    auth TEXT NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            `;
            console.log("Table created successfully.");
        }
    } catch (error) {
        console.error("Schema Check Error:", error);
    } finally {
        await client.end();
    }
}

checkSchema();
