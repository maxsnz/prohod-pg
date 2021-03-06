require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
  },
  "production": {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    use_env_variable: "DATABASE_URL",
    // native: true,
  }
};
