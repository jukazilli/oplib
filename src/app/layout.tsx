import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";

import { authenticationLocalization } from "@/modules/identity/ui";
import { getSiteUrl, publicRobots } from "@/lib/seo/metadata";

import "./styles.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-editorial",
});
const manrope = Manrope({ subsets: ["latin"], variable: "--font-interface" });

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: "OPALIB", template: "%s | OPALIB" },
  description: "Conhecimento para construir, preservar e compartilhar.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "OPALIB",
    title: "OPALIB",
    description: "Conhecimento para construir, preservar e compartilhar.",
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "OPALIB — conhecimento para construir, preservar e compartilhar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OPALIB",
    description: "Conhecimento para construir, preservar e compartilhar.",
    images: ["/opengraph-image"],
  },
  robots: publicRobots(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${newsreader.variable} ${manrope.variable}`}>
      <body>
        <ClerkProvider
          appearance={{ theme: shadcn }}
          localization={authenticationLocalization}
          signInUrl="/sign-in"
          signUpUrl={undefined}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
