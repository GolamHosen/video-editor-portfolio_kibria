export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  categoryId: number | null;
  categoryName?: string;
  categorySlug?: string;
  client: string | null;
  year: number | null;
  role: string | null;
  tools: string[];
  featured: boolean | null;
  order: number | null;
  status: "draft" | "published" | "archived" | null;
  thumbnailUrl: string | null;
  thumbnailPublicId: string | null;
  videoUrl: string | null;
  videoPublicId: string | null;
  videoPosterUrl: string | null;
  tags: string[];
  liveUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  media?: Media[];
}

export interface Media {
  id: number;
  projectId: number | null;
  type: "image" | "video" | "gif" | "document";
  cloudinaryPublicId: string | null;
  url: string;
  thumbnailUrl: string | null;
  altText: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  order: number | null;
  createdAt: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  order: number | null;
  createdAt: Date;
}

export interface Testimonial {
  id: number;
  name: string;
  company: string | null;
  role: string | null;
  message: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  rating: number | null;
  featured: boolean | null;
  order: number | null;
  createdAt?: Date;
}

export interface Service {
  id: number;
  title: string;
  description: string | null;
  icon: string | null;
  features: string[];
  order: number | null;
  createdAt?: Date;
}

export interface SiteSetting {
  id: number;
  key: string;
  value: string | null;
  type: string | null;
  updatedAt: Date;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  projectType: string | null;
  budget: string | null;
  read: boolean | null;
  createdAt: Date;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stat {
  id: number;
  label: string;
  value: string;
  order: number | null;
  createdAt?: Date;
}

export interface Skill {
  id: number;
  category: string;
  items: string[];
  order: number | null;
  createdAt?: Date;
}

export interface ExperienceEntry {
  id: number;
  year: string;
  title: string;
  description: string | null;
  order: number | null;
  createdAt?: Date;
}
