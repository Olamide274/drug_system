const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
const Admin = db.Admin;
const Pharmacist = db.Pharmacist;
const AppError = require("../utils/appError");

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new AppError("You are not logged in", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decoded.role === "admin") {
      user = await Admin.findByPk(decoded.id);
    } else if (decoded.role === "pharmacist") {
      user = await Pharmacist.findByPk(decoded.id);
    } else {
      user = await User.findByPk(decoded.id);
    }

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    req.user = user; // ✅ Correctly assign the user
    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error);
    return next(new AppError("Invalid token", 401));
  }
};
