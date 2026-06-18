import fs from "fs";
import path from "path";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import { db } from "./prismaClient.js";
import dotenv from "dotenv";
dotenv.config();

// ----------------------
// CONFIG
// ----------------------
const ROOT_DIR = path.join(process.cwd(), "designs");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// ----------------------
// CLOUDINARY CONFIG
// ----------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ----------------------
// HELPERS
// ----------------------
function cleanName(fileName) {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]/g, " ")
    .trim();
}

// ----------------------
// MAIN IMPORT
// ----------------------
async function importDesigns() {
  console.log("🚀 Starting import...");
  console.log("ROOT_DIR:", ROOT_DIR);

  const categories = fs.readdirSync(ROOT_DIR);
  console.log("CATEGORIES FOUND:", categories);

  for (const category of categories) {
    const categoryPath = path.join(ROOT_DIR, category);

    if (!fs.lstatSync(categoryPath).isDirectory()) {
      console.log("SKIPPING NON-DIR:", category);
      continue;
    }

    console.log("\n📁 CATEGORY:", category);

    const files = fs.readdirSync(categoryPath);
    console.log(`FILES FOUND IN ${category}:`, files.length);

    for (const file of files) {
      const fullPath = path.join(categoryPath, file);

      if (fs.lstatSync(fullPath).isDirectory()) {
        console.log("SKIP FOLDER:", file);
        continue;
      }

      // debug every file
      console.log("🔎 FOUND FILE:", file);

      // only images
      if (!/\.(jpg|jpeg|png|jfif)$/i.test(file)) {
        console.log("⛔ SKIPPING (not image):", file);
        continue;
      }

      const name = cleanName(file);

        const existing = await db.template.findFirst({
        where: {
            name,
            category,
        },
        });

        if (existing) {
        console.log(`⏭ SKIPPING DUPLICATE: ${name} (${category})`);
        continue;
        }

        try {
          console.log(`⬆️ Uploading: ${file}`);

          const result = await cloudinary.uploader.upload(fullPath, {
            folder: "designs",
          });

          const imageUrl = result.secure_url;

          const payload = {
            name: cleanName(file),
            category,
            imageUrl,
          };

          console.log("📦 POSTING:", payload);

          const design = await db.template.create({
            data: {
              name: payload.name,
              category: payload.category,
              imageUrl: payload.imageUrl,
              active: true,
            },
          });

          console.log("✅ CREATED:", design.name);

        } catch (err) {
          console.error("❌ FAILED:", file);
          console.error(err?.response?.data || err.message);
        }
    }
  }

  console.log("\n🎉 Import complete!");
}

importDesigns();