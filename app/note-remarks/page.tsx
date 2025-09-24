"use client";

import React, { useState } from 'react';
import { useLanguageAndContent } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmergencyModal from '@/components/EmergencyModal';
import { AlertTriangle } from 'lucide-react';

export default function NoteRemarksPage() {
  const { lang, setLang, currentContent } = useLanguageAndContent();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEmergencyOpen, setEmergencyOpen] = useState(false);
  const html = currentContent.noteRemarksHtml || '';
  // Strip embedded document wrappers/styles so we can style like Important Info
  const sanitizedHtml = html
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<\/?(html|head|body)[^>]*>/gi, '');

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
        <h1 className="text-4xl font-bold text-brand-red mb-8 text-center">{lang === 'zh-TW' ? '注意事項與備註' : (lang === 'zh-CN' ? '注意事项与备注' : 'Notes & Remarks')}</h1>
        <div className="max-w-3xl mx-auto mb-6 text-center">
          <a
            className="text-blue-600 hover:underline font-medium"
            href="/docs/2026-The-Meadows-School-Note-Remarks.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            {lang === 'zh-TW' ? '下載 PDF' : (lang === 'zh-CN' ? '下载 PDF' : 'Download PDF')}
          </a>
        </div>
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg doc-html doc-notes">
          <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
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