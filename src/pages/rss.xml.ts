import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const blog = await getCollection('blog');

  // Create container for rendering
  const container = await AstroContainer.create();

  // Render markdown to HTML for each blog post
  const blogWithRenderedContent = await Promise.all(
    blog.map(async (post) => {
      const { Content } = await render(post);
      // Render the Astro component to HTML string
      const html = await container.renderToString(Content);

      return {
        ...post,
        renderedHtml: html,
      };
    }),
  );

  return rss({
    title: 'sebdanielsson.dev',
    description: 'The personal site of Sebastian Danielsson',
    site: context.site || 'https://sebdanielsson.dev',
    items: blogWithRenderedContent.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      updatedDate: post.data.updatedDate,
      description: post.data.description,
      link: `/${post.id}/`,
      content: post.renderedHtml,
    })),
    customData: `<language>en</language>`,
    trailingSlash: false,
  });
}
