import { Pool } from "pg"
import dotenv from "dotenv"
dotenv.config()

const db_name = process.env.DB_NAME || "educonnect";

const configWithOutDB = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: `${process.env.DB_PASSWORD}`,
  port: Number(process.env.DB_PORT) || 5432,
  database: 'postgres',
};

export const defaultPool = new Pool(configWithOutDB)
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: db_name,
  password: `${process.env.DB_PASSWORD}`,
  port: Number(process.env.DB_PORT) || 5432,
});
export const host_pool = new Pool({
  connectionString: "postgresql://educonnect:KRRyvVQk6FO4S6UYUIIxLtnPQGXGOJUm@dpg-d4o22g75r7bs73cdiorg-a.oregon-postgres.render.com/educonnect_2h47",
  ssl: {
    rejectUnauthorized: false
  }
});