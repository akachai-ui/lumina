"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {

  LogOut,
  Loader2,
  Gift,
  CheckCircle2,
  Heart,
  Award,
  Mail,
  UserCheck,
  Calendar,
  KeyRound,
  Store,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Check,
  BadgeCheck,
  FileCheck2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";

type Shop = Database["public"]["Tables"]["shops"]["Row"];
type User = {
  id: string;
  email?: string;
  last_sign_in_at?: string;
  created_at?: string;
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    terms_accepted?: boolean;
    terms_accepted_at?: string;
    terms_version?: string;
  };
};

export default function ChecklistPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchSessionAndShop() {
      try {
        const {
          data: { user: currentUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (authError || !currentUser) {
          router.replace("/login");
          return;
        }

        setUser(currentUser as User);

        // Fetch shop
        const { data: shopsData, error: shopError } = await supabase
          .from("shops")
          .select("*")
          .eq("owner_id", currentUser.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (!isMounted) return;

        if (shopError) {
          throw shopError;
        }

        if (shopsData && shopsData.length > 0) {
          setShop(shopsData[0] as Shop);
        }
      } catch (err) {
        console.error("Error loading checklist data:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchSessionAndShop();

    return () => {
      isMounted = false;
    };
  }, [router, refreshKey]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">
            กำลังโหลดรายงานผลการทดสอบ...
          </p>
        </div>
      </div>
    );
  }

  const providerName =
    user?.app_metadata?.provider === "google"
      ? "Google Account (OAuth)"
      : user?.app_metadata?.provider === "facebook"
      ? "Facebook Account (OAuth)"
      : "Email & Password";

  const formattedSignInDate = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "ณ ตอนนี้";

  const isTermsAccepted = user?.user_metadata?.terms_accepted === true;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Header Bar - Clean, Compact & Perfectly Responsive */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2.5">
          {/* Left: Back to Dashboard */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all shadow-2xs active:scale-95 whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>กลับแดชบอร์ด</span>
            </Link>

            {/* Logo Badge (Hidden on mobile to save space) */}
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                LUMINA
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                <BadgeCheck className="w-3 h-3 text-emerald-600" />
                <span>Checklist</span>
              </span>
            </div>
          </div>

          {/* Right Actions: Refresh & Logout */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Refresh Button */}
            <button
              onClick={() => setRefreshKey((prev) => prev + 1)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
              title="รีเฟรชข้อมูล"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="hidden xs:inline">รีเฟรช</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl transition-all active:scale-95 cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
              title="ออกจากระบบ"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-4 sm:py-7 flex-1 space-y-4 sm:space-y-6">
        {/* Top Thank-You Banner */}
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/70 to-indigo-50/70 border border-emerald-200 p-4 sm:p-7 shadow-xs relative overflow-hidden">
          <div className="pointer-events-none absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-300/20 rounded-full blur-2xl" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 relative z-10">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <div className="space-y-1 sm:space-y-1.5">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ผ่านการทดสอบ 100%
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    <Award className="w-3 h-3 text-indigo-500" />
                    Verified Tester
                  </span>
                  {isTermsAccepted && (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <FileCheck2 className="w-3 h-3 text-emerald-600" />
                      PDPA Accepted
                    </span>
                  )}
                </div>

                <h1 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-1.5">
                  <span>ขอขอบคุณ Tester ที่ร่วมทดสอบระบบ!</span>
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500 shrink-0" />
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  การทดสอบระบบสิทธิ์ ยืนยันตัวตน และการยอมรับเงื่อนไข PDPA ของ Lumina ประสบความสำเร็จเรียบร้อย ข้อมูลผู้ใช้ของคุณถูกตรวจสอบและเชื่อมต่อกับระบบ Supabase Cloud อย่างปลอดภัยแล้วครับ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Tester Auth & Session Verification */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200/80 shadow-xs space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                ข้อมูลผลการทดสอบการเข้าสู่ระบบและเงื่อนไข (Auth & Terms Details)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ตรวจสอบสถานะ Session สิทธิ์การเข้าถึง และการบันทึกข้อมูลส่วนบุคคล
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 shrink-0">
              Session Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Tester Name */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>ชื่อผู้ทดสอบ (Tester Name)</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {user?.user_metadata?.full_name || "ไม่ระบุชื่อ"}
              </div>
            </div>

            {/* Email */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>อีเมลที่ใช้ล็อกอิน (Email)</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {user?.email}
              </div>
            </div>

            {/* Auth Provider */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                <span>ช่องทางการเข้าสู่ระบบ (Provider)</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-indigo-700 truncate">
                {providerName}
              </div>
            </div>

            {/* Shop Name */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <Store className="w-3.5 h-3.5 text-indigo-600" />
                <span>ชื่อร้านค้าที่ทดสอบ (Shop Name)</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {shop ? shop.name : "ยังไม่ได้สร้างร้าน"}
              </div>
            </div>

            {/* Package Tier */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <Gift className="w-3.5 h-3.5 text-emerald-600" />
                <span>แพ็กเกจสิทธิ์การใช้งาน (Plan Tier)</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-emerald-700 flex items-center gap-1.5 truncate">
                <span>ทดลองใช้ฟรี 2 เดือน (TRIAL)</span>
              </div>
            </div>

            {/* Last Sign In */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>เข้าสู่ระบบล่าสุด (Last Login)</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
                {formattedSignInDate}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Phase 1 Completion Checklist */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 sm:pb-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Checklist ความพร้อมระบบ Authentication & PDPA (Phase 1)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              สรุปรายการฟังก์ชันสำคัญที่ได้รับการทดสอบและยืนยันผลเรียบร้อยแล้ว
            </p>
          </div>

          <div className="space-y-3">
            {/* Item 1: OAuth & Traditional Auth */}
            <div className="p-3.5 sm:p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    1. ระบบเข้าสู่ระบบแบบผสมผสาน (Hybrid Authentication)
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                    รองรับทั้ง Google OAuth, Facebook OAuth และระบบสมัครด้วย Email & Password พร้อมระบบส่งลิงก์รีเซ็ตรหัสผ่าน
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ผ่านการทดสอบแล้ว</span>
              </span>
            </div>

            {/* Item 2: Free 2-Month Trial Auto Provisioning */}
            <div className="p-3.5 sm:p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    2. สิทธิ์ทดลองใช้งานฟรี 2 เดือนเต็มอัตโนมัติ (60-Day Free Trial)
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                    ผู้สมัครใหม่ทุกคนได้รับสิทธิ์ทดลองใช้ฟรี 60 วันทันทีโดยไม่ต้องกรอกบัตรเครดิต มีระบบนับถอยหลังวันหมดอายุชัดเจน
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ผ่านการทดสอบแล้ว</span>
              </span>
            </div>

            {/* Item 3: Shop Database Isolation & Multi-tenant */}
            <div className="p-3.5 sm:p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    3. การแยกฐานข้อมูลร้านค้าและความปลอดภัย (Row-Level Security)
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                    เจ้าของร้านแต่ละคนจะเข้าถึงได้เฉพาะข้อมูลร้านค้า ช่าง และยอดขายของตนเองเท่านั้น ข้อมูลถูกจัดเก็บปลอดภัยบน Supabase
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ผ่านการทดสอบแล้ว</span>
              </span>
            </div>

            {/* Item 4: Terms & Privacy Consent Modal */}
            <div className="p-3.5 sm:p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    4. ระบบป๊อปอัปยอมรับเงื่อนไขการใช้งาน & PDPA (First-Time Consent)
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                    แสดงเงื่อนไขทดลองใช้ 2 เดือน และนโยบายความลับข้อมูลร้านค้า บันทึกสถานะการยินยอมลง Supabase Auth Metadata อัตโนมัติ
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ผ่านการทดสอบแล้ว</span>
              </span>
            </div>
          </div>

          {/* Action to Dashboard */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                ระบบสิทธิ์และเงื่อนไข PDPA พร้อม 100% สำหรับการเปิดร้านค้าจริง
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                ก้าวสู่เฟสที่ 2: ระบบจัดการร้านค้า บริการ ช่าง และคิดเงิน POS
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all whitespace-nowrap"
            >
              <span>ไปที่แดชบอร์ดร้านค้า</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-3.5 sm:py-4 text-center text-[11px] sm:text-xs text-slate-400 border-t border-slate-200/60 mt-6">
        LUMINA &bull; Salon & Barber Management Platform &bull; Authentication Phase 100% Passed & Verified
      </footer>
    </div>
  );
}
