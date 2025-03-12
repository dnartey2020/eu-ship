// lib/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

let sequelize;

// To avoid multiple Sequelize instances during hot reloads in development
if (!global.sequelize) {
  global.sequelize = new Sequelize(process.env.DATABASE_URL!, {
    dialect: "postgres",
    protocol: "postgres",
    sync: { force: true },
    dialectOptions: {
      ssl: {
        require: true,
        // The following option may be necessary for some providers like Neon:
        rejectUnauthorized: false,
      },
    },
    logging: false, // Disable logging in production
  });
}

sequelize = global.sequelize;

export default sequelize;
