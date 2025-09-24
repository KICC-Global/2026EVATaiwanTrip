import React from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { NavContent, Language } from '@/types';

interface HeaderProps {
  content: NavContent;
  lang: Language;
  setLang: (lang: Language) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ content, lang, setLang, isMobileMenuOpen, setMobileMenuOpen }) => {
  // Labels
  const statementLabel = lang === 'zh-TW' ? '聲明' : (lang === 'zh-CN' ? '声明' : 'Statement');
  const noteRemarksLabel =
    lang === 'zh-TW' ? '注意事項與備註' : (lang === 'zh-CN' ? '注意事项与备注' : 'Notes & Remarks');
  const agreementLabel =
    lang === 'zh-TW' ? '同意與免責聲明' : (lang === 'zh-CN' ? '协议与免责声明' : 'Agreement & Release');

  // Primary nav links (excluding Statement children)
  const primaryNavLinks = [
    { href: '/#highlights', text: content.highlights },
    { href: '/#itinerary', text: content.itinerary },
    { href: '/#gallery', text: content.gallery },
    { href: '/#faq', text: content.faq },
  ];

  // Submenu items under Statement
  const statementLinks = [
    { href: '/important-information', text: content.importantInformation },
    { href: '/note-remarks', text: noteRemarksLabel },
    { href: '/agreement', text: agreementLabel },
  ];

  const applyNowLabel = lang === 'zh-TW' ? '立即報名' : (lang === 'zh-CN' ? '立即报名' : 'Apply Now');

  return (
    <header className="fixed top-0 left-0 right-0 bg-brand-bg/80 backdrop-blur-sm z-40 shadow-md">
      <div className="w-full max-w-[1600px] mx-auto px-6 py-3 flex justify-between items-center">
        <a href="/" className="flex items-center space-x-3">
          <img
            src="/images/KICC_GE-removebg-preview.png"
            alt="KICC GE Logo"
            className="h-10 w-auto object-contain"
          />
          <div className="text-xl font-bold text-brand-red">SHS Taiwan 2026</div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-6">
          {primaryNavLinks.map((link, index) => (
            <a key={index} href={link.href} className="text-brand-text hover:text-brand-red transition-colors">
              {link.text}
            </a>
          ))}
          {/* Statement dropdown (desktop, hover-intent with delay) */}
          <DesktopStatementDropdown label={statementLabel} items={statementLinks} />
          <a
            href="/2024-taiwan-trip"
            className="border border-brand-red text-brand-red font-semibold py-2 px-4 rounded-full hover:bg-red-50 transition-colors shadow"
          >
            2024 Taiwan Trip
          </a>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfa-E5o5ywPfWWKjV-gY21oOT2pCO88EcgqC_tNDn-dC_IbtA/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-red text-white font-semibold py-2 px-4 rounded-full hover:bg-red-800 transition-colors shadow"
          >
            {applyNowLabel}
          </a>
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </nav>

        {/* Mobile Menu Button */}
        <div className="xl:hidden">
          <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu" className="p-2">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:hidden bg-brand-bg pb-4"
        >
          <nav className="flex flex-col items-center space-y-4">
            {primaryNavLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-brand-text hover:text-brand-red transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.text}
              </a>
            ))}
            {/* Statement collapsible (mobile) */}
            <MobileStatement
              label={statementLabel}
              items={statementLinks}
              onNavigate={() => setMobileMenuOpen(false)}
            />
            <a
              href="/2024-taiwan-trip"
              className="border border-brand-red text-brand-red font-semibold py-2 px-4 rounded-full hover:bg-red-50 transition-colors shadow"
              onClick={() => setMobileMenuOpen(false)}
            >
              2024 Taiwan Trip
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfa-E5o5ywPfWWKjV-gY21oOT2pCO88EcgqC_tNDn-dC_IbtA/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-red text-white font-semibold py-2 px-4 rounded-full hover:bg-red-800 transition-colors shadow"
              onClick={() => setMobileMenuOpen(false)}
            >
              {applyNowLabel}
            </a>
            <LanguageSwitcher lang={lang} setLang={setLang} />
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;

// Mobile submenu component to keep Header tidy
const MobileStatement: React.FC<{
  label: string;
  items: { href: string; text: string }[];
  onNavigate: () => void;
}> = ({ label, items, onNavigate }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="w-full max-w-sm mx-auto">
      <button
        className="w-full flex items-center justify-center gap-1 text-brand-text hover:text-brand-red transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{label}</span>
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <ul className="mt-2 space-y-2">
          {items.map((s, i) => (
            <li key={i}>
              <a
                href={s.href}
                className="block w-full text-center text-sm text-gray-700 hover:text-brand-red"
                onClick={onNavigate}
              >
                {s.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Desktop dropdown with hover intent and small close delay to avoid flicker
const DesktopStatementDropdown: React.FC<{
  label: string;
  items: { href: string; text: string }[];
}> = ({ label, items }) => {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef<number | null>(null);

  const openNow = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
    }
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLButtonElement | HTMLDivElement> = (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="relative" onMouseLeave={scheduleClose}>
      <button
        className="text-brand-text hover:text-brand-red transition-colors flex items-center gap-1"
        aria-haspopup="menu"
        aria-expanded={open}
        onMouseEnter={openNow}
        onFocus={openNow}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
      >
        {label}
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
      </button>
      <div
        className={`${open ? 'block' : 'hidden'} absolute left-0 mt-2 bg-white shadow-lg rounded-md border border-gray-100 min-w-[220px] z-50`}
        onMouseEnter={openNow}
        onKeyDown={onKeyDown}
      >
        <ul className="py-2">
          {items.map((s, i) => (
            <li key={i}>
              <a href={s.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-red">
                {s.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
