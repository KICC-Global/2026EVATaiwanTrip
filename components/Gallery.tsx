'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GalleryContent, ItineraryContent } from '@/types';
import Lightbox from '@/components/Lightbox';
import Image from 'next/image';

interface GalleryProps {
  content: GalleryContent;
  itinerary?: ItineraryContent;
}

const Gallery: React.FC<GalleryProps> = ({ content, itinerary }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const itineraryDayCount = itinerary?.days?.length ?? 0;

  // Use images provided by content (already curated per day)
  const imagesWithPlaceholders = useMemo(() => {
    return [...(content.images ?? [])];
  }, [content.images]);

  useEffect(() => {
    const uniqueSrcs = Array.from(new Set(imagesWithPlaceholders.map(img => img.src).filter(Boolean)));
    uniqueSrcs.forEach(src => {
      const preloader = new window.Image();
      preloader.src = src;
    });
  }, [imagesWithPlaceholders]);

  const filteredImages = imagesWithPlaceholders.filter(image =>
    activeFilter === 'all' || image.tags.includes(activeFilter)
  );

  const allTags = Array.from(new Set(imagesWithPlaceholders.flatMap(img => img.tags)));
  const isDayTag = (tag: string) => /^d[1-9]\d*$/.test(tag);

  const getTagConfig = (tag: string) => {
    const config = content.tags?.[tag];
    if (!config) return undefined;
    return {
      label: config.label,
      visible: config.visible ?? true,
    };
  };

  const dayTags = useMemo(() => {
    const fromItinerary = Array.from({ length: itineraryDayCount }, (_, idx) => `d${idx + 1}`);
    const fromContent = Object.keys(content.tags ?? {}).filter(isDayTag);
    const fromImages = allTags.filter(isDayTag);
    const combined = new Set([...fromItinerary, ...fromContent, ...fromImages]);
    return Array.from(combined)
      .filter(tag => getTagConfig(tag)?.visible ?? true)
      .sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10));
  }, [allTags, content.tags, itineraryDayCount]);

  const getTagLabel = (tag: string) => {
    const config = getTagConfig(tag);
    if (config?.label) return config.label;

    if (isDayTag(tag)) {
      const n = parseInt(tag.slice(1), 10);
      const dayLabel = content.filters.day ?? 'Day';
      const isChinese = /[\u4e00-\u9fff]/.test(dayLabel) || /[\u4e00-\u9fff]/.test(content.title);
      return isChinese ? `\u7b2c${n}\u5929` : `${dayLabel} ${n}`;
    }

    return tag;
  };

  const getFilterButtons = () => (
    <>
      <button onClick={() => setActiveFilter('all')} className={getButtonClass('all')}>{content.filters.all}</button>
      {dayTags.length > 0 && (
        <>
          <div className="my-2 md:my-0 md:mx-2 border-l border-gray-300 h-6"></div>
          {dayTags.map(tag => (
            <button key={tag} onClick={() => setActiveFilter(tag)} className={getButtonClass(tag)}>{getTagLabel(tag)}</button>
          ))}
        </>
      )}
    </>
  );
  
  const getButtonClass = (filter: string) => 
    `px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
      activeFilter === filter
        ? 'bg-brand-red text-white'
        : 'bg-gray-200 text-brand-text hover:bg-gray-300'
    }`;


  return (
    <section id="gallery" className="py-20 bg-brand-bg">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-brand-red">{content.title}</h2>
          <p className="text-lg text-gray-600 mt-2">{content.subtitle}</p>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
            {getFilterButtons()}
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4" style={{ columnGap: '1rem' }}>
          {filteredImages.map((image, index) => (
            <button
              type="button"
              key={image.src + index}
              onClick={() => setLightboxIndex(index)}
              className="relative mb-4 overflow-hidden rounded-lg shadow-lg group block w-full text-left"
              style={{ breakInside: 'avoid' }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={500}
                height={500}
                loading="lazy"
                className="w-full h-auto block"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-white text-xs truncate">{image.alt}</div>
              </div>
            </button>
          ))}
        </div>

        {lightboxIndex !== null && (
          <Lightbox
            images={filteredImages}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </div>
    </section>
  );
};

export default Gallery;
