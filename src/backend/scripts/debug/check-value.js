import { loadEnvConfig } from '@next/env';
loadEnvConfig('.');
import { sql } from '@vercel/postgres';

async function checkValue() {
  try {
    const result = await sql`
      SELECT breaking_news_is_active, breaking_news_ticker FROM site_settings WHERE id = 1;
    `;
    console.table(result.rows);
  } catch {
    console.error(err);
  }
}

checkValue();
