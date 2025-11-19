'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { FaqContent, FaqItem } from '@/types';

interface FaqProps {
  content: FaqContent;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const sanitizeHref = (href: string) => {
  const trimmed = href.trim();
  if (!trimmed) {
    return '#';
  }

  if (trimmed.startsWith('#') || trimmed.startsWith('/')) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();
  if (lower.startsWith('mailto:') || lower.startsWith('tel:')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    // fall through to default
  }

  return '#';
};

const createAnswerMarkup = (answer: string) => {
  const anchorRegex = /<a\s+[^>]*href\s*=\s*"([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  const anchors: Array<{ placeholder: string; href: string; text: string }> = [];
  let matchIndex = 0;

  const withoutAnchors = answer.replace(anchorRegex, (_, href: string, text: string) => {
    const placeholder = `__FAQ_ANCHOR_${matchIndex}__`;
    anchors.push({ placeholder, href, text });
    matchIndex += 1;
    return placeholder;
  });

  const baseEscaped = escapeHtml(withoutAnchors).replace(/\r?\n/g, '<br />');

  const htmlWithAnchors = anchors.reduce((html, anchor) => {
    const safeHref = sanitizeHref(anchor.href);
    const safeText = escapeHtml(anchor.text).replace(/\r?\n/g, '<br />');
    const isExternal = /^https?:/i.test(safeHref);
    const attributes = isExternal
      ? `href="${safeHref}" target="_blank" rel="noopener noreferrer"`
      : `href="${safeHref}"`;
    const anchorHtml = `<a ${attributes} class="text-brand-red underline break-words">${safeText}</a>`;
    return html.replace(anchor.placeholder, anchorHtml);
  }, baseEscaped);

  return { __html: htmlWithAnchors };
};

const AccordionItem: React.FC<{ item: FaqItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sanitizedAnswer = useMemo(() => createAnswerMarkup(item.a), [item.a]);

  return (
    <div className="border-b border-red-100">
      <button
        className="w-full flex justify-between items-center text-left py-4 px-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-brand-text">{item.q}</span>
        <ChevronDown
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div
          className="pb-4 px-2 text-gray-600 whitespace-pre-line"
          dangerouslySetInnerHTML={sanitizedAnswer}
        />
      </motion.div>
    </div>
  );
};

const Faq: React.FC<FaqProps> = ({ content }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = content.items.filter(item =>
    item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="faq" className="py-20 bg-white">
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

        <div className="max-w-3xl mx-auto">
          <div className="relative mb-8">
            <input
              type="text"
              placeholder={content.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-brand-red focus:outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div>
            {Object.keys(content.categories).map(key => {
              const categoryItems = filteredItems.filter(item => item.category === key);
              if (categoryItems.length === 0) return null;

              return (
                <div key={key} className="mb-8">
                  <h3 className="text-2xl font-bold text-brand-red mb-4">{content.categories[key]}</h3>
                  <div className="bg-white rounded-lg">
                    {categoryItems.map((item, index) => (
                      <AccordionItem key={index} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;

