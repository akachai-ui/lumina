import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

export const CtaBanner = () => {
  return (
    <section className="py-16 bg-slate-50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 px-6 py-12 sm:px-12 sm:py-16 text-center text-white shadow-2xl shadow-indigo-900/20">
          {/* Background pattern */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />

          {/* Badge */}
          <div className="relative inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/20">
            <Sparkles className="h-3.5 w-3.5 text-violet-200" />
            <span>เริ่มต้นฟรี 2 เดือนเต็ม &bull; ไม่มีข้อผูกมัดใดๆ</span>
          </div>

          {/* Headline */}
          <h2 className="relative mt-6 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            พร้อมยกระดับการจัดการร้านของคุณแล้วหรือยัง?
          </h2>

          <p className="relative mt-4 text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto font-normal">
            เข้าร่วมกับร้านซาลอนและบาร์เบอร์ชั้นนำทั่วประเทศที่เลือกใช้ Lumina
            เพื่อเพิ่มกำไรและประหยัดเวลาการทำบัญชีส่วนแบ่งช่าง
          </p>

          {/* CTA Buttons */}
          <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-indigo-700 shadow-lg shadow-indigo-950/20 hover:bg-indigo-50 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span>สมัครทดลองใช้งานฟรีทันที</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-7 py-4 text-base font-semibold text-white backdrop-blur-sm border border-white/20 hover:bg-white/20 active:scale-95 transition-all"
            >
              <span>นัดหมายเพื่อชมตัวอย่างระบบ</span>
            </Link>
          </div>

          {/* Highlights */}
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-indigo-100/90 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              ทดลองครบทุกฟีเจอร์ 2 เดือน
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              ข้อมูลปลอดภัยด้วย Cloud มาตรฐานสากล
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              มีทีมงานคนไทยสอนใช้งานผ่าน LINE & โทร
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
