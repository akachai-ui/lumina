"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scissors,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Check,
  KeyRound,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check if user came from a valid recovery link
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setHasSession(true);
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();

    // 2. Listen to PASSWORD_RECOVERY event from Supabase URL hash
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setHasSession(true);
        setCheckingSession(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setErrorMessage("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("รหัสผ่านทั้งสองช่องไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        if (error.message.includes("Auth session missing")) {
          throw new Error(
            "ไม่พบสิทธิ์การรีเซ็ตรหัสผ่าน หรือลิงก์หมดอายุแล้ว กรุณากดขอลิงก์รีเซ็ตรหัสผ่านใหม่อีกครั้ง"
          );
        }
        throw new Error(error.message);
      }

      setSuccessMessage(
        "เปลี่ยนรหัสผ่านใหม่สำเร็จเรียบร้อย! กำลังนำคุณเข้าสู่ระบบ..."
      );

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">
            กำลังตรวจสอบสิทธิ์ความปลอดภัย...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-indigo-500 selection:text-white">
      {/* Background Soft Glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-200/40 via-violet-200/30 to-pink-100/20 blur-[130px] -z-10 rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-100/30 blur-[120px] -z-10 rounded-full" />

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
                RESET PASSWORD
              </span>
            </div>
          </Link>
        </div>

        <h2 className="mt-4 sm:mt-6 text-center text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
          ตั้งรหัสผ่านใหม่
        </h2>
        <p className="mt-1.5 text-center text-xs sm:text-sm text-slate-600">
          กำหนดรหัสผ่านใหม่สำหรับเข้าสู่ระบบจัดการร้านของคุณ
        </p>

        {/* Card */}
        <div className="mt-6 bg-white py-6 sm:py-8 px-5 sm:px-10 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200/80 relative">
          {/* If no active recovery session (User visited URL directly without clicking email link) */}
          {!hasSession ? (
            <div className="text-center py-2 space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
                <KeyRound className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  ต้องเข้าผ่านลิงก์ในอีเมล
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  เพื่อความปลอดภัย คุณไม่สามารถเปิดหน้านี้โดยตรงได้ กรุณาขอลิงก์รีเซ็ตรหัสผ่าน แล้วคลิกลิงก์ที่ได้รับจากกล่องจดหมายของคุณครับ
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/forgot-password"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>ไปหน้าขอลิงก์รีเซ็ตรหัสผ่าน</span>
                </Link>
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>กลับหน้าเข้าสู่ระบบ</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {errorMessage && (
                <div className="mb-5 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 sm:p-4 flex items-start gap-2.5 sm:gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
                </div>
              )}

              {/* Success Message */}
              {successMessage ? (
                <div className="text-center py-4 space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">สำเร็จแล้ว!</h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      {successMessage}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdatePassword} className="space-y-4 sm:space-y-5">
                  {/* New Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-xs sm:text-sm font-bold text-slate-700 mb-1"
                    >
                      รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร) *
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
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

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-xs sm:text-sm font-bold text-slate-700 mb-1"
                    >
                      ยืนยันรหัสผ่านใหม่อีกครั้ง *
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-11 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
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
                          <span>กำลังบันทึกรหัสผ่านใหม่...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>บันทึกรหัสผ่านใหม่และเข้าสู่ระบบ</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      <div className="w-full max-w-md mx-auto py-2" />
    </div>
  );
}
