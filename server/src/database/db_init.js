import { createDatabase, createTables } from "./db_setup.js"
import dotenv from 'dotenv'
dotenv.config()
const initialize_database = async () => {
  console.log({
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
  });

  await createDatabase()
  await createTables()
}

initialize_database()