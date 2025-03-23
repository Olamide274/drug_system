const { Drug, Admin } = require("../models"); // ✅ Import Drug from models
const { Op } = require("sequelize"); // ✅ Import Op for date comparison
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// ✅ Create a new drug entry
exports.createDrug = catchAsync(async (req, res, next) => {
  const { name, serial_number, qr_code, manufacturer, manufacturing_date, expiry_date, added_by } = req.body;

  // ✅ Check if `added_by` exists in Admins table
  const adminExists = await Admin.findByPk(added_by);
  if (!adminExists) {
    return next(new AppError("Invalid admin ID. The admin does not exist.", 400));
  }

  // ✅ Insert new drug only if `added_by` is valid
  const drug = await Drug.create({
    name,
    serial_number,
    qr_code,
    manufacturer,
    manufacturing_date,
    expiry_date,
    added_by,
  });

  res.status(201).json({ message: "Drug added successfully", drug });
});

// ✅ Get all drugs
exports.getAllDrugs = catchAsync(async (req, res, next) => {
  const drugs = await Drug.findAll();
  res.status(200).json({ status: "success", results: drugs.length, data: drugs });
});

// ✅ Get a single drug by ID
exports.getDrugById = catchAsync(async (req, res, next) => {
  const drug = await Drug.findByPk(req.params.id);
  if (!drug) return next(new AppError("Drug not found", 404));

  res.status(200).json({ status: "success", data: drug });
});

// ✅ Get all expired drug
exports.getExpiredDrugs = catchAsync(async (req, res, next) => {
  const today = new Date();

  console.log("📌 DEBUG: Fetching expired drugs where expiry_date < ", today);

  // ✅ Fetch expired drugs
  const expiredDrugs = await Drug.findAll({
    where: {
      expiry_date: { [Op.lt]: today }, // ✅ Ensure correct column name
    },
  });

  console.log("📌 DEBUG: Expired drugs found:", expiredDrugs);

  if (!expiredDrugs || expiredDrugs.length === 0) {
    console.log("❌ DEBUG: No expired drugs found.");
    return res.status(404).json({
      success: false,
      status: "fail",
      message: "No expired drugs found",
    });
  }

  res.status(200).json({
    success: true,
    status: "success",
    results: expiredDrugs.length,
    data: expiredDrugs,
  });
});
// ✅ Get a specific expired drug by ID
exports.getExpiredDrugById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const today = new Date();

  const drug = await Drug.findOne({
    where: {
      id,
      expiry_date: { [Op.lt]: today }, // ✅ Only fetch if expired
    },
  });

  if (!drug) return next(new AppError("Expired drug not found", 404));

  res.status(200).json({ status: "success", data: drug });
});

// ✅ Update drug details (Prevent updating serial_number)
exports.updateDrug = catchAsync(async (req, res, next) => {
  const { name, manufacturer, expiry_date } = req.body;
  const drug = await Drug.findByPk(req.params.id);

  if (!drug) return next(new AppError("Drug not found", 404));

  await drug.update({ name, manufacturer, expiry_date });

  res.status(200).json({ message: "Drug updated successfully", drug });
});

// ✅ Delete a drug
exports.deleteDrug = catchAsync(async (req, res, next) => {
  const drug = await Drug.findByPk(req.params.id);
  if (!drug) return next(new AppError("Drug not found", 404));

  await drug.destroy();
  res.status(200).json({ message: "Drug deleted successfully" });
});
