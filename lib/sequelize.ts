import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Validate environment variables
const requiredEnvVars = ["DATABASE_URL", "NODE_ENV"];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`${varName} is not defined in environment variables`);
  }
});

// Conditional SSL configuration
const dialectOptions =
  process.env.NODE_ENV === "production"
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: true, // Always verify SSL certificate in production
        },
      }
    : {};

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  dialectOptions: {
    ...dialectOptions,
    application_name: "your-app-name", // Useful for monitoring
  },
  pool: {
    max: process.env.NODE_ENV === "production" ? 10 : 5,
    min: process.env.NODE_ENV === "production" ? 2 : 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true, // Enable automatic createdAt/updatedAt
    underscored: true, // Use snake_case for column names
    freezeTableName: true, // Prevent pluralization
  },
  hooks: {
    beforeConnect: async (config) => {
      // Add any pre-connection logic here
    },
  },
});

// Connection test with retries
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

(async () => {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await sequelize.authenticate();
      console.log("Database connection established successfully.");
      return;
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error);
      if (i === MAX_RETRIES - 1) {
        console.error("Maximum connection retries reached. Exiting...");
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
})();

export default sequelize;
