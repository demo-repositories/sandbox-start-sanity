import { defineField, defineType } from "sanity";
import { Wrench } from "lucide-react";

import { pageBuilderField } from "../common";
import { GROUP, GROUPS } from "../../utils/constant";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: Wrench,
  description: "A service page that can be rendered on the website",
  groups: GROUPS,
  fields: [
    defineField({
      name: "title",
      title: "Service Title",
      type: "string",
      description: "The title of the service page",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Service Slug",
      type: "slug",
      description: "The URL slug for this service page",
      group: GROUP.MAIN_CONTENT,
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    pageBuilderField,
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
    },
    prepare({ title, slug }) {
      return {
        title: title || "Untitled Service",
        subtitle: slug ? `/${slug}` : "No slug",
      };
    },
  },
});
