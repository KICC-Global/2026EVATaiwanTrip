import React from 'react';
import Image from 'next/image';
import { FooterContent, Language } from '@/types';

interface FooterProps {
  content: FooterContent;
  lang?: Language;
}

const Footer: React.FC<FooterProps> = ({ content, lang = 'zh' }) => {
  return (
    <footer className="bg-brand-text text-white py-8">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-4 flex flex-col items-center">
          <Image
            src="/images/KICC_GE-removebg-preview-modified.png"
            alt="KICC GE Logo"
            width={320}
            height={80}
            className="h-20 w-auto object-contain mb-3"
          />
          <p className="font-bold">{content.contact}: jekicc2020@gmail.com</p>
          <p className="font-bold">{content.hotline}</p>
          <p className="font-bold">{lang === 'zh' ? '美国电话' : 'U.S. Phone Number'}: +1 (714)332-5323</p>
          <p className="font-bold">{lang === 'zh' ? '台湾电话' : 'Taiwan Phone Number'}: +886 0936615150</p>
        </div>
        <p className="text-sm text-gray-400">{content.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;