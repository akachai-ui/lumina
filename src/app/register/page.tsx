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
  Check,
} from "lucide-react";
import { Provider } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";

function RegisterContent() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setErrorMessage("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (!shopName.trim()) {
      setErrorMessage("กรุณาระบุชื่อร้านค้าของคุณ");
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-indigo-500 selection:text-white">
      {/* Background Glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-200/40 via-violet-200/30 to-pink-100/20 blur-[130px] -z-10 rounded-full" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-100/30 blur-[120px] -z-10 rounded-full" />

      {/* Top Bar */}
      <div className="w-full max-w-lg mx-auto flex items-center justify-between mb-4 sm:mb-6 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>กลับหน้าแรก</span>
        </Link>
        <Link
          href="/login"
          className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200/60"
        >
          มีบัญชีแล้ว? เข้าสู่ระบบ
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg my-auto relative z-10">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Scissors className="h-5 w-5 sm:h-6 sm:w-6 rotate-[-45deg]" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  LUMINA
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  <Gift className="w-3 h-3 text-emerald-600" />
                  ฟรี 2 เดือนเต็ม
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-wide text-slate-400 font-medium -mt-1">
                ทดลองใช้ฟรี 60 วัน &bull; ปลดล็อกครบทุกฟังก์ชัน
              </span>
            </div>
          </Link>

          <h2 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            ลงทะเบียนเปิดร้านค้าใหม่
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            ไม่มีค่าบริการ ไม่ต้องกรอกบัตรเครดิต เริ่มเปิดบิลได้ใน 2 นาที
          </p>
        </div>

        {/* Free 2-Month All-Access Banner */}
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 p-3.5 sm:p-4 text-left shadow-xs">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs sm:text-sm">
            <Gift className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>สิทธิ์พิเศษทดลองใช้ฟรี 2 เดือนเต็ม (All-Access 60 Days)</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] sm:text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>เปิดบิล POS ได้ไม่จำกัด</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>เพิ่มช่างได้ไม่จำกัด</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>คำนวณค่าคอมฯ อัตโนมัติ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>ครบกำหนดค่อยเลือกแพ็กเกจ</span>
            </div>
          </div>
        </div>

        {/* Register Form Card */}
        <div className="mt-5 bg-white py-6 sm:py-8 px-5 sm:px-8 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200/80">
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

          {/* 1-Click Social Sign-Up */}
          <div className="mb-5 space-y-2.5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>สมัครด่วนในคลิกเดียว (แนะนำ)</span>
            </div>

            {/* Google Quick Sign-Up */}
            <button
              type="button"
              onClick={() => handleOAuthSignUp("google")}
              disabled={!!oauthLoading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-2.5 sm:py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 touch-manipulation"
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
              <span>
                {oauthLoading === "google"
                  ? "กำลังสมัครด้วย Google..."
                  : "สมัครทดลองใช้ฟรี 2 เดือนด้วย Google"}
              </span>
            </button>

            {/* Facebook Quick Sign-Up */}
            <button
              type="button"
              onClick={() => handleOAuthSignUp("facebook")}
              disabled={!!oauthLoading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#1877F2]/30 bg-[#1877F2] text-white py-2.5 sm:py-3 px-4 text-xs sm:text-sm font-semibold shadow-2xs hover:bg-[#166fe5] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 touch-manipulation"
            >
              {oauthLoading === "facebook" ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <svg className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              )}
              <span>
                {oauthLoading === "facebook"
                  ? "กำลังสมัครด้วย Facebook..."
                  : "สมัครทดลองใช้ฟรี 2 เดือนด้วย Facebook"}
              </span>
            </button>

            <div className="relative mt-5 flex items-center justify-center pt-2">
              <div className="w-full border-t border-slate-200" />
              <span className="absolute bg-white px-3 text-[11px] sm:text-xs text-slate-400 font-medium">
                หรือกรอกข้อมูลสมัครด้วยอีเมล
              </span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Step 1 Header */}
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-indigo-600" />
              <span>ข้อมูลร้านของคุณ</span>
            </div>

            {/* Shop Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อร้านซาลอน / บาร์เบอร์ (Shop Name) *
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Store className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="เช่น The Gentleman Barber & Salon"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                เบอร์โทรศัพท์ร้าน (Phone Number)
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081-xxx-xxxx"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
            </div>

            {/* Step 2 Header */}
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2 pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>บัญชีผู้ดูแลระบบ (เจ้าของร้าน)</span>
            </div>

            {/* Owner Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อ-นามสกุลของคุณ (Owner Name)
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="เช่น เอกชัย หาญบรรเทิง"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                อีเมลสำหรับเข้าสู่ระบบ (Email) *
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@yourshop.com"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                รหัสผ่าน (Password อย่างน้อย 6 ตัวอักษร) *
              </label>
              <div className="relative rounded-xl shadow-sm">
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
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-11 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
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
                    <span>เริ่มต้นใช้งานฟรี 2 เดือนเต็มทันที</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Login */}
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
