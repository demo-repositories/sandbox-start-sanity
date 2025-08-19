import { defineField, defineType } from "sanity";
import { DollarSign } from "lucide-react";

export const investor = defineType({
  name: "investor",
  title: "Investor",
  type: "document",
  icon: DollarSign,
  description: "Investor information for the company",
  fields: [
    defineField({
      name: "name",
      title: "Investor Name",
      type: "string",
      description: "The name of the investor or investment firm",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Investor URL",
      type: "url",
      description: "The website URL of the investor or investment firm",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "url",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Untitled Investor",
        subtitle: subtitle || "No URL provided",
      };
    },
  },
});
