import { SiteContent, LanguageSpecificContent, GalleryImage, ImportantInfoContent } from '@/types';

// JSON imports
import heroEn from '@/content/hero.en.json';
import heroZhTw from '@/content/hero.zh-TW.json';
import heroZhCn from '@/content/hero.zh-CN.json';
import navEn from '@/content/nav.en.json';
import navZhTw from '@/content/nav.zh-TW.json';
import navZhCn from '@/content/nav.zh-CN.json';
import featuresEn from '@/content/features.en.json';
import featuresZhTw from '@/content/features.zh-TW.json';
import featuresZhCn from '@/content/features.zh-CN.json';
import itineraryEn from '@/content/itinerary.en.json';
import itineraryZhTw from '@/content/itinerary.zh-TW.json';
import itineraryZhCn from '@/content/itinerary.zh-CN.json';
import galleryEn from '@/content/gallery.en.json';
import galleryZhTw from '@/content/gallery.zh-TW.json';
import galleryZhCn from '@/content/gallery.zh-CN.json';
import faqEn from '@/content/faq.en.json';
import faqZhTw from '@/content/faq.zh-TW.json';
import faqZhCn from '@/content/faq.zh-CN.json';
import footerEn from '@/content/footer.en.json';
import footerZhTw from '@/content/footer.zh-TW.json';
import footerZhCn from '@/content/footer.zh-CN.json';
import emergencyEn from '@/content/emergency.en.json';
import emergencyZhTw from '@/content/emergency.zh-TW.json';
import emergencyZhCn from '@/content/emergency.zh-CN.json';
import importantInfoEn from '@/content/importantInfo.en.json';
import importantInfoZhTw from '@/content/importantInfo.zh-TW.json';
import importantInfoZhCn from '@/content/importantInfo.zh-CN.json';

// Dynamic/Generated content imports
import { imagesByDay } from '@/lib/images_by_day';
import itineraryByLang from '@/generated/itinerary_by_lang.json';
import * as htmlContent from '@/generated/html-content';

// This function runs only on the server to assemble the complete site content.
export function getSiteContent(): SiteContent {
  // 1. Assemble the base content from JSON files
  const baseContent: SiteContent = {
    en: {
      nav: navEn,
      hero: heroEn,
      features: featuresEn,
      itinerary: itineraryEn,
      gallery: galleryEn,
      faq: faqEn,
      footer: footerEn,
      emergency: emergencyEn,
      importantInfo: importantInfoEn as ImportantInfoContent,
    },
    'zh-TW': {
      nav: navZhTw,
      hero: heroZhTw,
      features: featuresZhTw,
      itinerary: itineraryZhTw,
      gallery: galleryZhTw,
      faq: faqZhTw,
      footer: footerZhTw,
      emergency: emergencyZhTw,
      importantInfo: importantInfoZhTw as ImportantInfoContent,
    },
    'zh-CN': {
      nav: navZhCn,
      hero: heroZhCn,
      features: featuresZhCn,
      itinerary: itineraryZhCn,
      gallery: galleryZhCn,
      faq: faqZhCn,
      footer: footerZhCn,
      emergency: emergencyZhCn,
      importantInfo: importantInfoZhCn as ImportantInfoContent,
    },
  };

  // 2. Patch/Inject dynamic and file-based content
  const finalContent = { ...baseContent };

  // Inject HTML from pre-generated file
  finalContent.en.agreementHtml = htmlContent.agreement_en;
  finalContent.en.noteRemarksHtml = htmlContent.notes_en;
  finalContent['zh-TW'].agreementHtml = htmlContent.agreement_zh_tw;
  finalContent['zh-TW'].noteRemarksHtml = htmlContent.notes_zh_tw;
  if (finalContent['zh-CN']) {
    finalContent['zh-CN'].agreementHtml = htmlContent.agreement_zh_cn;
    finalContent['zh-CN'].noteRemarksHtml = htmlContent.notes_zh_cn;
  }

  // Inject itinerary details and images (re-using the logic from content_with_images.ts)
  Object.keys(finalContent).forEach(lang => {
    const key = lang as keyof SiteContent;
    finalContent[key] = patchLanguage(finalContent[key]!, key as any);
  });

  return finalContent;
}

// Helper function to patch a single language's content (adapted from content_with_images.ts)
function patchLanguage(lc: LanguageSpecificContent, langKey: 'en' | 'zh-TW' | 'zh-CN'): LanguageSpecificContent {
  const days = lc.itinerary.days.map((d, idx) => {
    const jsonKey = String(idx + 1);
    const longHtmlFromDocs = (itineraryByLang as any)?.[langKey]?.[jsonKey] as string | undefined;
    const tag = `d${idx + 1}` as const;
    const imgs = imagesByDay[tag] || d.images || [];
    return { ...d, images: imgs, longHtml: longHtmlFromDocs };
  });

  const galleryImages = buildGalleryImages({ ...lc, itinerary: { ...lc.itinerary, days } });

  return {
    ...lc,
    itinerary: { ...lc.itinerary, days },
    gallery: { ...lc.gallery, images: galleryImages },
  };
}

function buildGalleryImages(lc: LanguageSpecificContent): GalleryImage[] {
  const byDay: GalleryImage[] = [];
  for (let n = 1; n <= 9; n++) {
    const tag = `d${n}`;
    const idx = n - 1;
    const dayTitle = lc.itinerary.days[idx]?.title || lc.gallery.tags?.[tag] || `Day ${n}`;
    const srcs = imagesByDay[tag] || [];
    srcs.forEach((src) => {
      byDay.push({ src, alt: `${lc.gallery.tags?.[tag] || `Day ${n}`}: ${dayTitle}`, tags: [tag] });
    });
  }
  return byDay;
}