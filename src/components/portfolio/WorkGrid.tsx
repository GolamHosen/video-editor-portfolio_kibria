"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Play, Camera, Maximize2 } from "lucide-react";
import { formatVideoUrl, formatVideoPoster } from "@/components/ui/VideoPlayer";
import { MediaModal, MediaModalItem } from "@/components/ui/MediaModal";

interface ProjectItem {
  id: number;
  title: string;
  slug: string;
  shortDescription: string | null;
  client: string | null;
  year: number | null;
  thumbnailUrl: string | null;
  videoPosterUrl: string | null;
  videoUrl?: string | null;
  tags: string[] | null;
  featured: boolean | null;
  order: number | null;
  categoryId: number | null;
  categoryName: string | null;
  categorySlug: string | null;
}

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  order: number | null;
  createdAt: Date;
}

interface WorkGridProps {
  projects: ProjectItem[];
  categories: CategoryItem[];
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function WorkGrid({ projects, categories }: WorkGridProps) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  // A filter click overrides the URL filter; `null` means "follow the URL".
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Derived during render (instead of synced through an Effect) so an incoming
  // ?category=... filter applies immediately, without a second render pass.
  const urlCategorySlug = useMemo(() => {
    if (!urlCategory) return null;
    const target = urlCategory.toLowerCase();
    if (target === "all") return "all";
    return categories.find((c) => c.slug.toLowerCase() === target)?.slug ?? null;
  }, [urlCategory, categories]);

  const activeCategory = selectedCategory ?? urlCategorySlug ?? "all";

  const allFilters = [
    { id: "all", name: "All", slug: "all" },
    ...categories.map((c) => ({ id: String(c.id), name: c.name, slug: c.slug })),
  ];

  const handleFilterClick = (slug: string) => {
    setSelectedCategory(slug);
    if (typeof window !== "undefined") {
      const newUrl = slug === "all" ? "/work" : `/work?category=${slug}`;
      window.history.replaceState(null, "", newUrl);
    }
  };

  const filtered = useMemo(() => {
    if (activeCategory === "all") return projects;

    return projects.filter((p) => {
      const catSlug = (p.categorySlug || "").toLowerCase().trim();
      const catName = (p.categoryName || "").toLowerCase().trim();
      const target = activeCategory.toLowerCase().trim();

      const matchedCat = categories.find((c) => c.slug.toLowerCase() === target);
      if (matchedCat && p.categoryId === matchedCat.id) return true;

      if (catSlug === target || catName === target) return true;

      // Fallback detection
      if (target === "video" && Boolean(p.videoUrl)) return true;
      if (target === "photo" && !p.videoUrl && Boolean(p.thumbnailUrl)) return true;

      return false;
    });
  }, [activeCategory, projects, categories]);

  // Modal items for current filtered list (supports both video and photo modal)
  const modalItems: MediaModalItem[] = useMemo(
    () =>
      filtered.map((p) => {
        const hasVid = Boolean(p.videoUrl);
        return {
          id: p.id,
          type: hasVid ? "video" : "image",
          url: hasVid ? formatVideoUrl(p.videoUrl!) : (p.thumbnailUrl || p.videoPosterUrl || ""),
          posterUrl: p.videoPosterUrl || p.thumbnailUrl || (hasVid ? formatVideoPoster(p.videoUrl!) : undefined),
          title: p.title,
          slug: p.slug,
          categoryName: p.categoryName || (hasVid ? "Video" : "Photo"),
        };
      }),
    [filtered]
  );

