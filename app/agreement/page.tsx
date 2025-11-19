"use client";

import React, { useState } from 'react';
import { useLanguageAndContent } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmergencyModal from '@/components/EmergencyModal';
import { PhoneCall } from 'lucide-react';
import { ImportantInfoContentBlock } from '@/types';

export default function AgreementPage() {
  const { lang, setLang, currentContent } = useLanguageAndContent();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEmergencyOpen, setEmergencyOpen] = useState(false);

  const html = currentContent.agreementHtml || '';
  const sanitizedHtml = html
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<\/?(html|head|body)[^>]*>/gi, '');

  const pageTitle = currentContent.agreement?.title || 'Agreement & Release';

  const renderBlock = (block: ImportantInfoContentBlock, index: number) => {
    switch (block.type) {
      case 'heading':
        return <h2 key={index}>{block.content}</h2>;
      case 'paragraph':
        return <p key={index}>{block.content}</p>;
      case 'list':
        return (
          <ul key={index}>
            {(block.content as string[]).map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        );
      case 'table': {
        const rows = block.content as string[][];
        if (!Array.isArray(rows) || rows.length === 0) return null;
        const [header, ...body] = rows;
        return (
          <div key={index} className="overflow-x-auto my-4">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr>
                  {header.map((h, i) => (
                    <th key={i} className="border px-3 py-2 text-left bg-gray-50 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="border px-3 py-2 align-top">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      case 'link':
        return (
          <p key={index}>
            <a href={(block as any).url} target="_blank" rel="noopener noreferrer">
              {block.content}
            </a>
          </p>
        );
      case 'html':
        return <div key={index} dangerouslySetInnerHTML={{ __html: String(block.content) }} />;
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
        <h1 className="text-4xl font-bold text-brand-red mb-8 text-center">{pageTitle}</h1>
        {/* <div className="max-w-3xl mx-auto mb-6 text-center">
          <a
            className="text-blue-600 hover:underline font-medium"
            href="/docs/2026-AHS-AGREEMENT-AND-RELEASE.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            {lang === 'zh-TW' ? '下載 PDF' : (lang === 'zh-CN' ? '下载 PDF' : 'Download PDF')}
          </a>
        </div> */}
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg doc-html doc-notes">
          {currentContent.agreement?.blocks
            ? currentContent.agreement.blocks.map(renderBlock)
            : <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />}
        </div>
      </main>
      <Footer content={currentContent.footer} lang={lang} />

      <button
        onClick={() => setEmergencyOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-red text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-red-800 transition-transform duration-300 hover:scale-110"
        aria-label={currentContent.emergency.button}
      >
        <PhoneCall size={32} />
      </button>

      {isEmergencyOpen && (
        <EmergencyModal content={currentContent.emergency} lang={lang} onClose={() => setEmergencyOpen(false)} />
      )}
    </>
  );
}
