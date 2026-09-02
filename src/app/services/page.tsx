"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scissors,
  Plus,
  Users,
  ArrowLeft,
  Loader2,
  Trash2,
  Edit3,
  Check,
  Banknote,
  AlertCircle,
  Search,
  X,
  AlertTriangle,
  Tag,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";

type Service = Database["public"]["Tables"]["services"]["Row"];
type Shop = Database["public"]["Tables"]["shops"]["Row"];

export default function ServicesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Delete Confirmation Modal State
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

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

        // Fetch services for this shop
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("shop_id", currentShop.id)
          .order("created_at", { ascending: false });

        if (!isMounted) return;

        if (servicesError) {
          throw servicesError;
        }

        setServicesList(servicesData || []);
      } catch (err) {
        console.error("Error loading services:", err);
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

  const openAddModal = () => {
    setEditingService(null);
    setName("");
    setPrice("");
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setPrice(service.price.toString());
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop || !name.trim() || !price) return;

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMessage("กรุณาระบุราคาที่ถูกต้อง");
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    try {
      if (editingService) {
        // Update service
        const { data, error } = await (
          supabase.from("services") as ReturnType<typeof supabase.from>
        )
          .update({
            name: name.trim(),
            price: parsedPrice,
          } as never)
          .eq("id", editingService.id)
          .select()
          .single();

        if (error) throw error;

        setServicesList((prev) =>
          prev.map((s) => (s.id === editingService.id ? (data as Service) : s))
        );
      } else {
        // Insert new service
        type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
        const newService: ServiceInsert = {
          shop_id: shop.id,
          name: name.trim(),
          price: parsedPrice,
        };

        const { data, error } = await (
          supabase.from("services") as ReturnType<typeof supabase.from>
        )
          .insert([newService] as never)
          .select()
          .single();

        if (error) throw error;

        setServicesList((prev) => [data as Service, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", serviceToDelete.id);

      if (error) throw error;

      setServicesList((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
      setServiceToDelete(null);
    } catch (err) {
      console.error("Delete service error:", err);
      alert("ไม่สามารถลบรายการบริการได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredServices = servicesList.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">
            กำลังโหลดเมนูบริการของร้าน...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100/70 via-slate-50 to-slate-100/40 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar - Clean, Compact & Perfectly Responsive */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
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
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="text-slate-800 font-extrabold">{shop.name}</span>
              <span>&bull;</span>
              <span>เมนูบริการ & ราคามาตรฐาน</span>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/staff"
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-800 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all shadow-2xs active:scale-95 whitespace-nowrap shrink-0"
              title="จัดการช่าง"
            >
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden xs:inline">ช่าง</span>
            </Link>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>เพิ่มบริการใหม่</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-4 sm:py-7 flex-1 space-y-4 sm:space-y-6">
        {/* Header Hero Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                <Scissors className="h-4 w-4 sm:h-5 sm:w-5 rotate-[-45deg]" />
              </div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900">
                เมนูบริการ & ราคาขายมาตรฐาน
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              กำหนดราคาเริ่มต้นของแต่ละบริการ เพื่อใช้คิดเงินไวในหน้าจอ POS และคำนวณค่าคอมฯ ช่างอัตโนมัติ
            </p>
          </div>

          {/* Quick Metrics & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
            {/* Service Counter Pill */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-2xl">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              <div className="text-xs font-bold text-slate-700">
                <span>ทั้งหมด:</span>{" "}
                <span className="text-slate-900 font-extrabold">{servicesList.length}</span>{" "}
                <span>รายการ</span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-52 md:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อบริการ..."
                className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-14 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto space-y-4">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Scissors className="w-7 h-7 sm:w-8 sm:h-8 rotate-[-45deg]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {searchQuery ? "ไม่พบรายการบริการที่ค้นหา" : "ยังไม่มีรายการบริการในร้าน"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                เริ่มต้นเพิ่มบริการแรก เช่น ตัดผมชาย, สระไดร์ หรือทำสี เพื่อนำไปใช้แตะคิดเงินในหน้า POS
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={openAddModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ เพิ่มบริการแรกของร้าน</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {filteredServices.map((service) => {
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-amber-400 p-4 sm:p-6 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs shrink-0 border border-amber-100">
                        <Scissors className="h-5 w-5 rotate-[-45deg]" />
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          ราคามาตรฐาน
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          ฿{service.price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        {service.name}
                      </h3>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Banknote className="w-3 h-3 text-slate-400" />
                        <span>ราคาตั้งต้นในบิล POS</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      พร้อมเปิดบิล
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(service)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl transition-all cursor-pointer active:scale-95"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                        <span>แก้ไข</span>
                      </button>

                      <button
                        onClick={() => setServiceToDelete(service)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer active:scale-95"
                        title="ลบบริการ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Global Standard Delete Confirmation Modal */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150">
            {/* Header Icon & Title */}
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  ยืนยันการลบบริการนี้?
                </h3>
                <p className="text-xs text-slate-500">
                  โปรดตรวจสอบข้อมูลก่อนดำเนินการ
                </p>
              </div>
            </div>

            {/* Service Preview Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="text-sm font-extrabold text-slate-900">
                  {serviceToDelete.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  ราคามาตรฐาน ฿{serviceToDelete.price.toLocaleString()}
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-200">
                บริการ
              </span>
            </div>

            {/* Warning Text */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/70 text-xs text-amber-800 leading-relaxed">
              ⚠️ รายการบริการนี้จะถูกนำออกจากเมนูคิดเงิน POS ของร้าน
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setServiceToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังลบ...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>ลบบริการ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-600 via-indigo-600 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/10 text-white flex items-center justify-center border border-white/10 shrink-0">
                  <Scissors className="h-5 w-5 rotate-[-45deg]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">
                    {editingService ? "แก้ไขรายการบริการ" : "เพิ่มรายการบริการใหม่"}
                  </h3>
                  <p className="text-xs text-slate-200">
                    {shop?.name} &bull; กำหนดชื่อและราคามาตรฐาน
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveService} className="p-5 sm:p-6 space-y-4">
              {errorMessage && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Service Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อบริการ (Service Name) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น ตัดผมชายวินเทจ, สระไดร์พรีเมียม"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 sm:py-3 text-base sm:text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>

              {/* Standard Price */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ราคาขายมาตรฐาน (บาท) *
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-bold text-sm">
                    ฿
                  </div>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="300"
                    className="w-full rounded-xl border border-slate-200 pl-8 pr-3.5 py-2.5 sm:py-3 text-base sm:text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  ราคานี้จะแสดงขึ้นมาให้อัตโนมัติเมื่อเลือกบริการในหน้า POS
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer active:scale-95"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 active:scale-95 disabled:opacity-60 transition-all cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>บันทึกบริการ</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clean Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 py-3.5 sm:py-4 text-center text-[11px] sm:text-xs text-slate-400 border-t border-slate-200/60 mt-6">
        LUMINA &bull; เมนูบริการและราคามาตรฐาน &bull; {shop?.name}
      </footer>
    </div>
  );
}
