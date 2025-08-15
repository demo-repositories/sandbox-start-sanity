import { PhoneIcon } from "lucide-react";
import { defineField, defineType } from "sanity";
import { buttonsField } from "../common";

export const featuredEvent = defineType({
  name: "featuredEvent",
  type: "object",
  icon: PhoneIcon,
  fields: [
    defineField({
      name: "event",
      title: "Event",
      type: "reference",
      to: [{ type: "event" }],
      description: "Select the event to feature in this block",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Title for the featured event block",
    }),
    defineField({
      name: "bannerText",
      title: "Banner Text",
      type: "array",
      of: [{ type: "block" }],
      description:
        "Rich text to display as the banner text for the featured event",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      description: "Background image for the featured event block",
      options: {
        hotspot: true,
      },
    }),
    {
      ...buttonsField,
      description:
        "Buttons to display for the featured event. If no button is added a fallback button linking to the provided event's page will appear.",
    },
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title,
      subtitle: "Featured Event",
    }),
  },
});
