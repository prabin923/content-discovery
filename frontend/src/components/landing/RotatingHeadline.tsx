'use client';

import { useEffect, useState } from 'react';

const words = ['Discover.', 'Save.', 'Curate.', 'Learn.'];

export default function RotatingHeadline() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating('out');
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setAnimating('in');
      }, 350);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      key={`${index}-${animating}`}
      className={`inline-block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400 ${
        animating === 'in' ? 'animate-hero-word-in' : 'animate-hero-word-out'
      }`}
    >
      {words[index]}
    </span>
  );
}
