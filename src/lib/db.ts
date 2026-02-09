import { sql as vercelSql, createClient } from "@vercel/postgres";
import type { QueryResultRow, QueryResult } from "@vercel/postgres";

/**
 * A robust wrapper around Vercel Postgres `sql` that handles both pooled and direct connection strings.
 * 
 * The default `sql` export from @vercel/postgres expects a pooled connection string (e.g. for serverless).
 * If a direct connection string is provided (common in local dev or migrations), it throws a 'VercelPostgresError'.
 * This wrapper catches that specific error and falls back to `createClient` which supports direct connections.
 */
const globalForSql = global as unknown as { fallbackClient: ReturnType<typeof createClient> };

type Primitive = string | number | boolean | null | undefined;

export async function sql<O extends QueryResultRow>(
  strings: TemplateStringsArray, 
  ...values: Primitive[]
): Promise<QueryResult<O>> {
  try {
    return await vercelSql<O>(strings, ...values);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const code = (error as { code?: string })?.code;

    const isConnectionError = 
        code === 'invalid_connection_string' || 
        message.includes('createClient') ||
        message.includes('pooled connection string');

    if (isConnectionError) {
      if (!globalForSql.fallbackClient) {
        globalForSql.fallbackClient = createClient();
        await globalForSql.fallbackClient.connect();
      }
      return await globalForSql.fallbackClient.sql(strings, ...values);
    }
    
    throw error;
  }
}
