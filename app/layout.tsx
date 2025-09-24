import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { cookies } from "next/headers";
import { getSiteContent } from "@/lib/content-loader";

export const metadata: Metadata = {
  title: "2026 The Meadows School  台湾文化及志工之旅",
  description: "专为美国高中生设计的 9 天台湾文化沉浸行程，体验传统与现代、自然与人文的丰富面貌。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteContent = getSiteContent(); // Fetch data on server
  const cookieStore = cookies();
  const cookieLang = cookieStore.get('preferredLang')?.value;
  const initialLang = (cookieLang === 'en' || cookieLang === 'zh-TW' || cookieLang === 'zh-CN') ? cookieLang : 'en';
  const htmlLang = initialLang === 'zh-TW' ? 'zh-Hant' : initialLang === 'zh-CN' ? 'zh-Hans' : 'en';

  return (
    <html lang={htmlLang}>
      <body>
        <LanguageProvider 
          initialLang={initialLang as any}
          siteContent={siteContent} // Pass data to provider
        >
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}