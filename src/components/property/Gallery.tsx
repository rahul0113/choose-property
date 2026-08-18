"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import type { PropertyMedia } from "@/types/database";
import { SmartImage } from "@/components/ui/SmartImage";
import { MEDIA_CATEGORY_LABELS } from "@/lib/constants";
import { track } from "@/lib/analytics";

type Tab = "all" | "ground" | "drone" | "video";

function groupLabel(m: PropertyMedia): string {
  if (m.media_type === "video" || m.media_type === "drone_video") return "video";
  if (m.media_type === "drone_photo") return "drone";
  return "ground";
}

export function Gallery({
  media,
  propertyId,
  propertyUuid,
}: {
  media: PropertyMedia[];
  propertyId: string;
  propertyUuid?: string;
}) {
  const [tab, setTab] = useState<Tab>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const filtered = useMemo(() => (tab === "all" ? media : media.filter((m) => groupLabel(m) === tab)), [media, tab]);

  useEffect(() => {
    if (openIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i == null ? i : (i + 1) % filtered.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i == null ? i : (i - 1 + filtered.length) % filtered.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, filtered.length]);

  if (media.length === 0) return null;

  const openItem = openIndex != null ? filtered[openIndex] : null;

  return (
    <div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Media categories">
        {(
          [
            ["all", "All"],
            ["ground", "Ground"],
            ["drone", "Drone"],
            ["video", "Video"],
          ] as Array<[Tab, string]>
        ).map(([key, label]) => {
          const count = key === "all" ? media.length : media.filter((m) => groupLabel(m) === key).length;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => {
                setTab(key);
                setOpenIndex(null);
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                tab === key ? "bg-brand text-white" : "bg-paper-soft text-ink-soft hover:bg-paper-line"
              }`}
            >
              {label} <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {filtered.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setOpenIndex(i);
              setZoomed(false);
              track({ event: "media_view", propertyId: propertyUuid ?? null, propertyCode: propertyId });
            }}
            className="relative block aspect-[4/3] w-[78%] max-w-sm shrink-0 snap-start overflow-hidden rounded-xl bg-paper-soft sm:w-72"
            aria-label={`View ${m.caption ?? "media"} full screen`}
          >
            {m.media_type === "video" || m.media_type === "drone_video" ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video src={m.url} preload="metadata" muted playsInline className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <SmartImage src={m.url} alt={m.alt_text ?? m.caption ?? "Photo"} sizes="(max-width: 640px) 78vw, 288px" />
            )}
            <span className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
              <span className="truncate rounded-md bg-ink/70 px-2 py-1 text-xs text-white">
                {m.caption ?? MEDIA_CATEGORY_LABELS[m.category]}
              </span>
              <Maximize2 className="h-4 w-4 shrink-0 text-white drop-shadow" aria-hidden />
            </span>
          </button>
        ))}
      </div>

      {/* Fullscreen viewer */}
      {openItem && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink/95" role="dialog" aria-modal="true" aria-label="Media viewer">
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <p className="truncate pr-4 text-sm">{openItem.caption ?? MEDIA_CATEGORY_LABELS[openItem.category]}</p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
              >
                {zoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"
                aria-label="Close viewer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-auto p-4">
            {openItem.media_type === "video" || openItem.media_type === "drone_video" ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={openItem.url}
                controls
                preload="none"
                poster={openItem.url}
                className="max-h-full max-w-full rounded-lg"
              />
            ) : (
              <img
                src={openItem.url}
                alt={openItem.alt_text ?? openItem.caption ?? "Photo"}
                className={`max-h-full max-w-full rounded-lg transition-transform ${
                  zoomed ? "scale-[1.8] cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onClick={() => setZoomed((z) => !z)}
              />
            )}
          </div>

          {filtered.length > 1 && (
            <div className="flex items-center justify-between px-4 py-4">
              <button
                type="button"
                onClick={() => setOpenIndex((openIndex - 1 + filtered.length) % filtered.length)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Previous media"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <p className="text-sm text-white/80">
                {openIndex + 1} / {filtered.length}
              </p>
              <button
                type="button"
                onClick={() => setOpenIndex((openIndex + 1) % filtered.length)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Next media"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      )}

      <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-faint">
        <Camera className="h-3.5 w-3.5" aria-hidden />
        Tap any photo for full screen. Videos do not autoplay.
      </p>
    </div>
  );
}
