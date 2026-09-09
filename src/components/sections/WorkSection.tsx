"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Play, Film } from "lucide-react";
import { Reveal, SlideUp, FadeIn } from "@/components/animation";
import { MediaModal, MediaModalItem } from "@/components/ui/MediaModal";
import { formatVideoUrl, formatVideoPoster } from "@/components/ui/VideoPlayer";

interface ProjectCard {
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

interface WorkSectionProps {
  projects: ProjectCard[];
}

function WorkCard({
  project,
  index,
  isFeatured = false,
  className = "",
  onPlayVideo,
}: {
  project: ProjectCard;
  index: number;
  isFeatured?: boolean;
  className?: string;
  onPlayVideo?: (project: ProjectCard) => void;
}) {
  const rawThumbnail = project.thumbnailUrl || project.videoPosterUrl;
  const videoUrl = project.videoUrl ? formatVideoUrl(project.videoUrl) : null;
  const thumbnail = rawThumbnail || (videoUrl ? formatVideoPoster(videoUrl) || "" : "");
  const hasVideo = Boolean(videoUrl);

  const handleCardClick = (e: React.MouseEvent) => {
    if (hasVideo && onPlayVideo) {
      e.preventDefault();
      onPlayVideo(project);
    }
  };

  const CardWrapper = hasVideo ? "div" : Link;
  const cardProps = hasVideo
    ? { onClick: handleCardClick, role: "button", tabIndex: 0 }
    : { href: `/work/${project.slug}` };

  return (
    <CardWrapper
      {...(cardProps as any)}
      className={`group relative block overflow-hidden rounded-2xl bg-neutral-900/90 border border-white/10 hover:border-white/25 transition-all duration-500 cursor-pointer shadow-2xl ${
        className || (isFeatured ? "aspect-[16/9]" : "aspect-[16/10]")
      }`}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/10 group-hover:via-black/20 transition-colors duration-300" />
        </div>
      ) : thumbnail ? (
        <div className="absolute inset-0">
          <Image
            src={thumbnail}
            alt={project.title}
            fill
            unoptimized
            priority={index === 0}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes={isFeatured ? "(max-width: 768px) 100vw, 80vw" : "(max-width: 768px) 100vw, 40vw"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/10 group-hover:via-black/20 transition-colors duration-300" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 flex flex-col items-center justify-center p-6 text-center">
          <span className="text-4xl mb-2 text-neutral-600 group-hover:scale-110 transition-transform duration-300">✦</span>
          <span className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">Visual Craft</span>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        </div>
      )}

      {/* Center play button for videos */}
      {hasVideo && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-20 h-20 rounded-full bg-white/25 animate-ping opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white text-black flex items-center justify-center pl-1 shadow-[0_0_40px_rgba(255,255,255,0.4)] group-hover:scale-110 group-hover:bg-yellow-400 transition-all duration-300">
              <Play size={isFeatured ? 30 : 26} className="fill-black text-black" />
            </div>
          </div>
        </div>
      )}

      {/* Badges on top left */}
      <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
        {project.categoryName && (
          <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-200 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-lg">
            {project.categoryName}
          </span>
        )}
        {hasVideo && (
          <span className="text-[11px] font-semibold tracking-wider uppercase text-yellow-400 bg-yellow-500/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-yellow-500/40 flex items-center gap-1.5 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Watch Video
          </span>
        )}
      </div>

