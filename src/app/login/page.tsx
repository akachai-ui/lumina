"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scissors,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Provider } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error(
            "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง หรือเข้าสู่ระบบด้วย Google / Facebook ด้านบน"
          );
        } else if (error.message.includes("Email not confirmed")) {
          throw new Error("อีเมลนี้ยังไม่ได้ยืนยันตัวตน กรุณาตรวจสอบกล่องจดหมายของคุณ");
        }
        throw new Error(error.message);
      }

      if (data.user) {
        setSuccessMessage("เข้าสู่ระบบสำเร็จ! กำลังนำคุณเข้าสู่แดชบอร์ด...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: Provider) => {
    setErrorMessage(null);
    setOauthLoading(provider);

    // Auto unlock if user cancels or takes too long
    const timeout = setTimeout(() => {
      setOauthLoading(null);
    }, 6000);

    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/dashboard`
          : undefined;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Explicit navigation fallback for Mobile Safari / Chrome
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(`ไม่สามารถเชื่อมต่อการเข้าสู่ระบบด้วย ${provider} ได้ในขณะนี้`);
      }
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-indigo-500 selection:text-white">
      {/* Background Soft Glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-200/40 via-violet-200/30 to-pink-100/20 blur-[130px] -z-10 rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-100/30 blur-[120px] -z-10 rounded-full" />

      {/* Top Bar - Clean & Non-redundant */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between mb-4 sm:mb-6 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>กลับหน้าแรก</span>
        </Link>
        <Link
          href="/register"
          className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200/60"
        >
          เปิดร้านใหม่ฟรี 2 เดือน
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
                  SaaS
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-wide text-slate-400 font-medium -mt-1">
                SALON & BARBER PLATFORM
              </span>
            </div>
          </Link>
        </div>

        <h2 className="mt-4 sm:mt-6 text-center text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
          เข้าสู่ระบบจัดการร้าน
        </h2>
        <p className="mt-1.5 text-center text-xs sm:text-sm text-slate-600">
          เปิดบิล POS สรุปค่าคอมมิชชันช่าง และดูกำไรเรียลไทม์
        </p>

        {/* Form Card */}
        <div className="mt-6 bg-white py-6 sm:py-8 px-5 sm:px-10 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200/80 relative">
          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-5 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 sm:p-4 flex items-start gap-2.5 sm:gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Success Message Banner */}
          {successMessage && (
            <div className="mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 sm:p-4 flex items-start gap-2.5 sm:gap-3 text-emerald-800 text-xs sm:text-sm animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          {/* Social OAuth Buttons (Google & Facebook) */}
          <div className="mb-5 space-y-2.5 sm:space-y-3">
            {/* Google Button */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("google")}
              disabled={!!oauthLoading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 touch-manipulation"
            >
              {oauthLoading === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
              ) : (
                <svg className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              <span>{oauthLoading === "google" ? "กำลังเชื่อมต่อ Google..." : "เข้าสู่ระบบด้วย Google"}</span>
            </button>

            {/* Facebook Button */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("facebook")}
              disabled={!!oauthLoading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#1877F2]/30 bg-[#1877F2] text-white py-3 px-4 text-xs sm:text-sm font-semibold shadow-2xs hover:bg-[#166fe5] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 touch-manipulation"
            >
              {oauthLoading === "facebook" ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <svg className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              )}
              <span>{oauthLoading === "facebook" ? "กำลังเชื่อมต่อ Facebook..." : "เข้าสู่ระบบด้วย Facebook"}</span>
            </button>

            <div className="relative mt-5 flex items-center justify-center pt-1">
              <div className="w-full border-t border-slate-200" />
              <span className="absolute bg-white px-3 text-[11px] sm:text-xs text-slate-400 font-medium">
                หรือใช้อีเมลและรหัสผ่าน
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-bold text-slate-700 mb-1"
              >
                อีเมลเจ้าของร้าน (Email)
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
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-bold text-slate-700"
                >
                  รหัสผ่าน (Password)
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] sm:text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  ลืมรหัสผ่าน?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-11 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs sm:text-sm text-slate-600 cursor-pointer"
                >
                  จดจำการเข้าสู่ระบบไว้ในเครื่องนี้
                </label>
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
                    <span>กำลังเข้าสู่ระบบ...</span>
                  </>
                ) : (
                  <>
                    <span>เข้าสู่ระบบด้วยอีเมล</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Prominent Register Callout Button */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-2.5">ยังไม่มีบัญชีร้านซาลอน / บาร์เบอร์?</p>
            <Link
              href="/register"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-indigo-200 bg-indigo-50/70 text-xs sm:text-sm font-bold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 active:scale-95 transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>สมัครเปิดร้านใหม่ &bull; ทดลองใช้ฟรี 2 เดือนเต็ม</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Empty spacer for bottom balance */}
      <div className="w-full max-w-md mx-auto py-2" />
    </div>
  );
}
