"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { SlideUp, StaggerContainer, StaggerItem, Reveal } from "@/components/animation";
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

interface FeaturedWorkProps {
  projects: ProjectCard[];
}

function ProjectCardItem({
  project,
  index,
  onPlayVideo,
}: {
  project: ProjectCard;
  index: number;
  onPlayVideo?: (project: ProjectCard) => void;
}) {
  const rawThumbnail = project.thumbnailUrl || project.videoPosterUrl;
  const videoUrl = project.videoUrl ? formatVideoUrl(project.videoUrl) : null;
  const thumbnail = rawThumbnail || (videoUrl ? formatVideoPoster(videoUrl) || "" : "");
  const hasVideo = Boolean(videoUrl);
  const isLarge = index === 0 || index === 3;

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
      className={`group relative block overflow-hidden rounded-2xl bg-neutral-900 cursor-pointer ${
        isLarge ? "md:col-span-2 aspect-16/9" : "aspect-4/3"
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
          <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/30 to-black/10 group-hover:via-black/20 transition-colors duration-300" />
        </div>
      ) : thumbnail ? (
        <div className="absolute inset-0">
          <Image
            src={thumbnail}
            alt={project.title}
            fill
            priority={index < 2}
            loading={index < 2 ? "eager" : "lazy"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes={isLarge ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/30 to-black/10 group-hover:via-black/20 transition-colors duration-300" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-neutral-800 via-neutral-900 to-neutral-950 flex flex-col items-center justify-center p-6 text-center">
          <span className="text-4xl mb-2 text-neutral-600 group-hover:scale-110 transition-transform duration-300">✦</span>
          <span className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">Visual Craft</span>
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
        </div>
      )}

      {/* Center Cinematic Play Button for Videos */}
      {hasVideo && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            {/* Pulsing ring on hover */}
            <div className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 animate-ping opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center pl-1 shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <Play size={24} className="fill-black text-black" />
            </div>
          </div>
        </div>
      )}

      {/* Category tag & Video Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        {project.categoryName && (
          <span className="text-[10px] font-semibold tracking-widest uppercase text-neutral-300 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {project.categoryName}
          </span>
        )}
        {hasVideo && (
          <span className="text-[10px] font-semibold tracking-widest uppercase text-yellow-400 bg-yellow-500/15 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-yellow-500/30 flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Watch Video
          </span>
        )}
      </div>

      {/* Case study link button on top right */}
      <div className="absolute top-4 right-4 z-20">
        <Link
          href={`/work/${project.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="w-9 h-9 rounded-full bg-black/60 hover:bg-white text-white hover:text-black flex items-center justify-center backdrop-blur-md border border-white/15 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
          title="View Project Details"
        >
          <ArrowUpRight size={16} />
        </Link>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-neutral-400 text-xs font-medium tracking-wide mb-1 flex items-center gap-2">
            <span>{project.client && `${project.client} · `}{project.year}</span>
            {hasVideo && <span className="text-yellow-400/80 font-mono text-[11px]">• Click to Play</span>}
          </p>
          <h3 className="text-white font-bold text-xl md:text-2xl tracking-tight leading-tight mb-1">
            {project.title}
          </h3>
          {project.shortDescription && (
            <p className="text-neutral-300 text-sm leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-20 overflow-hidden">
              {project.shortDescription}
            </p>
          )}
        </div>
      </div>
    </CardWrapper>
  );
}

export function FeaturedWork({ projects }: FeaturedWorkProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (projects.length === 0) return null;

  // Build modal items for all projects with videos
  const videoProjects = projects.filter((p) => Boolean(p.videoUrl));
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

      <section className="py-24 md:py-32 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-14">
            <div>
              <Reveal>
                <span className="text-neutral-600 text-xs tracking-[0.3em] uppercase font-medium">
                  Selected Work
                </span>
              </Reveal>
              <SlideUp delay={0.1}>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mt-3">
                  Featured Projects
                </h2>
              </SlideUp>
            </div>
            <SlideUp delay={0.2}>
              <Link
                href="/work"
                className="group inline-flex items-center gap-2 text-neutral-400 hover:text-white text-sm font-medium transition-colors duration-200"
                data-cursor="link"
              >
                View all projects
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </Link>
            </SlideUp>
          </div>

          {/* Project grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((project, index) => (
              <StaggerItem key={project.id}>
                <ProjectCardItem
                  project={project}
                  index={index}
                  onPlayVideo={handlePlayVideo}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}

