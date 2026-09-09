"use client";

import { useState } from "react";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export function formatVideoUrl(url: string): string {
  if (!url) return url;
  if (url.includes("res.cloudinary.com") && url.includes("/video/upload/")) {
    const hasExt = /\.(mp4|webm|mov|m4v|ogv)$/i.test(url);
    if (!hasExt) {
      return `${url}.mp4`;
    }
  }
  return url;
}

export function formatVideoPoster(videoUrl: string, explicitPoster?: string | null): string | undefined {
  if (explicitPoster) return explicitPoster;
  if (videoUrl && videoUrl.includes("res.cloudinary.com") && videoUrl.includes("/video/upload/")) {
    const baseUrl = videoUrl.replace(/\.(mp4|webm|mov|m4v|ogv)$/i, "");
    return `${baseUrl}.jpg`;
  }
  return undefined;
}

function parseVideoUrl(url: string) {
  if (!url) return { type: "none", embedUrl: "" };

  // YouTube Shorts or normal videos
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // Direct MP4/WebM/Cloudinary/Other HTML5 Video
  return {
    type: "native",
    embedUrl: formatVideoUrl(url),
  };
}

export function VideoPlayer({
  src,
  poster,
  className = "",
  autoPlay = false,
  controls = true,
  muted = false,
  loop = false,
}: VideoPlayerProps) {
  const formattedSrc = formatVideoUrl(src);
  const formattedPoster = formatVideoPoster(src, poster);
  const { type, embedUrl } = parseVideoUrl(formattedSrc);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  if (!src) return null;

  if (type === "youtube" || type === "vimeo") {
    const finalEmbedUrl = new URL(embedUrl);
    if (autoPlay || isPlaying) finalEmbedUrl.searchParams.set("autoplay", "1");
    if (muted) finalEmbedUrl.searchParams.set("muted", "1");
    if (loop) finalEmbedUrl.searchParams.set("loop", "1");

    return (
      <div className={`relative aspect-video w-full overflow-hidden bg-black ${className}`}>
        {!isPlaying && formattedPoster ? (
          <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={formattedPoster} alt="Video poster" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
              <div className="w-16 h-16 rounded-full bg-white/90 text-black flex items-center justify-center pl-1 group-hover:scale-110 transition-transform">
                <Play size={28} className="fill-black" />
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={finalEmbedUrl.toString()}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    );
  }

  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-black ${className}`}>
      <video
        src={formattedSrc}
        poster={formattedPoster}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        className="w-full h-full object-contain bg-black"
      >
        <source src={formattedSrc} type="video/mp4" />
        Your browser does not support playing this video.
      </video>
    </div>
  );
}
