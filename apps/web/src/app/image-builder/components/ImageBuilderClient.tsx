"use client";

import { useState, useMemo } from "react";
import type { SanityImageSource } from "@sanity/asset-utils";
import { imageBuilder } from "@/lib/sanity/client";
import type { SanityImageCrop, SanityImageHotspot } from "@/lib/sanity/sanity.types";

import ImageSelector from "./ImageSelector";
import TransformationControls from "./TransformationControls";
import CropHotspotEditor from "./CropHotspotEditor";
import MetadataDisplay from "./MetadataDisplay";
import ImagePreview from "./ImagePreview";

export type ImageAsset = {
  _id: string;
  _type: string;
  url?: string;
  originalFilename?: string;
  altText?: string;
  metadata?: {
    dimensions?: {
      width?: number;
      height?: number;
      aspectRatio?: number;
    };
    palette?: {
      dominant?: {
        background?: string;
        foreground?: string;
      };
      vibrant?: {
        background?: string;
        foreground?: string;
      };
      muted?: {
        background?: string;
        foreground?: string;
      };
    };
    lqip?: string;
    blurHash?: string;
    hasAlpha?: boolean;
    isOpaque?: boolean;
  };
};

type TransformationParams = {
  width?: number;
  height?: number;
  blur?: number;
  quality?: number;
  fit?: "max" | "min" | "fill" | "scale-down" | "crop";
  format?: "webp" | "jpg" | "png" | "auto";
  dpr?: number;
  autoFormat?: boolean;
};

export type CropValues = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type HotspotValues = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function ImageBuilderClient({
  initialImages,
}: {
  initialImages: ImageAsset[];
}) {
  const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(
    initialImages[0] ?? null,
  );
  const [manualImageInput, setManualImageInput] = useState<string>("");

  const [transformations, setTransformations] = useState<TransformationParams>({
    width: undefined,
    height: undefined,
    blur: 0,
    quality: 75,
    fit: "max",
    format: "auto",
    dpr: 1,
    autoFormat: false,
  });

  const [crop, setCrop] = useState<CropValues>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  const [hotspot, setHotspot] = useState<HotspotValues>({
    x: 0.5,
    y: 0.5,
    width: 0.8,
    height: 0.8,
  });

  // Build the image source with crop and hotspot
  const imageSource: SanityImageSource | null = useMemo(() => {
    if (!selectedImage) return null;

    const source: SanityImageSource = {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: selectedImage._id,
      },
    };

    // Add crop if any values are non-zero
    if (crop.top > 0 || crop.bottom > 0 || crop.left > 0 || crop.right > 0) {
      source.crop = {
        _type: "sanity.imageCrop",
        top: crop.top,
        bottom: crop.bottom,
        left: crop.left,
        right: crop.right,
      } as SanityImageCrop;
    }

    // Add hotspot if values are set
    if (hotspot.x !== 0.5 || hotspot.y !== 0.5 || hotspot.width !== 0.8 || hotspot.height !== 0.8) {
      source.hotspot = {
        _type: "sanity.imageHotspot",
        x: hotspot.x,
        y: hotspot.y,
        width: hotspot.width,
        height: hotspot.height,
      } as SanityImageHotspot;
    }

    return source;
  }, [selectedImage, crop, hotspot]);

  // Generate the image URL
  const imageUrl = useMemo(() => {
    if (!imageSource) return null;

    try {
      let builder = imageBuilder.image(imageSource);

      if (transformations.width) {
        builder = builder.width(transformations.width);
      }
      if (transformations.height) {
        builder = builder.height(transformations.height);
      }
      if (transformations.blur && transformations.blur > 0) {
        builder = builder.blur(transformations.blur);
      }
      if (transformations.quality) {
        builder = builder.quality(transformations.quality);
      }
      if (transformations.fit) {
        builder = builder.fit(transformations.fit);
      }
      if (transformations.format && transformations.format !== "auto") {
        builder = builder.format(transformations.format);
      }
      if (transformations.dpr) {
        builder = builder.dpr(transformations.dpr);
      }
      if (transformations.autoFormat) {
        builder = builder.auto("format");
      }

      return builder.url();
    } catch (error) {
      console.error("Error building image URL:", error);
      return null;
    }
  }, [imageSource, transformations]);

  const handleImageSelect = (image: ImageAsset | null) => {
    setSelectedImage(image);
    setManualImageInput("");
  };

  const handleManualImageSubmit = () => {
    if (!manualImageInput.trim()) return;

    // Try to parse as asset ID or URL
    const assetIdMatch = manualImageInput.match(/image-([^-]+-[^-]+-[^-]+-[^-]+-[^-]+)/);
    if (assetIdMatch) {
      // Create a minimal image object from asset ID
      const newImage: ImageAsset = {
        _id: `image-${assetIdMatch[1]}`,
        _type: "sanity.imageAsset",
        url: manualImageInput.includes("http") ? manualImageInput : undefined,
      };
      setSelectedImage(newImage);
    } else if (manualImageInput.includes("http")) {
      // It's a URL, try to extract asset ID or use as-is
      const newImage: ImageAsset = {
        _id: manualImageInput,
        _type: "sanity.imageAsset",
        url: manualImageInput,
      };
      setSelectedImage(newImage);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
      {/* Left Sidebar: Controls */}
      <div className="space-y-6 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
        <ImageSelector
          images={initialImages}
          selectedImage={selectedImage}
          onSelect={handleImageSelect}
          manualInput={manualImageInput}
          onManualInputChange={setManualImageInput}
          onManualSubmit={handleManualImageSubmit}
        />

        <TransformationControls
          transformations={transformations}
          onChange={setTransformations}
        />

        <CropHotspotEditor
          crop={crop}
          hotspot={hotspot}
          onCropChange={setCrop}
          onHotspotChange={setHotspot}
          imageDimensions={selectedImage?.metadata?.dimensions}
        />

        {selectedImage && (
          <MetadataDisplay image={selectedImage} />
        )}
      </div>

      {/* Right Main Area: Large Preview */}
      <div className="w-full">
        <ImagePreview
          imageUrl={imageUrl}
          originalImage={selectedImage}
          transformations={transformations}
          crop={crop}
          hotspot={hotspot}
          onHotspotChange={setHotspot}
          onTransformationsChange={setTransformations}
        />
      </div>
    </div>
  );
}
