import { Inter } from "next/font/google";
import "./globals.css";
import logo from "../../public/sahibinden.png";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
//some changes
export const metadata = {
  title: "Sahibinden - Param Güvende",
  description: "Sahibinden Param Güvende ile hızlı ve güvenli alışveriş yapın.",
  icons: {
    icon: '../../public/sahibinden.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="Sahibinden - Param Güvende Hizmetleri Hızlı Satış" />
        <meta property="og:description" content="Sahibinden Param Güvende ile hızlı ve güvenli alışveriş yapın." />
        <meta property="og:image" content="https://sahibinden-get.vercel.app/sahibinden.png" />
        <meta property="og:url" content="https://sahibinden-get.vercel.app" />
        <style>{`
          #__next-build-watcher { display: none !important; }
          #NextLogo { display: none !important; }
          #nextjs-portal-root { display: none !important; }
          [data-nextjs-dialog-overlay] { display: none !important; }
          [data-nextjs-dialog] { display: none !important; }
        `}</style>
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
