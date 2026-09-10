import mongoose, { Schema, Document, Model } from "mongoose";

// ── Category Model ──────────────────────────────────────────────────
export interface ICategory extends Document {
  id: number;
  name: string;
  slug: string;
  description?: string;
  order: number;
  createdAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ── Project Model ───────────────────────────────────────────────────
export interface IProject extends Document {
  id: number;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  categoryId?: number;
  client?: string;
  year?: number;
  role?: string;
  tools: string[];
  featured: boolean;
  order: number;
  status: "draft" | "published" | "archived";
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
  videoUrl?: string;
  videoPublicId?: string;
  videoPosterUrl?: string;
  tags: string[];
  liveUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    shortDescription: { type: String },
    categoryId: { type: Number },
    client: { type: String },
    year: { type: Number },
    role: { type: String },
    tools: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published", "archived"], default: "published" },
    thumbnailUrl: { type: String },
    thumbnailPublicId: { type: String },
    videoUrl: { type: String },
    videoPublicId: { type: String },
    videoPosterUrl: { type: String },
    tags: { type: [String], default: [] },
    liveUrl: { type: String },
  },
  { timestamps: true }
);

// ── Media Model ─────────────────────────────────────────────────────
export interface IMedia extends Document {
  id: number;
  projectId?: number;
  type: "image" | "video" | "gif" | "document";
  cloudinaryPublicId?: string;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  width?: number;
  height?: number;
  duration?: number;
  order: number;
  createdAt: Date;
}

const MediaSchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    projectId: { type: Number },
    type: { type: String, enum: ["image", "video", "gif", "document"], default: "image" },
    cloudinaryPublicId: { type: String },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    altText: { type: String },
    width: { type: Number },
    height: { type: Number },
    duration: { type: Number },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ── Testimonial Model ───────────────────────────────────────────────
export interface ITestimonial extends Document {
  id: number;
  name: string;
  company?: string;
  role?: string;
  message: string;
  imageUrl?: string;
  imagePublicId?: string;
  rating: number;
  featured: boolean;
  order: number;
  createdAt: Date;
}

const TestimonialSchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    company: { type: String },
    role: { type: String },
    message: { type: String, required: true },
    imageUrl: { type: String },
    imagePublicId: { type: String },
    rating: { type: Number, default: 5 },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ── Service Model ───────────────────────────────────────────────────
export interface IService extends Document {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  features: string[];
  order: number;
  createdAt: Date;
}

const ServiceSchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    features: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ── SiteSetting Model ───────────────────────────────────────────────
export interface ISiteSetting extends Document {
  id: number;
  key: string;
  value?: string;
  type: string;
  updatedAt: Date;
}

const SiteSettingSchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    key: { type: String, required: true, unique: true },
    value: { type: String },
    type: { type: String, default: "text" },
  },
  { timestamps: true }
);

// ── ContactSubmission Model ─────────────────────────────────────────
export interface IContactSubmission extends Document {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  projectType?: string;
  budget?: string;
  read: boolean;
  createdAt: Date;
}

const ContactSubmissionSchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    projectType: { type: String },
    budget: { type: String },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ── AdminUser Model ─────────────────────────────────────────────────
export interface IAdminUser extends Document {
  id: number;
  email: string;
  passwordHash: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
  },
  { timestamps: true }
);

// ── Comment / Review Model ──────────────────────────────────────────
export interface IComment extends Document {
  id: number;
  projectId: number;
  projectSlug: string;
  projectTitle: string;
  name: string;
  role?: string;
  email?: string;
  rating: number; // 1 to 5 stars
  comment: string;
  status: "approved" | "pending" | "spam";
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    projectId: { type: Number, required: true, index: true },
    projectSlug: { type: String, required: true, index: true },
    projectTitle: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String },
    email: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    status: { type: String, enum: ["approved", "pending", "spam"], default: "approved" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ── Indexes for high-performance querying ─────────────────────────────
ProjectSchema.index({ status: 1, order: 1, createdAt: -1 });
ProjectSchema.index({ status: 1, featured: -1 });
ProjectSchema.index({ categoryId: 1 });
CategorySchema.index({ order: 1 });
ContactSubmissionSchema.index({ read: 1, createdAt: -1 });
CommentSchema.index({ status: 1, createdAt: -1 });
CommentSchema.index({ projectId: 1, status: 1 });
ServiceSchema.index({ order: 1 });
TestimonialSchema.index({ featured: 1, order: 1 });

// ── Export Models (Handling Next.js hot-reload model re-declarations) ─
export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export const SiteSetting: Model<ISiteSetting> =
  mongoose.models.SiteSetting || mongoose.model<ISiteSetting>("SiteSetting", SiteSettingSchema);

export const ContactSubmission: Model<IContactSubmission> =
  mongoose.models.ContactSubmission ||
  mongoose.model<IContactSubmission>("ContactSubmission", ContactSubmissionSchema);

export const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser || mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);

export const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
