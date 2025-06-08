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
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      author: z.string().optional(),
      draft: z.boolean().default(false),
    }).refine(
      (data) => {
        // If heroImage is set, heroImageAlt must also be set
        if (data.heroImage && !data.heroImageAlt) {
          return false;
        }
        return true;
      },
      {
        message: 'heroImageAlt is required when heroImage is provided',
        path: ['heroImageAlt'], // This will show the error on the heroImageAlt field
      }
    ),
});

export const collections = { blog };
