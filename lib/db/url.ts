import { config } from 'dotenv';

config({ path: '.env.local' });

export function getPostgresUrl(): string {
  const keys = [
    'POSTGRES_URL',
    'DATABASE_URL',
    'POSTGRES_PRISMA_URL',
    'POSTGRES_URL_NON_POOLING',
    'DATABASE_URL_UNPOOLED',
  ];

  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value && /^(postgres|postgresql):\/\//i.test(value)) {
      if (/@db\.[^/]+\.supabase\.co/i.test(value)) {
        throw new Error(
          'POSTGRES_URL uses db.*.supabase.co, which often does not resolve (ENOTFOUND). In Supabase: Connect → Session pooler URI. The host must contain pooler.supabase.com, not db.….supabase.co. Also replace [YOUR-PASSWORD] with your real database password.',
        );
      }
      return value;
    }
  }

  throw new Error(
    'No Postgres URL found. Set POSTGRES_URL or DATABASE_URL in .env.local to a postgresql:// string from Neon or Supabase. Not a stack-auth URL.',
  );
}
