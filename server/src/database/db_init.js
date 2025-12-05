import { createDatabase, createTables } from "./db_setup.js"
import dotenv from 'dotenv'
dotenv.config()
const initialize_database = async () => {


  await createDatabase()
  await createTables()
}

initialize_database()