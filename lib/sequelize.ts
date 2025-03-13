// lib/db.ts
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

// Declare a global variable to avoid multiple instances during hot reloads
declare global {
  // eslint-disable-next-line no-var
  var sequelize: Sequelize | undefined;
}

const sequelize =
  globalThis.sequelize ??
  new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    // In production, enforce SSL; in development, this can be omitted
    dialectOptions:
      process.env.NODE_ENV === "production"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : undefined,
    // Enable logging in development for debugging; disable in production
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  });

// In non-production environments, cache the instance on globalThis
if (process.env.NODE_ENV !== "production") {
  globalThis.sequelize = sequelize;
}

export default sequelize;
