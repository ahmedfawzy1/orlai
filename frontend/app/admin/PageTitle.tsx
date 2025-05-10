import React from 'react';

interface PageTitleProps {
  children: React.ReactNode;
  component?: React.ElementType;
  className?: string;
}

export default function PageTitle({
  children,
  component: Component = 'h1',
  className = '',
}: PageTitleProps) {
  return (
    <Component className={`text-xl font-bold mb-6 ${className}`.trim()}>
      {children}
    </Component>
  );
}
