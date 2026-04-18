import type { Metadata } from "next";
import "./globals.css";
import JsonLd from "@/app/components/jsonld";

export const metadata: Metadata = {
  title: "CleanFlow AI – Clean Your Dataset for Machine Learning in Seconds",
  description:
    "Upload messy CSV or Excel files and get ML‑ready data instantly. Automatic outlier removal, missing value imputation, and AI‑powered insights.",
  keywords:
    "data cleaning, machine learning, CSV cleaner, Excel cleaner, AI data prep, data preprocessing, clean dataset",
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "CleanFlow AI – Instant ML‑Ready Datasets",
    description:
      "Upload messy datasets and get clean, analysis‑ready files in one click.",
    url: "https://clean-flow-ai.vercel.app",
    siteName: "CleanFlow AI",
    images: [
      {
        url: "https://clean-flow-ai.vercel.app/og-image.png", // Create this image
        width: 1200,
        height: 630,
        alt: "CleanFlow AI – Clean data for ML",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CleanFlow AI – Clean Data for Machine Learning",
    description:
      "Upload CSV/Excel files and get clean, ML‑ready data instantly.",
    images: ["https://clean-flow-ai.vercel.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code", // Get from Google Search Console
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}