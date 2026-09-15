"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink, Maximize2, Play } from "lucide-react";
import { SlideUp, Reveal, FadeIn, StaggerContainer, StaggerItem } from "@/components/animation";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { MediaModal, MediaModalItem } from "@/components/ui/MediaModal";
import { ProjectComments } from "./ProjectComments";

interface MediaItem {
  id: number;
  type: "image" | "video" | "gif" | "document";
  url: string;
  thumbnailUrl: string | null;
  altText: string | null;
  width: number | null;
  height: number | null;
}

interface ProjectData {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  client: string | null;
  year: number | null;
  role: string | null;
  tools: string[];
  featured: boolean | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  videoPosterUrl: string | null;
  liveUrl: string | null;
  tags: string[];
  categoryName: string | null;
  categorySlug: string | null;
  media: MediaItem[];
}

interface AdjacentProject {
  id: number;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
}

interface ProjectDetailClientProps {
  project: ProjectData;
  adjacentProjects: AdjacentProject[];
}

export function ProjectDetailClient({ project, adjacentProjects }: ProjectDetailClientProps) {
  const heroImage = project.thumbnailUrl || project.videoPosterUrl;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  // Build full list of media items for lightbox navigation
  const allMediaItems: MediaModalItem[] = [];

  if (project.videoUrl) {
    allMediaItems.push({
      id: "hero-video",
      type: "video",
      url: project.videoUrl,
      posterUrl: project.videoPosterUrl || project.thumbnailUrl,
      title: `${project.title} — Showcase Video`,
    });
  } else if (heroImage) {
    allMediaItems.push({
      id: "hero-image",
      type: "image",
      url: heroImage,
      title: project.title,
    });
  }

  project.media.forEach((m) => {
    allMediaItems.push({
      id: m.id,
      type: m.type === "video" ? "video" : "image",
      url: m.url,
      posterUrl: m.thumbnailUrl,
      title: m.altText || project.title,
    });
  });

  const openModal = (idx: number) => {
    setModalIndex(idx);
    setModalOpen(true);
  };

  const projectMeta = [
    { label: "Client", value: project.client },
    { label: "Year", value: project.year?.toString() },
    { label: "Role", value: project.role },
    { label: "Category", value: project.categoryName },
  ].filter((m) => m.value);

  const heroIndex = project.videoUrl || heroImage ? 0 : -1;
  const galleryOffset = heroIndex >= 0 ? 1 : 0;

  return (
    <>
      <MediaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        items={allMediaItems}
        currentIndex={modalIndex}
        onNavigate={(newIdx) => setModalIndex(newIdx)}
      />

      <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24">
        {/* Header section */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <FadeIn>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-xs font-mono tracking-widest uppercase mb-8 transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Work
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-end mb-12">
            <div className="lg:col-span-2">
              {project.categoryName && (
                <FadeIn delay={0.1}>
                  <span className="text-xs font-mono text-neutral-500 tracking-widest uppercase mb-3 block">
                    {project.categoryName}
                  </span>
                </FadeIn>
              )}
              <SlideUp>
                <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight">
                  {project.title}
                </h1>
              </SlideUp>
              {project.shortDescription && (
                <SlideUp delay={0.2}>
                  <p className="text-neutral-400 text-lg leading-relaxed mt-4">
                    {project.shortDescription}
                  </p>
                </SlideUp>
              )}
            </div>

            {/* Meta */}
            <FadeIn delay={0.3}>
              <div className="grid grid-cols-2 gap-6">
                {projectMeta.map(({ label, value }) => (
                  <div key={label} className="border-l border-white/10 pl-4">
                    <p className="text-neutral-600 text-xs tracking-widest uppercase font-medium mb-1">
                      {label}
                    </p>
                    <p className="text-white text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              {project.liveUrl && (
                <div className="mt-6">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white border border-white/15 px-5 py-3 rounded-full text-sm font-medium hover:border-white/40 transition-all duration-200"
                    data-cursor="link"
                  >
                    <ExternalLink size={14} />
                    View Live
                  </a>
                </div>
              )}
            </FadeIn>
          </div>

          {/* Hero image or video */}
          {project.videoUrl ? (
            <FadeIn>
              <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-black">
                <VideoPlayer
                  src={project.videoUrl}
                  poster={project.videoPosterUrl || project.thumbnailUrl || undefined}
                  className="rounded-2xl"
                />
                <button
                  onClick={() => openModal(0)}
                  className="absolute top-4 right-4 z-20 bg-black/70 hover:bg-black text-white text-xs font-medium px-3.5 py-2 rounded-full backdrop-blur-md border border-white/15 flex items-center gap-1.5 opacity-90 hover:scale-105 transition-all shadow-lg cursor-pointer"
                  title="Expand to Large Cinema View"
                >
                  <Maximize2 size={14} />
                  <span>Fullscreen Cinema</span>
                </button>
              </div>
            </FadeIn>
          ) : heroImage ? (
            <FadeIn>
              <div
                onClick={() => openModal(0)}
                className="relative aspect-16/9 rounded-2xl overflow-hidden bg-neutral-900 cursor-pointer group border border-white/10"
              >
                <Image
                  src={heroImage}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, 90vw"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-black/80 text-white text-xs font-semibold px-4 py-2.5 rounded-full border border-white/20 flex items-center gap-2 backdrop-blur-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Maximize2 size={14} />
                    <span>Click to Enlarge</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-linear-to-br from-neutral-800 via-neutral-900 to-neutral-950 flex flex-col items-center justify-center text-center p-8 border border-white/5">
                <span className="text-6xl mb-3 text-neutral-600">✦</span>
                <p className="text-sm font-mono text-neutral-300 uppercase tracking-widest mb-1">{project.title}</p>
                <p className="text-xs text-neutral-500 max-w-md">
                  Upload image or video assets via the Admin panel to display media for this project.
                </p>
              </div>
            </FadeIn>
          )}
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left - Description & Media Gallery */}
            <div className="lg:col-span-2">
              {project.description && (
                <SlideUp>
                  <div className="prose prose-invert max-w-none">
                    <h2 className="text-white text-2xl font-bold mb-6 tracking-tight">
                      About the Project
                    </h2>
                    <div className="text-neutral-400 text-base leading-[1.8] whitespace-pre-line">
                      {project.description}
                    </div>
                  </div>
                </SlideUp>
              )}

              {/* Media gallery */}
              {project.media.length > 0 && (
                <div className="mt-16">
                  <SlideUp>
                    <h2 className="text-white text-2xl font-bold mb-8 tracking-tight">
                      Project Gallery
                    </h2>
                  </SlideUp>
                  <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.media.map((item, idx) => {
                      const itemModalIndex = galleryOffset + idx;
                      return (
                        <StaggerItem key={item.id}>
                          <div
                            onClick={() => openModal(itemModalIndex)}
                            className="relative aspect-16/10 rounded-xl overflow-hidden bg-neutral-900 cursor-pointer group border border-white/5"
                          >
                            {item.type === "image" ? (
                              <>
                                <Image
                                  src={item.url}
                                  alt={item.altText || project.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                                  sizes="(max-width: 640px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <div className="bg-black/80 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 backdrop-blur-md">
                                    <Maximize2 size={12} />
                                    <span>Expand Image</span>
                                  </div>
                                </div>
                              </>
                            ) : item.type === "video" ? (
                              <div className="relative w-full h-full">
                                <VideoPlayer
                                  src={item.url}
                                  poster={item.thumbnailUrl || undefined}
                                  className="h-full"
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openModal(itemModalIndex);
                                  }}
                                  className="absolute top-3 right-3 z-10 bg-black/80 hover:bg-black text-white text-[11px] font-medium px-2.5 py-1 rounded-full backdrop-blur-md border border-white/15 flex items-center gap-1 opacity-90 transition-all"
                                >
                                  <Maximize2 size={11} />
                                  <span>Cinema View</span>
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                </div>
              )}
            </div>

            {/* Right - Sidebar */}
            <div>
              <FadeIn delay={0.2}>
                {/* Tools */}
                {project.tools.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-4">
                      Tools Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tools.map((tool) => (
                        <span
                          key={tool}
                          className="text-xs text-neutral-400 bg-neutral-900 border border-white/5 px-3 py-1.5 rounded-full"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-4">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-neutral-600 px-3 py-1.5 rounded-full border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="border border-white/8 rounded-xl p-6 bg-neutral-900/50">
                  <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
                    Like what you see? Let&apos;s create something together.
                  </p>
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 bg-white text-black font-bold text-sm px-5 py-3 rounded-full hover:bg-neutral-100 transition-colors duration-200"
                    data-cursor="link"
                  >
                    Start a Project
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Client Reviews & Comments Section */}
          <ProjectComments
            projectId={project.id}
            projectSlug={project.slug}
            projectTitle={project.title}
          />

          {/* Adjacent projects */}
          {adjacentProjects.length > 0 && (
            <div className="mt-24 pt-12 border-t border-white/5">
              <SlideUp>
                <h2 className="text-white font-bold text-xl tracking-tight mb-8">
                  More Projects
                </h2>
              </SlideUp>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {adjacentProjects.map((adj) => (
                  <motion.div key={adj.id} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                    <Link
                      href={`/work/${adj.slug}`}
                      className="group block relative overflow-hidden rounded-xl bg-neutral-900 aspect-video"
                      data-cursor="view"
                    >
                      {adj.thumbnailUrl && (
                        <>
                          <Image
                            src={adj.thumbnailUrl}
                            alt={adj.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                        </>
                      )}
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <p className="text-white font-bold text-base tracking-tight">{adj.title}</p>
                      </div>
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <ArrowUpRight size={14} className="text-black" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="py-16 text-center">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-white text-sm transition-colors duration-200"
            >
              <ArrowLeft size={14} />
              Back to all work
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
