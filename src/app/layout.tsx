import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lumina - แพลตฟอร์มบริหารร้านซาลอนและบาร์เบอร์ยุคใหม่ | All-in-One Salon SaaS",
  description:
    "คิดเงินไว สรุปค่าคอมฯ ช่างแม่นยำ รู้กำไรเรียลไทม์ใน 3 วินาที แพลตฟอร์มบริหารร้านตัดผม ซาลอน และบาร์เบอร์ครบวงจร",
  keywords: [
    "โปรแกรมร้านทำผม",
    "โปรแกรมบาร์เบอร์",
    "ระบบ POS ร้านตัดผม",
    "คำนวณค่าคอมมิชชั่นช่าง",
    "Salon Management SaaS",
    "Lumina POS",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${inter.variable} scroll-smooth antialiased`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