      {/* Top right case study / details link */}
      <div className="absolute top-5 right-5 z-20">
        {hasVideo ? (
          <Link
            href={`/work/${project.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-10 rounded-full bg-black/70 hover:bg-white text-white hover:text-black flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
            title="View Project Details"
          >
            <ArrowUpRight size={18} />
          </Link>
        ) : (
          <div
            className="w-10 h-10 rounded-full bg-black/70 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300 group-hover:scale-110 shadow-lg"
            title="View Project Details"
          >
            <ArrowUpRight size={18} />
          </div>
        )}
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
        <div className="transform transition-transform duration-300">
          <p className="text-neutral-400 text-xs font-medium tracking-wider mb-2 flex items-center gap-2">
            <span>{project.client && `${project.client} · `}{project.year || "2026"}</span>
            {hasVideo && <span className="text-yellow-400 font-mono text-[11px]">• Click to Play Full Video</span>}
          </p>
          <h3 className={`text-white font-bold tracking-tight leading-tight mb-2 ${
            isFeatured ? "text-2xl md:text-4xl" : "text-xl md:text-2xl"
          }`}>
            {project.title}
          </h3>
          {project.shortDescription && (
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed line-clamp-2 max-w-2xl">
              {project.shortDescription}
            </p>
          )}
        </div>
      </div>
    </CardWrapper>
  );
}

export function WorkSection({ projects }: WorkSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayProjects = projects || [];

  // Build modal items
  const videoProjects = displayProjects.filter((p) => Boolean(p.videoUrl));
  const modalItems: MediaModalItem[] = videoProjects.map((p) => ({
    id: p.id,
    type: "video",
    url: formatVideoUrl(p.videoUrl!),
    posterUrl: p.videoPosterUrl || p.thumbnailUrl || formatVideoPoster(p.videoUrl!),
    title: p.title,
    slug: p.slug,
    categoryName: p.categoryName,
  }));

  const handlePlayVideo = (project: ProjectCard) => {
    const idx = videoProjects.findIndex((p) => p.id === project.id);
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

      <section id="videos" data-section="videos" className="relative py-20 md:py-32 bg-[#0a0a0a] overflow-hidden">
        {/* Alias anchor so hero 'explore work' smoothly lands here */}
        <div id="work" className="absolute -top-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 md:mb-16">
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-3">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-yellow-400/90 text-xs tracking-[0.25em] uppercase font-semibold font-mono">
                    VIDEO SHOWCASE
                  </span>
                </div>
              </FadeIn>
              <SlideUp delay={0.05}>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mt-1">
                  Featured Videos
                  <span className="block text-lg md:text-2xl font-normal text-neutral-400 mt-2 font-sans">
                    Cinematic Films, Commercials &amp; Motion Design
                  </span>
                </h1>
              </SlideUp>
            </div>
            <SlideUp delay={0.1}>
              <Link
                href="/work?category=video"
                className="group inline-flex items-center gap-2 text-neutral-300 hover:text-white text-sm font-semibold transition-colors duration-200 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full"
                data-cursor="link"
              >
                <span>View all videos</span>
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </Link>
            </SlideUp>
          </div>

          {/* Projects Display */}
          {displayProjects.length === 0 ? (
            <div className="py-24 text-center max-w-md mx-auto px-6 bg-white/[0.02] border border-white/10 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-neutral-400">
                <Film size={24} className="text-neutral-500" />
              </div>
              <p className="text-white text-lg font-semibold mb-2">No videos uploaded yet</p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Upload your videos under the &ldquo;Video&rdquo; category from the admin dashboard to showcase them here.
              </p>
            </div>
          ) : displayProjects.length === 1 ? (
            /* Single Project Spotlight - Grand Cinematic Showcase */
            <div className="max-w-5xl mx-auto">
              <WorkCard
                project={displayProjects[0]}
                index={0}
                isFeatured={true}
                className="aspect-[16/9] w-full"
                onPlayVideo={handlePlayVideo}
              />
            </div>
          ) : displayProjects.length === 2 ? (
            /* 2 Projects: Balanced Duo Showcase */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {displayProjects.map((project, index) => (
                <WorkCard
                  key={project.id}
                  project={project}
                  index={index}
                  isFeatured={false}
                  className="aspect-[16/10] w-full"
                  onPlayVideo={handlePlayVideo}
                />
              ))}
            </div>
          ) : (
            /* 3+ Projects: Bento Portfolio Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {displayProjects.map((project, index) => {
                const isFirst = index === 0;
                return (
                  <WorkCard
                    key={project.id}
                    project={project}
                    index={index}
                    isFeatured={isFirst}
                    className={
                      isFirst
                        ? "md:col-span-2 lg:col-span-2 aspect-video"
                        : "aspect-[16/10]"
                    }
                    onPlayVideo={handlePlayVideo}
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
