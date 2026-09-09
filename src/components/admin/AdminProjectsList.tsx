"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Star, Search } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

interface ProjectListItem {
  id: number;
  title: string;
  slug: string;
  status: string | null;
  featured: boolean | null;
  order: number | null;
  thumbnailUrl: string | null;
  videoPosterUrl: string | null;
  videoUrl: string | null;
  createdAt: Date;
  categoryName: string | null;
}

interface AdminProjectsListProps {
  projects: ProjectListItem[];
}

export function AdminProjectsList({ projects }: AdminProjectsListProps) {
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.categoryName?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        alert(body?.message || body?.error || `Delete failed (${res.status})`);
        return;
      }
      window.location.reload();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error — could not reach the server.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">Projects</h1>
            <p className="text-neutral-600 text-sm">{projects.length} total</p>
          </div>
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 bg-white text-black text-sm font-bold px-4 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <Plus size={14} />
            New Project
          </Link>
        </div>

        <div className="p-8">
          {/* Search */}
          <div className="relative mb-6">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm bg-neutral-900 border border-white/8 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>

          {/* Projects table */}
          <div className="bg-neutral-900 rounded-xl border border-white/5 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5 text-neutral-600 text-xs font-medium tracking-widest uppercase">
              <div className="col-span-5">Project</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Featured</div>
              <div className="col-span-2">Actions</div>
            </div>

            <div className="divide-y divide-white/5">
              {filtered.map((project) => (
                <div key={project.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-neutral-800/50 transition-colors">
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-12 h-8 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0 relative">
                      {(() => {
                        const thumb = project.thumbnailUrl || project.videoPosterUrl || (project.videoUrl && project.videoUrl.includes('res.cloudinary.com') && project.videoUrl.includes('/video/upload/') ? project.videoUrl.replace(/\.(mp4|webm|mov|m4v|ogv)$/i, '') + '.jpg' : null);
                        if (thumb) {
                          return (
                            <Image
                              src={thumb}
                              alt={project.title}
                              width={48}
                              height={32}
                              unoptimized
                              className="w-full h-full object-cover"
                            />
                          );
                        }
                        return (
                          <div className="w-full h-full flex items-center justify-center text-neutral-700 text-xs">
                            ✦
                          </div>
                        );
                      })()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{project.title}</p>
                      <p className="text-neutral-600 text-xs truncate">/work/{project.slug}</p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-neutral-500 text-xs">
                      {project.categoryName || "—"}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      project.status === "published"
                        ? "bg-green-500/10 text-green-400"
                        : project.status === "draft"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-neutral-800 text-neutral-500"
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  <div className="col-span-1">
                    {project.featured && (
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    )}
                  </div>

                  <div className="col-span-2 flex items-center gap-2">
                    <Link
                      href={`/work/${project.slug}`}
                      target="_blank"
                      className="p-1.5 text-neutral-600 hover:text-white transition-colors rounded-lg hover:bg-neutral-800"
                      title="View"
                    >
                      <Eye size={14} />
                    </Link>
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="p-1.5 text-neutral-600 hover:text-white transition-colors rounded-lg hover:bg-neutral-800"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deleting === project.id}
                      className="p-1.5 text-neutral-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="px-5 py-12 text-center text-neutral-700 text-sm">
                  {search ? "No projects match your search" : "No projects yet. Create your first one!"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
