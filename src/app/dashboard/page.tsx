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
  ClipboardCheck,
  Store,
  Clock,
  ShieldCheck,
  UserCheck,
  Mail,
  Calendar,
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
            กำลังโหลดข้อมูลร้านค้า...
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

  const formattedExpiryDate = shop?.plan_expires_at
    ? new Date(shop.plan_expires_at).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 truncate max-w-[140px] sm:max-w-[200px]">
                  {shop.name}
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-emerald-700 border border-emerald-200 flex items-center gap-1 shrink-0">
                  <Gift className="w-3 h-3 text-emerald-600" />
                  <span>TRIAL 2 เดือน</span>
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
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

      {/* Main Content: Clean & Focused Strictly on Shop & Package Info */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
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
          /* Case 2: Clean, Focused Shop & Package Overview */
          <div className="space-y-6">
            {/* 1. Main Shop & Package Hero Card */}
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border border-indigo-900/50">
              <div className="pointer-events-none absolute -right-16 -bottom-16 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl" />
              <div className="pointer-events-none absolute top-0 right-1/4 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left: Shop Name */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-md">
                      <Store className="w-3.5 h-3.5 text-indigo-300" />
                      ร้านค้าของคุณ
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-3 py-1 text-xs font-bold">
                      <Gift className="w-3.5 h-3.5 text-emerald-400" />
                      แพ็กเกจ: ทดลองใช้ฟรี 2 เดือนเต็ม (All-Access)
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      ชื่อร้านค้าในระบบ
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                      <span>{shop.name}</span>
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400 shrink-0" />
                    </h1>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                    ยินดีต้อนรับคุณ <strong className="text-white">{user?.user_metadata?.full_name || user?.email}</strong> &bull; สิทธิ์การใช้งานปลดล็อกครบทุกฟังก์ชัน ไม่จำกัดจำนวนบิลและช่างในร้าน
                  </p>
                </div>

                {/* Right: Remaining Days Box */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 text-left min-w-[260px] shrink-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs text-indigo-200 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ระยะเวลาทดลองใช้งาน</span>
                    </span>
                    <span className="text-xs font-black text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/30">
                      เหลืออีก {daysRemaining} วัน
                    </span>
                  </div>

                  <div className="text-lg sm:text-xl font-black text-white">
                    หมดอายุ: {formattedExpiryDate}
                  </div>

                  <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>ไม่มีการตัดเงินอัตโนมัติ 100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Clear Details Grid (Shop & Plan & Account) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-600" />
                <span>ข้อมูลร้านค้าและแพ็กเกจปัจจุบัน</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Shop Name */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-slate-400" />
                    <span>ชื่อร้านค้า (Shop Name)</span>
                  </div>
                  <div className="text-base font-black text-slate-900">
                    {shop.name}
                  </div>
                </div>

                {/* 2. Current Plan */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-emerald-600" />
                    <span>แพ็กเกจปัจจุบัน (Plan)</span>
                  </div>
                  <div className="text-base font-black text-emerald-800">
                    ทดลองใช้ฟรี 2 เดือน (All-Access)
                  </div>
                </div>

                {/* 3. Days Remaining */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>ระยะเวลาคงเหลือ (Remaining)</span>
                  </div>
                  <div className="text-base font-black text-indigo-900">
                    เหลืออีก {daysRemaining} วัน (ถึง {formattedExpiryDate})
                  </div>
                </div>

                {/* 4. Owner Name */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>เจ้าของร้าน (Owner)</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {user?.user_metadata?.full_name || "เจ้าของร้าน"}
                  </div>
                </div>

                {/* 5. Email */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>อีเมลเข้าสู่ระบบ (Email)</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800 truncate">
                    {user?.email || "-"}
                  </div>
                </div>

                {/* 6. Phone */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>เบอร์โทรศัพท์ร้าน</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {shop.phone || "ยังไม่ได้ระบุ"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 mt-8">
        LUMINA &bull; แพลตฟอร์มบริหารร้านซาลอนและบาร์เบอร์ &bull; สิทธิ์ทดลองใช้งานฟรี 2 เดือนเต็ม
      </footer>
    </div>
  );
}
