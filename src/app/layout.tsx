import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClientLayout } from "@/components/shared/ClientLayout";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "MakeLocal - Web Summit Demo",
  description:
    "Browse products, personalize items, and place demo orders to see local manufacturing in action.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display="
          rel="stylesheet"
        />
      </head>
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <ServiceWorkerRegistration />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
