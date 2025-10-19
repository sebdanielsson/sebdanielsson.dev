import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { rssSchema } from "@astrojs/rss";
import raycastExtensionsList from "./data/raycastExtensions.json";

const blog = defineCollection({
  loader: glob({ base: "./src/blog", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    rssSchema
      .extend({
        title: z.string(),
        description: z
          .string()
          .max(155, { message: "Must be 155 or fewer characters long" })
          .optional(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        slug: z.string(),
        tags: z.array(z.string()).default([]),
        heroImage: image().optional(),
        heroImageAlt: z.string().optional(),
        author: z.string().optional(),
        draft: z.boolean().default(false),
      })
      .refine(
        (data) => {
          // If heroImage is set, heroImageAlt must also be set
          if (data.heroImage && !data.heroImageAlt) {
            return false;
          }
          return true;
        },
        {
          message: "heroImageAlt is required when heroImage is provided",
          path: ["heroImageAlt"], // This will show the error on the heroImageAlt field
        },
      ),
});

const raycastExtensions = defineCollection({
  loader: {
    name: "raycast-extensions-loader",
    load: async ({ store, logger }) => {
      logger.info("Loading Raycast extensions");
      store.clear();

      for (const ext of raycastExtensionsList) {
        const res = await fetch(
          `https://backend.raycast.com/api/v1/extensions/sebdanielsson/${ext.extension}`,
        );
        const json = await res.json();

        store.set({
          id: json.name,
          data: {
            title: json.title,
            description: json.description,
            store_url: json.store_url,
            download_count: json.download_count,
            categories: json.categories,
            icon_light: json.icons?.light || null,
            icon_dark: json.icons?.dark || null,
          },
        });
      }
    },
  },
  schema: z.object({
    title: z.string(),
    description: z.string(),
    store_url: z.string().url(),
    download_count: z.number(),
    categories: z.array(z.string()),
    icon_light: z.string().url().nullable(),
    icon_dark: z.string().url().nullable(),
  }),
});

export const collections = { blog, raycastExtensions };
