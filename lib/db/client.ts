import postgres from 'postgres';
import { getPostgresUrl } from './url';

export function createPostgresClient(options?: { max?: number }) {
  const url = getPostgresUrl();
  const cloud = /supabase\.co|neon\.tech|pooler\.supabase/i.test(url);

  return postgres(url, {
    max: options?.max ?? 10,
    prepare: false,
    ssl: cloud ? 'require' : undefined,
  });
}
