"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scissors,
  Sparkles,
  LogOut,
  Loader2,
  Gift,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Award,
  Mail,
  UserCheck,
  Calendar,
  KeyRound,
  Store,
  ArrowRight,
  RefreshCw,
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
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [creatingShop, setCreatingShop] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

        // Fetch shop associated with owner
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

        if (!shopsData || shopsData.length === 0) {
          setShop(null);
        } else {
          setShop(shopsData[0] as Shop);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
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

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !shopName.trim()) return;

    setCreatingShop(true);
    setErrorMessage(null);

    try {
      const slug =
        shopName
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-") +
        "-" +
        Math.floor(Math.random() * 10000);

      // 60 days free trial
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

      const { data, error } = await (
        supabase.from("shops") as ReturnType<typeof supabase.from>
      )
        .insert([newShop] as never)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setShop(data as Shop);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("ไม่สามารถสร้างร้านค้าได้ กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setCreatingShop(false);
    }
  };

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
            กำลังตรวจสอบสิทธิ์การเข้าสู่ระบบ...
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
                <Scissors className="h-5 w-5 rotate-[-45deg]" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                LUMINA
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-200/70">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              Auth Testing Mode
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 px-3.5 py-2 rounded-xl transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              <LogOut className="w-4 h-4" />
              <span>ออกจากระบบ (Sign Out)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content: 100% Focused on Auth & Login Testing */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {!shop ? (
          /* Case 1: First-time user, must create a shop name to complete onboarding */
          <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl mt-6">
            <div className="text-center mb-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                เข้าสู่ระบบสำเร็จ!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                ตั้งชื่อร้านค้าเพื่อเสร็จสิ้นขั้นตอนการทดสอบล็อกอิน
              </p>
            </div>

            {/* Trial Banner */}
            <div className="mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>รับสิทธิ์ทดลองใช้ฟรี 2 เดือนเต็ม (60 วัน) อัตโนมัติ</span>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCreateShop} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อร้านค้าทดสอบ (Shop Name) *
                </label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="เช่น ร้านทดสอบ 1 (Test Salon)"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  เบอร์โทรศัพท์ (ไม่บังคับ)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081-xxx-xxxx"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>

              <button
                type="submit"
                disabled={creatingShop}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 px-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all cursor-pointer disabled:opacity-60"
              >
                {creatingShop ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังบันทึกร้านค้า...</span>
                  </>
                ) : (
                  <span>ยืนยันชื่อร้านและเสร็จสิ้นการทดสอบ</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Case 2: Clean, Verified Login Test Report for Tester */
          <div className="space-y-6">
            {/* Top Thank-You Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/70 to-indigo-50/70 border border-emerald-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="pointer-events-none absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-300/20 rounded-full blur-2xl" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/25">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        เข้าสู่ระบบสำเร็จ 100%
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                        <Award className="w-3.5 h-3.5 text-indigo-500" />
                        Verified Tester
                      </span>
                    </div>

                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                      <span>ขอขอบคุณ Tester ที่ร่วมทดสอบระบบ!</span>
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                      การทดสอบระบบสิทธิ์ ยืนยันตัวตน และสร้างฐานข้อมูลร้านค้าของ Lumina ประสบความสำเร็จเรียบร้อย ข้อมูลผู้ใช้ของคุณถูกตรวจสอบและเชื่อมต่อกับระบบ Supabase Cloud อย่างปลอดภัยแล้วครับ
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setRefreshKey((prev) => prev + 1)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
                    title="รีเฟรชข้อมูล"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>รีเฟรชข้อมูล</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Authentication Verification Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                    ข้อมูลผลการทดสอบการเข้าสู่ระบบ (Auth Test Details)
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  Session Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* 1. Tester Name */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    ชื่อผู้ทดสอบ (Tester Name)
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900">
                    {user?.user_metadata?.full_name || "เจ้าของร้าน (Owner)"}
                  </div>
                </div>

                {/* 2. Email */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>อีเมลที่ใช้ล็อกอิน (Email)</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900 truncate">
                    {user?.email || "-"}
                  </div>
                </div>

                {/* 3. Provider */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    ช่องทางเข้าสู่ระบบ (Provider)
                  </div>
                  <div className="text-sm sm:text-base font-black text-indigo-700">
                    {providerName}
                  </div>
                </div>

                {/* 4. Shop Name */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Store className="w-3 h-3 text-slate-400" />
                    <span>ชื่อร้านค้าในระบบ (Shop Name)</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900">
                    {shop?.name || "-"}
                  </div>
                </div>

                {/* 5. Plan Status */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Gift className="w-3 h-3 text-emerald-600" />
                    <span>สถานะสิทธิ์การใช้งาน (Plan Tier)</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-emerald-700">
                    ทดลองใช้ฟรี 2 เดือน (All-Access 60 วัน)
                  </div>
                </div>

                {/* 6. Sign in time */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>เวลาที่ล็อกอินล่าสุด (Sign-in Time)</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800">
                    {formattedSignInDate}
                  </div>
                </div>
              </div>

              {/* Supabase User ID info */}
              <div className="mt-5 p-3.5 rounded-2xl bg-slate-100/70 border border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    <strong>Supabase User ID:</strong>{" "}
                    <code className="text-indigo-600 font-mono text-[11px]">{user?.id}</code>
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  ✓ Verified in Supabase
                </span>
              </div>
            </div>

            {/* Test Navigation Shortcuts for Tester */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-900 mb-4">
                ทดสอบเส้นทางอื่นๆ ในระบบสิทธิ์ (Auth Navigation Test):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={handleSignOut}
                  className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-rose-700 font-bold text-xs sm:text-sm mb-1">
                    <span>1. ทดสอบออกจากระบบ</span>
                    <LogOut className="w-4 h-4 text-rose-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-rose-600/80">
                    เคลียร์ Session แล้วกลับไปหน้า Login เพื่อเทสล็อกอินใหม่
                  </p>
                </button>

                <Link
                  href="/register"
                  className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/20 text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-slate-900 group-hover:text-indigo-600 font-bold text-xs sm:text-sm mb-1">
                    <span>2. ทดสอบหน้าสมัครร้านค้า</span>
                    <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    ดูฟอร์มลงทะเบียนร้านค้าใหม่ฟรี 2 เดือน (/register)
                  </p>
                </Link>

                <Link
                  href="/forgot-password"
                  className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/20 text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-slate-900 group-hover:text-indigo-600 font-bold text-xs sm:text-sm mb-1">
                    <span>3. ทดสอบหน้าลืมรหัสผ่าน</span>
                    <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    ทดสอบการขอส่งลิงก์รีเซ็ตรหัสผ่าน (/forgot-password)
                  </p>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 mt-8">
        LUMINA &bull; Salon & Barber Management Platform &bull; Authentication Phase Verified
      </footer>
    </div>
  );
}
