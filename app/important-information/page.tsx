"use client";

import React, { useState } from 'react';
import { useLanguageAndContent } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ImportantInfoContentBlock } from '@/types';
import EmergencyModal from '@/components/EmergencyModal';
import { AlertTriangle } from 'lucide-react';

export default function ImportantInformationPage() {
  const { lang, setLang, currentContent } = useLanguageAndContent();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEmergencyOpen, setEmergencyOpen] = useState(false);

  if (!currentContent || !currentContent.importantInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-bg text-brand-red">
        Loading Important Information...
      </div>
    );
  }

  const renderBlock = (block: ImportantInfoContentBlock, index: number) => {
    switch (block.type) {
      case 'heading':
        return <h2 key={index} className="text-2xl font-bold text-brand-text mt-6 mb-2">{block.content}</h2>;
      case 'paragraph':
        return <p key={index} className="text-gray-700 mb-2">{block.content}</p>;
      case 'list':
        return (
          <ul key={index} className="list-disc list-inside text-gray-700 mb-2 ml-4">
            {(block.content as string[]).map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        );
      case 'link':
        return (
          <p key={index} className="text-blue-600 hover:underline mb-2">
            <a href={block.url} target="_blank" rel="noopener noreferrer">
              {block.content}
            </a>
          </p>
        );
      default:
        return null;
    }
  };

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
        <h1 className="text-4xl font-bold text-brand-red mb-8 text-center">
          {currentContent.importantInfo.title}
        </h1>
        <div className="max-w-3xl mx-auto mb-6 text-center">
          <a
            className="text-blue-600 hover:underline font-medium"
            href="/docs/2026-Taiwan-Trip-Registration-Form-Payment-Instructions.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            {lang === 'zh-TW' ? '下載 PDF' : (lang === 'zh-CN' ? '下载 PDF' : 'Download PDF')}
          </a>
        </div>
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          {currentContent.importantInfo.blocks.map(renderBlock)}
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