const bcrypt = require("bcryptjs");
const { Admin } = require("./models"); // Adjust path if needed

async function hashExistingAdminPasswords() {
  const admins = await Admin.findAll();

  for (const admin of admins) {
    if (!admin.password.startsWith("$2")) { // ✅ Avoid re-hashing already hashed passwords
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      admin.password = hashedPassword;
      await admin.save();
      console.log(`✅ Hashed password for Admin: ${admin.email}`);
    }
  }

  console.log("🔄 All existing admin passwords are now hashed!");
}

hashExistingAdminPasswords();
