const path = require("path");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcryptjs");

// Import database and models
const { sequelize, User } = require("./models");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const drugRoutes = require("./routes/drugRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminRoutes = require("./routes/adminRoutes");
const pharmacistRoutes = require("./routes/pharmacistRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const qrRoutes = require("./routes/qrRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/drugs", drugRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/pharmacists", pharmacistRoutes);
app.use("/api/qrcode", qrRoutes);
app.use("/api/settings", settingsRoutes);

// Views
app.get("/", (req, res) => res.render("index"));
app.get("/verify", (req, res) => res.render("verify"));
app.get("/about", (req, res) => res.render("about"));
app.get("/contact", (req, res) => res.render("contact"));
app.get("/login", (req, res) => res.render("login"));
app.get("/forgot-password", (req, res) => res.render("forgot-password"));
app.get("/admin", (req, res) => res.render("admin"));
app.get("/pharmacist", (req, res) => res.render("pharmacist"));
app.get("/managedrugs", (req, res) => res.render("managedrugs"));
app.get("/expireddrugs", (req, res) => res.render("expireddrugs"));
app.get("/report", (req, res) => res.render("report"));
app.get("/settings", (req, res) => res.render("settings"));
app.get("/logout", (req, res) => res.render("logout"));
app.get("/druginventory", (req, res) => res.render("druginventory"));
app.get("/verifydrug", (req, res) => res.render("verifydrug"));
app.get("/expireddrug", (req, res) => res.render("expireddrug"));
app.get("/profile", (req, res) => res.render("profile"));
app.get("/pharmacistlogout", (req, res) => res.render("pharmacistlogout"));
app.get("/pharmacistadmin", (req, res) => res.render("pharmacistadmin"));

// Sync database before starting the server
sequelize
  .sync({ force: false }) // ❌ Don't use force:true in production
  .then(() => {
    console.log("✅ Database connected & tables synced!");

    const PORT = process.env.PORT || 1200;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });

app.use(globalErrorHandler);