import type { Metadata } from "next";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { GlobalLoader } from "@/components/ui/global-loader";
import WhatsAppButton from "@/components/WhatsAppButton";
import Schema from "@/components/Schema";
import { AdminSidebarProvider } from "@/contexts/AdminSidebarContext";
export const metadata: Metadata = {
  title: {
    default: "Kirubai Furniture",
    template: "%s | Kirubai Furniture",
  },
  description: "Discover premium furniture for your home and office.",
  keywords: [
    "furniture",
    "wooden furniture",
    "home furniture",
    "office furniture",
    "Kirubai Furniture",
  ],
  openGraph: {
    title: "Kirubai Furniture",
    description: "High-quality custom furniture in Tamil Nadu.",
    url: "https://kirubaifurniture.com",
    siteName: "Kirubai Furniture",
    images: [
      {
        url: "https://res.cloudinary.com/dzk3mhoqu/image/upload/v1764329428/Screenshot_2025-11-28_165645_w9zgz7.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <AdminSidebarProvider>
          <Header />
          <Schema />
          <main className="w-full px-0 ">{children}</main>

          <Footer />
          <GlobalLoader />
          <Toaster position="top-right" />
          <WhatsAppButton />
        </AdminSidebarProvider>
      </body>
    </html>
  );
}
