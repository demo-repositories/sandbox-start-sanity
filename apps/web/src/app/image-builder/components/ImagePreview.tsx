"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import type { ImageAsset, TransformationParams, CropValues, HotspotValues } from "./ImageBuilderClient";

type ImagePreviewProps = {
  imageUrl: string | null;
  originalImage: ImageAsset | null;
  transformations: TransformationParams;
  crop: CropValues;
  hotspot: HotspotValues;
  onHotspotChange: (hotspot: HotspotValues) => void;
};

export default function ImagePreview({
  imageUrl,
  originalImage,
  transformations,
  crop,
  hotspot,
  onHotspotChange,
  onTransformationsChange,
}: ImagePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [showHotspotOverlay, setShowHotspotOverlay] = useState(true);
  const [imageContainerSize, setImageContainerSize] = useState({ width: 0, height: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Calculate contrast ratio between two colors (WCAG standard)
  const getContrastRatio = (color1: string, color2: string): number => {
    const getLuminance = (hex: string): number => {
      const rgb = hexToRgb(hex);
      if (!rgb) return 0;
      
      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  };

  // Convert hex to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Get the best contrasting color for the hotspot overlay
  // Uses the image's dominant color to determine which overlay color will have best contrast
  const getBestContrastColor = (): string => {
    if (!originalImage?.metadata?.palette) {
      return "#3b82f6"; // Default blue
    }

    const palette = originalImage.metadata.palette;
    // Use dominant background color as the "background" we're overlaying on
    const imageBackgroundColor = palette.dominant?.background;
    
    if (!imageBackgroundColor) {
      return "#3b82f6"; // Default blue
    }

    // High contrast colors to test - these will be used for the overlay
    const highContrastColors = [
      { color: "#ffffff", name: "white" },
      { color: "#000000", name: "black" },
      { color: "#ffff00", name: "yellow" },
      { color: "#00ffff", name: "cyan" },
      { color: "#ff00ff", name: "magenta" },
      { color: "#3b82f6", name: "blue" },
      { color: "#ef4444", name: "red" },
      { color: "#10b981", name: "green" },
      { color: "#f59e0b", name: "orange" },
    ];

    let bestColor = "#3b82f6"; // Default
    let bestContrast = 0;

    // Test each high contrast color against the image's dominant color
    // The one with the highest contrast ratio will be most visible
    for (const { color } of highContrastColors) {
      const contrast = getContrastRatio(imageBackgroundColor, color);
      if (contrast > bestContrast) {
        bestContrast = contrast;
        bestColor = color;
      }
    }

    // Ensure minimum contrast (WCAG AA requires at least 3:1 for large text, 4.5:1 for normal)
    // If no color meets 3:1, use white or black (whichever has better contrast)
    if (bestContrast < 3) {
      const whiteContrast = getContrastRatio(imageBackgroundColor, "#ffffff");
      const blackContrast = getContrastRatio(imageBackgroundColor, "#000000");
      bestColor = whiteContrast > blackContrast ? "#ffffff" : "#000000";
    }

    return bestColor;
  };

  const hotspotColor = useMemo(() => getBestContrastColor(), [originalImage?.metadata?.palette]);

  // Track image container size for hotspot visualization
  useEffect(() => {
    const updateSize = () => {
      if (imageContainerRef.current && imageRef.current) {
        const container = imageContainerRef.current;
        const img = imageRef.current;
        setImageContainerSize({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [imageUrl, transformations]);

  // Calculate hotspot overlay position
  const [hotspotOverlayStyle, setHotspotOverlayStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const updateHotspotOverlay = () => {
      if (!imageRef.current || !imageContainerRef.current) {
        setHotspotOverlayStyle(null);
        return;
      }

      const img = imageRef.current;
      const container = imageContainerRef.current;
      
      // Wait for image to load
      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        return;
      }
      
      const containerRect = container.getBoundingClientRect();
      
      // Calculate the actual displayed image size (accounting for object-contain)
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const containerAspect = containerRect.width / containerRect.height;
      
      let displayWidth, displayHeight, offsetX, offsetY;
      
      if (imgAspect > containerAspect) {
        // Image is wider - fit to width
        displayWidth = containerRect.width;
        displayHeight = containerRect.width / imgAspect;
        offsetX = 0;
        offsetY = (containerRect.height - displayHeight) / 2;
      } else {
        // Image is taller - fit to height
        displayHeight = containerRect.height;
        displayWidth = containerRect.height * imgAspect;
        offsetX = (containerRect.width - displayWidth) / 2;
        offsetY = 0;
      }

      // Calculate hotspot position relative to displayed image
      const hotspotLeft = offsetX + (hotspot.x - hotspot.width / 2) * displayWidth;
      const hotspotTop = offsetY + (hotspot.y - hotspot.height / 2) * displayHeight;
      const hotspotWidth = hotspot.width * displayWidth;
      const hotspotHeight = hotspot.height * displayHeight;

      setHotspotOverlayStyle({
        left: hotspotLeft,
        top: hotspotTop,
        width: hotspotWidth,
        height: hotspotHeight,
      });
    };

    const img = imageRef.current;
    if (img) {
      img.addEventListener('load', updateHotspotOverlay);
    }
    
    updateHotspotOverlay();
    window.addEventListener('resize', updateHotspotOverlay);
    
    return () => {
      if (img) {
        img.removeEventListener('load', updateHotspotOverlay);
      }
      window.removeEventListener('resize', updateHotspotOverlay);
    };
  }, [hotspot, imageUrl, imageContainerSize, transformations]);

  // Preset aspect ratios for testing hotspot
  const presetAspectRatios = [
    { name: "Square", width: 800, height: 800 },
    { name: "Portrait", width: 600, height: 900 },
    { name: "Landscape", width: 1200, height: 800 },
    { name: "Wide", width: 1600, height: 900 },
    { name: "Tall", width: 600, height: 1200 },
  ];

  const applyPresetAspectRatio = (width: number, height: number) => {
    if (onTransformationsChange) {
      onTransformationsChange({
        ...transformations,
        width,
        height,
        fit: "crop", // Use crop to demonstrate hotspot effect
      });
    }
  };

  const copyToClipboard = async () => {
    if (!imageUrl) return;
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!imageUrl || !originalImage) {
    return (
      <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
        <div className="p-6 border rounded-lg bg-muted/50">
          <h2 className="text-2xl font-semibold mb-4">Image Preview</h2>
          <div className="flex items-center justify-center min-h-[500px] bg-muted rounded-lg border-2 border-dashed border-border">
            <p className="text-muted-foreground text-lg">Select an image to see preview</p>
          </div>
        </div>
      </div>
    );
  }

  const calculateDisplayDimensions = () => {
    const originalWidth = originalImage.metadata?.dimensions?.width ?? 0;
    const originalHeight = originalImage.metadata?.dimensions?.height ?? 0;

    if (!transformations.width && !transformations.height) {
      return { width: originalWidth, height: originalHeight };
    }

    if (transformations.width && transformations.height) {
      return {
        width: transformations.width,
        height: transformations.height,
      };
    }

    if (transformations.width) {
      const aspectRatio =
        originalImage.metadata?.dimensions?.aspectRatio ??
        originalWidth / originalHeight;
      return {
        width: transformations.width,
        height: Math.round(transformations.width / aspectRatio),
      };
    }

    if (transformations.height) {
      const aspectRatio =
        originalImage.metadata?.dimensions?.aspectRatio ??
        originalWidth / originalHeight;
      return {
        width: Math.round(transformations.height * aspectRatio),
        height: transformations.height,
      };
    }

    return { width: originalWidth, height: originalHeight };
  };

  const displayDimensions = calculateDisplayDimensions();

  // Handle clicking on image to set hotspot
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !imageRef.current) return;
    
    const container = imageContainerRef.current;
    const img = imageRef.current;
    const rect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    
    // Calculate click position relative to the actual displayed image
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = rect.width / rect.height;
    
    let displayWidth, displayHeight, offsetX, offsetY;
    
    if (imgAspect > containerAspect) {
      displayWidth = rect.width;
      displayHeight = rect.width / imgAspect;
      offsetX = 0;
      offsetY = (rect.height - displayHeight) / 2;
    } else {
      displayHeight = rect.height;
      displayWidth = rect.height * imgAspect;
      offsetX = (rect.width - displayWidth) / 2;
      offsetY = 0;
    }
    
    const clickX = e.clientX - rect.left - offsetX;
    const clickY = e.clientY - rect.top - offsetY;
    
    // Convert to normalized coordinates (0-1)
    const normalizedX = Math.max(0, Math.min(1, clickX / displayWidth));
    const normalizedY = Math.max(0, Math.min(1, clickY / displayHeight));
    
    onHotspotChange({
      ...hotspot,
      x: normalizedX,
      y: normalizedY,
    });
  };

  return (
    <div className="space-y-6 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
      {/* Large Image Preview */}
      <div className="space-y-4 p-6 border rounded-lg bg-muted/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-semibold">Image Preview</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Display:</span> {displayDimensions.width} × {displayDimensions.height}px
              {originalImage.metadata?.dimensions && (
                <> | <span className="font-medium">Original:</span> {originalImage.metadata.dimensions.width} × {originalImage.metadata.dimensions.height}px</>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showHotspotOverlay}
                onChange={(e) => setShowHotspotOverlay(e.target.checked)}
                className="h-4 w-4"
              />
              <span>Show Hotspot</span>
            </label>
          </div>
        </div>

        {/* Preset Aspect Ratios for Testing Hotspot */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium self-center">Test with:</span>
          {presetAspectRatios.map((preset) => (
            <Button
              key={preset.name}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyPresetAspectRatio(preset.width, preset.height)}
              className="text-xs"
            >
              {preset.name} ({preset.width}×{preset.height})
            </Button>
          ))}
        </div>

        <div 
          ref={imageContainerRef}
          className="relative w-full bg-background rounded-lg overflow-hidden border-2 border-border shadow-lg cursor-crosshair"
          onClick={handleImageClick}
        >
          <div className="relative min-h-[500px] flex items-center justify-center p-8">
            {imageUrl ? (
              <div className="relative w-full max-w-full" style={{ maxHeight: '70vh' }}>
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt={originalImage.originalFilename || "Transformed image"}
                  className="object-contain w-full h-full mx-auto pointer-events-none"
                  style={{ 
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '70vh',
                  }}
                />
                
                {/* Hotspot Overlay */}
                {showHotspotOverlay && hotspotOverlayStyle && (
                  <div
                    className="absolute border-2 pointer-events-none z-10"
                    style={{
                      left: `${hotspotOverlayStyle.left}px`,
                      top: `${hotspotOverlayStyle.top}px`,
                      width: `${hotspotOverlayStyle.width}px`,
                      height: `${hotspotOverlayStyle.height}px`,
                      borderColor: hotspotColor,
                      backgroundColor: `${hotspotColor}20`, // 20% opacity
                    }}
                  >
                    <div
                      className="absolute -top-6 left-0 text-xs font-medium px-2 py-1 rounded whitespace-nowrap"
                      style={{
                        backgroundColor: hotspotColor,
                        color: getContrastRatio(hotspotColor, "#ffffff") > getContrastRatio(hotspotColor, "#000000") ? "#ffffff" : "#000000",
                      }}
                    >
                      Hotspot
                    </div>
                    {/* Center point indicator */}
                    <div
                      className="absolute w-3 h-3 border-2 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: hotspotColor,
                        borderColor: getContrastRatio(hotspotColor, "#ffffff") > getContrastRatio(hotspotColor, "#000000") ? "#ffffff" : "#000000",
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
          <p className="font-medium mb-1">💡 Hotspot Demo:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Click on the image to set the hotspot center point</li>
            <li>The hotspot ensures the important part of your image stays visible when cropped to different aspect ratios</li>
            <li>Try the preset aspect ratio buttons above to see how the hotspot affects the crop</li>
            <li>Adjust hotspot size and position using the controls in the sidebar</li>
          </ul>
        </div>
      </div>

      {/* Generated URL */}
      <div className="space-y-2 p-4 bg-background rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Generated URL</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
          >
            {copied ? "Copied!" : "Copy URL"}
          </Button>
        </div>
        <Input
          type="text"
          value={imageUrl}
          readOnly
          className="font-mono text-xs"
        />
        <p className="text-xs text-muted-foreground">
          This URL includes all transformation parameters and can be used directly in your application.
        </p>
      </div>
    </div>
  );
}
