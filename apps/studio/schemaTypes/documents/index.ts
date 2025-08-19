import { author } from "./author";
import { blog } from "./blog";
import { blogIndex } from "./blog-index";
import { clientStory } from "./client-story";
import { faq } from "./faq";
import { footer } from "./footer";
import { homePage } from "./home-page";
import { investor } from "./investor";
import { navbar } from "./navbar";
import { news } from "./news";
import { page } from "./page";
import { service } from "./service";
import { settings } from "./settings";

export const singletons = [homePage, blogIndex, settings, footer, navbar];

export const documents = [
  blog,
  page,
  faq,
  author,
  investor,
  service,
  clientStory,
  news,
  ...singletons,
];
