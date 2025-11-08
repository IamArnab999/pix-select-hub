import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Image {
  id: string;
  urls: {
    small: string;
    regular: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

interface ImageGridProps {
  images: Image[];
  selectedImages: Set<string>;
  onImageSelect: (id: string, checked: boolean) => void;
}

export const ImageGrid = ({ images, selectedImages, onImageSelect }: ImageGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative aspect-square rounded-xl overflow-hidden bg-muted shadow-soft hover:shadow-medium transition-all"
        >
          <img
            src={image.urls.small}
            alt={image.alt_description || "Unsplash image"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-sm font-medium truncate">
                by {image.user.name}
              </p>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <div className={cn(
              "bg-card rounded-lg p-2 shadow-medium transition-all",
              selectedImages.has(image.id) ? "scale-100" : "scale-0 group-hover:scale-100"
            )}>
              <Checkbox
                checked={selectedImages.has(image.id)}
                onCheckedChange={(checked) => onImageSelect(image.id, checked as boolean)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
