"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type Props = {
  beforeSrc: string;
  afterSrc: string;
  alt?: string;
};

export function BeforeAfter({ beforeSrc, afterSrc, alt }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      setPosition(Math.max(1, Math.min(99, Math.round((x / rect.width) * 100))));
    };

    const onDown = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      setIsDragging(true);
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      setPosition(Math.max(1, Math.min(99, Math.round((x / rect.width) * 100))));
    };

    const onUp = () => {
      setIsDragging(false);
    };

    const onLeave = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onMove);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchend', onUp);
      window.addEventListener('mouseleave', onLeave);
    }

    container.addEventListener('mousedown', onDown);
    container.addEventListener('touchstart', onDown);
    container.addEventListener('mouseleave', onLeave);

    return () => {
      container.removeEventListener('mousedown', onDown);
      container.removeEventListener('touchstart', onDown);
      container.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef} 
      className="relative select-none overflow-hidden rounded-lg cursor-ew-resize group" 
      style={{ border: '1px solid var(--hairline)', backgroundColor: 'var(--bg-secondary)' }}
    >
      {/* После (левая часть - фон) */}
      <div className="relative">
        <Image 
          src={afterSrc} 
          alt={alt || 'Реставрация мебели в Воронеже — результат работы (после)'} 
          width={800}
          height={600}
          className="w-full h-auto block" 
          sizes="(max-width: 768px) 100vw, 50vw" 
          loading="lazy"
        />
      </div>
      
      {/* До (правая часть - передний план) */}
      <div 
        className="absolute top-0 left-0 bottom-0 overflow-hidden" 
        style={{ width: `${position}%` }}
      >
        <div 
          className="relative h-full w-full" 
          style={{ 
            width: position > 0 ? `${(100 / position) * 100}%` : '0%'
          }}
        >
          <Image 
            src={beforeSrc} 
            alt={alt || 'Реставрация мебели в Воронеже — состояние до реставрации'} 
            fill
            className="object-cover" 
            sizes="(max-width: 768px) 100vw, 50vw" 
            loading="lazy"
          />
        </div>
      </div>
      
      {/* Линия разделения */}
      <div 
        className="absolute inset-y-0 w-0.5 bg-white shadow-lg z-10" 
        style={{ left: `calc(${position}% - 1px)` }}
      />
      
      {/* Ползунок */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-300 flex items-center justify-center z-20 cursor-ew-resize"
        style={{ left: `calc(${position}% - 16px)` }}
      >
        <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
        <div className="w-1 h-4 bg-gray-400 rounded-full ml-0.5"></div>
      </div>
      
      {/* Подписи */}
      <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
        До
      </div>
      <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
        После
      </div>
      
      {/* Инструкция */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity">
        Сдвигайте для сравнения
      </div>
    </div>
  );
}

