import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { HeaderBrandSection } from "@/components/layout/HeaderBrandSection";
import { Footer } from "@/components/layout/Footer";
import { ContentStudioShell } from "@/components/cms/ContentStudioShell";
import { CmsHeader, CmsHeaderBrand, CmsFooter } from "@/components/cms/CmsLayoutZones";
import { CartProvider } from "@/components/commerce/CartProvider";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shortkey",
  description:
    "The first AI-powered Asian beauty platform. Try, learn, shop, and discover beauty through shortcuts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans`}>
        <ContentStudioShell>
          <CartProvider>
            <CmsHeader>
              <Header />
            </CmsHeader>
            <CmsHeaderBrand>
              <HeaderBrandSection />
            </CmsHeaderBrand>
            <main>{children}</main>
            <CmsFooter>
              <Footer />
            </CmsFooter>
          </CartProvider>
        </ContentStudioShell>
      </body>
    </html>
  );
}
