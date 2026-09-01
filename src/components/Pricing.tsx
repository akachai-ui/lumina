"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { PricingPlan } from "../types/landing";

const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 590,
    priceAnnual: 470, // 20% discount
    description: "สำหรับร้านขนาดเล็ก เริ่มต้นธุรกิจ ช่าง 1-2 คน",
    targetAudience: "ช่าง 1 - 2 คน",
    features: [
      "เปิดบิลขาย POS ไม่จำกัดจำนวน",
      "รองรับการใช้งานบนมือถือ & แท็บเล็ต",
      "สรุปยอดขายรายวันและแยกเงินสด/โอน",
      "ระบบประวัติลูกค้าและเบอร์ติดต่อ",
      "พิมพ์ใบเสร็จและแชร์สลิปผ่าน LINE",
      "ระบบสำรองข้อมูลอัตโนมัติทุกวัน",
    ],
    ctaText: "ทดลองใช้ฟรี 2 เดือน",
    popular: false,
  },
  {
    id: "growth",
    name: "Growth",
    badge: "ยอดนิยมสำหรับร้านมาตรฐาน",
    priceMonthly: 1290,
    priceAnnual: 990, // ~23% discount
    description: "สำหรับร้านขนาดกลาง ช่าง 3-6 คน ที่ต้องการบริหารส่วนแบ่งช่าง",
    targetAudience: "ช่าง 3 - 6 คน",
    features: [
      "ทุกฟีเจอร์ในแพ็กเกจ Starter",
      "คำนวณค่าคอมมิชชันช่างแยกเรทรายคนอัตโนมัติ",
      "รองรับช่างหลายคนและ Multi-service ใน 1 บิล",
      "สรุปกำไรขั้นต้น (Net Margin) เรียลไทม์",
      "กราฟสถิติยอดขาย & อันดับช่างดาวเด่น",
      "ระบบจัดการสต็อกน้ำยาและสินค้าหน้าร้าน",
      "ระบบจองคิวออนไลน์สำหรับลูกค้า",
    ],
    ctaText: "เริ่มต้นทดลองใช้แผน Growth",
    popular: true,
    highlightColor: "indigo",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    badge: "ครบวงจรสำหรับร้านใหญ่",
    priceMonthly: 2490,
    priceAnnual: 1990, // ~20% discount
    description: "สำหรับร้านซาลอนขนาดใหญ่ หรือร้านที่มีหลายสาขา",
    targetAudience: "ไม่จำกัดจำนวนช่าง & หลายสาขา",
    features: [
      "ทุกฟีเจอร์ในแพ็กเกจ Growth ทั้งหมด",
      "ไม่จำกัดจำนวนช่าง และไม่จำกัดอุปกรณ์",
      "ระบบออกสลิปเงินเดือนช่างอัตโนมัติ (PDF)",
      "Export รายงานทางบัญชี Excel / CSV ได้ทันที",
      "ระบบบริหารหลายสาขา (Multi-Branch Dashboard)",
      "เชื่อมต่อ API และระบบสมาชิกขั้นสูง",
      "ทีมงานดูแลพิเศษ Fast-track Support 24/7",
    ],
    ctaText: "ติดต่อฝ่ายขาย / ทดลองใช้",
    popular: false,
  },
];

export const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-20 bg-white relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>TRANSPARENT PRICING</span>
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            แผนราคาสุดคุ้ม เลือกระดับที่พอดีกับร้านคุณ
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            ไม่มีค่าติดตั้งแรกเข้า ไม่ผูกมัดรายปี ยกเลิกเมื่อไหร่ก็ได้
            ทดลองใช้ฟรีเต็มรูปแบบ 2 เดือน
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span
              className={`text-sm font-semibold cursor-pointer ${
                !isAnnual ? "text-slate-900" : "text-slate-500"
              }`}
              onClick={() => setIsAnnual(false)}
            >
              ชำระรายเดือน
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              type="button"
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isAnnual ? "bg-indigo-600" : "bg-slate-300"
              }`}
              role="switch"
              aria-checked={isAnnual}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isAnnual ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <div
              className="flex items-center gap-1.5 cursor-pointer"
              onClick={() => setIsAnnual(true)}
            >
              <span
                className={`text-sm font-semibold ${
                  isAnnual ? "text-slate-900" : "text-slate-500"
                }`}
              >
                ชำระรายปี
              </span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2 py-0.5 border border-emerald-200">
                ประหยัด 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-200 ${
                  plan.popular
                    ? "border-2 border-indigo-600 bg-white shadow-2xl shadow-indigo-600/10 lg:-translate-y-2"
                    : "border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-lg"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1 text-xs font-bold text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{plan.badge || "ยอดนิยม"}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-200/70 text-slate-700">
                      {plan.targetAudience}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-500 min-h-[34px]">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">
                      ฿{price.toLocaleString()}
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                      / เดือน
                    </span>
                  </div>
                  {isAnnual && (
                    <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                      (เรียกเก็บ ฿{(price * 12).toLocaleString()} ต่อปี)
                    </div>
                  )}

                  {/* Feature Checklist */}
                  <div className="mt-8 space-y-3.5 pt-6 border-t border-slate-200/80">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      ฟีเจอร์ที่ได้รับ:
                    </div>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                            plan.popular
                              ? "bg-indigo-600 text-white"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          <Check className="h-3 w-3 stroke-[2.5]" />
                        </div>
                        <span className="text-xs sm:text-sm text-slate-700 leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-10">
                  <Link
                    href={`/register?plan=${plan.id}&billing=${isAnnual ? "annual" : "monthly"}`}
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 text-sm font-semibold transition-all shadow-sm ${
                      plan.popular
                        ? "bg-indigo-600 text-white shadow-indigo-600/25 hover:bg-indigo-700 hover:shadow-indigo-600/35"
                        : "bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing FAQ Footnote */}
        <div className="mt-12 text-center text-xs text-slate-500">
          มีข้อสงสัยเรื่องแพ็กเกจหรือต้องการปรับแต่งสำหรับแฟรนไชส์มากกว่า 5 สาขา?{" "}
          <a
            href="#contact"
            className="font-semibold text-indigo-600 hover:underline"
          >
            พูดคุยกับที่ปรึกษาของเรา &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};
