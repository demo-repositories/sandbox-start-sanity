"use client";

import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import type { TransformationParams } from "./ImageBuilderClient";

type TransformationControlsProps = {
  transformations: TransformationParams;
  onChange: (transformations: TransformationParams) => void;
};

export default function TransformationControls({
  transformations,
  onChange,
}: TransformationControlsProps) {
  const updateTransform = (key: keyof TransformationParams, value: any) => {
    onChange({ ...transformations, [key]: value });
  };

  const resetTransformations = () => {
    onChange({
      width: undefined,
      height: undefined,
      blur: 0,
      quality: 75,
      fit: "max",
      format: "auto",
      dpr: 1,
      autoFormat: false,
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Transformations</h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={resetTransformations}
        >
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Width */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Width (px)</label>
          <Input
            type="number"
            placeholder="Auto"
            value={transformations.width ?? ""}
            onChange={(e) =>
              updateTransform(
                "width",
                e.target.value ? parseInt(e.target.value, 10) : undefined,
              )
            }
            min="1"
          />
        </div>

        {/* Height */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Height (px)</label>
          <Input
            type="number"
            placeholder="Auto"
            value={transformations.height ?? ""}
            onChange={(e) =>
              updateTransform(
                "height",
                e.target.value ? parseInt(e.target.value, 10) : undefined,
              )
            }
            min="1"
          />
        </div>

        {/* Blur */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Blur: {transformations.blur ?? 0}
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={transformations.blur ?? 0}
            onChange={(e) => updateTransform("blur", parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>

        {/* Quality */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Quality: {transformations.quality ?? 75}%
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={transformations.quality ?? 75}
            onChange={(e) =>
              updateTransform("quality", parseInt(e.target.value, 10))
            }
            className="w-full"
          />
        </div>

        {/* Fit Mode */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Fit Mode</label>
          <select
            value={transformations.fit ?? "max"}
            onChange={(e) =>
              updateTransform("fit", e.target.value as TransformationParams["fit"])
            }
            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="max">Max (prevent upscale)</option>
            <option value="min">Min</option>
            <option value="fill">Fill</option>
            <option value="scale-down">Scale Down</option>
            <option value="crop">Crop</option>
          </select>
        </div>

        {/* Format */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Format</label>
          <select
            value={transformations.format ?? "auto"}
            onChange={(e) =>
              updateTransform(
                "format",
                e.target.value as TransformationParams["format"],
              )
            }
            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="auto">Auto</option>
            <option value="webp">WebP</option>
            <option value="jpg">JPEG</option>
            <option value="png">PNG</option>
          </select>
        </div>

        {/* DPR */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Device Pixel Ratio</label>
          <div className="flex gap-2">
            {[1, 2, 3].map((dpr) => (
              <Button
                key={dpr}
                type="button"
                variant={
                  transformations.dpr === dpr ? "default" : "outline"
                }
                size="sm"
                onClick={() => updateTransform("dpr", dpr)}
              >
                {dpr}x
              </Button>
            ))}
            <Input
              type="number"
              placeholder="Custom"
              value={
                transformations.dpr && ![1, 2, 3].includes(transformations.dpr)
                  ? transformations.dpr
                  : ""
              }
              onChange={(e) =>
                updateTransform(
                  "dpr",
                  e.target.value ? parseFloat(e.target.value) : 1,
                )
              }
              min="0.5"
              max="5"
              step="0.1"
              className="flex-1"
            />
          </div>
        </div>

        {/* Auto Format */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Auto Format</label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={transformations.autoFormat ?? false}
              onChange={(e) => updateTransform("autoFormat", e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <span className="text-sm text-muted-foreground">
              Automatically choose best format based on browser support
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
