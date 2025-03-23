const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Ensure path is correct

const Settings = sequelize.define("settings", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    admin_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    email_notifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    system_notifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    two_factor_auth: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    session_timeout: {
        type: DataTypes.STRING,
        defaultValue: "30 minutes"
    },
    backup_frequency: {
        type: DataTypes.STRING,
        defaultValue: "Weekly"
    },
    automatic_updates: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true // This ensures createdAt and updatedAt are automatically managed
});

module.exports = Settings;
