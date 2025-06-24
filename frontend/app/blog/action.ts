import { client } from '../lib/sanity';
import { BlogDetail } from '../types/blog';

export async function getAllBlogs() {
  const query = `
    *[_type == 'blog'] | order(_createdAt desc) {
      title,
      short_description,
      "slug": slug.current,
      image,
      readTime,
      category->{_id, title, slug, description},
      author->{_id, name, slug, image, bio}
    }
  `;
  const data = await client.fetch(query);
  return data;
}

export async function getBlogDetail(slug: string) {
  const query = `
    *[_type == "blog" && slug.current == "${slug}"][0]{
      title,
      short_description,
      content,
      "slug": slug.current,
      image,
      readTime,
      category->{_id, title, slug, description},
      author->{_id, name, slug, image, bio}
    }
  `;
  const data: BlogDetail = await client.fetch(query);
  return data;
}
