import { Calendar } from "lucide-react";
import { defineField, defineType } from "sanity";

export const eventsList = defineType({
  name: "eventsList",
  title: "Events List",
  type: "object",
  icon: Calendar,
  description:
    "Display all events in chronological order, with upcoming events first",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "The heading that appears above the events list",
      type: "string",
      initialValue: "Upcoming Events",
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "Optional text to describe the events section",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "showPastEvents",
      title: "Show Past Events",
      description: "Include events that have already happened",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "maxEvents",
      title: "Maximum Number of Events",
      description:
        "Limit the number of events displayed (leave empty to show all)",
      type: "number",
      validation: (Rule) => Rule.min(1).max(50),
    }),
  ],
  preview: {
    select: {
      title: "title",
      showPastEvents: "showPastEvents",
      maxEvents: "maxEvents",
    },
    prepare: ({ title, showPastEvents, maxEvents }) => {
      const subtitle = [
        showPastEvents ? "All events" : "Upcoming events only",
        maxEvents ? `(max ${maxEvents})` : "(all events)",
      ].join(" | ");

      return {
        title: title || "Events List",
        subtitle,
        media: Calendar,
      };
    },
  },
});
