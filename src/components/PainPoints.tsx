import React from "react";
import {
  Calculator,
  Zap,
  TrendingUp,
  XCircle,
  CheckCircle2,
  Sparkles,
  Clock,
} from "lucide-react";

export const PainPoints = () => {
  const points = [
    {
      id: "commission",
      icon: Calculator,
      title: "คิดค่าคอมมิชชันช่างไม่ผิดพลาด",
      highlightText: "หักส่วนแบ่งอัตโนมัติตามเรทช่างแต่ละคนในบิลเดียว",
      badCase: "จดมือใส่สมุด สิ้นเดือนนั่งกดเครื่องคิดเลขทีละบิล คิดผิด ช่างเคือง",
      goodCase: "ระบบคำนวณแยกช่างแต่ละบริการในบิลเดียวกันทันที ชัดเจน โปร่งใส 100%",
      accent: "indigo",
    },
    {
      id: "fast-checkout",
      icon: Zap,
      title: "เปิดบิลเร็ว รับลูกค้าลื่นไหล",
      highlightText: "แตะเลือกบริการ 3 วินาทีเสร็จ ไม่ต้องรอคิว",
      badCase: "ลูกค้าต่อคิวจ่ายเงินนาน พนักงานสับสนราคาโปรโมชั่น บิลตกหล่น",
      goodCase: "แตะ 3 ครั้งผ่าน iPad จบการขาย รองรับทั้งโอน สแกน QR บัตรเครดิต หรือเงินสด",
      accent: "violet",
    },
    {
      id: "realtime-profit",
      icon: TrendingUp,
      title: "รู้กำไรขั้นต้นและยอดขายทันที",
      highlightText: "ดูกราฟวิเคราะห์รายได้ผ่านมือถือได้ทุกที่ ทุกเวลา",
      badCase: "ไม่รู้ว่าเดือนนี้เหลือกำไรจริงเท่าไหร่ ยอดขายดีแต่เงินในบัญชีหายไปไหน",
      goodCase: "เห็นต้นทุน ค่าแรง ค่าคอมฯ และกำไรสุทธิแบบ Real-time เจ้าของร้านสบายใจ",
      accent: "emerald",
    },
  ];

  return (
    <section id="highlights" className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3.5 py-1 text-xs font-bold text-violet-700 border border-violet-100">
            <Sparkles className="w-3.5 h-3.5 text-violet-500" />
            <span>PAIN POINTS VS LUMINA SOLUTION</span>
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            เปลี่ยนความปวดหัวในร้านตัดผม ให้กลายเป็นความง่ายดาย
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            เราเข้าใจปัญหาของเจ้าของร้านซาลอนและบาร์เบอร์ Lumina จึงถูกออกแบบมาเพื่อแก้ปัญหาเหล่านี้โดยเฉพาะ
          </p>
        </div>

        {/* 3 Grid Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {points.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className="group relative rounded-2xl border border-slate-200/90 bg-slate-50/50 p-6 sm:p-8 hover:bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon */}
                  <div className="flex items-center justify-between">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      VALUE PROP
                    </span>
                  </div>

                  {/* Title & Highlight */}
                  <h3 className="mt-5 text-xl font-bold text-slate-900 leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-indigo-600 leading-relaxed">
                    {p.highlightText}
                  </p>

                  {/* Comparison Box */}
                  <div className="mt-6 space-y-3 pt-5 border-t border-slate-200/80 text-xs sm:text-sm">
                    {/* Before / Bad */}
                    <div className="flex items-start gap-2.5 rounded-xl bg-rose-50/70 p-3 text-slate-700 border border-rose-100">
                      <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-rose-900 block text-[11px] uppercase tracking-wider mb-0.5">
                          เมื่อก่อน (ก่อนใช้ Lumina)
                        </span>
                        <span className="text-slate-600 leading-relaxed text-xs">
                          {p.badCase}
                        </span>
                      </div>
                    </div>

                    {/* After / Good */}
                    <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50/80 p-3 text-slate-700 border border-emerald-100">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-emerald-900 block text-[11px] uppercase tracking-wider mb-0.5">
                          ปัจจุบันด้วย Lumina
                        </span>
                        <span className="text-slate-700 font-medium leading-relaxed text-xs">
                          {p.goodCase}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> ประหยัดเวลา 15+ ชม./เดือน
                  </span>
                  <span className="text-indigo-600 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center">
                    เรียนรู้เพิ่มเติม &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
