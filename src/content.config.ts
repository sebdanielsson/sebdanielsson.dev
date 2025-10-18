import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { rssSchema } from "@astrojs/rss";
import fs from "node:fs";
import path from "node:path";

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

// Raycast extensions collection: load local JSON and enrich with Raycast backend API when available
const raycastExtensions = defineCollection({
  loader: async () => {
    const dataPath = path.resolve(process.cwd(), "src/data/raycastExtensions.json");
    const raw = fs.readFileSync(dataPath, "utf-8");
    let list: any[] = [];
    try {
      list = JSON.parse(raw);
    } catch (e) {
      // If parsing fails, return empty array so build doesn't break
      console.error("Failed to parse src/data/raycastExtensions.json", e);
      return [];
    }

    // Helper to extract owner and slug from store_url
    const parseStoreUrl = (u: string) => {
      try {
        const url = new URL(u);
        const parts = url.pathname.split("/").filter(Boolean);
        // Expecting like /owner/slug
        if (parts.length >= 2) return { owner: parts[0], slug: parts[1] };
      } catch (e) {
        console.error("Failed to parse store URL:", e);
      }
      return null;
    };

    const assetsDir = path.resolve(process.cwd(), "src/assets/raycastExtensions");
    try {
      fs.mkdirSync(assetsDir, { recursive: true });
    } catch (e) {
      console.error("Failed to create assets directory for Raycast extensions:", e);
    }

    const enriched = await Promise.all(
      list.map(async (entry) => {
        const parsed = parseStoreUrl(entry.store_url || "");
        const baseId = parsed ? parsed.slug : entry.name.toLowerCase().replace(/\s+/g, "-");

        // Default fields from local entry
        const out: any = {
          id: baseId,
          name: entry.name,
          description: entry.description,
          store_url: entry.store_url,
          icon_url: entry.icon_url,
          install_button_url: entry.install_button_url,
          downloads: entry.downloads,
          categories: entry.categories ?? [],
        };

        if (!parsed) return out;

        const apiUrl = `https://backend.raycast.com/api/v1/extensions/${parsed.owner}/${parsed.slug}`;
        try {
          const res = await fetch(apiUrl);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();

          out.name = json.title ?? out.name;
          out.description = json.description ?? out.description;
          out.downloads =
            typeof json.download_count === "number" ? json.download_count : out.downloads;
          out.categories = json.categories ?? out.categories;

          // Prefer API icon if provided
          const remoteIcon = json.icons?.light ?? entry.icon_url;
          if (remoteIcon && remoteIcon.startsWith("http")) {
            try {
              const iconRes = await fetch(remoteIcon);
              if (iconRes.ok) {
                // Determine extension
                let ext = path.extname(new URL(remoteIcon).pathname) || "";
                if (!ext) {
                  const ct = iconRes.headers.get("content-type") || "";
                  if (ct.includes("svg")) ext = ".svg";
                  else if (ct.includes("png")) ext = ".png";
                  else if (ct.includes("webp")) ext = ".webp";
                  else if (ct.includes("jpeg") || ct.includes("jpg")) ext = ".png";
                  else ext = ".png";
                }

                const fileName = `raycast-extension-${baseId}${ext}`;
                const filePath = path.join(assetsDir, fileName);
                const publicPath = `/src/assets/raycastExtensions/${fileName}`;

                // Write file if missing
                if (!fs.existsSync(filePath)) {
                  const buffer = Buffer.from(await iconRes.arrayBuffer());
                  fs.writeFileSync(filePath, buffer);
                }

                out.icon_url = publicPath;
                out.source = json;
              }
            } catch (e) {
              console.error("Error fetching icon:", e);
            }
          } else if (remoteIcon) {
            // If icon is non-http (local path), prefer it
            out.icon_url = remoteIcon;
            out.source = json;
          }
        } catch (e) {
          console.error(`Failed to fetch data for Raycast extension ${entry.name}:`, e);
        }

        return out;
      }),
    );

    return enriched;
  },
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    store_url: z.string().url().optional(),
    icon_url: z.string().optional(),
    install_button_url: z.string().optional(),
    downloads: z.number().optional(),
    categories: z.array(z.string()).optional(),
  }),
});

export const collections = { blog, raycastExtensions };
