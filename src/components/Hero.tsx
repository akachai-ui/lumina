"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Scissors,
  Users,
  CreditCard,
  Percent,
  TrendingUp,
  Receipt,
} from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  barber: string;
  commissionRate: number; // e.g. 0.45 for 45%
  category: string;
}

const AVAILABLE_SERVICES: ServiceItem[] = [
  {
    id: "s1",
    name: "Classic Fade & Haircut",
    price: 450,
    barber: "ช่างมาร์ค (45%)",
    commissionRate: 0.45,
    category: "ตัดผม",
  },
  {
    id: "s2",
    name: "สปาดีท็อกซ์ & นวดผ่อนคลาย",
    price: 350,
    barber: "ช่างเกรซ (40%)",
    commissionRate: 0.4,
    category: "ทรีตเมนต์",
  },
  {
    id: "s3",
    name: "ทำสีแฟชั่นเกาหลี (Balayage)",
    price: 2500,
    barber: "ช่างเอิร์ธ (50%)",
    commissionRate: 0.5,
    category: "ทำสี",
  },
  {
    id: "s4",
    name: "โกนหนวด Hot Towel Shave",
    price: 300,
    barber: "ช่างมาร์ค (45%)",
    commissionRate: 0.45,
    category: "บาร์เบอร์",
  },
];

