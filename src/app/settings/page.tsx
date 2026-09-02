"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scissors,
  Users,
  Settings,
  ArrowLeft,

  Loader2,
  Store,
  Gift,
  Phone,

  ChevronRight,
  Tag,

} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";

type Shop = Database["public"]["Tables"]["shops"]["Row"];
type Staff = Database["public"]["Tables"]["staff"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [servicesList, setServicesList] = useState<Service[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (authError || !user) {
          router.replace("/login");
          return;
        }

        // Fetch shop
        const { data: shopsData, error: shopError } = await supabase
          .from("shops")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (!isMounted) return;

        if (shopError || !shopsData || shopsData.length === 0) {
          router.replace("/dashboard");
          return;
        }

        const currentShop = shopsData[0] as Shop;
        setShop(currentShop);

        // Fetch staff
        const { data: staffData } = await supabase
          .from("staff")
          .select("*")
          .eq("shop_id", currentShop.id);

        if (isMounted && staffData) {
          setStaffList(staffData);
        }

        // Fetch services
        const { data: servicesData } = await supabase
          .from("services")
          .select("*")
          .eq("shop_id", currentShop.id);

        if (isMounted && servicesData) {
          setServicesList(servicesData);
        }
      } catch (err) {
        console.error("Error loading settings data:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">
            กำลังโหลดหน้าการตั้งค่าร้านค้า...
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
    <div className="min-h-screen bg-gradient-to-b from-slate-100/70 via-slate-50 to-slate-100/40 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Left: Back to Dashboard */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all shadow-2xs active:scale-95 whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>กลับแดชบอร์ด</span>
          </Link>

          {/* Center Shop Name (Desktop / Tablet only) */}
          {shop && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="text-slate-800 font-extrabold">{shop.name}</span>
              <span>&bull;</span>
              <span>ศูนย์การตั้งค่าร้านค้า</span>
            </div>
          )}

          {/* Right Status Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 whitespace-nowrap shrink-0">
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>ตั้งค่าระบบ</span>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-5xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-4 sm:py-7 flex-1 space-y-4 sm:space-y-6">
        {/* Header Hero Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-tr from-slate-700 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/10 shrink-0">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900">
                การตั้งค่าร้านค้า (Shop Settings)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                ศูนย์รวมการจัดการระบบหลังบ้าน ข้อมูลร้าน รายชื่อช่าง และเมนูบริการมาตรฐาน
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Hub: 3 Clean Setting Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
          {/* Card 1: Services & Standard Prices */}
          <Link
            href="/services"
            className="group bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/80 hover:border-amber-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs border border-amber-100 group-hover:scale-105 transition-transform shrink-0">
                  <Scissors className="h-6 w-6 rotate-[-45deg]" />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                  <Tag className="w-3 h-3 text-amber-600" />
                  <span>{servicesList.length} รายการ</span>
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                  เมนูบริการ & ราคาขายมาตรฐาน
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  กำหนดราคาเริ่มต้นของแต่ละบริการ เช่น ตัดผม, สระไดร์, ทำสี เพื่อนำไปใช้แตะคิดเงินในระบบ POS ได้ทันที
                </p>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>จัดการเมนูบริการ</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Staff & Commission */}
          <Link
            href="/staff"
            className="group bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/80 hover:border-purple-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs border border-purple-100 group-hover:scale-105 transition-transform shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{staffList.length} คน (พร้อม {activeStaffCount})</span>
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                  รายชื่อช่าง & ค่าคอมมิชชัน
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  จัดการโปรไฟล์ช่าง รูปถ่าย กำหนดส่วนแบ่ง % ค่าคอมมิชชัน รูปแบบเงินเดือน และเปิด/ปิดสถานะพร้อมให้บริการ
                </p>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>จัดการรายชื่อช่าง</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Card 3: Shop Profile & Plan Overview (Full Width) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  ข้อมูลร้านค้า & แพ็กเกจปัจจุบัน
                </h3>
                <p className="text-xs text-slate-500">
                  รายละเอียดบัญชีร้านค้าและสถานะสิทธิ์การใช้งาน
                </p>
              </div>
            </div>

            <span className="self-start sm:self-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              <Gift className="w-3.5 h-3.5 text-emerald-600" />
              <span>TRIAL ทดลองใช้ฟรี 2 เดือน (เหลืออีก {daysRemaining} วัน)</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                ชื่อร้านค้า (Shop Name)
              </div>
              <div className="text-sm sm:text-base font-black text-slate-900 truncate">
                {shop?.name}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>เบอร์โทรศัพท์ร้าน</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900">
                {shop?.phone || "ไม่ได้ระบุ"}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-3.5 sm:py-4 text-center text-[11px] sm:text-xs text-slate-400 border-t border-slate-200/60 mt-6">
        LUMINA &bull; ศูนย์การตั้งค่าร้านค้า &bull; {shop?.name}
      </footer>
    </div>
  );
}
