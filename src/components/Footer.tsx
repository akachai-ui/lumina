import React from "react";
import Link from "next/link";
import { Scissors, MessageCircle, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md">
                <Scissors className="h-5 w-5 rotate-[-45deg]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white">
                  LUMINA
                </span>
                <span className="rounded-full bg-indigo-950 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-800">
                  Salon SaaS
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Lumina คือระบบบริหารร้านตัดผม ซาลอน และบาร์เบอร์แบบ All-in-One
              ที่ช่วยให้คิดเงินไว สรุปค่าคอมมิชชันช่างอัตโนมัติ
              และมองเห็นกำไรแท้จริงของร้านได้แบบเรียลไทม์
            </p>

            {/* LINE Official Contact Button */}
            <div className="pt-2">
              <a
                href="https://line.me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>ปรึกษาทีมงานผ่าน LINE Official: @luminasalon</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              ระบบและฟีเจอร์
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Fast POS คิดเงินหน้าเคาน์เตอร์
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  คำนวณค่าคอมฯ ช่างอัตโนมัติ
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  รายงานวิเคราะห์กำไรเรียลไทม์
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  ระบบออกสลิปเงินเดือน (PDF)
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  ระบบจองคิวออนไลน์
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Plans & Pricing */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              แพ็กเกจราคา
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Starter Plan (฿590/ด.)
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Growth Plan (฿1,290/ด.)
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Enterprise Plan (฿2,490/ด.)
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  ขอรับตัวอย่างระบบ Live Demo
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              ติดต่อเรา
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>02-105-XXXX (จันทร์-อาทิตย์)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@lumina.salon</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>อาคารภิรัชทาวเวอร์ แอท เอ็มควอเทียร์ สุขุมวิท กรุงเทพฯ</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 Lumina Platform. All rights reserved. ออกแบบสำหรับร้านซาลอนและบาร์เบอร์ไทย
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400">
              นโยบายความเป็นส่วนตัว (Privacy Policy)
            </a>
            <a href="#" className="hover:text-slate-400">
              ข้อกำหนดการใช้งาน (Terms of Service)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
