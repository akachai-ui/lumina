"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Scissors,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        throw new Error(error.message);
      }

      setSuccessMessage(
        "ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณเรียบร้อยแล้ว! กรุณาตรวจสอบกล่องจดหมาย (รวมถึงโฟลเดอร์ Junk/Spam)"
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("เกิดข้อผิดพลาดในการส่งอีเมล กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-indigo-500 selection:text-white">
      {/* Background Soft Glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-200/40 via-violet-200/30 to-pink-100/20 blur-[130px] -z-10 rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-100/30 blur-[120px] -z-10 rounded-full" />

      {/* Top Bar */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between mb-4 sm:mb-6 relative z-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>กลับหน้าเข้าสู่ระบบ</span>
        </Link>
        <Link
          href="/"
          className="text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-600"
        >
          หน้าแรก
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md my-auto relative z-10">
        {/* Brand Header */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Scissors className="h-5 w-5 sm:h-6 sm:w-6 rotate-[-45deg]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  LUMINA
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-indigo-700 border border-indigo-200/60">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-500" />
                  Security
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-wide text-slate-400 font-medium -mt-1">
                PASSWORD RECOVERY
              </span>
            </div>
          </Link>
        </div>

        <h2 className="mt-4 sm:mt-6 text-center text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
          ลืมรหัสผ่านใช่ไหม?
        </h2>
        <p className="mt-1.5 text-center text-xs sm:text-sm text-slate-600">
          กรอกอีเมลที่ใช้ลงทะเบียน เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้คุณ
        </p>

        {/* Card */}
        <div className="mt-6 bg-white py-6 sm:py-8 px-5 sm:px-10 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200/80 relative">
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 sm:p-4 flex items-start gap-2.5 sm:gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Success Message */}
          {successMessage ? (
            <div className="text-center py-3 space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">ตรวจสอบกล่องจดหมายของคุณ</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {successMessage}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>กลับไปหน้าเข้าสู่ระบบ</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4 sm:space-y-5">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-bold text-slate-700 mb-1"
                >
                  อีเมลที่ใช้ลงทะเบียน (Email) *
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@yourshop.com"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-3 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 px-4 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.99] disabled:opacity-70 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>กำลังส่งลิงก์...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>ส่งลิงก์รีเซ็ตรหัสผ่าน</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Back to Login Link */}
          {!successMessage && (
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
              จำรหัสผ่านได้แล้ว?{" "}
              <Link
                href="/login"
                className="font-bold text-indigo-600 hover:text-indigo-700 underline decoration-indigo-200 underline-offset-4"
              >
                เข้าสู่ระบบที่นี่
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-md mx-auto py-2" />
    </div>
  );
}
