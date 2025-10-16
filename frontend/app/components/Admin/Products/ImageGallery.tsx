'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { FileImage, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  handleImageChange: (urls: string[]) => void;
}

export default function ImageGallery({
  imageUrls,
  setImageUrls,
  handleImageChange,
}: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const onUpload = (result: any) => {
    if (result.info && result.info.secure_url) {
      const newImageUrl = result.info.secure_url;

      setImageUrls(prevImageUrls => {
        const updatedImageUrls = [...prevImageUrls, newImageUrl];
        handleImageChange(updatedImageUrls);
        return updatedImageUrls;
      });
    }
  };

  const onUploadError = (error: any) => {
    console.error(`Upload failed: ${error.message}`);
    toast.error(`Upload failed: ${error.message}`);
  };

  const handleDeleteImage = (index: number) => {
    setImageUrls(prevImageUrls => {
      const updateImageUrls = [...prevImageUrls];
      updateImageUrls.splice(index, 1);
      handleImageChange(updateImageUrls);
      return updateImageUrls;
    });
  };

  return (
    <div className='flex flex-col gap-3'>
      <div className='w-full min-h-60 bg-[#efefef] rounded-lg flex justify-center items-center'>
        {imageUrls.length > 0 ? (
          <Image
            src={imageUrls[selectedImage]}
            alt={'product image'}
            width={256}
            height={341}
            draggable={false}
            className='w-full h-full'
          />
        ) : (
          <FileImage />
        )}
      </div>
      <div className='flex flex-wrap gap-3'>
        {imageUrls.map((url, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`bg-[#efefef] w-[100px] h-[155px] max-w-fit relative rounded-lg flex justify-center items-center ${
              selectedImage === index ? 'border border-black' : ''
            }`}
          >
            <span
              onClick={() => handleDeleteImage(index)}
              className='text-red-500 absolute -top-1 right-1 cursor-pointer select-none'
            >
              x
            </span>
            <Image
              className='rounded-lg'
              src={url}
              alt={url}
              width={256}
              height={341}
              draggable={false}
            />
          </div>
        ))}
        <>
          <CldUploadWidget
            uploadPreset='bidrbjhr'
            onSuccess={onUpload}
            onError={onUploadError}
          >
            {({ open }) => {
              const handleOnClick = (
                e: React.MouseEvent<HTMLButtonElement>
              ) => {
                e.preventDefault();
                open();
              };
              return (
                <button onClick={handleOnClick} aria-label='Upload Image'>
                  <div
                    className={`w-[100px] h-[155px] p-3 border border-dashed rounded-lg flex justify-center items-center`}
                  >
                    <div className='bg-[#b2fbbc] h-[23px] p-0.5 rounded-full'>
                      <Plus size={18} color='#fff' />
                    </div>
                  </div>
                </button>
              );
            }}
          </CldUploadWidget>
        </>
      </div>
    </div>
  );
}
