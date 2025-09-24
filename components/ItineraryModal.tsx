"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ItineraryItem } from '@/types';
import { imagesByDay } from '@/lib/images_by_day';

interface ItineraryModalProps {
  item: ItineraryItem;
  modalContent: {
    close: string;
    details: string;
    gallery: string;
  };
  onClose: () => void;
}

const ItineraryModal: React.FC<ItineraryModalProps> = ({ item, modalContent, onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevFocusedRef = useRef<Element | null>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const displayImages = React.useMemo(() => {
    const match = item.day.match(/Day\s*(\d+)/i);
    const dayNum = match ? Math.max(1, Math.min(9, parseInt(match[1], 10))) : null;
    const tag = dayNum ? (`d${dayNum}` as keyof typeof imagesByDay) : null;
    const imgs = tag && imagesByDay[tag] ? imagesByDay[tag] : item.images || [];
    return imgs;
  }, [item]);

  useEffect(() => {
    // reset image index when item changes
    setImgIndex(0);
  }, [item]);

  useEffect(() => {
    // Lock background scroll
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    prevFocusedRef.current = document.activeElement;

    const getFocusables = (): HTMLElement[] => {
      const root = dialogRef.current;
      if (!root) return [];
      const selectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ];
      const nodes = Array.from(root.querySelectorAll<HTMLElement>(selectors.join(',')));
      return nodes.filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1 && el.offsetParent !== null);
    };

    // Focus first focusable or the dialog itself
    const focusInitial = () => {
      const els = getFocusables();
      if (els.length) {
        els[0].focus();
      } else {
        dialogRef.current?.focus();
      }
    };
    setTimeout(focusInitial, 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const els = getFocusables();
        if (!els.length) {
          e.preventDefault();
          dialogRef.current?.focus();
          return;
        }
        const first = els[0];
        const last = els[els.length - 1];
        const active = document.activeElement as HTMLElement | null;
        const within = active && dialogRef.current?.contains(active);
        if (e.shiftKey) {
          if (!within || active === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (!within || active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      // Restore scroll
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;

      document.removeEventListener('keydown', onKeyDown);
      const prev = prevFocusedRef.current as HTMLElement | null;
      if (prev && typeof prev.focus === 'function') {
        prev.focus();
      }
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="itinerary-modal-title">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="bg-brand-bg rounded-lg shadow-2xl w-full max-w-6xl m-4 max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
          ref={dialogRef}
          tabIndex={-1}
        >
          <div className="p-6 border-b border-red-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-brand-red font-bold">{item.day}</p>
              <h2 id="itinerary-modal-title" className="text-2xl font-bold text-brand-text">{item.title}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-brand-red">
              <X size={24} />
            </button>
          </div>
          <div className="p-6 flex-1 min-h-0 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Text */}
              <div className="pr-1">
                <h3 className="text-xl font-bold text-brand-red mb-2">{modalContent.details}</h3>
                {item.longHtml ? (
                  <div className="doc-html text-brand-text" dangerouslySetInnerHTML={{ __html: item.longHtml }} />
                ) : (
                  <div className="text-brand-text whitespace-pre-wrap">{item.longDesc}</div>
                )}
              </div>
              {/* Right: Images */}
              <div className="pl-1 md:sticky md:top-6 self-start md:flex md:flex-col">
                <h3 className="text-xl font-bold text-brand-red mb-4 md:mb-3 md:sticky md:top-0 md:bg-brand-bg md:pt-1 md:pb-2">
                  {modalContent.gallery}
                </h3>
                <div className="relative bg-white rounded-lg shadow-md overflow-hidden md:h-[56vh] flex items-center justify-center">
                  {displayImages && displayImages.length > 0 ? (
                    <>
                      <img
                        src={displayImages[imgIndex]}
                        alt={`${item.title} photo ${imgIndex + 1}`}
                        className="block max-w-full h-auto max-h-[56vh] w-auto object-contain"
                      />
                      {displayImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            aria-label="Previous image"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2"
                            onClick={() => setImgIndex((i) => (i - 1 + displayImages.length) % displayImages.length)}
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            aria-label="Next image"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2"
                            onClick={() => setImgIndex((i) => (i + 1) % displayImages.length)}
                          >
                            ›
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                            {imgIndex + 1} / {displayImages.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-sm text-gray-500">
                      No images
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ItineraryModal;

