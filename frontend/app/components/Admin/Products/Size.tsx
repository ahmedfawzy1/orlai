import { useFilterStore } from '@/app/store/useFilterStore';

interface SizeProps {
  selectedSize: string;
  onSizeChange: (sizeId: string) => void;
}

export default function Size({ selectedSize, onSizeChange }: SizeProps) {
  const { sizes } = useFilterStore();

  return (
    <div className='flex flex-wrap gap-2'>
      {sizes.map(size => (
        <button
          key={size._id}
          type='button'
          onClick={() => onSizeChange(size._id)}
          className={`px-3 py-1 rounded-md text-center text-[14px] cursor-pointer transition-colors duration-200 ${
            size._id === selectedSize
              ? 'bg-[#e2e2e2] hover:bg-[#d4d4d4]'
              : 'bg-[#efefef] hover:bg-[#e2e2e2]'
          }`}
        >
          {size.name}
        </button>
      ))}
    </div>
  );
}
