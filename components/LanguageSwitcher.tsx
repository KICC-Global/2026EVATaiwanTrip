import React from 'react';
import { Language } from '@/types';

interface LanguageSwitcherProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ lang, setLang }) => {
  return (
    <div className="flex items-center bg-gray-200 rounded-full p-1">
      <button
        onClick={() => setLang('zh-TW')}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          lang === 'zh-TW' ? 'bg-brand-red text-white' : 'text-brand-text'
        }`}
      >
        繁
      </button>
      <button
        onClick={() => setLang('zh-CN')}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          lang === 'zh-CN' ? 'bg-brand-red text-white' : 'text-brand-text'
        }`}
      >
        简
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          lang === 'en' ? 'bg-brand-red text-white' : 'text-brand-text'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;

