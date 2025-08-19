import { defineField, defineType } from "sanity";
import { Download } from "lucide-react";

export const fileDownload = defineType({
  name: "fileDownload",
  title: "File Download",
  type: "object",
  icon: Download,
  description: "Add a downloadable file to your page",
  fields: [
    defineField({
      name: "title",
      title: "Download Title",
      type: "string",
      description: "The title that will be displayed for the download link",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Optional description of the file",
      rows: 3,
    }),
    defineField({
      name: "file",
      title: "File",
      type: "file",
      description: "The file that users can download",
      validation: (Rule) => Rule.required(),
      options: {
        accept:
          ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.mp4,.mp3,.jpg,.jpeg,.png,.gif",
      },
      preview: {
        select: {
          asset: "asset",
        },
        prepare({ asset }) {
          return {
            title: asset?.originalFilename || "No file selected",
            media: Download,
          };
        },
      },
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
      description: "Text to display on the download button",
      initialValue: "Download File",
    }),
    defineField({
      name: "showFileSize",
      title: "Show File Size",
      type: "boolean",
      description: "Whether to display the file size",
      initialValue: true,
    }),
    defineField({
      name: "showFileType",
      title: "Show File Type",
      type: "boolean",
      description: "Whether to display the file type/extension",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
    },
    prepare({ title, description }) {
      return {
        title: title || "Untitled Download",
        subtitle: description || "File download block",
        media: Download,
      };
    },
  },
});
