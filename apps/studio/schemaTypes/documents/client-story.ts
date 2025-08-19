import { defineField, defineType } from "sanity";
import { Users } from "lucide-react";

import { richTextField } from "../common";
import { GROUP, GROUPS } from "../../utils/constant";

export const clientStory = defineType({
  name: "clientStory",
  title: "Client Story",
  type: "document",
  icon: Users,
  description: "A client success story that can be rendered as a page",
  groups: GROUPS,
  fields: [
    defineField({
      name: "title",
      title: "Client Story Title",
      type: "string",
      description: "The title of the client story",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Client Story Slug",
      type: "slug",
      description: "The URL slug for this client story page",
      group: GROUP.MAIN_CONTENT,
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      description: "The hero section for the client story page",
      group: GROUP.MAIN_CONTENT,
      fields: [
        defineField({
          name: "title",
          title: "Hero Title",
          type: "string",
          description: "The main title for the hero section",
        }),
        defineField({
          name: "subtitle",
          title: "Hero Subtitle",
          type: "text",
          description: "A subtitle or description for the hero section",
          rows: 3,
        }),
        defineField({
          name: "image",
          title: "Hero Image",
          type: "image",
          description: "Hero image for the client story",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alt Text",
              description: "Alternative text for the hero image",
            }),
          ],
        }),
      ],
    }),
    richTextField,
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      heroImage: "hero.image",
    },
    prepare({ title, slug, heroImage }) {
      return {
        title: title || "Untitled Client Story",
        subtitle: slug ? `/${slug}` : "No slug",
        media: heroImage,
      };
    },
  },
});
