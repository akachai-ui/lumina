"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scissors,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Store,
  Phone,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Gift,
  Zap,
  ShieldCheck,
  Clock,
  Smartphone,
  CheckCircle,
} from "lucide-react";
import { Provider } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";

function RegisterContent() {
  const router = useRouter();

  // Registration Method Tabs: 'social' | 'email'
  const [signupMethod, setSignupMethod] = useState<"social" | "email">("social");

  // Form Fields (Email Sign-up)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");

  // States
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Social Sign-Up (Google / Facebook) - 100% 1-Click
  const handleOAuthSignUp = async (provider: Provider) => {
    setErrorMessage(null);
    setOauthLoading(provider);

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

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(`ไม่สามารถสมัครด้วย ${provider} ได้ในขณะนี้`);
      }
      setOauthLoading(null);
    }
  };

  // Traditional Email & Password Sign-Up
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setErrorMessage("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (!shopName.trim()) {
      setErrorMessage("กรุณาระบุชื่อร้านซาลอน / บาร์เบอร์ของคุณ");
      return;
    }

    setLoading(true);

    try {
      // 1. Sign up user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            shop_name: shopName.trim(),
          },
        },
      });

      if (authError) {
        if (authError.message.includes("User already registered")) {
          throw new Error("อีเมลนี้ถูกลงทะเบียนไว้แล้ว กรุณาเข้าสู่ระบบ หรือใช้อีเมลอื่น");
        }
        throw new Error(authError.message);
      }

      const user = authData.user;
      if (!user) {
        throw new Error("ไม่สามารถสร้างบัญชีผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง");
      }

      // 2. Create the Shop in 'shops' table with 2-month trial
      const slug =
        shopName
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-") +
        "-" +
        Math.floor(Math.random() * 10000);

      // 60 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 60);

      type ShopInsert = Database["public"]["Tables"]["shops"]["Insert"];
      const newShop: ShopInsert = {
        name: shopName.trim(),
        phone: phone.trim() || null,
        owner_id: user.id,
        plan_tier: "trial",
        plan_status: "trial",
        plan_expires_at: expiresAt.toISOString(),
        slug: slug,
      };

      const { error: shopError } = await (
        supabase.from("shops") as ReturnType<typeof supabase.from>
      ).insert([newShop] as never);

      if (shopError) {
        console.warn("Shop auto-insert error:", shopError.message);
      }

      setSuccessMessage("สมัครสมาชิกสำเร็จ! เริ่มต้นทดลองใช้ฟรี 2 เดือนเต็ม กำลังพาเข้าแดชบอร์ด...");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-4 sm:py-8 px-3.5 sm:px-6 lg:px-8 relative selection:bg-indigo-500 selection:text-white">
      {/* Ambient Lighting Background */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-indigo-200/40 via-violet-200/30 to-pink-100/20 blur-[140px] -z-10 rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[450px] h-[450px] bg-indigo-100/30 blur-[130px] -z-10 rounded-full" />

      {/* Top Header Bar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between mb-4 sm:mb-6 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs active:scale-95 transition-all whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>กลับหน้าแรก</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">มีบัญชีร้านค้าอยู่แล้ว?</span>
          <Link
            href="/login"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3.5 py-1.5 rounded-xl border border-indigo-200/70 transition-colors whitespace-nowrap"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>

      {/* Main Container - Split Layout on Desktop / Tablet Landscape */}
      <div className="w-full max-w-6xl mx-auto my-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Membership Benefits & Privilege Overview */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5">
          {/* Logo & Headline */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform shrink-0">
                <Scissors className="h-5 w-5 sm:h-6 sm:w-6 rotate-[-45deg]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    LUMINA
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-emerald-700 border border-emerald-200">
                    TRIAL 2 เดือน
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider -mt-1">
                  SALON MANAGEMENT SAAS
                </span>
              </div>
            </Link>

            <h1 className="mt-4 text-xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
              สมัครสมาชิกเปิดร้านค้าใหม่
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              เลือกวิธีการสมัครที่สะดวกที่สุดสำหรับคุณ เริ่มต้นเปิดบิลและจัดการร้านได้ทันทีใน 2 นาที
            </p>
          </div>

          {/* Membership Plan Tier Card: Trial 2 Months (Highlight Card) */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-indigo-800/40 relative overflow-hidden">
            <div className="pointer-events-none absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl" />

            <div className="relative z-10 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                  <Gift className="w-3.5 h-3.5 text-emerald-400" />
                  <span>สิทธิ์การใช้งาน: ทดลองใช้ฟรี 60 วัน</span>
                </span>
                <span className="text-lg font-black text-amber-300">฿0</span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  ปลดล็อกครบทุกฟังก์ชัน (Full All-Access)
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  ไม่มีค่าบริการแรกเข้า &bull; ไม่ต้องผูกบัตรเครดิต &bull; ยกเลิกได้ตลอดเวลา
                </p>
              </div>

              <div className="pt-2 border-t border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>คิดเงินไว POS ไม่จำกัดจำนวนบิล</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>เพิ่มช่าง กำหนด % ค่าคอมฯ ได้ไม่จำกัด</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>รายงานสรุปรายได้และสถิติร้านแบบเรียลไทม์</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>รองรับทั้ง มือถือ แท็บเล็ต และคอมพิวเตอร์</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-3 text-center shadow-2xs">
              <Clock className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
              <div className="text-[11px] font-extrabold text-slate-800">เปิดร้านใน 2 นาที</div>
              <div className="text-[9px] text-slate-400">รวดเร็ว ทันใจ</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-3 text-center shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-[11px] font-extrabold text-slate-800">มาตรฐาน PDPA</div>
              <div className="text-[9px] text-slate-400">ข้อมูลปลอดภัย 100%</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-3 text-center shadow-2xs">
              <Smartphone className="w-4 h-4 text-violet-600 mx-auto mb-1" />
              <div className="text-[11px] font-extrabold text-slate-800">ใช้ได้ทุกอุปกรณ์</div>
              <div className="text-[9px] text-slate-400">iOS, Android, PC</div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Registration Card with Categorized Tabs */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/70 border border-slate-200/90">
          {/* Section Header: Choose Registration Category */}
          <div className="mb-5 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>เลือกรูปแบบการสมัครสมาชิก</span>
            </div>

            {/* UX Segmented Tab Control */}
            <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/70">
              {/* Tab 1: Fast Social Sign-Up */}
              <button
                type="button"
                onClick={() => setSignupMethod("social")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  signupMethod === "social"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Zap className={`w-4 h-4 ${signupMethod === "social" ? "text-amber-500 fill-amber-500" : "text-slate-400"}`} />
                <span>1. สมัครด่วน (Social)</span>
              </button>

              {/* Tab 2: Traditional Email Sign-Up */}
              <button
                type="button"
                onClick={() => setSignupMethod("email")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  signupMethod === "email"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Mail className={`w-4 h-4 ${signupMethod === "email" ? "text-indigo-600" : "text-slate-400"}`} />
                <span>2. สมัครด้วยอีเมล</span>
              </button>
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-4 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 flex items-start gap-2.5 text-rose-800 text-xs sm:text-sm animate-in fade-in">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-start gap-2.5 text-emerald-800 text-xs sm:text-sm animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          {/* CATEGORY 1: FAST SOCIAL SIGN-UP (Clean 1-Click with No Redundant Inputs) */}
          {signupMethod === "social" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 via-indigo-50/50 to-purple-50/50 border border-amber-200/70 text-xs text-slate-700 space-y-1.5">
                <div className="font-bold text-amber-900 flex items-center gap-1.5 text-sm">
                  <Zap className="w-4 h-4 text-amber-600 fill-amber-600" />
                  <span>คลิกเดียวเข้าใช้งานได้ทันที</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  เลือกเชื่อมต่อผ่าน Google หรือ Facebook ได้ทันทีโดยไม่ต้องจำรหัสผ่าน เมื่อเข้าสู่แดชบอร์ดระบบจะมีหน้าจอให้คุณตั้งชื่อร้านค้าและเริ่มเปิดบิลได้ทันที
                </p>
              </div>

              {/* Social Buttons */}
              <div className="space-y-3 pt-1">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => handleOAuthSignUp("google")}
                  disabled={!!oauthLoading}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white py-3.5 px-4 text-xs sm:text-sm font-bold text-slate-800 shadow-xs hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
                >
                  {oauthLoading === "google" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                  ) : (
                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
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
                  <span>
                    {oauthLoading === "google"
                      ? "กำลังเชื่อมต่อกับ Google..."
                      : "สมัครทดลองใช้ฟรี 2 เดือนด้วย Google"}
                  </span>
                </button>

                {/* Facebook Button */}
                <button
                  type="button"
                  onClick={() => handleOAuthSignUp("facebook")}
                  disabled={!!oauthLoading}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl border border-[#1877F2]/30 bg-[#1877F2] text-white py-3.5 px-4 text-xs sm:text-sm font-bold shadow-xs hover:bg-[#166fe5] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
                >
                  {oauthLoading === "facebook" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <svg className="h-5 w-5 shrink-0 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  )}
                  <span>
                    {oauthLoading === "facebook"
                      ? "กำลังเชื่อมต่อกับ Facebook..."
                      : "สมัครทดลองใช้ฟรี 2 เดือนด้วย Facebook"}
                  </span>
                </button>
              </div>

              <div className="text-center pt-3">
                <button
                  type="button"
                  onClick={() => setSignupMethod("email")}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline decoration-indigo-200 underline-offset-4 cursor-pointer"
                >
                  ต้องการกำหนดอีเมลและตั้งรหัสผ่านเอง? คลิกที่นี่
                </button>
              </div>
            </div>
          )}

          {/* CATEGORY 2: TRADITIONAL EMAIL & PASSWORD SIGN-UP */}
          {signupMethod === "email" && (
            <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in duration-150">
              {/* Group A: Shop Information */}
              <div className="space-y-3 pt-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                  <Store className="w-3.5 h-3.5 text-indigo-600" />
                  <span>หมวดที่ 1: ข้อมูลร้านค้าของคุณ</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อร้านซาลอน / บาร์เบอร์ (Shop Name) *
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Store className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="เช่น The Gentleman Barber & Salon"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 py-2.5 sm:py-3 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    เบอร์โทรศัพท์ร้าน (Phone Number)
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081-xxx-xxxx"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 py-2.5 sm:py-3 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    />
                  </div>
                </div>
              </div>

              {/* Group B: Owner Account Credentials */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>หมวดที่ 2: บัญชีผู้ดูแลระบบ (เจ้าของร้าน)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อ-นามสกุลของคุณ (Owner Name)
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="เช่น สมชาย ใจดี"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 py-2.5 sm:py-3 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    อีเมลสำหรับเข้าสู่ระบบ (Email) *
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@yourshop.com"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 py-2.5 sm:py-3 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    รหัสผ่าน (Password อย่างน้อย 6 ตัวอักษร) *
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-11 py-2.5 sm:py-3 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Email Registration */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 px-4 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-[0.99] disabled:opacity-70 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>กำลังสร้างบัญชีร้านค้า...</span>
                    </>
                  ) : (
                    <>
                      <span>เปิดร้านและเริ่มทดลองใช้ฟรี 2 เดือนเต็ม</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Switch to Login Footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            มีบัญชีร้านค้าอยู่แล้ว?{" "}
            <Link
              href="/login"
              className="font-bold text-indigo-600 hover:text-indigo-700 underline decoration-indigo-200 underline-offset-4"
            >
              เข้าสู่ระบบที่นี่
            </Link>
          </div>
        </div>
      </div>

      {/* Clean Bottom Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 py-3 sm:py-4 text-center text-[11px] sm:text-xs text-slate-400 border-t border-slate-200/60 mt-6 relative z-10">
        LUMINA &bull; แพลตฟอร์มบริหารร้านซาลอนและบาร์เบอร์ยุคใหม่ &bull; สิทธิ์ทดลองใช้งานฟรี 2 เดือนเต็ม
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
