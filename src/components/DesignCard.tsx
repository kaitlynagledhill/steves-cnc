"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

type Design = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
};

interface Props {
  design: Design;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
}

function getCloudinaryUrl(url: string, width: number) {
  if (!url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}

export default function DesignCard({
  design,
  isFavorited,
  onToggleFavorite,
}: Props) {
  return (
    <Link href={`/carvings/${design.id}`} className="group block">
      <div
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-[var(--border)]
          bg-white/70
          backdrop-blur
          shadow-sm
          hover:shadow-md
          transition-all
          duration-300
        "
      >
        {/* IMAGE */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={getCloudinaryUrl(design.imageUrl, 600)}
            srcSet={`
              ${getCloudinaryUrl(design.imageUrl, 400)} 400w,
              ${getCloudinaryUrl(design.imageUrl, 600)} 600w,
              ${getCloudinaryUrl(design.imageUrl, 800)} 800w
            `}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={design.name}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              group-hover:scale-105
            "
          />

          {/* subtle warm overlay on hover */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-t
              from-black/20
              via-transparent
              to-transparent
              opacity-0
              group-hover:opacity-100
              transition
            "
          />
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-1">
          <h3 className="text-sm font-semibold text-[var(--foreground)] truncate">
            {design.name}
          </h3>

          <p className="text-xs text-gray-500 tracking-wide">
            {design.category}
          </p>
        </div>

        {/* HEART */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(design.id);
          }}
          className="
            absolute
            top-3
            right-3
            w-9
            h-9
            rounded-full
            bg-white/60
            backdrop-blur-md
            border
            border-white/40
            flex
            items-center
            justify-center
            hover:scale-110
            transition
          "
          aria-label="Save design"
        >
          <Heart
            size={18}
            strokeWidth={1.8}
            className={
              isFavorited
                ? "fill-[var(--accent)] text-[var(--accent)]"
                : "text-[var(--foreground)]/60"
            }
          />
        </button>
      </div>
    </Link>
  );
}
