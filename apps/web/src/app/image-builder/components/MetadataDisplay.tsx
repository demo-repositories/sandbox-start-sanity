"use client";

import type { ImageAsset } from "./ImageBuilderClient";

type MetadataDisplayProps = {
  image: ImageAsset;
};

export default function MetadataDisplay({ image }: MetadataDisplayProps) {
  const metadata = image.metadata;
  if (!metadata) {
    return (
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Metadata</h2>
        <p className="text-sm text-muted-foreground">No metadata available</p>
      </div>
    );
  }

  const ColorSwatch = ({ color, label }: { color?: string; label: string }) => {
    if (!color) return null;
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded border border-border"
          style={{ backgroundColor: color }}
        />
        <div className="flex-1">
          <p className="text-xs font-medium">{label}</p>
          <p className="text-xs text-muted-foreground font-mono">{color}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Metadata</h2>

      {/* Dimensions */}
      {metadata.dimensions && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Dimensions</h3>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Width:</span>{" "}
              {metadata.dimensions.width}px
            </p>
            <p>
              <span className="font-medium">Height:</span>{" "}
              {metadata.dimensions.height}px
            </p>
            {metadata.dimensions.aspectRatio && (
              <p>
                <span className="font-medium">Aspect Ratio:</span>{" "}
                {metadata.dimensions.aspectRatio.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Color Palette */}
      {metadata.palette && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Color Palette</h3>

          {metadata.palette.dominant && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Dominant
              </p>
              <div className="space-y-2">
                <ColorSwatch
                  color={metadata.palette.dominant.background}
                  label="Background"
                />
                <ColorSwatch
                  color={metadata.palette.dominant.foreground}
                  label="Foreground"
                />
              </div>
            </div>
          )}

          {metadata.palette.vibrant && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Vibrant
              </p>
              <div className="space-y-2">
                <ColorSwatch
                  color={metadata.palette.vibrant.background}
                  label="Background"
                />
                <ColorSwatch
                  color={metadata.palette.vibrant.foreground}
                  label="Foreground"
                />
              </div>
            </div>
          )}

          {metadata.palette.muted && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Muted</p>
              <div className="space-y-2">
                <ColorSwatch
                  color={metadata.palette.muted.background}
                  label="Background"
                />
                <ColorSwatch
                  color={metadata.palette.muted.foreground}
                  label="Foreground"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* LQIP */}
      {metadata.lqip && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">LQIP (Low Quality Image Placeholder)</h3>
          <div className="relative">
            <img
              src={metadata.lqip.startsWith("data:") ? metadata.lqip : `data:image/svg+xml;base64,${metadata.lqip}`}
              alt="LQIP preview"
              className="w-full h-auto rounded border border-border"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Low quality image placeholder for progressive loading
          </p>
        </div>
      )}

      {/* BlurHash */}
      {metadata.blurHash && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">BlurHash</h3>
          <p className="text-xs font-mono text-muted-foreground break-all">
            {metadata.blurHash}
          </p>
          <p className="text-xs text-muted-foreground">
            Compact representation of image placeholder
          </p>
        </div>
      )}

      {/* Alpha Channel Info */}
      <div className="space-y-2 pt-2 border-t">
        <h3 className="text-sm font-medium">Image Properties</h3>
        <div className="text-sm space-y-1">
          {metadata.hasAlpha !== undefined && (
            <p>
              <span className="font-medium">Has Alpha Channel:</span>{" "}
              {metadata.hasAlpha ? "Yes" : "No"}
            </p>
          )}
          {metadata.isOpaque !== undefined && (
            <p>
              <span className="font-medium">Is Opaque:</span>{" "}
              {metadata.isOpaque ? "Yes" : "No"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
