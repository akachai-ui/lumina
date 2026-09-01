"use client";

import React, { useState } from "react";
import {
  MonitorCheck,
  ReceiptText,
  BarChart3,
  CheckCircle,
  Users,
  FileSpreadsheet,
  Sparkles,
  Wallet,
  TrendingUp,
} from "lucide-react";

export const FeatureShowcase = () => {
  const [activeTab, setActiveTab] = useState<"pos" | "payroll" | "analytics">(
    "pos"
  );

  const tabs = [
    {
      id: "pos" as const,
      name: "Fast POS Terminal",
      subtitle: "ระบบคิดเงินหน้าเคาน์เตอร์",
      icon: MonitorCheck,
      badge: "เร็วกว่าเดิม 5 เท่า",
    },
    {
      id: "payroll" as const,
      name: "Automated Commission",
      subtitle: "คิดค่าคอมฯ & ออกสลิป",
      icon: ReceiptText,
      badge: "อัตโนมัติ 100%",
    },
    {
      id: "analytics" as const,
      name: "Realtime Analytics",
      subtitle: "วิเคราะห์กำไร & สถิติร้าน",
      icon: BarChart3,
      badge: "เรียลไทม์",
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-50 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>FEATURES SHOWCASE</span>
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            ครบทุกเครื่องมือสำคัญสำหรับบริหาร Salon & Barber
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            ออกแบบร่วมกับเจ้าของร้านตัดผมตัวจริง เพื่อความลื่นไหลในทุกขั้นตอน
          </p>
        </div>

        {/* Tab Selection */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm max-w-full overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-indigo-600"}`} />
                  <div className="text-left">
                    <div className="leading-tight">{tab.name}</div>
                    <div
                      className={`text-[11px] font-normal ${
                        isActive ? "text-indigo-100" : "text-slate-400"
                      }`}
                    >
                      {tab.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="mt-10 bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-100 overflow-hidden">
          {/* TAB 1: FAST POS */}
          {activeTab === "pos" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 p-6 sm:p-10 gap-8 items-center animate-in fade-in duration-300">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                  <MonitorCheck className="w-4 h-4 text-indigo-600" />
                  Fast POS Terminal
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  เปิดบิลเร็ว ทันใจลูกค้า <br />
                  <span className="text-indigo-600">
                    ช่างกี่คนใน 1 บิล ก็ไม่มีปัญหา
                  </span>
                </h3>
                <p className="text-slate-600 text-base leading-relaxed">
                  เมื่อลูกค้าเข้ามาตัดผม สระไดร์ และทำสีในคราวเดียว โดยมีช่างคนละคนดูแล
                  Lumina ให้คุณเลือกบริการและระบุช่างแต่ละคนได้ในหน้าจอเดียว
                  คิดเงินเสร็จใน 3 วินาที พร้อมส่งสลิปผ่าน SMS หรือพิมพ์ใบเสร็จ
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700">
                      รองรับ Multi-Service ในบิลเดียว (ตัดผม + สปา + ย้อมสี)
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700">
                      ระบุช่างประจำรายการ พร้อมดึง % ค่าคอมฯ เฉพาะตัวอัตโนมัติ
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700">
                      รับชำระได้หลายวิธี: สแกน PromptPay QR, เงินสด, บัตรเครดิต, หรือแต้มสะสม
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex-1 text-center">
                    <div className="text-xl font-bold text-slate-900">0.3 วินาที</div>
                    <div className="text-xs text-slate-500">ความเร็วในการค้นหาบริการ</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex-1 text-center">
                    <div className="text-xl font-bold text-slate-900">0 กระดาษ</div>
                    <div className="text-xs text-slate-500">ลดการใช้กระดาษจด 100%</div>
                  </div>
                </div>
              </div>

              {/* Graphic Mockup Tab 1 */}
              <div className="lg:col-span-6 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-slate-50 to-violet-50/50 p-4 sm:p-6 border border-slate-200">
                <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-bold text-slate-900 text-sm">
                      ตัวอย่างหน้าจอ POS สำหรับ iPad & Mobile
                    </span>
                    <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                      Fast Checkout Mode
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <div className="p-3 rounded-lg border border-indigo-100 bg-indigo-50/40 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          ตัดผมชายสไตล์ Vintage Pompadour
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Users className="w-3 h-3 text-indigo-500" />
                          ช่างกานต์ &bull; คอมฯ 50% (฿225)
                        </div>
                      </div>
                      <span className="font-bold text-indigo-600 text-sm">฿450</span>
                    </div>

                    <div className="p-3 rounded-lg border border-violet-100 bg-violet-50/30 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          ทรีตเมนต์เคลือบเคราตินบำรุงผม
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Users className="w-3 h-3 text-violet-500" />
                          ช่างมินท์ &bull; คอมฯ 40% (฿480)
                        </div>
                      </div>
                      <span className="font-bold text-violet-600 text-sm">฿1,200</span>
                    </div>
                  </div>

                  <div className="mt-5 p-4 rounded-xl bg-slate-900 text-white space-y-2">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>ยอดชำระสุทธิ (Net Total)</span>
                      <span className="text-base font-extrabold text-white">฿1,650</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-emerald-400 font-medium">
                      <span>กำไรเข้าร้าน (Gross Margin)</span>
                      <span>+ ฿945 (57.3%)</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>รวมค่าคอมฯ แบ่งช่าง</span>
                      <span>฿705</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUTOMATED COMMISSION */}
          {activeTab === "payroll" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 p-6 sm:p-10 gap-8 items-center animate-in fade-in duration-300">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-violet-50 text-violet-700 text-xs font-bold border border-violet-100">
                  <ReceiptText className="w-4 h-4 text-violet-600" />
                  Automated Commission & Payroll
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  คำนวณค่าคอมฯ ช่างแม่นยำ <br />
                  <span className="text-violet-600">ออกสลิปเงินเดือนอัตโนมัติ</span>
                </h3>
                <p className="text-slate-600 text-base leading-relaxed">
                  หมดปัญหาช่างตัดพ้อเรื่องค่าคอมฯ ผิด หรือเจ้าของร้านต้องนั่งอดนอนทำบัญชี
                  Lumina บันทึกทุกรายการที่ช่างลงมือทำทันที
                  และสามารถพิมพ์สลิปส่วนแบ่งหรือส่งตรงเข้า LINE ให้ช่างตรวจสอบได้ทันที
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700">
                      กำหนดเปอร์เซ็นต์ค่าคอมมิชชันต่างกันได้ตามประสบการณ์ช่าง (เช่น 40%, 50%, 60%)
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700">
                      รองรับทั้งเงินเดือนประจำ + ค่าคอมฯ + ค่าทิปลูกค้า
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700">
                      Export ไฟล์รายงานเข้า Excel / CSV ได้ในคลิกเดียว
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-violet-700">
                    <FileSpreadsheet className="w-4 h-4 text-violet-600" />
                    <span>รองรับการออกสลิปเงินเดือน Lumina (PDF / Excel)</span>
                  </div>
                </div>
              </div>

              {/* Graphic Mockup Tab 2 */}
              <div className="lg:col-span-6 rounded-2xl bg-gradient-to-br from-violet-50/70 via-slate-50 to-indigo-50/50 p-4 sm:p-6 border border-slate-200">
                <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xs">
                        TN
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          สลิปสรุปรายได้ช่าง: คุณธนภัทร (ช่างท็อป)
                        </div>
                        <div className="text-[11px] text-slate-400">
                          รอบวันที่: 1 - 31 มี.ค. 2026 &bull; ประจำสาขาสยาม
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      พร้อมจ่าย
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">เงินเดือนประจำ (Base Salary)</span>
                      <span className="font-semibold text-slate-800">฿15,000</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">ยอดบิลทั้งหมดที่ให้บริการ (84 หัว)</span>
                      <span className="font-semibold text-slate-800">฿54,600</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 text-indigo-600 font-semibold">
                      <span>ค่าคอมมิชชันเฉลี่ย 45% (Commission)</span>
                      <span>+ ฿24,570</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 text-amber-600 font-semibold">
                      <span>ทิปลูกค้ารวม (Customer Tips)</span>
                      <span>+ ฿2,400</span>
                    </div>
                    <div className="flex justify-between py-1 text-rose-500">
                      <span>หักประกันสังคม / ภาษี ณ ที่จ่าย</span>
                      <span>- ฿750</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">
                        ยอดโอนสุทธิเข้าบัญชีช่าง
                      </div>
                      <div className="text-xs font-medium text-slate-200">
                        กสิกรไทย xxx-2-8912-x
                      </div>
                    </div>
                    <span className="text-lg font-black text-emerald-400">
                      ฿41,220
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REALTIME FINANCIAL ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 p-6 sm:p-10 gap-8 items-center animate-in fade-in duration-300">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  Realtime Financial Analytics
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  รู้ยอดขายและกำไรเรียลไทม์ <br />
                  <span className="text-emerald-600">
                    แยกเงินสด vs โอนแม่นยำ ไม่ต้องกลัวเงินรั่วไหล
                  </span>
                </h3>
                <p className="text-slate-600 text-base leading-relaxed">
                  เจ้าของร้านไม่ต้องนั่งเฝ้าเคาน์เตอร์ตลอดเวลา แค่เปิดแอป Lumina
                  บนมือถือก็สามารถตรวจสอบยอดขายรายชั่วโมง, สัดส่วนเงินสดกับเงินโอนเข้าบัญชี,
                  และจัดอันดับช่างยอดนิยมได้ทันที
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700">
                      สรุปแยกยอดเงินสด vs โอนผ่าน PromptPay เช็กยอดบัญชีได้เป๊ะๆ
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700">
                      วิเคราะห์ชั่วโมงพีค (Peak Hours) เพื่อจัดตารางกะช่างให้เหมาะสม
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700">
                      รายงานสินค้า/บริการขายดี และลูกค้าที่มีการกลับมาใช้ซ้ำ (Retention)
                    </span>
                  </div>
                </div>
              </div>

              {/* Graphic Mockup Tab 3 */}
              <div className="lg:col-span-6 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-slate-50 to-indigo-50/50 p-4 sm:p-6 border border-slate-200">
                <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        รายงานผลประกอบการวันนี้
                      </span>
                      <span className="text-xs text-slate-400">อัปเดตอัตโนมัติ ณ ตอนนี้</span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      +28.4% เทียบสัปดาห์ก่อน
                    </span>
                  </div>

                  {/* 3 Metric Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <Wallet className="w-3.5 h-3.5 text-indigo-500" /> ยอดขายรวม (Gross)
                      </div>
                      <div className="text-lg font-black text-slate-900 mt-1">
                        ฿38,450
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-100">
                      <div className="text-[11px] font-medium text-emerald-800 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> กำไรขั้นต้นสุทธิ
                      </div>
                      <div className="text-lg font-black text-emerald-600 mt-1">
                        ฿21,800
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods Split */}
                  <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/60">
                    <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                      <span>สัดส่วนช่องทางชำระเงิน</span>
                      <span className="text-[11px] font-normal text-slate-500">42 บิลวันนี้</span>
                    </div>
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                      <div className="h-full bg-indigo-600 w-[68%]" title="โอนสแกน QR 68%"></div>
                      <div className="h-full bg-emerald-500 w-[24%]" title="บัตรเครดิต 24%"></div>
                      <div className="h-full bg-amber-400 w-[8%]" title="เงินสด 8%"></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-indigo-600"></span> สแกน QR (68%)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span> บัตรเครดิต (24%)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-amber-400"></span> เงินสด (8%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
