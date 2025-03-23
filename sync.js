const { sequelize } = require("./models"); // Correct import

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true }); // Use `force: true` carefully
    console.log("✅ Database & tables synced successfully!");
    process.exit(); // Exit after sync
  } catch (error) {
    console.error("❌ Database sync failed:", error);
    process.exit(1); // Exit with error code
  }
}

syncDatabase();
