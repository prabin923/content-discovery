'use client';

import type { ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}

const hiddenTransforms: Record<NonNullable<Props['direction']>, string> = {
  up: 'translate-y-10',
  left: '-translate-x-10',
  right: 'translate-x-10',
  none: '',
};

export default function AnimateIn({ children, className = '', delay = 0, direction = 'up' }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
        inView ? 'translate-x-0 translate-y-0 opacity-100' : `opacity-0 ${hiddenTransforms[direction]}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
