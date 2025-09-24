import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Puzzle, Map, ShieldCheck } from 'lucide-react';
import { FeaturesContent } from '@/types';

interface FeaturesProps {
  content: FeaturesContent;
}

const iconMap: { [key: string]: React.ElementType } = {
  Palette,
  Puzzle,
  Map,
  ShieldCheck,
};

const Features: React.FC<FeaturesProps> = ({ content }) => {
  return (
    <section id="highlights" className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-brand-red mb-12">{content.title}</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.items.map((feature, index) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-brand-bg p-8 rounded-lg shadow-lg"
              >
                {IconComponent && (
                  <div className="flex justify-center items-center mb-4">
                    <div className="bg-brand-red text-brand-gold p-4 rounded-full">
                      <IconComponent size={32} />
                    </div>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2 text-brand-red">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

