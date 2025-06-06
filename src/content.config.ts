import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
import { rssSchema } from '@astrojs/rss';

const blog = defineCollection({
  loader: glob({ base: './src/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    rssSchema.extend({
      title: z.string(),
      description: z
        .string()
        .max(155, { message: 'Must be 155 or fewer characters long' })
        .optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      slug: z.string(),
      tags: z.array(z.string()).default([]),
      heroImage: image(),
      heroImageAlt: z.string(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
