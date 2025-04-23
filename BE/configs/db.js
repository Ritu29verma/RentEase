require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  String(process.env.DB_PASSWORD), 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: process.env.DB_LOGGING === 'true',
    dialectOptions: {
      connectTimeout: 60000,
    },
  }
);

 const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Postgres connected via Sequelize.");

    // Sync models
    await sequelize.sync({ alter: true });
    console.log("✅ Models synced.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
