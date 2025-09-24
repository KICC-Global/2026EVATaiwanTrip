import React from 'react';
import { motion } from 'framer-motion';
import { HeroContent } from '@/types';

interface HeroProps {
  content: HeroContent;
  signupLabel?: string;
  signupHref?: string;
}

const Hero: React.FC<HeroProps> = ({ content, signupLabel, signupHref }) => {
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center text-center text-white pt-[60px]">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{backgroundImage: `url('https://images.pexels.com/photos/1717859/pexels-photo-1717859.jpeg')`}}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 px-6"
      >
        <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
          {content.title}
        </h1>
        <p className="text-lg md:text-2xl mt-4 drop-shadow-md">{content.subtitle}</p>
        <a href="#itinerary" className="mt-8 inline-block bg-brand-red text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-red-800 transition-colors duration-300 shadow-lg">
          {content.cta}
        </a>
        {signupHref && (
          <div>
            <a
              href={signupHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-white/90 text-brand-red font-bold py-3 px-8 rounded-full text-lg hover:bg-white transition-colors duration-300 shadow-lg"
            >
              {signupLabel ?? '立即报名'}
            </a>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default Hero;

