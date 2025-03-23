const express = require("express");
const settingsController = require("../controllers/settingsController");

const router = express.Router();

router.get("/", settingsController.getSettings); // Get settings
router.put("/email", settingsController.updateEmail); // Update email
router.put("/password", settingsController.updatePassword); // Update password
router.put("/notifications", settingsController.updateNotifications); // Update notifications
router.put("/security", settingsController.updateSecuritySettings); // Update security settings
router.put("/system", settingsController.updateSystemSettings); // Update system settings

module.exports = router;
