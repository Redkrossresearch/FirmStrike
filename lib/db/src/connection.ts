/** Supabase direct hosts (db.*.supabase.co) are often IPv6-only; use the IPv4 pooler instead. */
export function resolveDatabaseUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const isDirectSupabase =
      parsed.hostname.startsWith("db.") && parsed.hostname.endsWith(".supabase.co");

    if (!isDirectSupabase) {
      return rawUrl;
    }

    const projectRef = parsed.hostname.slice("db.".length, -".supabase.co".length);
    const region = process.env.SUPABASE_REGION ?? "ap-south-1";
    const poolerPrefix = process.env.SUPABASE_POOLER_PREFIX ?? "aws-1";
    parsed.username = `postgres.${projectRef}`;
    parsed.hostname = `${poolerPrefix}-${region}.pooler.supabase.com`;
    parsed.port = process.env.SUPABASE_POOLER_PORT ?? "5432";
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

export function databaseRequiresSsl(connectionString: string): boolean {
  return (
    connectionString.includes("supabase.co") ||
    connectionString.includes("supabase.com") ||
    process.env.DATABASE_SSL === "true"
  );
}
