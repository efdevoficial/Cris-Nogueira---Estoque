import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("A variável DATABASE_URL não foi configurada.");
}

const globalForDb = globalThis as unknown as {
  sql?: ReturnType<typeof postgres>;
};

export const sql =
  globalForDb.sql ??
  postgres(connectionString, {
    ssl: "require",
    max: 5,
    idle_timeout: 20,
    connect_timeout: 15,
    prepare: false
  });

if (process.env.NODE_ENV !== "production") globalForDb.sql = sql;