export const Hero = () => {
  // Mockup interactive state
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([
    AVAILABLE_SERVICES[0],
    AVAILABLE_SERVICES[1],
  ]);

  const toggleService = (item: ServiceItem) => {
    if (selectedServices.find((s) => s.id === item.id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s.id !== item.id));
      }
    } else {
      setSelectedServices([...selectedServices, item]);
    }
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalCommission = selectedServices.reduce(
    (sum, s) => sum + s.price * s.commissionRate,
    0
  );
  const salonProfit = totalPrice - totalCommission;

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-indigo-200/50 via-violet-200/40 to-pink-100/30 blur-[130px] -z-10 rounded-full" />
      <div className="pointer-events-none absolute top-1/2 right-[-10%] w-[500px] h-[500px] bg-indigo-100/40 blur-[140px] -z-10 rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Tagline Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/90 px-4 py-1.5 text-xs sm:text-sm font-semibold text-indigo-700 shadow-sm shadow-indigo-100 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            <span>✨ แพลตฟอร์มบริหารร้านซาลอนและบาร์เบอร์ยุคใหม่</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="mt-7 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.25]">
            <span className="block sm:inline">คิดเงินไว สรุปค่าคอมฯ ช่างแม่นยำ</span>{" "}
            <span className="inline-block bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
              รู้กำไรเรียลไทม์ใน 3 วินาที
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            บอกลาสมุดจดและกระดาษ เปิดบิลผ่าน iPad หรือมือถือ
            พร้อมระบบคำนวณส่วนแบ่งพนักงานอัตโนมัติ ไม่ต้องปวดหัวตอนสิ้นเดือน
          </p>

          {/* CTA Buttons Group */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-600/25 hover:bg-indigo-700 hover:shadow-indigo-600/35 active:scale-95 transition-all"
            >
              <span>เริ่มต้นทดลองใช้งานฟรี 2 เดือน</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#demo-interactive"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-300 active:scale-95 shadow-sm transition-all"
            >
              <Play className="h-4 w-4 fill-indigo-600 text-indigo-600" />
              <span>ดูตัวอย่างระบบ (Live Demo)</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ไม่ต้องกรอกบัตรเครดิต
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              เปิดใช้งานได้ใน 2 นาที
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              รองรับทั้ง iPad, iPhone และแท็บเล็ต
            </span>
          </div>
        </div>

        {/* Tablet Mockup Interactive Preview */}
        <div id="demo-interactive" className="mt-14 sm:mt-16 relative mx-auto max-w-5xl">
          {/* Decorative Glow Ring */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-20 blur-xl"></div>

          {/* Tablet Frame Container */}
          <div className="relative rounded-3xl border-4 border-slate-800 bg-slate-900 p-2 sm:p-3 shadow-2xl shadow-indigo-950/20">
            {/* Tablet Inner Bezel */}
            <div className="rounded-2xl bg-white overflow-hidden border border-slate-200">
              {/* Tablet Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-4 py-2.5 text-white">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                  <span className="ml-2 text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-indigo-400" />
                    Lumina Smart POS &bull; โต๊ะ 3 (คุณภัทร - Walk-in)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="hidden sm:inline-block bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-500/30">
                    ONLINE SYNCED
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">14:32 น.</span>
                </div>
              </div>

              {/* POS Interface Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
                {/* Left Side: Services Catalog */}
                <div className="lg:col-span-7 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Scissors className="w-4 h-4 text-indigo-600" />
                        แตะเลือกรายการบริการ (Multi-Service)
                      </h3>
                      <p className="text-xs text-slate-500">
                        ลองคลิกเพิ่ม/ลด เพื่อดูระบบคำนวณแบบ Real-time ด้านขวา
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                      ช่างหลายคนใน 1 บิลได้
                    </span>
                  </div>

                  {/* Services List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {AVAILABLE_SERVICES.map((item) => {
                      const isSelected = selectedServices.some(
                        (s) => s.id === item.id
                      );
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleService(item)}
                          className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-500"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {item.category}
                            </span>
                            <div
                              className={`h-5 w-5 rounded-full flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-indigo-600 text-white"
                                  : "border border-slate-300 text-transparent"
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <h4 className="mt-2 text-sm font-bold text-slate-900 line-clamp-1">
                            {item.name}
                          </h4>
                          <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                            <span className="text-slate-500 flex items-center gap-1">
                              <Users className="w-3 h-3 text-indigo-500" />
                              {item.barber}
                            </span>
                            <span className="font-bold text-indigo-600">
                              ฿{item.price.toLocaleString()}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Customer Info Quick Pill */}
                  <div className="mt-5 p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center font-bold text-violet-700 text-xs">
                        PT
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">
                          คุณภัทริน (สมาชิก VIP Silver)
                        </div>
                        <div className="text-slate-400">089-123-XXXX &bull; สะสม 420 แต้ม</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                      ชำระ: สแกนโอน QR
                    </span>
                  </div>
                </div>

                {/* Right Side: Bill Summary & Live Commission Breakdown */}
                <div className="lg:col-span-5 p-4 sm:p-6 bg-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        สรุปบิลคำนวณเรียลไทม์
                      </span>
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {selectedServices.length} รายการ
                      </span>
                    </div>

                    {/* Items Selected Summary */}
                    <div className="mt-3 space-y-2.5 max-h-40 overflow-y-auto pr-1">
                      {selectedServices.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50 border border-slate-100"
                        >
                          <div className="truncate pr-2">
                            <div className="font-medium text-slate-800 truncate">
                              {s.name}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {s.barber} &rarr; คอมฯ ฿
                              {(s.price * s.commissionRate).toLocaleString()}
                            </div>
                          </div>
                          <span className="font-bold text-slate-900 shrink-0">
                            ฿{s.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Instant Financial Split Cards */}
                    <div className="mt-5 space-y-2 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>ยอดบิลรวมทั้งหมด</span>
                        <span className="text-sm font-extrabold text-slate-900">
                          ฿{totalPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-violet-700 bg-violet-50/60 p-2 rounded-lg border border-violet-100">
                        <span className="flex items-center gap-1 font-medium">
                          <Percent className="w-3.5 h-3.5 text-violet-600" />
                          รวมค่าคอมฯ ช่าง (ตัดจ่ายอัตโนมัติ)
                        </span>
                        <span className="font-bold">
                          - ฿{totalCommission.toLocaleString()}
                        </span>
                      </div>

                      {/* Profit in Emerald */}
                      <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                        <span className="flex items-center gap-1 font-semibold">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          กำไรขั้นต้นร้านคงเหลือ (Net Margin)
                        </span>
                        <span className="text-base font-extrabold text-emerald-600">
                          + ฿{salonProfit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button Mockup */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 hover:opacity-95 flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>ปิดบิลและพิมพ์สลิปทันที (3 วินาที)</span>
                    </button>
                    <p className="text-[10px] text-center text-slate-400 mt-2">
                      ข้อมูลจะถูกบันทึกลง Dashboard เจ้าของร้านและสรุปเข้าบัญชีช่างทันที
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
