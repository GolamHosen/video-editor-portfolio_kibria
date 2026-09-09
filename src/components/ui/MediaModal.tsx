"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, Play } from "lucide-react";
import { VideoPlayer } from "./VideoPlayer";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface MediaModalItem {
  id: string | number;
  type: "image" | "video";
  url: string;
  posterUrl?: string | null;
  title?: string;
  slug?: string | null;
  categoryName?: string | null;
}

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MediaModalItem[];
  currentIndex: number;
  onNavigate?: (newIndex: number) => void;
}

export function MediaModal({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
}: MediaModalProps) {
  const [index, setIndex] = useState(currentIndex);

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && items.length > 1) handlePrev();
      if (e.key === "ArrowRight" && items.length > 1) handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, index, items.length]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const currentItem = items[index];

  const handlePrev = () => {
    const newIdx = index === 0 ? items.length - 1 : index - 1;
    setIndex(newIdx);
    onNavigate?.(newIdx);
  };

  const handleNext = () => {
    const newIdx = index === items.length - 1 ? 0 : index + 1;
    setIndex(newIdx);
    onNavigate?.(newIdx);
  };

  if (!isOpen || !currentItem) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
        onClick={onClose}
      >
        {/* Top Control Bar */}
        <div
          className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-auto px-2 md:px-4 py-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            {currentItem.categoryName && (
              <span className="text-[11px] font-mono font-medium tracking-widest uppercase text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                {currentItem.categoryName}
              </span>
            )}
            {currentItem.title && (
              <span className="text-white text-xs md:text-sm font-semibold tracking-tight bg-neutral-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                {currentItem.title}
              </span>
            )}
            {currentItem.slug && (
              <Link
                href={`/work/${currentItem.slug}`}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 transition-all duration-200"
              >
                <span>View Case Study</span>
                <ArrowUpRight size={13} />
              </Link>
            )}
            {items.length > 1 && (
              <span className="text-neutral-400 text-xs font-mono bg-neutral-900/80 px-3 py-1.5 rounded-full border border-white/10">
                {index + 1} / {items.length}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-white flex items-center justify-center border border-white/10 hover:border-white/30 transition-all hover:scale-105"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Previous Button */}
        {items.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white flex items-center justify-center border border-white/10 transition-transform hover:scale-110"
            aria-label="Previous item"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Next Button */}
        {items.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white flex items-center justify-center border border-white/10 transition-transform hover:scale-110"
            aria-label="Next item"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Content Container */}
        <motion.div
          key={currentItem.id || index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-6xl w-full max-h-[85vh] flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {currentItem.type === "video" ? (
            <VideoPlayer
              src={currentItem.url}
              poster={currentItem.posterUrl || undefined}
              autoPlay={true}
              controls={true}
              className="w-full h-full max-h-[85vh] object-contain bg-black"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentItem.url}
              alt={currentItem.title || "Expanded image"}
              className="w-full h-full max-h-[85vh] object-contain bg-black rounded-2xl select-none"
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
