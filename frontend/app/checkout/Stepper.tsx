import { Home, CreditCard, List } from 'lucide-react';

const steps = [
  { label: 'Address', icon: Home },
  { label: 'Payment Method', icon: CreditCard },
  { label: 'Review', icon: List },
];

export default function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className='relative flex items-center justify-between mb-4'>
      <div className='absolute top-6 left-0 w-full border-t border-dashed border-gray-300 z-0' />
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = idx === currentStep;
        return (
          <div
            key={step.label}
            className='flex flex-col items-center relative z-10'
          >
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-lg mb-2 ${
                isActive ? 'bg-black text-white' : 'bg-gray-100 text-black'
              }`}
            >
              <Icon className='w-6 h-6' />
            </div>
            <span
              className={`text-sm font-medium ${
                isActive ? 'text-black' : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
