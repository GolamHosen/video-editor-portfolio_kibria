// Backup sample videos removed — only user-uploaded projects are displayed
export const fallbackProjects: Array<{
  id: number;
  title: string;
  slug: string;
  shortDescription: string | null;
  client: string | null;
  year: number | null;
  thumbnailUrl: string | null;
  videoPosterUrl: string | null;
  videoUrl?: string | null;
  tags: string[];
  featured: boolean;
  order: number;
  categoryName: string | null;
  categorySlug: string | null;
}> = [];


export const fallbackServices = [
  {
    id: 1,
    title: "Video Editing",
    description: "Professional post-production including color grading, sound design, and motion integration. From short-form social content to long-form documentary and commercial work.",
    icon: "film",
    features: [
      "Color grading & DaVinci Resolve",
      "Sound design & mixing",
      "Multi-cam editing",
      "Fast turnaround",
      "Broadcast quality output",
    ],
    order: 1,
  },
  {
    id: 2,
    title: "Motion Graphics",
    description: "Dynamic motion design that brings brands to life. Logo animations, title sequences, explainer videos, UI animations, and full motion identity systems.",
    icon: "zap",
    features: [
      "Logo animation",
      "Title sequences",
      "Explainer videos",
      "UI/UX animation",
      "Lottie for web/app",
    ],
    order: 2,
  },
  {
    id: 3,
    title: "Graphic Design",
    description: "High-impact visual design across digital and print mediums. Social media assets, presentation decks, marketing collateral, and brand assets.",
    icon: "pen-tool",
    features: [
      "Social media graphics",
      "Pitch deck design",
      "Marketing collateral",
      "Digital advertising assets",
      "Vector illustration",
    ],
    order: 3,
  },
  {
    id: 4,
    title: "Branding & Identity",
    description: "End-to-end brand identity creation. From discovery and concept development to full visual systems, typography rules, color palettes, and brand guidelines.",
    icon: "layers",
    features: [
      "Logo design & marks",
      "Color & typography systems",
      "Brand guidelines",
      "Stationery & templates",
      "Motion brand guidelines",
    ],
    order: 4,
  },
  {
    id: 5,
    title: "Social Media Strategy",
    description: "Content strategy and production designed specifically for social platforms. Short-form video (Reels, TikTok), animated posts, and carousel content.",
    icon: "share-2",
    features: [
      "Reels & TikTok editing",
      "Hook-driven storytelling",
      "Platform-specific sizing",
      "Content calendars",
      "Engagement optimization",
    ],
    order: 5,
  },
];

export const fallbackTestimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    company: "Luxe Mode Studio",
    role: "Creative Director",
    message: "The brand film exceeded every expectation. The ability to capture our brand essence through motion and narrative is truly exceptional. Our campaign performance increased by 340% after launch.",
    imageUrl: null,
    imagePublicId: null,
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
    imageUrl: null,
    imagePublicId: null,
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
    imageUrl: null,
    imagePublicId: null,
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
    imageUrl: null,
    imagePublicId: null,
    rating: 5,
    featured: true,
    order: 4,
  },
];

export const fallbackStats = [
  { value: "8+", label: "Years of Experience" },
  { value: "120+", label: "Projects Completed" },
  { value: "50+", label: "Happy Clients" },
  { value: "12", label: "Countries Served" },
];

export const fallbackSkills = [
  { category: "Video Editing", items: ["Premiere Pro", "DaVinci Resolve", "Final Cut Pro", "Color Grading", "Sound Design"] },
  { category: "Motion Graphics", items: ["After Effects", "Cinema 4D", "Lottie", "Motion Bro", "Cavalry"] },
  { category: "Design", items: ["Photoshop", "Illustrator", "Figma", "InDesign", "Procreate"] },
  { category: "Production", items: ["Direction", "Storyboarding", "Cinematography", "Location Scouting", "Script Writing"] },
];

export const fallbackExperience = [
  { year: "2024", title: "International Campaigns", desc: "Delivered video and motion projects for clients across 12 countries." },
  { year: "2023", title: "Studio Partnership", desc: "Established ongoing partnerships with major creative agencies in London and NYC." },
  { year: "2022", title: "Award Recognition", desc: "Recognized for excellence in visual storytelling at regional creative awards." },
  { year: "2020", title: "Freelance Launch", desc: "Launched as an independent creative, focusing on cinematic brand storytelling." },
  { year: "2016", title: "Creative Journey Begins", desc: "Started as a motion designer at a boutique production studio." },
];

export const fallbackAboutTitle = "Crafting Stories Through Motion";

export const fallbackBio1 =
  "I'm a creative visual artist with 8+ years of experience crafting compelling stories through video, motion graphics, and design. I work at the intersection of art and strategy — creating content that moves people and drives results.";

export const fallbackBio2 =
  "Based globally, working internationally. I partner with brands, agencies, and independent creators to develop visual content that stands out in an increasingly crowded world.";
