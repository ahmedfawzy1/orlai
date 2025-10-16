import { useFilterStore } from '@/app/store/useFilterStore';

interface colorProps {
  selectedColor: string;
  onColorChange: (colorId: string) => void;
}

export default function Color({ selectedColor, onColorChange }: colorProps) {
  const { colors } = useFilterStore();

  return (
    <div className='relative'>
      <div className='mt-2 flex flex-wrap gap-2'>
        {colors.map(color => (
          <button
            key={color._id}
            type='button'
            onClick={() => onColorChange(color._id)}
            className={`w-6 h-6 rounded-full border cursor-pointer hover:scale-110 transition-transform ${
              selectedColor === color._id ? 'ring-2 ring-black' : ''
            }`}
            style={{ backgroundColor: color.hexCode }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}
