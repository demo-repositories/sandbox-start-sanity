import { assist } from "@sanity/assist";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { iconPicker } from "sanity-plugin-icon-picker";
import { media } from "sanity-plugin-media";

import { Logo } from "./components/logo";
import { locations } from "./location";
import { presentationUrl } from "./plugins/presentation-url";
import { schemaTypes } from "./schemaTypes";
import {
  structureGlobal,
  structureEngineering,
  structureInvent,
} from "./structure";
import { createPageTemplate, getPresentationUrl } from "./utils/helper";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";

export default defineConfig([
  {
    name: "capgemini",
    title: "Capgemini",
    basePath: "/global",
    projectId: projectId,
    icon: Logo,
    dataset: "production",
    plugins: [
      structureTool({
        structure: structureGlobal,
      }),
      presentationTool({
        resolve: {
          locations,
        },
        previewUrl: {
          origin: getPresentationUrl(),
          previewMode: {
            enable: "/api/presentation-draft",
          },
        },
      }),
      assist(),
      visionTool(),
      iconPicker(),
      media(),
      presentationUrl(),
      unsplashImageAsset(),
    ],

    form: {
      image: {
        assetSources: (sources) =>
          sources.filter((source) => source.name !== "sanity-default"),
      },
      // Disable the default for file assets
      file: {
        assetSources: (sources) =>
          sources.filter((source) => source.name !== "sanity-default"),
      },
    },
    document: {
      newDocumentOptions: (prev, { creationContext }) => {
        const { type } = creationContext;
        if (type === "global") return [];
        return prev;
      },
    },
    schema: {
      types: schemaTypes,
      templates: createPageTemplate(),
    },
  },
  {
    name: "capgemini-engineering",
    title: "Capgemini Engineering",
    basePath: "/engineering",
    projectId: projectId,
    icon: Logo,
    dataset: "production",
    plugins: [
      structureTool({
        structure: structureEngineering,
      }),
      presentationTool({
        resolve: {
          locations,
        },
        previewUrl: {
          origin: getPresentationUrl(),
          previewMode: {
            enable: "/api/presentation-draft",
          },
        },
      }),
      assist(),
      visionTool(),
      iconPicker(),
      media(),
      presentationUrl(),
      unsplashImageAsset(),
    ],

    form: {
      image: {
        assetSources: (sources) =>
          sources.filter((source) => source.name !== "sanity-default"),
      },
      // Disable the default for file assets
      file: {
        assetSources: (sources) =>
          sources.filter((source) => source.name !== "sanity-default"),
      },
    },
    document: {
      newDocumentOptions: (prev, { creationContext }) => {
        const { type } = creationContext;
        if (type === "global") return [];
        return prev;
      },
    },
    schema: {
      types: schemaTypes,
      templates: createPageTemplate(),
    },
  },
  {
    name: "capgemini-invent",
    title: "Capgemini Invent",
    basePath: "/invent",
    projectId: projectId,
    icon: Logo,
    dataset: "production",
    plugins: [
      structureTool({
        structure: structureInvent,
      }),
      presentationTool({
        resolve: {
          locations,
        },
        previewUrl: {
          origin: getPresentationUrl(),
          previewMode: {
            enable: "/api/presentation-draft",
          },
        },
      }),
      assist(),
      visionTool(),
      iconPicker(),
      media(),
      presentationUrl(),
      unsplashImageAsset(),
    ],

    form: {
      image: {
        assetSources: (sources) =>
          sources.filter((source) => source.name !== "sanity-default"),
      },
      // Disable the default for file assets
      file: {
        assetSources: (sources) =>
          sources.filter((source) => source.name !== "sanity-default"),
      },
    },
    document: {
      newDocumentOptions: (prev, { creationContext }) => {
        const { type } = creationContext;
        if (type === "global") return [];
        return prev;
      },
    },
    schema: {
      types: schemaTypes,
      templates: createPageTemplate(),
    },
  },
]);
