import { useState } from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import ColorPicker from 'react-pick-color';
import { useFilterStore } from '@/app/store/useFilterStore';

interface colorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export default function Color({ selectedColor, onColorChange }: colorProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempColor, setTempColor] = useState('#ffffff');
  const { colors } = useFilterStore();

  const handleConfirm = () => {
    onColorChange(tempColor);
    setShowPicker(false);
  };

  return (
    <div className='relative'>
      <div className='flex items-center gap-2'>
        <button
          type='button'
          onClick={() => setShowPicker(!showPicker)}
          className='bg-[#efefef] rounded-lg text-center text-[14px] px-3 py-1 cursor-pointer hover:bg-[#e2e2e2] transition-all duration-200'
        >
          {selectedColor ? 'Change Color' : 'Select Color'}
        </button>

        {selectedColor && (
          <div className='flex items-center gap-2'>
            <div
              className='w-6 h-6 rounded-full border'
              style={{ backgroundColor: selectedColor }}
            />
            <button
              type='button'
              onClick={() => onColorChange('')}
              className='text-red-500 hover:text-red-700 transition-all cursor-pointer'
            >
              ×
            </button>
          </div>
        )}
      </div>

      {showPicker && (
        <div className='absolute z-10 mt-2'>
          <div className='bg-white pt-1 rounded-lg shadow-lg'>
            <div className='flex justify-end items-center'>
              <button
                type='button'
                onClick={() => setShowPicker(false)}
                className='p-1 cursor-pointer'
              >
                <XIcon size={16} />
              </button>{' '}
              <button
                type='button'
                onClick={handleConfirm}
                className='p-1 cursor-pointer'
              >
                <CheckIcon size={16} />
              </button>
            </div>
            <ColorPicker
              color={tempColor}
              onChange={color => setTempColor(color.hex)}
            />
          </div>
        </div>
      )}

      <div className='mt-2 flex flex-wrap gap-2'>
        {colors.map(color => (
          <button
            key={color._id}
            type='button'
            onClick={() => onColorChange(color.hexCode)}
            className='w-6 h-6 rounded-full border cursor-pointer hover:scale-110 transition-transform'
            style={{ backgroundColor: color.hexCode }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}
