"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Camera, Maximize2, Sparkles } from "lucide-react";
import { SlideUp, FadeIn } from "@/components/animation";
import { MediaModal, MediaModalItem } from "@/components/ui/MediaModal";

export interface PhotoCardItem {
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
  categoryName: string | null;
  categorySlug: string | null;
}

interface PhotoSectionProps {
  projects: PhotoCardItem[];
}

function PhotoCard({
  project,
  index,
  isFeatured = false,
  className = "",
  onOpenModal,
}: {
  project: PhotoCardItem;
  index: number;
  isFeatured?: boolean;
  className?: string;
  onOpenModal: (project: PhotoCardItem) => void;
}) {
  const imageUrl = project.thumbnailUrl || project.videoPosterUrl || "";

  return (
    <div
      onClick={() => onOpenModal(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenModal(project);
        }
      }}
      className={`group relative block overflow-hidden rounded-2xl bg-neutral-900/90 border border-white/10 hover:border-white/25 transition-all duration-500 cursor-pointer shadow-2xl ${
        className || (isFeatured ? "aspect-16/10" : "aspect-4/3")
      }`}
      data-cursor="view"
    >
      {/* Image Container */}
      {imageUrl ? (
        <div className="absolute inset-0 bg-neutral-950">
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            unoptimized
            priority={index === 0}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes={
              isFeatured
                ? "(max-width: 768px) 100vw, 80vw"
                : "(max-width: 768px) 100vw, 40vw"
            }
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/30 to-black/10 group-hover:via-black/15 transition-colors duration-300" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-neutral-800 via-neutral-900 to-neutral-950 flex flex-col items-center justify-center p-6 text-center">
          <Camera size={36} className="text-neutral-600 mb-2 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">
            Photo Still
          </span>
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
        </div>
      )}

      {/* Top Left Badges */}
      <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-200 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-lg">
          {project.categoryName || "Photo"}
        </span>
        <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400 bg-emerald-500/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/40 flex items-center gap-1.5 shadow-lg">
          <Camera size={12} />
          Still Photo
        </span>
      </div>

      {/* Top Right Action Buttons */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
        {/* Quick View / Lightbox trigger */}
        <div
          className="w-10 h-10 rounded-full bg-black/70 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300 group-hover:scale-110 shadow-lg"
          title="Open Fullscreen Lightbox"
        >
          <Maximize2 size={16} />
        </div>

        {/* Case study link */}
        <Link
          href={`/work/${project.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="w-10 h-10 rounded-full bg-black/70 hover:bg-white text-white hover:text-black flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
          title="View Project Details"
        >
          <ArrowUpRight size={18} />
        </Link>
      </div>

      {/* Hover Center Indicator */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-2 shadow-2xl">
          <Maximize2 size={14} className="text-emerald-400" />
          <span>Click to Expand Photo</span>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
        <p className="text-neutral-400 text-xs font-medium tracking-wider mb-2 flex items-center gap-2">
          <span>{project.client ? `${project.client} · ` : ""}{project.year || "2026"}</span>
          <span className="text-emerald-400 font-mono text-[11px]">• High Resolution</span>
        </p>
        <h3
          className={`text-white font-bold tracking-tight leading-tight mb-2 ${
            isFeatured ? "text-2xl md:text-4xl" : "text-xl md:text-2xl"
          }`}
        >
          {project.title}
        </h3>
        {project.shortDescription && (
          <p className="text-neutral-300 text-sm md:text-base leading-relaxed line-clamp-2 max-w-2xl">
            {project.shortDescription}
          </p>
        )}
      </div>
    </div>
  );
}

export function PhotoSection({ projects }: PhotoSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayProjects = projects || [];

  const modalItems: MediaModalItem[] = displayProjects.map((p) => ({
    id: p.id,
    type: "image",
    url: p.thumbnailUrl || p.videoPosterUrl || "",
    posterUrl: p.thumbnailUrl,
    title: p.title,
    slug: p.slug,
    categoryName: p.categoryName || "Photo",
  }));

  const handleOpenModal = (project: PhotoCardItem) => {
    const idx = displayProjects.findIndex((p) => p.id === project.id);
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

      <section
        id="photos"
        data-section="photos"
        className="relative py-20 md:py-32 bg-[#080808] border-t border-white/5 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header with <h1> */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 md:mb-16">
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400/90 text-xs tracking-[0.25em] uppercase font-semibold font-mono">
                    PHOTO GALLERY
                  </span>
                </div>
              </FadeIn>
              <SlideUp delay={0.05}>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mt-1">
                  Photography
                  <span className="block text-lg md:text-2xl font-normal text-neutral-400 mt-2 font-sans">
                    Stills, Visual Arts &amp; Creative Captures
                  </span>
                </h1>
              </SlideUp>
            </div>
            <SlideUp delay={0.1}>
              <Link
                href="/work?category=photo"
                className="group inline-flex items-center gap-2 text-neutral-300 hover:text-white text-sm font-semibold transition-colors duration-200 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full"
                data-cursor="link"
              >
                <span>View all photos</span>
                <ArrowUpRight
                  size={16}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                />
              </Link>
            </SlideUp>
          </div>

          {/* Projects Display */}
          {displayProjects.length === 0 ? (
            <div className="py-24 text-center max-w-md mx-auto px-6 bg-white/[0.02] border border-white/10 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-neutral-400">
                <Camera size={24} className="text-neutral-500" />
              </div>
              <p className="text-white text-lg font-semibold mb-2">No photo projects yet</p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Upload photos under the &ldquo;Photo&rdquo; category from the admin dashboard to showcase them here.
              </p>
            </div>
          ) : displayProjects.length === 1 ? (
            /* Single Photo Spotlight */
            <div className="max-w-5xl mx-auto">
              <PhotoCard
                project={displayProjects[0]}
                index={0}
                isFeatured={true}
                className="aspect-16/10 md:aspect-16/9 w-full"
                onOpenModal={handleOpenModal}
              />
            </div>
          ) : displayProjects.length === 2 ? (
            /* 2 Photos: Balanced Duo Showcase */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {displayProjects.map((project, index) => (
                <PhotoCard
                  key={project.id}
                  project={project}
                  index={index}
                  isFeatured={false}
                  className="aspect-4/3 w-full"
                  onOpenModal={handleOpenModal}
                />
              ))}
            </div>
          ) : (
            /* 3+ Photos: Bento Gallery Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {displayProjects.map((project, index) => {
                const isFirst = index === 0;
                return (
                  <PhotoCard
                    key={project.id}
                    project={project}
                    index={index}
                    isFeatured={isFirst}
                    className={
                      isFirst
                        ? "md:col-span-2 lg:col-span-2 aspect-16/10"
                        : "aspect-4/3"
                    }
                    onOpenModal={handleOpenModal}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
