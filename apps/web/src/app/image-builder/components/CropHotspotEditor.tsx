"use client";

import { Button } from "@workspace/ui/components/button";
import type { CropValues, HotspotValues } from "./ImageBuilderClient";

type CropHotspotEditorProps = {
  crop: CropValues;
  hotspot: HotspotValues;
  onCropChange: (crop: CropValues) => void;
  onHotspotChange: (hotspot: HotspotValues) => void;
  imageDimensions?: {
    width?: number;
    height?: number;
    aspectRatio?: number;
  };
};

export default function CropHotspotEditor({
  crop,
  hotspot,
  onCropChange,
  onHotspotChange,
  imageDimensions,
}: CropHotspotEditorProps) {
  const resetCrop = () => {
    onCropChange({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });
  };

  const resetHotspot = () => {
    onHotspotChange({
      x: 0.5,
      y: 0.5,
      width: 0.8,
      height: 0.8,
    });
  };

  const updateCrop = (key: keyof CropValues, value: number) => {
    onCropChange({ ...crop, [key]: Math.max(0, Math.min(1, value)) });
  };

  const updateHotspot = (key: keyof HotspotValues, value: number) => {
    onHotspotChange({ ...hotspot, [key]: Math.max(0, Math.min(1, value)) });
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Crop & Hotspot</h2>

      {/* Crop Editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Crop (0-1, fractions of image)</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetCrop}
          >
            Reset
          </Button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Top</span>
              <span>{(crop.top * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={crop.top}
              onChange={(e) => updateCrop("top", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Bottom</span>
              <span>{(crop.bottom * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={crop.bottom}
              onChange={(e) => updateCrop("bottom", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Left</span>
              <span>{(crop.left * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={crop.left}
              onChange={(e) => updateCrop("left", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Right</span>
              <span>{(crop.right * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={crop.right}
              onChange={(e) => updateCrop("right", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
          <p>
            Crop values represent how much to remove from each edge (0 = no crop,
            1 = full edge removed).
          </p>
        </div>
      </div>

      {/* Hotspot Editor */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Hotspot (0-1, fractions of image)</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetHotspot}
          >
            Reset
          </Button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>X Position</span>
              <span>{(hotspot.x * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={hotspot.x}
              onChange={(e) => updateHotspot("x", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Y Position</span>
              <span>{(hotspot.y * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={hotspot.y}
              onChange={(e) => updateHotspot("y", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Width</span>
              <span>{(hotspot.width * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={hotspot.width}
              onChange={(e) => updateHotspot("width", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Height</span>
              <span>{(hotspot.height * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={hotspot.height}
              onChange={(e) => updateHotspot("height", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
          <p>
            Hotspot defines the focal point and area. X/Y is the center position,
            width/height is the size of the hotspot area.
          </p>
        </div>
      </div>

      {/* Image Dimensions Info */}
      {imageDimensions && (
        <div className="pt-4 border-t text-xs text-muted-foreground">
          <p>
            <span className="font-medium">Original:</span>{" "}
            {imageDimensions.width} × {imageDimensions.height}
            {imageDimensions.aspectRatio && (
              <> (Aspect: {imageDimensions.aspectRatio.toFixed(2)})</>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
