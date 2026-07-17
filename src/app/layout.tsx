import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { HeaderBrandSection } from "@/components/layout/HeaderBrandSection";
import { Footer } from "@/components/layout/Footer";
import { ContentStudioShell } from "@/components/cms/ContentStudioShell";
import { CmsHeader, CmsHeaderBrand, CmsFooter } from "@/components/cms/CmsLayoutZones";
import { CartProvider } from "@/components/commerce/CartProvider";
import { COMING_SOON } from "@/lib/comingSoon";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: COMING_SOON ? "Coming Soon | Shortkey" : "Shortkey",
  description:
    "The first AI-powered Asian beauty platform. Try, learn, shop, and discover beauty through shortcuts.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans`}>
        <CartProvider>
          {COMING_SOON ? (
            children
          ) : (
            <ContentStudioShell>
              <CmsHeader>
                <Header />
              </CmsHeader>
              <CmsHeaderBrand>
                <HeaderBrandSection />
              </CmsHeaderBrand>
              <main className="min-w-0">{children}</main>
              <CmsFooter>
                <Footer />
              </CmsFooter>
            </ContentStudioShell>
          )}
        </CartProvider>
      </body>
    </html>
  );
}
