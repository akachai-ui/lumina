"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scissors,
  Users,
  Sparkles,
  TrendingUp,
  Receipt,
  LogOut,
  Loader2,
  Calendar,
  Gift,
  ArrowRight,
  ClipboardCheck,
  PlusCircle,
  Store,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import TermsConsentModal from "@/components/TermsConsentModal";

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

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [servicesCount, setServicesCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [creatingShop, setCreatingShop] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
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

        const typedUser = currentUser as User;
        setUser(typedUser);

        // Check if user has accepted the terms and conditions
        const hasAcceptedTerms = typedUser.user_metadata?.terms_accepted === true;
        if (!hasAcceptedTerms) {
          setShowTermsModal(true);
        } else {
          setShowTermsModal(false);
        }

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
          const currentShop = shopsData[0] as Shop;
          setShop(currentShop);

          // Fetch services count
          const { count: sCount } = await supabase
            .from("services")
            .select("*", { count: "exact", head: true })
            .eq("shop_id", currentShop.id);

          // Fetch staff count
          const { count: stCount } = await supabase
            .from("staff")
            .select("*", { count: "exact", head: true })
            .eq("shop_id", currentShop.id);

          if (isMounted) {
            setServicesCount(sCount || 0);
            setStaffCount(stCount || 0);
          }
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDashboardData();

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

  const handleTermsAccepted = () => {
    setShowTermsModal(false);
    setRefreshKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">
            กำลังโหลดแดชบอร์ดร้านค้า...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* First-Time Login Consent Modal */}
      <TermsConsentModal
        isOpen={showTermsModal}
        userEmail={user?.email}
        userName={user?.user_metadata?.full_name}
        onAccepted={handleTermsAccepted}
        onDeclined={handleSignOut}
      />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
                <Scissors className="h-5 w-5 rotate-[-45deg]" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                LUMINA
              </span>
            </Link>

            {shop && (
              <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
                <span className="text-sm font-bold text-slate-800">{shop.name}</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Gift className="w-3 h-3 text-emerald-600" />
                  {shop.plan_status === "trial" ? "TRIAL 2 เดือน" : shop.plan_tier?.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Link to Dedicated Checklist Page */}
            <Link
              href="/checklist"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">ผลการทดสอบ</span>
              <span>(Checklist)</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        {!shop ? (
          /* Case 1: First-time user without shop -> Setup Shop Wizard */
          <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl mt-6">
            <div className="text-center mb-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                <Store className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                ยินดีต้อนรับสู่ LUMINA!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                เริ่มต้นตั้งชื่อร้านของคุณเพื่อเริ่มทดลองใช้ฟรี 2 เดือนเต็ม
              </p>
            </div>

            <div className="mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>สิทธิ์ทดลองใช้ฟรี 2 เดือนเต็ม (ปลดล็อกครบทุกฟังก์ชัน)</span>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCreateShop} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อร้านซาลอน / บาร์เบอร์ (Shop Name) *
                </label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="เช่น The Classic Salon & Barber"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-base sm:text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  เบอร์โทรศัพท์ร้าน
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081-xxx-xxxx"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-base sm:text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
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
                    <span>กำลังสร้างร้านค้า...</span>
                  </>
                ) : (
                  <span>เปิดร้านและเริ่มทดลองใช้ฟรี 2 เดือน</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Case 2: Real Salon Owner Dashboard */
          <div className="space-y-6 sm:space-y-8">
            {/* Greeting Hero Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 p-6 sm:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
              <div className="pointer-events-none absolute -right-16 -bottom-16 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl" />

              <div className="relative z-10 space-y-1.5">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-md mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                  ระบบบริหารร้านซาลอน & บาร์เบอร์ออนไลน์
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {shop.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-0.5 text-xs font-bold">
                    <Gift className="w-3.5 h-3.5 text-emerald-400" />
                    {shop.plan_status === "trial" ? "ทดลองใช้ฟรี 2 เดือน (60 วัน)" : shop.plan_tier?.toUpperCase()}
                  </span>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                  ยินดีต้อนรับ {user?.user_metadata?.full_name || user?.email} &bull; สิทธิ์การใช้งานปลดล็อกครบทุกฟังก์ชัน ไม่จำกัดจำนวนบิลและช่างในร้าน
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-3 shrink-0">
                <Link
                  href="/pos"
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
                >
                  <Receipt className="w-4 h-4" />
                  <span>เข้าสู่หน้าจอ POS คิดเงิน</span>
                </Link>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Stat 1: Today Sales */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    ยอดขายวันนี้
                  </span>
                  <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  ฿0
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <span>⏱ อัปเดตเรียลไทม์</span>
                </div>
              </div>

              {/* Stat 2: Staff */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    ช่างในร้าน
                  </span>
                  <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  {staffCount} คน
                </div>
                <Link
                  href="/staff"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 mt-1 inline-flex items-center gap-1"
                >
                  <span>จัดการช่าง & ค่าคอมฯ</span>
                  <span>&rarr;</span>
                </Link>
              </div>

              {/* Stat 3: Services */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    รายการบริการ
                  </span>
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Scissors className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  {servicesCount} เมนู
                </div>
                <Link
                  href="/services"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-1 inline-flex items-center gap-1"
                >
                  <span>จัดการบริการ & ราคา</span>
                  <span>&rarr;</span>
                </Link>
              </div>

              {/* Stat 4: Appointments */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    นัดหมายวันนี้
                  </span>
                  <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Calendar className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  0 คิว
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  ไม่มีคิวที่รอดำเนินการ
                </div>
              </div>
            </div>

            {/* Quick Actions Guide for Launching Salon */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    ขั้นตอนการเริ่มต้นใช้งานร้านค้าของคุณ
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ทำตาม 3 ขั้นตอนนี้เพื่อเริ่มเปิดบิลขายและคำนวณค่าคอมฯ ช่างได้ทันที
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1: Services */}
                <Link
                  href="/services"
                  className="p-5 rounded-2xl border-2 border-indigo-200/70 bg-gradient-to-b from-indigo-50/40 to-white hover:border-indigo-600 transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white text-xs font-black shadow-xs">
                      1
                    </span>
                    <PlusCircle className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    เพิ่มรายการบริการและราคา
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    เพิ่มเมนูตัดผม สระ-ไดร์ ทำสี กำหนดราคา หรือโหลดเมนูตัวอย่างมาตรฐาน
                  </p>
                  <div className="mt-3 text-xs font-bold text-indigo-600 flex items-center gap-1">
                    <span>จัดการบริการ</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Step 2: Staff */}
                <Link
                  href="/staff"
                  className="p-5 rounded-2xl border border-slate-200 hover:border-purple-600 hover:bg-purple-50/20 transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700 text-xs font-black">
                      2
                    </span>
                    <Users className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    เพิ่มช่าง & ตั้งค่าคอมมิชชัน
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    เพิ่มรายชื่อช่างในร้าน กำหนดค่าจ้าง และตั้งค่า % ส่วนแบ่งค่าคอมฯ
                  </p>
                  <div className="mt-3 text-xs font-bold text-purple-600 flex items-center gap-1">
                    <span>จัดการช่าง</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Step 3: POS */}
                <Link
                  href="/pos"
                  className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/20 transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 text-xs font-black">
                      3
                    </span>
                    <Receipt className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    เริ่มเปิดบิล Fast POS
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    แตะคิดเงินผ่าน iPad หรือมือถือ คำนวณรายได้และค่าคอมฯ ใน 3 วินาที
                  </p>
                  <div className="mt-3 text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <span>เข้าสู่หน้าคิดเงิน</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 mt-8">
        LUMINA &bull; แพลตฟอร์มบริหารร้านซาลอนและบาร์เบอร์ &bull; สิทธิ์ทดลองใช้งานฟรี 2 เดือนเต็ม
      </footer>
    </div>
  );
}
