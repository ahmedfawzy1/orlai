'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageGalleryProps {
  ImageUrls: string[];
}

export default function ImageGallery({ ImageUrls }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  return (
    <div className='flex flex-col basis-1/2 gap-3'>
      <div className='w-full h-fit bg-[#fafafa] rounded-lg flex justify-center items-center'>
        <Image
          className='w-[440px] h-[440px] object-cover object-top rounded-lg'
          src={ImageUrls[selectedImage]}
          alt={'product'}
          width={780}
          height={1196}
          priority
        />
      </div>
      <div className='flex flex-row justify-start gap-3'>
        {ImageUrls.slice(0, 3).map((url, index) => (
          <div key={index} className='bg-[#fafafa] max-w-fit rounded-lg'>
            <Image
              onClick={() => setSelectedImage(index)}
              className={`w-[104px] h-[138px] rounded-lg object-cover object-top ${
                selectedImage === index ? 'border border-black' : ''
              }`}
              width={780}
              height={1196}
              src={url}
              alt={url}
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
}
