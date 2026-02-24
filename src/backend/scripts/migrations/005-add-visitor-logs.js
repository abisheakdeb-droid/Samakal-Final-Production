const { sql } = require('@vercel/postgres');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function up() {
  try {
    console.log('Creating visitor_logs table...');
    await sql`
      CREATE TABLE IF NOT EXISTS visitor_logs (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
        visited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        ip_hash VARCHAR(255),
        user_agent TEXT,
        path TEXT -- To track which page was visited (home vs article)
      );
    `;

    // Create index for faster time-based queries
    await sql`CREATE INDEX IF NOT EXISTS idx_visitor_logs_time ON visitor_logs(visited_at)`;
    
    // Create index for article based queries
    await sql`CREATE INDEX IF NOT EXISTS idx_visitor_logs_article ON visitor_logs(article_id)`;

    console.log('Migration completed: visitor_logs table created.');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

up();
