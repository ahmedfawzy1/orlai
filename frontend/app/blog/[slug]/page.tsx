import Link from 'next/link';
import Image from 'next/image';
import generateSEO from '../../lib/seo';
import BlogContent from '@/app/components/BlogContent';
import { Clock, ArrowLeft } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { BlogDetail } from '@/app/types/blog';
import { getAllBlogs, getBlogDetail } from '../action';
import { urlFor } from '@/app/lib/sanity';

export const revalidate = 3600;

interface GenerateMetadataProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async () => {
  const blogs = await getAllBlogs();
  return blogs.map((blog: BlogDetail) => ({ slug: blog.slug }));
};

export const generateMetadata = async (props: GenerateMetadataProps) => {
  const { slug } = await props.params;
  const data: BlogDetail = await getBlogDetail(slug);

  if (!slug) {
    return generateSEO({
      title: 'Article Not Found | Orlai',
      description: "The article you're looking for doesn't exist.",
    });
  }

  return generateSEO({
    title: `${data.title} | Orlai Blog`,
    description: `${data.short_description} and explore in-depth fashion insights, on the Orlai Blog.`,
  });
};

interface pageParams {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage(props: pageParams) {
  const { slug } = await props.params;
  const post: BlogDetail = await getBlogDetail(slug);

  if (!post) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Article Not Found
          </h1>
          <p className='text-gray-600 mb-8'>
            The article you're looking for doesn't exist.
          </p>
          <Link href='/blog'>
            <Button className='bg-slate-800 hover:bg-slate-900'>
              <ArrowLeft size={16} className='mr-2' />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <section
        className='relative bg-cover bg-center bg-no-repeat text-white py-20'
        style={{
          backgroundImage: `url("${urlFor(post.image).url()}")`,
        }}
      >
        <div className='absolute inset-0 bg-black opacity-50'></div>
        <div className='container mx-auto px-4 relative z-10'>
          <div className='max-w-4xl mx-auto'>
            <Link href='/blog'>
              <Button
                variant='ghost'
                className='text-white hover:bg-white hover:text-gray-900 mb-2 md:mb-8'
              >
                <ArrowLeft size={16} className='mr-2' />
                Back to Blog
              </Button>
            </Link>
            <div className='mb-6'>
              <Badge variant='secondary' className='mb-4'>
                {post.category?.title}
              </Badge>
              <h1 className='text-3xl md:text-5xl font-bold mb-4'>
                {post.title}
              </h1>
              <p className='md:text-xl text-gray-200 mb-6'>
                {post.short_description}
              </p>
              <div className='flex items-center gap-6 text-sm'>
                <div className='flex items-center gap-2'>
                  {post.author?.image && (
                    <Image
                      src={urlFor(post.author.image).width(64).height(64).url()}
                      alt={post.author.name}
                      width={32}
                      height={32}
                      className='w-8 h-8 rounded-full object-cover'
                    />
                  )}
                  <span>{post.author?.name}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Clock size={16} />
                  {post.readTime} read
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='py-12 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <div className='prose prose-md md:prose-lg max-w-none'>
              <BlogContent content={post.content} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
