"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Trash2, ExternalLink, MessageSquare, Search } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

interface CommentItem {
  id: number;
  projectId: number;
  projectSlug: string;
  projectTitle: string;
  name: string;
  role: string | null;
  email: string | null;
  rating: number;
  comment: string;
  status: string;
  createdAt: string | Date;
}

interface AdminCommentsProps {
  comments: CommentItem[];
}

export function AdminComments({ comments: initialComments }: AdminCommentsProps) {
  const [comments, setComments] = useState(initialComments);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const filtered = comments.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.projectTitle.toLowerCase().includes(q) ||
      c.comment.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateInput: string | Date) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Stats
  const totalReviews = comments.length;
  const avgRating =
    totalReviews > 0
      ? (comments.reduce((sum, c) => sum + c.rating, 0) / totalReviews).toFixed(1)
      : "0.0";

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">Reviews &amp; Comments</h1>
            <p className="text-neutral-600 text-sm">{totalReviews} total · avg {avgRating} ★</p>
          </div>
        </div>

        <div className="p-8">
          {/* Search */}
          <div className="relative mb-6 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, project, or comment..."
              className="w-full bg-neutral-900 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>

          {/* Comments list */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-neutral-600">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                {search ? "No reviews match your search." : "No reviews submitted yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  className="bg-neutral-900 rounded-xl border border-white/5 p-5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Reviewer info */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center uppercase shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-semibold text-sm">{c.name}</span>
                          {c.role && (
                            <span className="text-neutral-500 text-xs font-mono">· {c.role}</span>
                          )}
                          <span className="text-neutral-600 text-[10px]">
                            {formatDate(c.createdAt)}
                          </span>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5 mt-1 mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              className={
                                s <= c.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-neutral-700"
                              }
                            />
                          ))}
                          <span className="text-xs text-amber-400/70 ml-1 font-mono">
                            {c.rating}.0
                          </span>
                        </div>

                        {/* Comment text */}
                        <p className="text-neutral-300 text-sm leading-relaxed">
                          {c.comment}
                        </p>

                        {/* Project link */}
                        <div className="mt-2">
                          <Link
                            href={`/work/${c.projectSlug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors"
                          >
                            <ExternalLink size={11} />
                            <span>{c.projectTitle}</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Right: Delete button */}
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={deleting === c.id}
                      className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0 disabled:opacity-50 cursor-pointer"
                      title="Delete this review"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
