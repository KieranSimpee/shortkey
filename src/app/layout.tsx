import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { ContentStudioShell } from "@/components/cms/ContentStudioShell";
import { CartProvider } from "@/components/commerce/CartProvider";
import { AppChrome } from "@/components/layout/AppChrome";
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
        <ContentStudioShell>
          <CartProvider>
            <AppChrome>{children}</AppChrome>
          </CartProvider>
        </ContentStudioShell>
      </body>
    </html>
  );
}
