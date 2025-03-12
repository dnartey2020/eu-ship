/** @type {import('next').NextConfig} */

// next.config.mjs
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
      net: false,
      tls: false,
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      "pg-hstore": false,
      "pg-native": false,
      pg: false,
      tedious: false,
      mysql2: false,
      mysql: false,
      oracle: false,
      "strong-oracle": false,
      oracledb: false,
      "pg-query-stream": false,
      sqlite3: "sqlite3",
    };
    return config;
  },

  serverExternalPackages: ["sequelize", "sqlite3"],
};

module.exports = nextConfig;
