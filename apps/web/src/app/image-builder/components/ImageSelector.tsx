"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import type { ImageAsset } from "./ImageBuilderClient";
import { imageBuilder } from "@/lib/sanity/client";

type ImageSelectorProps = {
  images: ImageAsset[];
  selectedImage: ImageAsset | null;
  onSelect: (image: ImageAsset | null) => void;
  manualInput: string;
  onManualInputChange: (value: string) => void;
  onManualSubmit: () => void;
};

export default function ImageSelector({
  images,
  selectedImage,
  onSelect,
  manualInput,
  onManualInputChange,
  onManualSubmit,
}: ImageSelectorProps) {
  const [showManualInput, setShowManualInput] = useState(false);

  const getThumbnailUrl = (image: ImageAsset) => {
    if (image.url) return image.url;
    try {
      return imageBuilder
        .image({
          _type: "image",
          asset: {
            _type: "reference",
            _ref: image._id,
          },
        })
        .width(150)
        .height(150)
        .fit("crop")
        .url();
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Select Image</h2>

      {/* Sample Images List */}
      {images.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Sample Images</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {images.map((image) => {
              const thumbnailUrl = getThumbnailUrl(image);
              const isSelected = selectedImage?._id === image._id;

              return (
                <button
                  key={image._id}
                  type="button"
                  onClick={() => onSelect(image)}
                  className={`relative aspect-square rounded border-2 transition-colors ${
                    isSelected
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={image.originalFilename || "Image"}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs">
                      No preview
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Manual Input</label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowManualInput(!showManualInput)}
          >
            {showManualInput ? "Hide" : "Show"}
          </Button>
        </div>

        {showManualInput && (
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter asset ID or image URL"
              value={manualInput}
              onChange={(e) => onManualInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onManualSubmit();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onManualSubmit}
              className="w-full"
            >
              Load Image
            </Button>
            <p className="text-xs text-muted-foreground">
              Enter a Sanity asset ID (e.g., image-xxx-xxx-xxx) or a full image URL
            </p>
          </div>
        )}
      </div>

      {/* Selected Image Info */}
      {selectedImage && (
        <div className="pt-4 border-t space-y-2">
          <h3 className="text-sm font-medium">Selected Image</h3>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">ID:</span> {selectedImage._id}
            </p>
            {selectedImage.originalFilename && (
              <p>
                <span className="font-medium">Filename:</span>{" "}
                {selectedImage.originalFilename}
              </p>
            )}
            {selectedImage.metadata?.dimensions && (
              <p>
                <span className="font-medium">Dimensions:</span>{" "}
                {selectedImage.metadata.dimensions.width} ×{" "}
                {selectedImage.metadata.dimensions.height}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
