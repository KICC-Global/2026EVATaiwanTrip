export type Language = 'en' | 'zh-TW' | 'zh-CN';

export interface NavContent {
  highlights: string;
  itinerary: string;
  gallery: string;
  faq: string;
  emergency: string;
  importantInformation: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  cta: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
}

export interface FeaturesContent {
  title: string;
  items: FeatureItem[];
}

export interface ItineraryItem {
  day: string;
  title: string;
  details: string;
  longDesc?: string;
  longHtml?: string;
  images?: string[];
}

export interface ItineraryContent {
  title: string;
  subtitle: string;
  modal: {
    close: string;
    details: string;
    gallery: string;
  };
  days: ItineraryItem[];
}

export interface GalleryImage {
  src: string;
  alt: string;
  tags: string[];
}

export interface GalleryContent {
  title: string;
  subtitle: string;
  filters: {
    all: string;
    day: string;
    theme: string;
  };
  tags: { [key: string]: string };
  images?: GalleryImage[];
}

export interface FaqItem {
  q: string;
  a: string;
  category: string;
}

export interface FaqContent {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  categories: { [key: string]: string };
  items: FaqItem[];
}

export interface FooterContent {
  contact: string;
  hotline: string;
  copyright: string;
}

export interface EmergencyContent {
  title: string;
  button: string;
  leadTeacher: string;
  localContact: string;
  insuranceInfo: string;
  call: string;
}

export interface ImportantInfoContentBlock {
  type: 'heading' | 'paragraph' | 'list' | 'link';
  content: string | string[];
  url?: string;
}

export interface ImportantInfoContent {
  title: string;
  blocks: ImportantInfoContentBlock[];
}

export interface LanguageSpecificContent {
  nav: NavContent;
  hero: HeroContent;
  features: FeaturesContent;
  itinerary: ItineraryContent;
  gallery: GalleryContent;
  faq: FaqContent;
  footer: FooterContent;
  emergency: EmergencyContent;
  importantInfo: ImportantInfoContent;
  noteRemarksHtml?: string; // raw HTML for Notes & Remarks
  agreementHtml?: string; // raw HTML for Agreement & Release
}

export interface SiteContent {
  en: LanguageSpecificContent;
  'zh-TW': LanguageSpecificContent;
  'zh-CN'?: LanguageSpecificContent;
}
