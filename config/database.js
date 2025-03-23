const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("drug_verification", "postgres", "olamide", {
  host: "localhost",
  port: 5432, // Make sure this matches the instance with your DB
  dialect: "postgres",
  logging: false,
});

module.exports = sequelize;
