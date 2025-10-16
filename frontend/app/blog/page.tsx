import Link from 'next/link';
import Image from 'next/image';
import generateSEO from '../lib/seo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Clock, User, ArrowRight } from 'lucide-react';
import { BlogOverview } from '../types/blog';
import { getAllBlogs } from './action';
import { urlFor } from '../lib/sanity';

export const revalidate = 3600;

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Orlai Blog | Fashion Trends, Style Tips & Inspiration',
    description:
      'Discover the latest fashion trends, style tips, and lifestyle inspiration. Stay updated with our blog featuring the best in fashion, beauty, and lifestyle.',
  });
};

export default async function BlogPage() {
  const data: BlogOverview[] = await getAllBlogs();
  const [featuredPost, ...latestPosts] = data;

  return (
    <div className='min-h-screen bg-gray-50'>
      <section
        className='relative bg-cover bg-center bg-no-repeat text-white py-20'
        style={{
          backgroundImage: 'url("/images/blog/hero.avif")',
        }}
      >
        <div className='absolute inset-0 bg-black opacity-50'></div>
        <div className='container mx-auto px-4 relative z-10'>
          <div className='max-w-4xl mx-auto text-center'>
            <h1 className='text-3xl md:text-5xl font-bold mb-6'>
              Fashion & Lifestyle Blog
            </h1>
            <p className='md:text-xl mb-8 text-gray-200'>
              Discover the latest trends, styling tips, and insights from the
              world of fashion
            </p>
          </div>
        </div>
      </section>

      <section className='py-12 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>
            Featured Article
          </h2>
          {featuredPost && (
            <Link href={`/blog/${featuredPost.slug}`} className='block'>
              <Card className='p-0 overflow-hidden cursor-pointer'>
                <div className='grid md:grid-cols-2 gap-0'>
                  <div className='relative h-64 md:h-full'>
                    <Image
                      src={urlFor(featuredPost.image).url()}
                      alt={featuredPost.title}
                      width={500}
                      height={300}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <div className='p-6 md:p-8 flex flex-col justify-center'>
                    <div className='flex items-center gap-4 text-sm text-gray-600 mb-4'>
                      <Badge variant='outline'>
                        {featuredPost.category?.title}
                      </Badge>
                      <div className='flex items-center gap-1 text-nowrap'>
                        <Clock size={16} />
                        {featuredPost.readTime}
                      </div>
                    </div>
                    <CardTitle className='text-xl md:text-2xl mb-2 md:mb-4 text-gray-900'>
                      {featuredPost.title}
                    </CardTitle>
                    <CardDescription className='md:text-lg mb-2 md:mb-6 text-gray-700'>
                      {featuredPost.short_description}
                    </CardDescription>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <User size={16} />
                        {featuredPost.author?.name}
                      </div>
                      <Button className='bg-slate-800 hover:bg-slate-900'>
                        Read More
                        <ArrowRight size={16} className='ml-2' />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          )}
        </div>
      </section>

      <Separator />

      <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>
            Latest Articles
          </h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {latestPosts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className='block'
              >
                <Card className='p-0 gap-0 overflow-hidden bg-white cursor-pointer'>
                  <div className='relative h-48'>
                    <Image
                      src={urlFor(post.image).url()}
                      alt={post.title}
                      width={500}
                      height={300}
                      className='w-full h-full object-cover'
                    />
                    <div className='absolute top-4 left-4'>
                      <Badge variant='secondary'>{post.category?.title}</Badge>
                    </div>
                  </div>
                  <CardHeader className='pt-3.5'>
                    <div className='flex justify-between items-center gap-4 text-sm text-gray-600'>
                      <div className='flex items-center gap-2 text-sm text-nowrap text-gray-600'>
                        <User size={14} />
                        {post.author?.name}
                      </div>
                      <div className='flex items-center gap-1 text-nowrap'>
                        <Clock size={14} />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className='text-xl line-clamp-2'>
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className='line-clamp-3 mb-4'>
                      {post.short_description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
