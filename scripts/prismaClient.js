import { PrismaClient } from "@prisma/client";
import "dotenv/config";

console.log("DB:", process.env.DATABASE_URL);

export const db = new PrismaClient();