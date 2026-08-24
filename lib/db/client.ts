import postgres from 'postgres';
import { getPostgresUrl } from './url';

export function createPostgresClient(options?: { max?: number }) {
  const url = getPostgresUrl();
  const cloud = /supabase\.co|neon\.tech|pooler\.supabase/i.test(url);

  return postgres(url, {
    max: options?.max ?? 5,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 20,
    ssl: cloud ? 'require' : undefined,
  });
}
