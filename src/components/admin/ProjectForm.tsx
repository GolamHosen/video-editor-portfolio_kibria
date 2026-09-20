"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, ArrowLeft, X, Plus, Upload, Film, Image as ImageIcon, Trash2, Loader2 } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProjectData {
  id?: number;
  title?: string;
  slug?: string;
  description?: string | null;
  shortDescription?: string | null;
  categoryId?: number | null;
  client?: string | null;
  year?: number | null;
  role?: string | null;
  tools?: string[] | null;
  featured?: boolean | null;
  order?: number | null;
  status?: "draft" | "published" | "archived" | null;
  thumbnailUrl?: string | null;
  thumbnailPublicId?: string | null;
  videoUrl?: string | null;
  videoPublicId?: string | null;
  videoPosterUrl?: string | null;
  liveUrl?: string | null;
  tags?: string[] | null;
}

interface ProjectFormProps {
  project?: ProjectData;
  categories: Category[];
}

const inputClasses =
  "w-full bg-neutral-900 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors duration-200";

export function ProjectForm({ project, categories }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!project?.id;

  const [formData, setFormData] = useState({
    title: project?.title || "",
    slug: project?.slug || "",
    description: project?.description || "",
    shortDescription: project?.shortDescription || "",
    categoryId: project?.categoryId ? String(project.categoryId) : "",
    client: project?.client || "",
    year: project?.year ? String(project.year) : String(new Date().getFullYear()),
    role: project?.role || "",
    tools: project?.tools?.join(", ") || "",
    featured: project?.featured !== undefined ? Boolean(project.featured) : true,
    order: project?.order ? String(project.order) : "0",
    status: (project?.status as "draft" | "published" | "archived") || "published",
    thumbnailUrl: project?.thumbnailUrl || "",
    thumbnailPublicId: project?.thumbnailPublicId || "",
    videoUrl: project?.videoUrl || "",
    videoPublicId: project?.videoPublicId || "",
    videoPosterUrl: project?.videoPosterUrl || "",
    liveUrl: project?.liveUrl || "",
    tags: project?.tags?.join(", ") || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const handleFileUpload = async (
    file: File,
    targetField: "thumbnailUrl" | "videoUrl" | "videoPosterUrl",
    publicIdField?: "thumbnailPublicId" | "videoPublicId"
  ) => {
    setUploadingField(targetField);
    setError("");

    try {
      const isVideo = file.type.startsWith("video/");
      const resourceType = isVideo ? "video" : "image";
      const PROXY_LIMIT = 4 * 1024 * 1024; // 4MB — Vercel serverless body limit

      let uploadData: { secure_url: string; public_id: string };

      if (file.size <= PROXY_LIMIT) {
        // ── Small file: upload through our API proxy (no CORS) ──
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "portfolio");
        fd.append("resource_type", resourceType);
        fd.append("mode", "proxy");

        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Upload failed");
        }
        uploadData = await res.json();
      } else {
        // ── Large file: get signed params, then upload directly to Cloudinary ──
        // Step 1 — get a server-generated signature (secure, no secrets exposed)
        const fd = new FormData();
        fd.append("mode", "sign");
        fd.append("folder", "portfolio");
        fd.append("resource_type", resourceType);

        const sigRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (!sigRes.ok) {
          const err = await sigRes.json();
          throw new Error(err.error || "Failed to authorize upload");
        }
        const { signature, timestamp, cloudName, apiKey, folder } = await sigRes.json();

        // Step 2 — upload directly to Cloudinary with signed params
        const cloudFd = new FormData();
        cloudFd.append("file", file);
        cloudFd.append("api_key", apiKey);
        cloudFd.append("timestamp", timestamp.toString());
        cloudFd.append("signature", signature);
        cloudFd.append("folder", folder);

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
        const uploadRes = await fetch(uploadUrl, { method: "POST", body: cloudFd });

        if (!uploadRes.ok) {
          const errJson = await uploadRes.json();
          throw new Error(errJson.error?.message || "Upload failed");
        }
        uploadData = await uploadRes.json();
      }

      const isVideoField = targetField === "videoUrl";
      const autoPoster = isVideoField && !formData.videoPosterUrl
        ? uploadData.secure_url.replace(/\.(mp4|webm|mov|m4v|ogv)$/i, "") + ".jpg"
        : null;

      setFormData((prev) => ({
        ...prev,
        [targetField]: uploadData.secure_url,
        ...(publicIdField ? { [publicIdField]: uploadData.public_id } : {}),
        ...(autoPoster ? { videoPosterUrl: autoPoster } : {}),
      }));
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload file");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description || null,
      shortDescription: formData.shortDescription || null,
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      client: formData.client || null,
      year: formData.year ? parseInt(formData.year) : null,
      role: formData.role || null,
      tools: formData.tools ? formData.tools.split(",").map((t) => t.trim()).filter(Boolean) : [],
      featured: formData.featured,
      order: parseInt(formData.order) || 0,
      status: formData.status,
      thumbnailUrl: formData.thumbnailUrl || null,
      thumbnailPublicId: formData.thumbnailPublicId || null,
      videoUrl: formData.videoUrl || null,
      videoPublicId: formData.videoPublicId || null,
      videoPosterUrl: formData.videoPosterUrl || null,
      liveUrl: formData.liveUrl || null,
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };

    try {
      const url = isEditing
        ? `/api/admin/projects/${project!.id}`
        : "/api/admin/projects";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save project");
      } else {
        router.push("/admin/projects");
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-white font-bold text-xl">
                {isEditing ? "Edit Project" : "New Project"}
              </h1>
              <p className="text-neutral-600 text-sm">
                {isEditing ? project?.title : "Create a new portfolio project"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-neutral-500 hover:text-white text-sm border border-white/10 px-4 py-2 rounded-lg hover:border-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              form="project-form"
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-white text-black text-sm font-bold px-4 py-2 rounded-lg hover:bg-neutral-100 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Save size={14} />
              {saving ? "Saving..." : "Save Project"}
            </button>
          </div>
        </div>

        <form id="project-form" onSubmit={handleSubmit} className="p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main fields */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-neutral-900 rounded-xl border border-white/5 p-6">
                <h2 className="text-white font-bold text-sm mb-5">Project Info</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide">Title *</label>
                    <input name="title" required value={formData.title} onChange={handleTitleChange} placeholder="Project title" className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide">Slug</label>
                    <input name="slug" value={formData.slug} onChange={handleChange} placeholder="auto-generated-from-title" className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide">Short Description</label>
                    <input name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="One-line description for cards" className={inputClasses} maxLength={500} />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide">Full Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={8} placeholder="Full project description..." className={`${inputClasses} resize-none`} />
                  </div>
                </div>
              </div>

              {/* Media Section with Cloudinary Upload */}
              <div className="bg-neutral-900 rounded-xl border border-white/5 p-6">
                <h2 className="text-white font-bold text-sm mb-5 flex items-center justify-between">
                  <span>Media Assets (Cloudinary)</span>
                  <span className="text-xs font-normal text-neutral-500">Direct upload to Cloudinary CDN</span>
                </h2>
                
                <div className="space-y-6">
                  {/* Thumbnail Image Upload */}
                  <div className="border border-white/5 rounded-xl p-4 bg-neutral-950/40">
                    <label className="block text-xs text-neutral-400 font-semibold mb-2 uppercase tracking-wide flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><ImageIcon size={14} /> Thumbnail Image</span>
                      {formData.thumbnailUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, thumbnailUrl: "", thumbnailPublicId: "" }))}
                          className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      )}
                    </label>

                    {formData.thumbnailUrl ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 mb-3 bg-black">
                        <Image
                          src={formData.thumbnailUrl}
                          alt="Thumbnail Preview"
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="flex gap-2">
                      <input
                        name="thumbnailUrl"
                        value={formData.thumbnailUrl}
                        onChange={handleChange}
                        placeholder="https://res.cloudinary.com/... or paste image URL"
                        className={inputClasses}
                      />
                      <label className="cursor-pointer flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium px-4 py-3 rounded-xl border border-white/10 shrink-0 transition-colors">
                        {uploadingField === "thumbnailUrl" ? (
                          <Loader2 size={14} className="animate-spin text-white" />
                        ) : (
                          <Upload size={14} />
                        )}
                        <span>{uploadingField === "thumbnailUrl" ? "Uploading..." : "Upload File"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, "thumbnailUrl", "thumbnailPublicId");
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Video URL Upload */}
                  <div className="border border-white/5 rounded-xl p-4 bg-neutral-950/40">
                    <label className="block text-xs text-neutral-400 font-semibold mb-2 uppercase tracking-wide flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><Film size={14} /> Showcase Video</span>
                      {formData.videoUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, videoUrl: "", videoPublicId: "" }))}
                          className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      )}
                    </label>

                    {formData.videoUrl ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 mb-3 bg-black">
                        <video src={formData.videoUrl} controls className="w-full h-full object-cover" />
                      </div>
                    ) : null}

                    <div className="flex gap-2">
                      <input
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleChange}
                        placeholder="https://res.cloudinary.com/... or paste video URL"
                        className={inputClasses}
                      />
                      <label className="cursor-pointer flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium px-4 py-3 rounded-xl border border-white/10 shrink-0 transition-colors">
                        {uploadingField === "videoUrl" ? (
                          <Loader2 size={14} className="animate-spin text-white" />
                        ) : (
                          <Upload size={14} />
                        )}
                        <span>{uploadingField === "videoUrl" ? "Uploading..." : "Upload Video"}</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, "videoUrl", "videoPublicId");
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Video Poster Image Upload */}
                  <div className="border border-white/5 rounded-xl p-4 bg-neutral-950/40">
                    <label className="block text-xs text-neutral-400 font-semibold mb-2 uppercase tracking-wide flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><ImageIcon size={14} /> Video Poster Image (Optional)</span>
                      {formData.videoPosterUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, videoPosterUrl: "" }))}
                          className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      )}
                    </label>

                    {formData.videoPosterUrl ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 mb-3 bg-black">
                        <Image
                          src={formData.videoPosterUrl}
                          alt="Poster Preview"
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="flex gap-2">
                      <input
                        name="videoPosterUrl"
                        value={formData.videoPosterUrl}
                        onChange={handleChange}
                        placeholder="https://... (poster preview image)"
                        className={inputClasses}
                      />
                      <label className="cursor-pointer flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium px-4 py-3 rounded-xl border border-white/10 shrink-0 transition-colors">
                        {uploadingField === "videoPosterUrl" ? (
                          <Loader2 size={14} className="animate-spin text-white" />
                        ) : (
                          <Upload size={14} />
                        )}
                        <span>{uploadingField === "videoPosterUrl" ? "Uploading..." : "Upload Poster"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, "videoPosterUrl");
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar fields */}
            <div className="space-y-6">
              <div className="bg-neutral-900 rounded-xl border border-white/5 p-6">
                <h2 className="text-white font-bold text-sm mb-5">Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className={`${inputClasses} cursor-pointer`}>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide">Category</label>
                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} className={`${inputClasses} cursor-pointer`}>
                      <option value="">No category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide">Order</label>
                    <input name="order" type="number" value={formData.order} onChange={handleChange} placeholder="0" className={inputClasses} />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="w-4 h-4 rounded cursor-pointer"
                    />
                    <label htmlFor="featured" className="text-neutral-400 text-sm cursor-pointer">Featured project</label>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900 rounded-xl border border-white/5 p-6">
                <h2 className="text-white font-bold text-sm mb-5">Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide">Client</label>
                    <input name="client" value={formData.client} onChange={handleChange} placeholder="Client name" className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide">Year</label>
                    <input name="year" type="number" value={formData.year} onChange={handleChange} placeholder="2024" className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide">Role</label>
                    <input name="role" value={formData.role} onChange={handleChange} placeholder="Video Editor + Motion Designer" className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide">Tools (comma separated)</label>
                    <input name="tools" value={formData.tools} onChange={handleChange} placeholder="Premiere Pro, After Effects" className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide">Tags (comma separated)</label>
                    <input name="tags" value={formData.tags} onChange={handleChange} placeholder="branding, commercial" className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide">Live URL</label>
                    <input name="liveUrl" value={formData.liveUrl} onChange={handleChange} placeholder="https://..." className={inputClasses} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
