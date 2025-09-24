"use client";

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { GalleryImage } from '@/types';

interface LightboxProps {
  images: GalleryImage[];
  startIndex: number;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => setIndex(startIndex), [startIndex]);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;
    };
  }, [images.length, onClose]);

  const current = images[index];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative w-full h-full max-w-6xl max-h-[92vh] m-4"
          onClick={(e) => e.stopPropagation()}
          ref={dialogRef}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
          >
            <X size={20} />
          </button>

          <div className="absolute left-0 top-1/2 -translate-y-1/2 p-2">
            <button
              className="bg-black/50 hover:bg-black/70 text-white rounded-full p-3"
              aria-label="Previous image"
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            >
              ‹
            </button>
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 p-2">
            <button
              className="bg-black/50 hover:bg-black/70 text-white rounded-full p-3"
              aria-label="Next image"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
            >
              ›
            </button>
          </div>

          <div className="w-full h-full bg-black/20 rounded-lg flex items-center justify-center">
            {current ? (
              <img
                src={current.src}
                alt={current.alt}
                className="max-w-full max-h-[92vh] w-auto h-auto object-contain shadow-2xl"
                loading="eager"
              />
            ) : null}
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {index + 1} / {images.length}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Lightbox;

