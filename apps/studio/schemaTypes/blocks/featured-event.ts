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
      name: "headline",
      title: "Headline",
      type: "string",
      description: "The big attention-grabbing text for the featured event",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bannerText",
      title: "Banner Text",
      type: "array",
      of: [{ type: "block" }],
      description:
        "Optional rich text to display as additional banner text for the featured event",
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
      headline: "headline",
      eventTitle: "event.title",
    },
    prepare: ({ headline, eventTitle }) => ({
      title: headline || eventTitle || "Featured Event",
      subtitle: "Featured Event",
    }),
  },
});
