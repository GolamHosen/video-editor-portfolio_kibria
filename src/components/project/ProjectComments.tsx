"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Send, CheckCircle2, User, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommentItem {
  id: number;
  projectId: number;
  projectSlug: string;
  projectTitle: string;
  name: string;
  role: string | null;
  rating: number;
  comment: string;
  createdAt: string | Date;
}

interface ProjectCommentsProps {
  projectId: number;
  projectSlug: string;
  projectTitle: string;
}

const RATING_LABELS: Record<number, string> = {
  1: "Needs Improvement",
  2: "Fair",
  3: "Good Project",
  4: "Very Good Work",
  5: "Exceptional & Masterful",
};

export function ProjectComments({
  projectId,
  projectSlug,
  projectTitle,
}: ProjectCommentsProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState("");

  // Stats
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 5.0,
  });

  // Fetch comments
  useEffect(() => {
    let isMounted = true;
    async function loadComments() {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${projectSlug}/comments`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setComments(data.data || []);
            setStats(
              data.stats || {
                totalReviews: data.data?.length || 0,
                averageRating: 5.0,
              }
            );
          }
        }
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadComments();
    return () => {
      isMounted = false;
    };
  }, [projectSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !commentText.trim()) {
      setError("Please provide your name and a comment.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`/api/projects/${projectSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim() || undefined,
          rating,
          comment: commentText.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit comment");
      }

      const { data: newComment } = await res.json();

      setComments((prev) => [newComment, ...prev]);
      setStats((prev) => {
        const newTotal = prev.totalReviews + 1;
        const newSum = prev.averageRating * prev.totalReviews + rating;
        return {
          totalReviews: newTotal,
          averageRating: parseFloat((newSum / newTotal).toFixed(1)),
        };
      });

      // Clear form
      setName("");
      setRole("");
      setCommentText("");
      setRating(5);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateInput: string | Date) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "Recently";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const activeStars = hoverRating > 0 ? hoverRating : rating;

  return (
    <div id="reviews" className="mt-24 pt-16 border-t border-white/10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3">
            <Sparkles size={13} className="text-amber-400" />
            <span className="text-amber-400 text-xs tracking-[0.2em] uppercase font-semibold font-mono">
              CLIENT REVIEWS &amp; RATINGS
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Feedback &amp; Comments
          </h2>
          <p className="text-neutral-400 text-sm md:text-base mt-2 max-w-xl">
            Read what clients, directors, and collaborators think about &ldquo;{projectTitle}&rdquo;, or leave your own review below.
          </p>
        </div>

        {/* Rating Summary Card */}
        <div className="flex items-center gap-4 bg-neutral-900/80 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-md">
          <div className="text-center pr-4 border-r border-white/10">
            <div className="text-3xl md:text-4xl font-black text-amber-400">
              {stats.totalReviews > 0 ? stats.averageRating : "5.0"}
            </div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono mt-0.5">
              out of 5
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  className={`${
                    s <= Math.round(stats.totalReviews > 0 ? stats.averageRating : 5)
                      ? "fill-amber-400 text-amber-400"
                      : "text-neutral-700"
                  }`}
                />
              ))}
            </div>
            <p className="text-neutral-400 text-xs mt-1 font-medium">
              {stats.totalReviews} {stats.totalReviews === 1 ? "review" : "reviews"} recorded
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left column: Add Review Form */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-neutral-900/60 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
              <MessageSquare size={18} className="text-amber-400" />
              Leave a Review
            </h3>
            <p className="text-neutral-400 text-xs mb-6">
              Rate this work and share your feedback with others.
            </p>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5"
              >
                <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                <span>Thank you! Your review has been posted successfully.</span>
              </motion.div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Interactive Star Rating Picker */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2 uppercase tracking-wider">
                  Your Rating *
                </label>
                <div className="flex items-center gap-2 bg-neutral-950/60 border border-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 hover:scale-125 transition-transform duration-150 cursor-pointer focus:outline-none"
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      >
                        <Star
                          size={24}
                          className={`transition-colors duration-150 ${
                            star <= activeStars
                              ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                              : "text-neutral-700 hover:text-neutral-500"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-amber-300 font-medium ml-auto font-mono">
                    {RATING_LABELS[activeStars] || "5 Stars"}
                  </span>
                </div>
              </div>

              {/* Name input */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2 uppercase tracking-wider">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  maxLength={100}
                  className="w-full bg-neutral-950/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-400/50 transition-colors"
                />
              </div>

              {/* Role input (optional) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2 uppercase tracking-wider">
                  Role / Company <span className="text-neutral-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Client · Creative Director"
                  maxLength={100}
                  className="w-full bg-neutral-950/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-400/50 transition-colors"
                />
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2 uppercase tracking-wider">
                  Your Comment *
                </label>
                <textarea
                  required
                  rows={4}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="What did you think of the visual storytelling, editing pace, color, or sound?"
                  maxLength={2000}
                  className="w-full bg-neutral-950/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-400/50 transition-colors resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-bold text-sm py-3.5 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(245,158,11,0.25)] disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Posting Review...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Post Comment &amp; Rating</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Public Comments Feed */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-lg">
              Public Reviews ({comments.length})
            </h3>
            <span className="text-xs text-neutral-500 font-mono">
              Live Verified Feedback
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-neutral-500">
              <Loader2 size={24} className="animate-spin mx-auto mb-2 text-amber-400" />
              <p className="text-sm">Loading reviews...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/10">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-400">
                <Star size={24} className="fill-amber-400/50 text-amber-400" />
              </div>
              <h4 className="text-white font-bold text-base mb-1">No reviews yet</h4>
              <p className="text-neutral-400 text-sm max-w-sm mx-auto leading-relaxed">
                Be the first to share your thoughts, comment on the craft, and rate this project!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {comments.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 rounded-2xl bg-neutral-900/60 border border-white/10 hover:border-white/20 transition-colors backdrop-blur-md shadow-lg"
                  >
                    {/* Review Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        {/* Initial Avatar */}
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 text-amber-300 font-bold text-sm flex items-center justify-center uppercase shrink-0">
                          {item.name.charAt(0) || <User size={16} />}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm leading-snug">
                            {item.name}
                          </p>
                          {item.role && (
                            <p className="text-neutral-400 text-xs font-mono">
                              {item.role}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Stars & Date */}
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-0.5 justify-end">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              className={`${
                                s <= item.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-neutral-700"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-neutral-500 text-[11px] font-mono mt-1">
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Comment Body */}
                    <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line pl-13">
                      {item.comment}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
