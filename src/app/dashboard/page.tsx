"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Scissors,
  Sparkles,
  LogOut,
  Loader2,
  Gift,
  ClipboardCheck,
  Store,
  Users,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import TermsConsentModal from "@/components/TermsConsentModal";

type Shop = Database["public"]["Tables"]["shops"]["Row"];
type Staff = Database["public"]["Tables"]["staff"]["Row"];
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
  const [staffList, setStaffList] = useState<Staff[]>([]);
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

        // Check if user has accepted terms
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

          // Fetch staff of this shop
          const { data: staffData } = await supabase
            .from("staff")
            .select("*")
            .eq("shop_id", currentShop.id)
            .order("created_at", { ascending: false });

          if (isMounted && staffData) {
            setStaffList(staffData);
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
            กำลังโหลดระบบร้านค้า...
          </p>
        </div>
      </div>
    );
  }

  // Calculate Remaining Trial Days
  const calculateDaysRemaining = () => {
    if (!shop?.plan_expires_at) return 60;
    const expires = new Date(shop.plan_expires_at);
    const now = new Date();
    const diffTime = expires.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = calculateDaysRemaining();
  const activeStaffCount = staffList.filter((s) => s.is_active).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
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
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 shrink-0">
                <Scissors className="h-5 w-5 rotate-[-45deg]" />
              </div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                LUMINA
              </span>
            </Link>

            {shop && (
              <div className="flex items-center gap-1.5 sm:gap-2 border-l border-slate-200 pl-2.5 sm:pl-3">
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 truncate max-w-[120px] sm:max-w-[200px]">
                  {shop.name}
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-emerald-700 border border-emerald-200 flex items-center gap-1 shrink-0">
                  <Gift className="w-3 h-3 text-emerald-600" />
                  <span>TRIAL 2 เดือน</span>
                </span>
              </div>
            )}
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/staff"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all shadow-2xs"
            >
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>จัดการช่าง</span>
            </Link>

            <Link
              href="/checklist"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all shadow-2xs"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">ผลการทดสอบ</span>
              <span>(Checklist)</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-2.5 sm:px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 space-y-6">
        {!shop ? (
          /* First-time Setup Wizard */
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
          <div className="space-y-6">
            {/* 1. Top Banner: Shop Name & Package */}
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 p-6 sm:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden border border-indigo-900/50">
              <div className="pointer-events-none absolute -right-16 -bottom-16 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl" />

              <div className="relative z-10 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-indigo-300 font-semibold flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-indigo-400" />
                    <span>ร้านของคุณ:</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-2.5 py-0.5 text-xs font-bold">
                    <Gift className="w-3 h-3 text-emerald-400" />
                    <span>แพ็กเกจ: ทดลองใช้ฟรี 2 เดือน (เหลือ {daysRemaining} วัน)</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-2">
                  <span>{shop.name}</span>
                  <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
                </h1>

                <p className="text-slate-300 text-xs sm:text-sm">
                  ยินดีต้อนรับ {user?.user_metadata?.full_name || user?.email} &bull; สิทธิ์การใช้งานปลดล็อกครบทุกฟังก์ชัน
                </p>
              </div>
            </div>

            {/* 2. Staff Card (Clickable to view Staff List) */}
            <div className="max-w-md">
              <Link
                href="/staff"
                className="group block bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-purple-500 hover:shadow-xl transition-all duration-200 active:scale-[0.99] relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
                    <Users className="h-7 w-7" />
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200/80 group-hover:bg-purple-100 transition-colors">
                    <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>พร้อมทำงาน {activeStaffCount} คน</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    ทีมช่างของร้าน
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {staffList.length}
                    </span>
                    <span className="text-base font-extrabold text-slate-500">
                      คน
                    </span>
                  </div>
                </div>

                {/* Stylists Avatar Preview Row */}
                {staffList.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center -space-x-2">
                      {staffList.slice(0, 4).map((s) => (
                        <div
                          key={s.id}
                          className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-xs"
                          title={s.name}
                        >
                          {s.image_url ? (
                            <Image
                              src={s.image_url}
                              alt={s.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                              {s.name.charAt(0)}
                            </div>
                          )}
                        </div>
                      ))}
                      {staffList.length > 4 && (
                        <div className="h-9 w-9 rounded-full bg-slate-100 border-2 border-white text-slate-600 text-xs font-bold flex items-center justify-center shadow-xs">
                          +{staffList.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="inline-flex items-center gap-1 text-xs font-extrabold text-purple-600 group-hover:text-purple-700">
                      <span>ดูรายชื่อช่าง</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                )}

                {staffList.length === 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                    <span>คลิกเพื่อเพิ่มช่างคนแรก</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Link>
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