  const handleOpenMedia = (project: ProjectItem) => {
    const idx = filtered.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      setCurrentIndex(idx);
      setModalOpen(true);
    }
  };

  return (
    <>
      <MediaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        items={modalItems}
        currentIndex={currentIndex}
        onNavigate={(newIdx) => setCurrentIndex(newIdx)}
      />

      <div>
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {allFilters.map((filter) => {
            const isSelected = activeCategory.toLowerCase() === filter.slug.toLowerCase();
            return (
              <button
                key={filter.slug}
                onClick={() => handleFilterClick(filter.slug)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-white text-black shadow-lg"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-white/5 hover:border-white/15"
                }`}
              >
                {filter.name}
              </button>
            );
          })}
        </div>

        {/* Project count & active badge */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-neutral-400 text-sm font-mono">
            Showing {filtered.length} project{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "all" && (
              <span className="text-white font-sans font-semibold ml-2">
                in category &ldquo;{allFilters.find((f) => f.slug === activeCategory)?.name}&rdquo;
              </span>
            )}
          </p>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => {
              const rawThumbnail = project.thumbnailUrl || project.videoPosterUrl;
              const videoUrl = project.videoUrl ? formatVideoUrl(project.videoUrl) : null;
              const thumbnail =
                rawThumbnail || (project.videoUrl ? formatVideoPoster(project.videoUrl) || "" : "");
              const hasVideo = Boolean(videoUrl);

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <div
                    onClick={() => handleOpenMedia(project)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleOpenMedia(project);
                      }
                    }}
                    className="group block relative overflow-hidden rounded-xl bg-neutral-900 aspect-4/3 cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-300 shadow-xl"
                    data-cursor={hasVideo ? "play" : "view"}
                  >
                    {/* Media: Video preview or Photo */}
                    {hasVideo ? (
                      <div className="absolute inset-0 bg-black">
                        <video
                          src={videoUrl!}
                          poster={thumbnail || undefined}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/30 to-black/10 group-hover:via-black/20 transition-colors duration-300" />
                      </div>
                    ) : thumbnail ? (
                      <div className="absolute inset-0">
                        <Image
                          src={thumbnail}
                          alt={project.title}
                          fill
                          priority={index < 3}
                          loading={index < 3 ? "eager" : "lazy"}
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/30 to-black/10 group-hover:via-black/20 transition-colors duration-300" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-linear-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                        <span className="text-6xl opacity-20">✦</span>
                      </div>
                    )}

                    {/* Center Cinematic Play Button for Videos */}
                    {hasVideo && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                        <div className="relative flex items-center justify-center">
                          <div className="absolute w-14 h-14 rounded-full bg-white/20 animate-ping opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
                          <div className="w-13 h-13 rounded-full bg-white text-black flex items-center justify-center pl-0.5 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                            <Play size={22} className="fill-black text-black" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Center Expand indicator for Photos */}
                    {!hasVideo && thumbnail && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-1.5 shadow-2xl">
                          <Maximize2 size={13} className="text-emerald-400" />
                          <span>Expand</span>
                        </div>
                      </div>
                    )}

                    {/* Category & Media Badges */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                      {project.categoryName && (
                        <span className="text-[10px] font-semibold tracking-widest uppercase text-neutral-300 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                          {project.categoryName}
                        </span>
                      )}
                      {hasVideo ? (
                        <span className="text-[10px] font-semibold tracking-widest uppercase text-yellow-400 bg-yellow-500/15 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-yellow-500/30 flex items-center gap-1.5 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                          Video
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold tracking-widest uppercase text-emerald-400 bg-emerald-500/15 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                          <Camera size={11} />
                          Photo
                        </span>
                      )}
                    </div>

                    {/* Case study link button on top right */}
                    <div className="absolute top-4 right-4 z-20">
                      <Link
                        href={`/work/${project.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 rounded-full bg-black/60 hover:bg-white text-white hover:text-black flex items-center justify-center backdrop-blur-md border border-white/15 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
                        title="View Project Details"
                      >
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                      <p className="text-neutral-400 text-xs mb-1 font-medium flex items-center gap-2">
                        <span>{project.client ? `${project.client} · ` : ""}{project.year || "2026"}</span>
                        {hasVideo ? (
                          <span className="text-yellow-400/80 font-mono text-[10px]">• Click to Play</span>
                        ) : (
                          <span className="text-emerald-400/80 font-mono text-[10px]">• Click to View Photo</span>
                        )}
                      </p>
                      <h3 className="text-white font-bold text-lg tracking-tight leading-tight mb-1">
                        {project.title}
                      </h3>
                      {project.shortDescription && (
                        <p className="text-neutral-300 text-sm mt-1.5 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {project.shortDescription}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-neutral-600">
            <p className="text-4xl mb-4">✦</p>
            <p>No projects found in this category.</p>
          </div>
        )}
      </div>
    </>
  );
}
