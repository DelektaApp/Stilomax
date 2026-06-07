"use client";

import Image from "next/image";
import { Image as ImageType } from "@/types";

interface Props {
  image: ImageType;
  onSelect: () => void;
  disabled?: boolean;
}

export default function OutfitCard({ image, onSelect, disabled }: Props) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className="group relative flex-1 bg-stone-50 border border-stone-200 hover:border-stone-400 transition-all duration-200 rounded-sm overflow-hidden aspect-[3/4] cursor-pointer disabled:cursor-default"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src={image.image_url}
          alt={image.archetype?.name ?? "Outfit"}
          fill
          className="object-contain p-4"
          onError={(e) => {
            // Show placeholder silhouette on error
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Fallback silhouette */}
        <div className="w-24 h-48 bg-stone-200 rounded-sm opacity-60" />
      </div>
      <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-colors duration-200" />
      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-stone-900 text-white text-xs tracking-widest uppercase text-center py-2 rounded-sm">
          Choose
        </div>
      </div>
    </button>
  );
}
