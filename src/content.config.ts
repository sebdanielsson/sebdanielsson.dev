import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { rssSchema } from "@astrojs/rss";
import raycastExtensionsList from "./data/raycastExtensions.json";
import dockerHubImagesList from "./data/dockerHubImages.json";
import githubReposList from "./data/githubRepos.json";
import { Octokit } from "@octokit/rest";
import { GH_API } from "astro:env/server";

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
          data: json, // Store the full response
        });
      }
    },
  },
  schema: z.object({
    id: z.string(),
    name: z.string(),
    native_id: z.string().nullable(),
    seo_categories: z.array(z.string()),
    platforms: z.array(z.string()),
    author: z.object({
      id: z.string(),
      name: z.string(),
      handle: z.string(),
      bio: z.string(),
      twitter_handle: z.string(),
      github_handle: z.string(),
      location: z.string(),
      initials: z.string(),
      avatar_placeholder_color: z.string(),
      slack_community_username: z.string().nullable(),
      slack_community_user_id: z.string().nullable(),
      created_at: z.number(),
      website_anchor: z.string(),
      website: z.string().url(),
      credits: z.number(),
      username: z.string(),
      avatar: z.string().url(),
    }),
    created_at: z.number(),
    kill_listed_at: z.number(),
    owner: z.object({
      id: z.string(),
      name: z.string(),
      handle: z.string(),
      bio: z.string(),
      twitter_handle: z.string(),
      github_handle: z.string(),
      location: z.string(),
      initials: z.string(),
      avatar_placeholder_color: z.string(),
      slack_community_username: z.string().nullable(),
      slack_community_user_id: z.string().nullable(),
      created_at: z.number(),
      website_anchor: z.string(),
      website: z.string().url(),
      credits: z.number(),
      username: z.string(),
      avatar: z.string().url(),
    }),
    status: z.string(),
    is_new: z.boolean(),
    access: z.string(),
    store_url: z.string().url(),
    download_count: z.number(),
    past_contributors: z.array(z.any()),
    listed: z.boolean(),
    title: z.string(),
    description: z.string(),
    commit_sha: z.string(),
    relative_path: z.string(),
    api_version: z.string(),
    categories: z.array(z.string()),
    prompt_examples: z.array(z.any()),
    metadata_count: z.number(),
    updated_at: z.number(),
    source_url: z.string().url(),
    readme_url: z.string().url(),
    readme_assets_path: z.string().url(),
    icons: z.object({
      light: z.string().url().nullable(),
      dark: z.string().url().nullable(),
    }),
    commands: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        title: z.string(),
        subtitle: z.string(),
        description: z.string(),
        keywords: z.array(z.string()),
        mode: z.string(),
        disabled_by_default: z.boolean(),
        beta: z.boolean(),
        icons: z.object({
          light: z.string().url().nullable(),
          dark: z.string().url().nullable(),
        }),
      }),
    ),
    tools: z.array(z.any()),
    download_url: z.string().url(),
    contributors: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        handle: z.string(),
        bio: z.string(),
        twitter_handle: z.string(),
        github_handle: z.string(),
        location: z.string(),
        initials: z.string(),
        avatar_placeholder_color: z.string(),
        slack_community_username: z.string().nullable(),
        slack_community_user_id: z.string().nullable(),
        created_at: z.number(),
        website_anchor: z.string(),
        website: z.string().url(),
        credits: z.number(),
        username: z.string(),
        avatar: z.string().url(),
      }),
    ),
    metadata: z.array(z.string().url()),
    changelog: z.object({
      versions: z.array(
        z.object({
          title: z.string(),
          title_link: z.string().nullable(),
          date: z.string(),
          markdown: z.string(),
        }),
      ),
    }),
  }),
});

const dockerHubImages = defineCollection({
  loader: {
    name: "docker-hub-images-loader",
    load: async ({ store, logger }) => {
      logger.info("Loading Docker Hub images");
      store.clear();

      for (const image of dockerHubImagesList) {
        const res = await fetch(
          `https://hub.docker.com/v2/repositories/${image.owner}/${image.repo}`,
        );
        const json = await res.json();

        store.set({
          id: `${image.owner}/${image.repo}`,
          data: {
            owner: image.owner,
            repo: image.repo,
            github_url: image.github_url,
            hub_details: json,
          },
        });
      }
    },
  },
  schema: z.object({
    owner: z.string(),
    repo: z.string(),
    github_url: z.string().url(),
    hub_details: z.object({
      user: z.string(),
      name: z.string(),
      namespace: z.string(),
      description: z.string(),
      pull_count: z.number(),
      star_count: z.number(),
      last_updated: z.string(),
      date_registered: z.string(),
    }),
  }),
});

const githubRepos = defineCollection({
  loader: {
    name: "github-repos-loader",
    load: async ({ store, logger }) => {
      logger.info("Loading GitHub repositories");
      store.clear();

      const octokit = new Octokit({
        auth: GH_API,
        userAgent: "sebdanielsson/sebdanielsson.dev",
      });

      for (const repo of githubReposList) {
        try {
          const response = await octokit.repos.get({
            owner: repo.owner,
            repo: repo.repo,
          });

          const repoData = response.data;

          store.set({
            id: `${repo.owner}/${repo.repo}`,
            data: {
              id: repoData.id,
              owner: repoData.owner.login,
              owner_url: repoData.owner.html_url,
              name: repoData.name,
              full_name: repoData.full_name,
              html_url: repoData.html_url,
              description: repoData.description,
              created_at: repoData.created_at,
              updated_at: repoData.updated_at,
              pushed_at: repoData.pushed_at,
              stars: repoData.stargazers_count,
              language: repoData.language,
              topics: repoData.topics ?? [],
              license: repoData.license
                ? {
                    key: repoData.license.key,
                    name: repoData.license.name,
                    url: repoData.license.url,
                    spdx_id: repoData.license.spdx_id,
                    node_id: repoData.license.node_id,
                  }
                : null,
            },
          });
        } catch (error) {
          logger.error(`Error fetching repository ${repo.owner}/${repo.repo}: ${error}`);
        }
      }
    },
  },
  schema: z.object({
    id: z.number(),
    owner: z.string(),
    owner_url: z.string().url(),
    name: z.string(),
    full_name: z.string(),
    html_url: z.string().url(),
    description: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    pushed_at: z.string(),
    stars: z.number(),
    language: z.string().nullable(),
    topics: z.array(z.string()),
    license: z
      .object({
        key: z.string(),
        name: z.string(),
        url: z.string().url().nullable(),
        spdx_id: z.string().nullable(),
        node_id: z.string(),
      })
      .nullable(),
  }),
});

export const collections = { blog, raycastExtensions, dockerHubImages, githubRepos };
