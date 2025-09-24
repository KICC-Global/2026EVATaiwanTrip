"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmergencyModal from '@/components/EmergencyModal';
import { AlertTriangle } from 'lucide-react';
import { useLanguageAndContent } from '@/contexts/LanguageContext';

export default function TaiwanTrip2024Page() {
  const { lang, setLang, currentContent } = useLanguageAndContent();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEmergencyOpen, setEmergencyOpen] = useState(false);

  return (
    <>
      <Header
        content={currentContent.nav}
        lang={lang}
        setLang={setLang}
        isMobileMenuOpen={isMobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main className="container mx-auto px-6 pt-28 pb-12">
        <h1 className="text-4xl font-bold text-brand-red mb-8 text-center">2024 Taiwan Trip</h1>
        <div className="max-w-4xl mx-auto bg-white p-4 md:p-6 rounded-lg shadow-lg">
          {/* Responsive video embed */}
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-md"
              src="https://www.youtube.com/embed/_s9JzPWDcIc?si=fACF5RT_gLfetx7h"
              title="2024 Taiwan Trip"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </main>
      <Footer content={currentContent.footer} lang={lang} />

      <button
        onClick={() => setEmergencyOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-red text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-red-800 transition-transform duration-300 hover:scale-110"
        aria-label={currentContent.emergency.button}
      >
        <AlertTriangle size={32} />
      </button>

      {isEmergencyOpen && (
        <EmergencyModal content={currentContent.emergency} lang={lang} onClose={() => setEmergencyOpen(false)} />
      )}
    </>
  );
}