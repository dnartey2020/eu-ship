const path = require("path");

module.exports = {
  config: path.resolve(__dirname, "config/config.ts"),
  "models-path": path.resolve(__dirname, "models"),
  "migrations-path": path.resolve(__dirname, "migrations"),
  "seeders-path": path.resolve(__dirname, "seeders"),
};
