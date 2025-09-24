"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';
import { Language, SiteContent, LanguageSpecificContent } from '@/types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  siteContent: SiteContent;
  currentContent: LanguageSpecificContent;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
  initialLang?: Language;
  siteContent: SiteContent;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, initialLang, siteContent }) => {
  const getInitialLang = (): Language => {
    if (initialLang) {
      return initialLang;
    }
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(/(?:^|; )preferredLang=([^;]+)/);
      const fromCookie = match ? decodeURIComponent(match[1]) : null;
      if (fromCookie === 'en' || fromCookie === 'zh-TW' || fromCookie === 'zh-CN') return fromCookie;
      const saved = localStorage.getItem('preferredLang');
      if (saved === 'en' || saved === 'zh-TW' || saved === 'zh-CN') return saved;
    }
    return 'en';
  };

  const [lang, setLangState] = useState<Language>(getInitialLang);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLang', newLang);
      document.cookie = `preferredLang=${encodeURIComponent(newLang)}; Path=/; Max-Age=31536000; SameSite=Lax`;
      const html = document.documentElement;
      html.lang = newLang === 'zh-TW' ? 'zh-Hant' : newLang === 'zh-CN' ? 'zh-Hans' : 'en';
    }
  };

  const currentContent = useMemo(() => {
    return siteContent[lang] || siteContent.en;
  }, [lang, siteContent]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, siteContent, currentContent }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageAndContent = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageAndContent must be used within a LanguageProvider');
  }
  return context;
};