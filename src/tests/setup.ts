import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

beforeAll(async () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL is not defined");
  await mongoose.connect(dbUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
});
