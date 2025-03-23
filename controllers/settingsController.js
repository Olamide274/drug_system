const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Settings = require("../models/settings");
const bcrypt = require("bcrypt");

// Fetch Admin Settings
exports.getSettings = catchAsync(async (req, res, next) => {
    const settings = await Settings.findOne();

    if (!settings) {
        return next(new AppError("Settings not found", 404));
    }

    res.status(200).json({
        success: true,
        data: settings
    });
});

// Update Admin Email
exports.updateEmail = catchAsync(async (req, res, next) => {
    const { admin_email } = req.body;

    if (!admin_email) {
        return next(new AppError("Email is required", 400));
    }

    const settings = await Settings.findOne();
    if (!settings) {
        return next(new AppError("Settings not found", 404));
    }

    settings.admin_email = admin_email;
    await settings.save();

    res.status(200).json({
        success: true,
        message: "Email updated successfully",
        data: settings
    });
});

// Change Admin Password
exports.updatePassword = catchAsync(async (req, res, next) => {
    const { newPassword } = req.body;

    if (!newPassword) {
        return next(new AppError("New password is required", 400));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const settings = await Settings.findOne();
    if (!settings) {
        return next(new AppError("Settings not found", 404));
    }

    settings.password_hash = hashedPassword;
    await settings.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });
});

// Toggle Notification Settings
exports.updateNotifications = catchAsync(async (req, res, next) => {
    const { email_notifications, system_notifications } = req.body;

    const settings = await Settings.findOne();
    if (!settings) {
        return next(new AppError("Settings not found", 404));
    }

    if (email_notifications !== undefined) {
        settings.email_notifications = email_notifications;
    }
    if (system_notifications !== undefined) {
        settings.system_notifications = system_notifications;
    }

    await settings.save();

    res.status(200).json({
        success: true,
        message: "Notification settings updated successfully",
        data: settings
    });
});

// Update Security Settings
exports.updateSecuritySettings = catchAsync(async (req, res, next) => {
    const { two_factor_auth, session_timeout } = req.body;

    const settings = await Settings.findOne();
    if (!settings) {
        return next(new AppError("Settings not found", 404));
    }

    if (two_factor_auth !== undefined) {
        settings.two_factor_auth = two_factor_auth;
    }
    if (session_timeout) {
        settings.session_timeout = session_timeout;
    }

    await settings.save();

    res.status(200).json({
        success: true,
        message: "Security settings updated successfully",
        data: settings
    });
});

// Update System Settings
exports.updateSystemSettings = catchAsync(async (req, res, next) => {
    const { backup_frequency, automatic_updates } = req.body;

    const settings = await Settings.findOne();
    if (!settings) {
        return next(new AppError("Settings not found", 404));
    }

    if (backup_frequency) {
        settings.backup_frequency = backup_frequency;
    }
    if (automatic_updates !== undefined) {
        settings.automatic_updates = automatic_updates;
    }

    await settings.save();

    res.status(200).json({
        success: true,
        message: "System settings updated successfully",
        data: settings
    });
});
