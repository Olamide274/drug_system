const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Drug = require("./Drug");
const Pharmacist = require("./Pharmacist");
const Admin = require("./Admin");

class Report extends Model {}

Report.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    drug_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Drug,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    pharmacist_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Pharmacist,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    admin_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Admin,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    report_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Report",
    tableName: "reports",
    timestamps: false,
  }
);

// ✅ Define Associations
Report.belongsTo(Drug, { foreignKey: "drug_id", as: "drug" });
Report.belongsTo(Pharmacist, { foreignKey: "pharmacist_id", as: "pharmacist" });
Report.belongsTo(Admin, { foreignKey: "admin_id", as: "admin" });

module.exports = Report;
