import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  url: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

const Logo = ({ url, src, alt, width, height }: LogoProps) => {
  return (
    <Link href={url} className='flex items-center gap-2'>
      <Image
        width={width}
        height={height}
        src={src}
        className='max-h-8'
        alt={alt}
        priority
      />
    </Link>
  );
};

export default Logo;
