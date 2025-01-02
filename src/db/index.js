import pkg from "pg";
const { Pool } = pkg;
import { config } from "dotenv";
config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
export const connectDB = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.log("ERROR : ", error);
    pool.end();
  }
};
