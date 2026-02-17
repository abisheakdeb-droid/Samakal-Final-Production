import { sql } from '../src/lib/db.js';

async function checkArticle() {
    try {
        const result = await sql`
            SELECT id, title, slug, public_id, 
                   LENGTH(content) as content_length,
                   SUBSTRING(content, 1, 100) as content_preview
            FROM articles 
            WHERE public_id = 1
        `;
        
        console.log('Article with public_id = 1:');
        console.table(result.rows);
        
        if (result.rows.length > 0 && result.rows[0].content_length === 0) {
            console.log('\n⚠️  WARNING: Article has ZERO content!');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

checkArticle();
