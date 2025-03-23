const Report = require("../models/Report");
const Drug = require("../models/Drug");
const Pharmacist = require("../models/Pharmacist");
const Admin = require("../models/Admin");

const { v4: isUuid } = require("uuid");

exports.createReport = async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    let pharmacist_id = req.body.pharmacist_id || req.body.reported_by || (req.user && req.user.id);

    if (!pharmacist_id || pharmacist_id === "pharmacist") {
      console.error("Invalid pharmacist ID:", pharmacist_id);
      return res.status(400).json({ error: "A valid pharmacist ID is required." });
    }

    // ✅ Corrected destructuring
    const { drug_id, report_text } = req.body;

    if (!drug_id || !report_text || !pharmacist_id) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Validate pharmacist_id as UUID
    if (!isUuid(pharmacist_id)) {
      console.error("Invalid UUID format for pharmacist ID:", pharmacist_id);
      return res.status(400).json({ error: "Invalid pharmacist ID format." });
    }

    // Create the report
    const newReport = await Report.create({
      drug_id,
      pharmacist_id,
      report_text,
    });

    return res.status(201).json({ message: "Report submitted successfully", data: newReport });
  } catch (error) {
    console.error("Error creating report:", error);
    return res.status(500).json({ error: error.message });
  }
};

// 📌 Get All Reports (Admins & Pharmacists can view)
exports.getAllReports = async (req, res) => {
    try {
      const reports = await Report.findAll({
        include: [
          { model: Drug, as: "drug", attributes: ["name", "serial_number"] }, // ✅ Correct alias
          { model: Pharmacist, as: "pharmacist", attributes: ["name", "email"] }, // ✅ Correct alias
          { model: Admin, as: "admin", attributes: ["name"] }, // ✅ Correct alias
        ],
      });
  
      res.status(200).json(reports);
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

// 📌 Get Report by ID (Admin & Pharmacists can view specific report)
exports.getReportById = async (req, res) => {
    try {
      const report = await Report.findByPk(req.params.id, {
        include: [
          { model: Drug, as: "drug", attributes: ["name", "serial_number"] }, // ✅ Correct alias
          { model: Pharmacist, as: "pharmacist", attributes: ["name", "email"] }, // ✅ Correct alias
          { model: Admin, as: "admin", attributes: ["name"] }, // ✅ Correct alias
        ],
      });
  
      if (!report) return res.status(404).json({ message: "Report not found" });
  
      res.status(200).json(report);
    } catch (error) {
      console.error("❌ Error fetching report:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  exports.submitReport = async (req, res) => {
    try {
        const { drug_id, reason, reported_by } = req.body;

        console.log("Received Data:", req.body); // Debugging log

        if (!drug_id || !reason) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const newReport = await ReportModel.create({ drug_id, reason, reported_by });

        res.status(201).json({ message: "Report submitted successfully", data: newReport });
    } catch (error) {
        console.error("Error submitting report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 📌 Update Report Status (Only Admins can update)
exports.updateReportStatus = async (req, res) => {
  try {
    const { status, admin_id } = req.body;

    // Validate status
    if (!["pending", "reviewed", "removed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Check if report exists
    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Check if admin exists
    const admin = await Admin.findByPk(admin_id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Update the report
    await report.update({ status, admin_id });

    res.status(200).json({ message: "Report status updated", report });
  } catch (error) {
    console.error("❌ Error updating report status:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    
    // Debug log: Check what reportId is received
    console.log("DEBUG: Deleting report with ID:", reportId);
    
    // Validate reportId is defined and looks like a UUID
    if (!reportId) {
      return res.status(400).json({ message: "Report ID is required." });
    }
    
    // Optionally, if you want to validate the UUID format, you can use a regex or a library like 'uuid'
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(reportId)) {
      return res.status(400).json({ message: "Invalid report ID format." });
    }
    
    // Attempt to find the report by its primary key
    const report = await Report.findByPk(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }
    
    // Delete the report
    await report.destroy();
    return res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};