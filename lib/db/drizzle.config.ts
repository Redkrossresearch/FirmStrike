import { defineConfig } from "drizzle-kit";
import path from "path";
import { resolveDatabaseUrl } from "./src/connection";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts").split(path.sep).join("/"),
  dialect: "postgresql",
  dbCredentials: {
    url: resolveDatabaseUrl(process.env.DATABASE_URL),
    ssl: "require",
  },
});
