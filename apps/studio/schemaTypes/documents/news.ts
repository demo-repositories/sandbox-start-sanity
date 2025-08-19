import { defineField, defineType } from "sanity";
import { Newspaper } from "lucide-react";

import { richTextField } from "../common";
import { GROUP, GROUPS } from "../../utils/constant";

export const news = defineType({
  name: "news",
  title: "News",
  type: "document",
  icon: Newspaper,
  description: "News articles and announcements for the company",
  groups: GROUPS,
  fields: [
    defineField({
      name: "title",
      title: "News Title",
      type: "string",
      description: "The title of the news article",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "News Category",
      type: "string",
      description: "The category of this news item",
      group: GROUP.MAIN_CONTENT,
      options: {
        list: [
          { title: "Press Releases", value: "press-releases" },
          { title: "Analyst Recognition", value: "analyst-recognition" },
          { title: "Client Stories", value: "client-stories" },
          { title: "Inside Stories", value: "inside-stories" },
          { title: "Social Media", value: "social-media" },
          { title: "Events", value: "events" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    richTextField,
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
    },
    prepare({ title, category }) {
      const categoryTitles = {
        "press-releases": "Press Release",
        "analyst-recognition": "Analyst Recognition",
        "client-stories": "Client Story",
        "inside-stories": "Inside Story",
        "social-media": "Social Media",
        events: "Event",
      };

      return {
        title: title || "Untitled News",
        subtitle:
          categoryTitles[category as keyof typeof categoryTitles] ||
          category ||
          "No category",
      };
    },
  },
});
