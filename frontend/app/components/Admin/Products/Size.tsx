interface SizeProps {
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export default function Size({ selectedSize, onSizeChange }: SizeProps) {
  const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

  return (
    <div className='flex flex-wrap gap-2'>
      {sizes.map(size => (
        <button
          key={size}
          type='button'
          onClick={() => onSizeChange(size === selectedSize ? '' : size)}
          className={`px-3 py-1 rounded-md text-center text-[14px] cursor-pointer transition-colors duration-200 ${
            size === selectedSize
              ? 'bg-[#e2e2e2] hover:bg-[#d4d4d4]'
              : 'bg-[#efefef] hover:bg-[#e2e2e2]'
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
