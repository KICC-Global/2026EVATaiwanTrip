import React from 'react';
import { motion } from 'framer-motion';
import { ItineraryContent, ItineraryItem } from '@/types';

interface ItineraryProps {
  content: ItineraryContent;
  onItineraryClick: (item: ItineraryItem) => void;
}

const Itinerary: React.FC<ItineraryProps> = ({ content, onItineraryClick }) => {
  return (
    <section id="itinerary" className="py-20 bg-brand-bg">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {content.titleUrl ? (
            <a href={content.titleUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
              <h2 className="text-4xl font-bold text-brand-red hover:underline">{content.title}</h2>
            </a>
          ) : (
            <h2 className="text-4xl font-bold text-brand-red">{content.title}</h2>
          )}
          <p className="text-lg text-gray-600 mt-2">{content.subtitle}</p>
          {content.introVideo?.url && (
            <div className="mt-4">
              <a
                href={content.introVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand-red text-white font-bold py-2 px-6 rounded-full text-base hover:bg-red-800 transition-colors duration-300 shadow-md"
              >
                {content.introVideo.label || 'Intro Video'}
              </a>
            </div>
          )}
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-red-200 hidden md:block"></div>

          {content.days.map((item, index) => {
            const isEven = index % 2 === 0;
            // Use explicit class names so Tailwind can tree-shake correctly
            const sideContainerClass = isEven
              ? "md:order-1 md:text-right"
              : "md:order-2 md:text-left";
            const emptySideClass = isEven ? "md:order-2" : "md:order-1";
            // Remove overlap toward the center line
            const nudgeClass = "";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                className="relative md:grid md:grid-cols-2 md:gap-8 items-center mb-10"
              >
                {/* Left or Right (alternating) */}
                <div className={sideContainerClass}>
                  <div className="md:inline-block">
                    <p className="text-lg font-bold text-brand-red">{item.day}</p>
                    <div
                      onClick={() => onItineraryClick(item)}
                      className={`bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all mt-2 md:mt-0 ${nudgeClass}`}
                    >
                      <h3 className="text-xl font-bold text-brand-text">{item.title}</h3>
                      <p className="text-gray-600 mt-2 whitespace-pre-line">{item.details}</p>
                    </div>
                  </div>
                </div>

                {/* Center dot for desktop */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block">
                  <div className="z-10 bg-brand-red w-4 h-4 rounded-full border-4 border-brand-bg"></div>
                </div>

                {/* Empty side (for grid alignment) */}
                <div className={emptySideClass}></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Itinerary;

