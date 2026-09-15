import "dotenv/config";
import mongoose from "mongoose";
import {
  Category,
  Project,
  Testimonial,
  Service,
  Stat,
  Skill,
  Experience,
  SiteSetting,
  AdminUser,
} from "../models";
import { hashPassword } from "../lib/auth";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kibria_portfolio";

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  console.log("🧹 Clearing old data...");
  await Category.deleteMany({});
  await Project.deleteMany({});
  await Testimonial.deleteMany({});
  await Service.deleteMany({});
  await Stat.deleteMany({});
  await Skill.deleteMany({});
  await Experience.deleteMany({});
  await SiteSetting.deleteMany({});
  await AdminUser.deleteMany({});

  // Categories
  const categoryData = [
    { id: 1, name: "Video Editing", slug: "video-editing", description: "Cinematic video editing and post-production", order: 1 },
    { id: 2, name: "Motion Graphics", slug: "motion-graphics", description: "Dynamic motion graphics and animation", order: 2 },
    { id: 3, name: "Graphic Design", slug: "graphic-design", description: "Visual design and creative concepts", order: 3 },
    { id: 4, name: "Branding", slug: "branding", description: "Brand identity and visual systems", order: 4 },
    { id: 5, name: "Social Media", slug: "social-media", description: "Social media content and campaigns", order: 5 },
  ];

  await Category.insertMany(categoryData);
  console.log(`✅ Categories: ${categoryData.length}`);

  // Projects
  const projectData = [
    {
      id: 1,
      title: "Cinematic Brand Film",
      slug: "cinematic-brand-film",
      shortDescription: "A high-impact brand story for a luxury fashion house.",
      description: `This cinematic brand film was created for a luxury fashion house looking to redefine their visual identity. The project involved location scouting, cinematography direction, color grading, and original motion graphics.

The challenge was to blend the brand's rich heritage with a contemporary, forward-looking aesthetic. Using a combination of slow-motion footage, custom typography animations, and an original score, we crafted a 3-minute narrative that captured the essence of the brand.

The final film was used across digital platforms, retail installations, and international fashion events.`,
      categoryId: 1,
      client: "Luxe Mode Studio",
      year: 2024,
      role: "Video Editor + Motion Designer",
      tools: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Cinema 4D"],
      featured: true,
      order: 1,
      status: "published",
      tags: ["branding", "fashion", "cinematic", "luxury"],
    },
    {
      id: 2,
      title: "Motion Brand Identity",
      slug: "motion-brand-identity",
      shortDescription: "Complete animated brand system for a tech startup.",
      description: `Developed a comprehensive motion brand identity for an emerging tech startup. This included logo animations, UI motion guidelines, presentation templates, and social media templates.

The brand system was designed to be flexible yet consistent across all touchpoints. Key animations include the logo reveal, loading states, and transition patterns used across their digital product.`,
      categoryId: 2,
      client: "Nexus Tech",
      year: 2024,
      role: "Motion Designer",
      tools: ["After Effects", "Illustrator", "Lottie", "Figma"],
      featured: true,
      order: 2,
      status: "published",
      tags: ["branding", "tech", "motion", "identity"],
    },
    {
      id: 3,
      title: "Documentary Series",
      slug: "documentary-series",
      shortDescription: "A 4-part documentary series on urban architecture.",
      description: `A compelling 4-part documentary series exploring the intersection of architecture and human experience in modern cities. Each episode runs 22 minutes and features interviews with leading architects, urban planners, and residents.

Post-production involved color grading, sound design integration, custom motion graphics for data visualizations, and animated chapter cards.`,
      categoryId: 1,
      client: "Urban Stories Media",
      year: 2023,
      role: "Lead Editor",
      tools: ["Premiere Pro", "After Effects", "Audition", "DaVinci Resolve"],
      featured: true,
      order: 3,
      status: "published",
      tags: ["documentary", "architecture", "storytelling"],
    },
    {
      id: 4,
      title: "Product Launch Campaign",
      slug: "product-launch-campaign",
      shortDescription: "Dynamic product reveal video for global product launch.",
      description: `Created a series of product reveal videos for a major consumer electronics brand's flagship product launch. The campaign included a 60-second hero video, 15-second social cuts, and animated feature highlights.

The videos were used across TV, digital, and OOH placements in 12 markets globally.`,
      categoryId: 2,
      client: "TechEdge Corp",
      year: 2024,
      role: "Motion Director",
      tools: ["After Effects", "Cinema 4D", "Premiere Pro", "Photoshop"],
      featured: false,
      order: 4,
      status: "published",
      tags: ["product", "tech", "launch", "commercial"],
    },
    {
      id: 5,
      title: "Brand Identity System",
      slug: "brand-identity-system",
      shortDescription: "Visual identity and brand guidelines for a creative studio.",
      description: `Developed a comprehensive brand identity system for an independent creative studio. The project included logo design, color system, typography, iconography, and an extensive brand guidelines document.

The identity needed to feel premium yet approachable, contemporary yet timeless. The final system has been applied across print, digital, signage, and merchandise.`,
      categoryId: 4,
      client: "Studio Arco",
      year: 2023,
      role: "Brand Designer",
      tools: ["Illustrator", "Figma", "Photoshop", "InDesign"],
      featured: false,
      order: 5,
      status: "published",
      tags: ["branding", "identity", "design", "studio"],
    },
    {
      id: 6,
      title: "Social Media Content",
      slug: "social-media-content",
      shortDescription: "Monthly content creation for a lifestyle brand.",
      description: `Ongoing monthly content creation partnership with a lifestyle brand, producing Instagram Reels, TikTok videos, and static content. The project involves concept development, shooting direction, editing, and motion graphics.

The content strategy focuses on storytelling-led posts that drive engagement and brand awareness, consistently achieving above-average engagement rates.`,
      categoryId: 5,
      client: "Bloom Lifestyle",
      year: 2024,
      role: "Content Director",
      tools: ["Premiere Pro", "After Effects", "Photoshop", "Canva"],
      featured: false,
      order: 6,
      status: "published",
      tags: ["social media", "lifestyle", "content", "reels"],
    },
    {
      id: 7,
      title: "Music Video",
      slug: "music-video",
      shortDescription: "Award-winning music video for an independent artist.",
      description: `Directed and edited a music video for an independent R&B artist. The concept explored themes of identity and transformation through visual metaphors.

The production involved color grading with a distinctive split-toned aesthetic, custom VFX elements, and synchronized motion graphics throughout.`,
      categoryId: 1,
      client: "Alex Rivers",
      year: 2023,
      role: "Director + Editor",
      tools: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Photoshop"],
      featured: false,
      order: 7,
      status: "published",
      tags: ["music video", "narrative", "creative", "artistic"],
    },
    {
      id: 8,
      title: "Event Highlights",
      slug: "event-highlights",
      shortDescription: "Dynamic highlight reel for an international design conference.",
      description: `Created a comprehensive highlight reel and recap series for an international design conference with 5,000+ attendees. The deliverables included a 3-minute main highlights video, individual speaker recaps, and social cuts.

The tight turnaround required same-day editing of keynote sessions and a final delivery within 48 hours of the event close.`,
      categoryId: 1,
      client: "DesignWorld Conf",
      year: 2024,
      role: "Video Editor",
      tools: ["Premiere Pro", "After Effects", "Audition"],
      featured: false,
      order: 8,
      status: "published",
      tags: ["event", "highlights", "conference", "recap"],
    },
  ];

  await Project.insertMany(projectData);
  console.log(`✅ Projects: ${projectData.length}`);

  // Testimonials
  const testimonialData = [
    {
      id: 1,
      name: "Sarah Mitchell",
      company: "Luxe Mode Studio",
      role: "Creative Director",
      message: "The brand film exceeded every expectation. The ability to capture our brand essence through motion and narrative is truly exceptional. Our campaign performance increased by 340% after launch.",
      rating: 5,
      featured: true,
      order: 1,
    },
    {
      id: 2,
      name: "James Chen",
      company: "Nexus Tech",
      role: "CEO & Founder",
      message: "The motion identity system transformed how our brand communicates. Every animation feels purposeful and premium. Our team uses the system daily and it's made a huge difference in presentation quality.",
      rating: 5,
      featured: true,
      order: 2,
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      company: "Urban Stories Media",
      role: "Executive Producer",
      message: "Working on the documentary series was a pleasure. The editorial instincts are sharp, the turnaround was fast, and the final product was beautiful. We've already booked for our next series.",
      rating: 5,
      featured: true,
      order: 3,
    },
    {
      id: 4,
      name: "Marcus Thompson",
      company: "Bloom Lifestyle",
      role: "Brand Manager",
      message: "Our social media engagement has never been higher. The content strategy and production quality consistently outperforms industry benchmarks. Highly recommend for any brand looking to elevate their visual presence.",
      rating: 5,
      featured: false,
      order: 4,
    },
  ];

  await Testimonial.insertMany(testimonialData);
  console.log(`✅ Testimonials: ${testimonialData.length}`);

  // Services
  const serviceData = [
    {
      id: 1,
      title: "Video Editing",
      description: "Professional post-production including color grading, sound design, and motion integration. From short-form social content to long-form documentary and commercial work.",
      icon: "film",
      features: ["Color grading & DaVinci Resolve", "Sound design & mixing", "Multi-cam editing", "Fast turnaround", "Broadcast quality output"],
      order: 1,
    },
    {
      id: 2,
      title: "Motion Graphics",
      description: "Dynamic motion design that brings brands to life. Logo animations, title sequences, explainer videos, UI animations, and full motion identity systems.",
      icon: "zap",
      features: ["Logo animation", "Title sequences", "Explainer videos", "UI/UX animation", "Lottie for web/app"],
      order: 2,
    },
    {
      id: 3,
      title: "Graphic Design",
      description: "Strategic visual design covering brand identities, marketing materials, editorial design, and digital assets. Every design serves both aesthetic and communication goals.",
      icon: "pen-tool",
      features: ["Brand identity design", "Print & editorial", "Digital assets", "Packaging design", "Pitch decks"],
      order: 3,
    },
    {
      id: 4,
      title: "Branding",
      description: "Comprehensive brand development from strategy through visual execution. Includes naming, positioning, visual identity, brand guidelines, and rollout support.",
      icon: "layers",
      features: ["Brand strategy", "Visual identity", "Brand guidelines", "Brand rollout", "Brand audit"],
      order: 4,
    },
    {
      id: 5,
      title: "Social Media Content",
      description: "High-performance social content optimized for each platform. Reels, TikTok, YouTube Shorts, and static content designed to maximize engagement and reach.",
      icon: "share-2",
      features: ["Instagram Reels", "TikTok content", "YouTube Shorts", "Static post design", "Content calendars"],
      order: 5,
    },
  ];

  await Service.insertMany(serviceData);
  console.log(`✅ Services: ${serviceData.length}`);

  // Stats (Years of Experience, Projects Done, Happy Clients, etc.)
  const statData = [
    { id: 1, value: "8+", label: "Years of Experience", order: 1 },
    { id: 2, value: "120+", label: "Projects Completed", order: 2 },
    { id: 3, value: "50+", label: "Happy Clients", order: 3 },
    { id: 4, value: "12", label: "Countries Served", order: 4 },
  ];

  await Stat.insertMany(statData);
  console.log(`✅ Stats: ${statData.length}`);

  // Skills (Tools & Skills groups)
  const skillData = [
    { id: 1, category: "Video Editing", items: ["Premiere Pro", "DaVinci Resolve", "Final Cut Pro", "Color Grading", "Sound Design"], order: 1 },
    { id: 2, category: "Motion Graphics", items: ["After Effects", "Cinema 4D", "Lottie", "Motion Bro", "Cavalry"], order: 2 },
    { id: 3, category: "Design", items: ["Photoshop", "Illustrator", "Figma", "InDesign", "Procreate"], order: 3 },
    { id: 4, category: "Production", items: ["Direction", "Storyboarding", "Cinematography", "Location Scouting", "Script Writing"], order: 4 },
  ];

  await Skill.insertMany(skillData);
  console.log(`✅ Skills: ${skillData.length}`);

  // Experience (career timeline)
  const experienceData = [
    { id: 1, year: "2024", title: "International Campaigns", description: "Delivered video and motion projects for clients across 12 countries.", order: 1 },
    { id: 2, year: "2023", title: "Studio Partnership", description: "Established ongoing partnerships with major creative agencies in London and NYC.", order: 2 },
    { id: 3, year: "2022", title: "Award Recognition", description: "Recognized for excellence in visual storytelling at regional creative awards.", order: 3 },
    { id: 4, year: "2020", title: "Freelance Launch", description: "Launched as an independent creative, focusing on cinematic brand storytelling.", order: 4 },
    { id: 5, year: "2016", title: "Creative Journey Begins", description: "Started as a motion designer at a boutique production studio.", order: 5 },
  ];


  await Experience.insertMany(experienceData);
  console.log(`✅ Experience entries: ${experienceData.length}`);

  // Site Settings
  const settingsData = [
    { id: 1, key: "hero_title", value: "Creative Visual Storyteller", type: "text" },
    { id: 2, key: "hero_subtitle", value: "Video Editor · Motion Designer · Visual Artist", type: "text" },
    { id: 3, key: "hero_cta", value: "View My Work", type: "text" },
    { id: 4, key: "about_title", value: "Crafting Stories Through Motion", type: "text" },
    { id: 5, key: "about_bio", value: "I'm a creative visual artist with 8+ years of experience crafting compelling stories through video, motion graphics, and design. Based globally, working internationally.", type: "text" },
    { id: 6, key: "contact_email", value: "hello@visualcraft.com", type: "text" },
    { id: 7, key: "availability", value: "Available for new projects", type: "text" },
    { id: 8, key: "about_bio_2", value: "Based globally, working internationally. I partner with brands, agencies, and independent creators to develop visual content that stands out in an increasingly crowded world.", type: "text" },
  ];

  await SiteSetting.insertMany(settingsData);
  console.log(`✅ Site Settings: ${settingsData.length}`);

  // Admin User
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const passwordHash = await hashPassword(adminPassword);

    await AdminUser.create({
      id: 1,
      email: adminEmail,
      passwordHash,
      name: "Kibria",
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
  }

  console.log("\n✨ MongoDB Seed complete!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ MongoDB Seed failed:", err);
  process.exit(1);
});
