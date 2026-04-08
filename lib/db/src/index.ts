import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;
const missingDatabaseError =
  "DATABASE_URL must be set. Did you forget to provision a database?";

const createDb = (client: pg.Pool) => drizzle(client, { schema });
type Database = ReturnType<typeof createDb>;

export const pool = databaseUrl ? new Pool({ connectionString: databaseUrl }) : null;
export const db: Database = pool
  ? createDb(pool)
  : (new Proxy(
      {},
      {
        get() {
          throw new Error(missingDatabaseError);
        },
      },
    ) as Database);

export * from "./schema";
