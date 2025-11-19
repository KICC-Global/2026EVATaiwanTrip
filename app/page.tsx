"use client";

import React, { useState } from 'react';
import { ItineraryItem } from '@/types';
import { useLanguageAndContent } from '@/contexts/LanguageContext'; // Use the new hook

// Import components
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Itinerary from '@/components/Itinerary';
import Gallery from '@/components/Gallery';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import EmergencyModal from '@/components/EmergencyModal';
import ItineraryModal from '@/components/ItineraryModal';
import { PhoneCall } from 'lucide-react';

export default function Home() {
    const { lang, setLang, currentContent } = useLanguageAndContent(); // Use the new hook to get currentContent
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isEmergencyOpen, setEmergencyOpen] = useState(false);
    const [selectedItinerary, setSelectedItinerary] = useState<ItineraryItem | null>(null);

    const handleItineraryClick = (item: ItineraryItem) => {
      setSelectedItinerary(item);
    };

    if (!currentContent) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-brand-bg text-brand-red">
          Loading...
        </div>
      );
    }

    return (
        <>
            <Header 
                content={currentContent.nav}
                lang={lang}
                setLang={setLang}
                isMobileMenuOpen={isMobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
            />
            <main id="main-content">
                
                <Hero 
                  content={currentContent.hero} 
                  // signupLabel={lang === 'zh-TW' ? '立即報名' : (lang === 'zh-CN' ? '立即报名' : 'Apply Now')} 
                  // signupHref="https://docs.google.com/forms/d/e/1FAIpQLSdu8_wULSQBhaQKILgsiMJc-ppD0FQaBG2IVgQGFhHI5KyNEA/viewform?usp=dialog"
                />
                <Features content={currentContent.features} />
                {/* Trip Intro Video Section */}
                <section id="intro-video" className="py-20 bg-brand-bg">
                  <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-brand-red text-center mb-8">
                      {lang === 'zh-TW' ? '' : (lang === 'zh-CN' ? '' : '')}
                    </h2>
                    <div className="relative w-full overflow-hidden rounded-lg shadow-lg pt-[56.25%]">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/o7O0Smy3jPo?si=kCh2TYZCzuKW92eI"
                        title="行程介紹"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </section>
                <Itinerary content={currentContent.itinerary} onItineraryClick={handleItineraryClick} />
                {/* Signup CTA above Gallery */}
                {/* <div className="container mx-auto px-6 mt-8 flex justify-center">
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdu8_wULSQBhaQKILgsiMJc-ppD0FQaBG2IVgQGFhHI5KyNEA/viewform?usp=dialog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-brand-red text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-red-800 transition-colors duration-300 shadow-lg"
                  >
                    {lang === 'zh-TW' ? '立即報名' : (lang === 'zh-CN' ? '立即报名' : 'Apply Now')} 
                  </a>
                </div> */}
                <Gallery content={currentContent.gallery} itinerary={currentContent.itinerary} />
                <Faq content={currentContent.faq} />
            </main>
            <Footer content={currentContent.footer} lang={lang} />

            <button 
                onClick={() => setEmergencyOpen(true)} 
                className="fixed bottom-6 right-6 bg-brand-red text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-red-800 transition-transform duration-300 hover:scale-110"
                aria-label={currentContent.emergency.button}
            >
                <PhoneCall size={32} />
            </button>
            
            {isEmergencyOpen && <EmergencyModal content={currentContent.emergency} lang={lang} onClose={() => setEmergencyOpen(false)} />}
            {selectedItinerary && <ItineraryModal item={selectedItinerary} modalContent={currentContent.itinerary.modal} onClose={() => setSelectedItinerary(null)} />}
        </>
    );
}
