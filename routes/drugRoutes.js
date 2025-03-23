const express = require("express");
const router = express.Router();
const drugController = require("../controllers/drugController"); // ✅ Ensure this exists

// ✅ Get a specific expired drug by ID (MUST COME BEFORE `/expired`)
router.get("/expired/:id", drugController.getExpiredDrugById);

// ✅ Get all expired drugs
router.get("/expired", drugController.getExpiredDrugs);

// ✅ CRUD Routes
router.post("/", drugController.createDrug);
router.get("/", drugController.getAllDrugs);
router.get("/:id", drugController.getDrugById);
router.put("/:id", drugController.updateDrug);
router.delete("/:id", drugController.deleteDrug);

module.exports = router;
