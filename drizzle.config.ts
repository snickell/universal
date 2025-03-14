import 'dotenv/config'
import type { Config } from "drizzle-kit";

export const devConfig = {
  dialect: 'sqlite',
  schema: "./server/drizzle/schema.ts",
  out: "./server/drizzle/migrations",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
} satisfies Config

export const prodConfig = {
  ...devConfig,
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  }
} satisfies Config

export default devConfig
