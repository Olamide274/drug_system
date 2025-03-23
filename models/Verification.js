const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Drug = require("./Drug");  // ✅ Import Drug model
const Pharmacist = require("./Pharmacist"); // ✅ Import Pharmacist model

const Verification = sequelize.define(
  "Verification",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    drugId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Drug, key: "id" },
    },
    pharmacistId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Pharmacist, key: "id" },
    },
    status: {
      type: DataTypes.ENUM("pending", "verified", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "verifications",
    timestamps: false, // ✅ Explicitly disable timestamps
  }
);

// ✅ Define relationships
Verification.belongsTo(Drug, { foreignKey: "drugId", onDelete: "CASCADE" });
Drug.hasMany(Verification, { foreignKey: "drugId", onDelete: "CASCADE" });

Verification.belongsTo(Pharmacist, { foreignKey: "pharmacistId", onDelete: "CASCADE" });
Pharmacist.hasMany(Verification, { foreignKey: "pharmacistId", onDelete: "CASCADE" });

module.exports = Verification;
