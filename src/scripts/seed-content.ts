// One-off: populates ONLY the new content collections without touching existing data.
// Unlike seed.ts, this never deletes projects, categories, testimonials or settings.
import "dotenv/config";
import mongoose from "mongoose";
import { Stat, Skill, Experience, SiteSetting } from "../models";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kibria_portfolio";

const statData = [
  { id: 1, value: "8+", label: "Years of Experience", order: 1 },
  { id: 2, value: "120+", label: "Projects Completed", order: 2 },
  { id: 3, value: "50+", label: "Happy Clients", order: 3 },
  { id: 4, value: "12", label: "Countries Served", order: 4 },
];

const skillData = [
  { id: 1, category: "Video Editing", items: ["Premiere Pro", "DaVinci Resolve", "Final Cut Pro", "Color Grading", "Sound Design"], order: 1 },
  { id: 2, category: "Motion Graphics", items: ["After Effects", "Cinema 4D", "Lottie", "Motion Bro", "Cavalry"], order: 2 },
  { id: 3, category: "Design", items: ["Photoshop", "Illustrator", "Figma", "InDesign", "Procreate"], order: 3 },
  { id: 4, category: "Production", items: ["Direction", "Storyboarding", "Cinematography", "Location Scouting", "Script Writing"], order: 4 },
];

const experienceData = [
  { id: 1, year: "2024", title: "International Campaigns", description: "Delivered video and motion projects for clients across 12 countries.", order: 1 },
  { id: 2, year: "2023", title: "Studio Partnership", description: "Established ongoing partnerships with major creative agencies in London and NYC.", order: 2 },
  { id: 3, year: "2022", title: "Award Recognition", description: "Recognized for excellence in visual storytelling at regional creative awards.", order: 3 },
  { id: 4, year: "2020", title: "Freelance Launch", description: "Launched as an independent creative, focusing on cinematic brand storytelling.", order: 4 },
  { id: 5, year: "2016", title: "Creative Journey Begins", description: "Started as a motion designer at a boutique production studio.", order: 5 },
];

async function main() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected");

  if ((await Stat.countDocuments()) === 0) {
    await Stat.insertMany(statData);
    console.log(`✅ Stats seeded: ${statData.length}`);
  } else {
    console.log("⏭ Stats already exist — skipped");
  }

  if ((await Skill.countDocuments()) === 0) {
    await Skill.insertMany(skillData);
    console.log(`✅ Skills seeded: ${skillData.length}`);
  } else {
    console.log("⏭ Skills already exist — skipped");
  }

  if ((await Experience.countDocuments()) === 0) {
    await Experience.insertMany(experienceData);
    console.log(`✅ Experience seeded: ${experienceData.length}`);
  } else {
    console.log("⏭ Experience already exist — skipped");
  }

  const bio2 = await SiteSetting.findOne({ key: "about_bio_2" });
  if (!bio2) {
    const max = await SiteSetting.findOne({}).sort({ id: -1 }).lean();
    await SiteSetting.create({
      id: max && max.id ? max.id + 1 : 1,
      key: "about_bio_2",
      value:
        "Based globally, working internationally. I partner with brands, agencies, and independent creators to develop visual content that stands out in an increasingly crowded world.",
      type: "text",
    });
    console.log("✅ about_bio_2 setting created");
  } else {
    console.log("⏭ about_bio_2 already exists — skipped");
  }

  await mongoose.disconnect();
  console.log("\n✨ Done (existing data untouched)");
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
