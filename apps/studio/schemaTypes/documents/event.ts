import { Calendar } from "lucide-react";
import { defineField, defineType } from "sanity";

import { PathnameFieldComponent } from "../../components/slug-field-component";
import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { isUnique } from "../../utils/slug";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  icon: Calendar,
  description:
    "Create a new event for your website. Events can be displayed on pages using the events list component.",
  groups: GROUPS,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The name of the event",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("An event title is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "A brief description of the event",
      rows: 3,
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) =>
        Rule.required().error("An event description is required"),
    }),
    defineField({
      name: "featureImage",
      type: "image",
      title: "Feature Image",
      description:
        "A main picture for this event that will be displayed in event listings",
      group: GROUP.MAIN_CONTENT,
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          description:
            "Remember to use alt text for people to be able to read what is happening in the image if they are using a screen reader, it's also important for SEO",
          title: "Alt Text",
        }),
      ],
    }),
    defineField({
      name: "dateTime",
      type: "datetime",
      title: "Date and Time",
      description: "When the event will take place",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) =>
        Rule.required().error("Event date and time is required"),
    }),
    defineField({
      name: "location",
      type: "string",
      title: "Location",
      description:
        "Where the event will take place (physical address, venue name, or online platform)",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("Event location is required"),
    }),
    defineField({
      name: "registrationLink",
      type: "url",
      title: "Registration Link",
      description: "URL where people can register for the event",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "URL",
      description:
        "The web address for this event (for example, '/summer-conference-2024' would create an event at yourdomain.com/events/summer-conference-2024)",
      group: GROUP.MAIN_CONTENT,
      options: {
        source: "title",
        isUnique,
      },
      validation: (Rule) =>
        Rule.required().error("A URL slug is required for the event"),
    }),
    ...seoFields.filter((field) => field.name !== "seoHideFromLists"),
    ...ogFields,
  ],
  preview: {
    select: {
      title: "title",
      dateTime: "dateTime",
      location: "location",
      media: "featureImage",
      isPrivate: "seoNoIndex",
    },
    prepare: ({ title, dateTime, location, media, isPrivate }) => {
      const statusEmoji = isPrivate ? "🔒" : "🌎";
      const date = dateTime
        ? new Date(dateTime).toLocaleDateString()
        : "No date";

      return {
        title: `${title || "Untitled Event"}`,
        subtitle: `${statusEmoji} 📅 ${date} | 📍 ${location || "No location"}`,
        media,
      };
    },
  },
});
