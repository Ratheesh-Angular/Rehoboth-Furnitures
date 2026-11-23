import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv(filePath) {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    // Prefer first non-empty value across env files
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv(resolve(root, ".env.local"));
loadEnv(resolve(root, ".dev.vars"));

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error(
    "MONGO_URI is empty. Set it in .env.local (or .dev.vars), then re-run:\n  node scripts/seed-admin.mjs"
  );
  process.exit(1);
}

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

async function seed() {
  await mongoose.connect(mongoUri);

  // Remove legacy email-based admin docs
  const deleteResult = await Admin.collection.deleteMany({
    email: { $exists: true },
    username: { $exists: false },
  });
  if (deleteResult.deletedCount > 0) {
    console.log(`Removed ${deleteResult.deletedCount} legacy email-based admin(s)`);
  }

  const hashed = bcrypt.hashSync("jesus", 10);

  await Admin.findOneAndUpdate(
    { username: "kirubai" },
    { username: "kirubai", password: hashed },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('Admin upserted: username "kirubai"');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
