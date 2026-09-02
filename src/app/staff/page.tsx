"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Users,
  Plus,
  ArrowLeft,
  Loader2,
  Trash2,
  Edit2,
  Check,
  Percent,
  Banknote,
  AlertCircle,
  Gift,
  Search,
  Camera,
  Upload,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";

type Staff = Database["public"]["Tables"]["staff"]["Row"];
type Shop = Database["public"]["Tables"]["shops"]["Row"];

export default function StaffPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [wageType, setWageType] = useState<string>("monthly");
  const [wageAmount, setWageAmount] = useState<string>("15000");
  const [commissionPercent, setCommissionPercent] = useState<string>("50");
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [note, setNote] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);

  // Delete Confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
        const { data: staffData, error: staffError } = await supabase
          .from("staff")
          .select("*")
          .eq("shop_id", currentShop.id)
          .order("created_at", { ascending: false });

        if (!isMounted) return;

        if (staffError) {
          throw staffError;
        }

        setStaffList(staffData || []);
      } catch (err) {
        console.error("Error loading staff:", err);
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
    setEditingStaff(null);
    setName("");
    setWageType("monthly");
    setWageAmount("15000");
    setCommissionPercent("50");
    setStartDate(new Date().toISOString().split("T")[0]);
    setNote("");
    setImageUrl("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsActive(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (staff: Staff) => {
    setEditingStaff(staff);
    setName(staff.name);
    setWageType(staff.wage_type || "monthly");
    setWageAmount(staff.wage_amount ? staff.wage_amount.toString() : "");
    setCommissionPercent(
      staff.commission_percent ? staff.commission_percent.toString() : "50"
    );
    setStartDate(
      staff.start_date || new Date().toISOString().split("T")[0]
    );
    setNote(staff.note || "");
    setImageUrl(staff.image_url || "");
    setSelectedFile(null);
    setPreviewUrl(staff.image_url || null);
    setIsActive(staff.is_active ?? true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  // Handle Photo File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Limit file size to 5MB
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("ขนาดรูปภาพต้องไม่เกิน 5MB");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop || !name.trim()) return;

    setSaving(true);
    setErrorMessage(null);

    try {
      let finalImageUrl = imageUrl.trim() || null;

      // Upload photo to Supabase Storage bucket 'staff_photos'
      if (selectedFile) {
        setUploadingPhoto(true);
        const fileExt = selectedFile.name.split(".").pop() || "jpg";
        const cleanFileName = `${shop.id}/${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("staff_photos")
          .upload(cleanFileName, selectedFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`อัปโหลดรูปไม่สำเร็จ: ${uploadError.message}`);
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("staff_photos")
          .getPublicUrl(cleanFileName);

        finalImageUrl = publicUrlData.publicUrl;
        setUploadingPhoto(false);
      }

      const parsedWageAmount =
        wageType === "none" || !wageAmount ? null : parseFloat(wageAmount);
      const parsedCommission = commissionPercent
        ? parseFloat(commissionPercent)
        : null;

      if (editingStaff) {
        // Update existing staff
        const { data, error } = await (
          supabase.from("staff") as ReturnType<typeof supabase.from>
        )
          .update({
            name: name.trim(),
            wage_type: wageType,
            wage_amount: parsedWageAmount,
            commission_percent: parsedCommission,
            start_date: startDate || null,
            note: note.trim() || null,
            image_url: finalImageUrl,
            is_active: isActive,
          } as never)
          .eq("id", editingStaff.id)
          .select()
          .single();

        if (error) throw error;

        setStaffList((prev) =>
          prev.map((s) => (s.id === editingStaff.id ? (data as Staff) : s))
        );
      } else {
        // Insert new staff
        type StaffInsert = Database["public"]["Tables"]["staff"]["Insert"];
        const newStaff: StaffInsert = {
          shop_id: shop.id,
          name: name.trim(),
          wage_type: wageType,
          wage_amount: parsedWageAmount,
          commission_percent: parsedCommission,
          start_date: startDate || null,
          note: note.trim() || null,
          image_url: finalImageUrl,
          is_active: isActive,
        };

        const { data, error } = await (
          supabase.from("staff") as ReturnType<typeof supabase.from>
        )
          .insert([newStaff] as never)
          .select()
          .single();

        if (error) throw error;

        setStaffList((prev) => [data as Staff, ...prev]);
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
      setUploadingPhoto(false);
    }
  };

  const handleToggleActive = async (staff: Staff) => {
    const nextState = !staff.is_active;

    // Optimistic update
    setStaffList((prev) =>
      prev.map((s) => (s.id === staff.id ? { ...s, is_active: nextState } : s))
    );

    try {
      const { error } = await (
        supabase.from("staff") as ReturnType<typeof supabase.from>
      )
        .update({ is_active: nextState } as never)
        .eq("id", staff.id);

      if (error) throw error;
    } catch (err) {
      console.error("Toggle active error:", err);
      // Revert on failure
      setStaffList((prev) =>
        prev.map((s) => (s.id === staff.id ? { ...s, is_active: staff.is_active } : s))
      );
    }
  };

  const handleDeleteStaff = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase.from("staff").delete().eq("id", id);
      if (error) throw error;

      setStaffList((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete staff error:", err);
      alert("ไม่สามารถลบข้อมูลช่างได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredStaff = staffList.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">
            กำลังโหลดข้อมูลช่างในร้าน...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>กลับแดชบอร์ด</span>
            </Link>

            {shop && (
              <div className="flex items-center gap-1.5 sm:gap-2 border-l border-slate-200 pl-2.5 sm:pl-3">
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 truncate max-w-[120px] sm:max-w-[180px]">
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
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มช่างใหม่</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 space-y-6">
        {/* Title & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                จัดการรายชื่อช่าง & ค่าคอมมิชชัน
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              เพิ่มช่าง อัปโหลดรูปภาพ กำหนดส่วนแบ่ง % ค่าคอมมิชชัน และสถานะพร้อมให้บริการ
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อช่าง..."
                className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Staff List Grid */}
        {filteredStaff.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {searchQuery ? "ไม่พบรายชื่อช่างที่ค้นหา" : "ยังไม่มีรายชื่อช่างในร้าน"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                เริ่มต้นเพิ่มช่างพร้อมรูปโปรไฟล์ในร้านของคุณ เพื่อนำไปใช้คิดเงินในหน้าจอ POS และคำนวณค่าคอมฯ ช่างอัตโนมัติ
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={openAddModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ เพิ่มช่างคนแรกของร้าน</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredStaff.map((staff) => {
              const initial = staff.name.trim().charAt(0) || "ช";

              return (
                <div
                  key={staff.id}
                  className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-xs relative flex flex-col justify-between ${
                    staff.is_active
                      ? "border-slate-200/90 hover:border-indigo-400 hover:shadow-md"
                      : "border-slate-200/50 bg-slate-50/50 opacity-70"
                  }`}
                >
                  <div>
                    {/* Top row: Photo/Avatar + Name + Status Toggle */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        {staff.image_url ? (
                          <div className="relative h-13 w-13 rounded-2xl overflow-hidden shadow-md shrink-0 border border-slate-200">
                            <Image
                              src={staff.image_url}
                              alt={staff.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-13 w-13 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-md shadow-purple-500/20 shrink-0">
                            {initial}
                          </div>
                        )}
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900">
                            {staff.name}
                          </h3>
                          <span className="text-[11px] text-slate-400 font-medium">
                            เริ่มงาน: {staff.start_date || "ไม่ระบุ"}
                          </span>
                        </div>
                      </div>

                      {/* Active Status Badge & Switch */}
                      <button
                        onClick={() => handleToggleActive(staff)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
                          staff.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-200 text-slate-600 border border-slate-300"
                        }`}
                        title="คลิกเพื่อสลับสถานะ"
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            staff.is_active ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                          }`}
                        />
                        <span>{staff.is_active ? "พร้อมทำงาน" : "พัก/ลางาน"}</span>
                      </button>
                    </div>

                    {/* Stats Pill: Commission & Wage */}
                    <div className="grid grid-cols-2 gap-2.5 mb-4">
                      {/* Commission % */}
                      <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-3">
                        <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                          <Percent className="w-3 h-3" />
                          <span>ค่าคอมมิชชัน</span>
                        </div>
                        <div className="text-lg font-black text-purple-900">
                          {staff.commission_percent ?? 0}%
                        </div>
                      </div>

                      {/* Wage / Salary */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                          <Banknote className="w-3 h-3" />
                          <span>
                            {staff.wage_type === "monthly"
                              ? "รายเดือน"
                              : staff.wage_type === "daily"
                              ? "รายวัน"
                              : "คอมฯ ล้วน"}
                          </span>
                        </div>
                        <div className="text-lg font-black text-slate-800">
                          {staff.wage_type === "none" || !staff.wage_amount
                            ? "ไม่มีเงินเดือน"
                            : `฿${staff.wage_amount.toLocaleString()}`}
                        </div>
                      </div>
                    </div>

                    {/* Note if available */}
                    {staff.note && (
                      <p className="text-xs text-slate-500 bg-slate-50 rounded-xl p-2.5 mb-4 line-clamp-2">
                        {staff.note}
                      </p>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">
                      ID: <code className="text-[10px] font-mono">{staff.id.slice(0, 8)}</code>
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(staff)}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                        title="แก้ไขข้อมูลช่าง"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteStaff(staff.id)}
                        disabled={deletingId === staff.id}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                        title="ลบช่าง"
                      >
                        {deletingId === staff.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/10 text-white flex items-center justify-center border border-white/10">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">
                    {editingStaff ? "แก้ไขข้อมูลช่าง" : "เพิ่มช่างใหม่ในร้าน"}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {shop?.name} &bull; อัปโหลดรูปภาพและกำหนดสิทธิ์
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveStaff} className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {errorMessage && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Staff Photo Upload Section (Storage: staff_photos) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  รูปถ่ายโปรไฟล์ช่าง (บันทึกลง staff_photos)
                </label>
                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="relative">
                    {previewUrl ? (
                      <div className="relative h-16 w-16 rounded-2xl overflow-hidden shadow-md border-2 border-indigo-500">
                        <Image
                          src={previewUrl}
                          alt="Staff Preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md hover:bg-rose-600 cursor-pointer"
                          title="ลบรูป"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-slate-200 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                        <Camera className="w-6 h-6" />
                        <span className="text-[9px] font-semibold mt-0.5">ไม่มีรูป</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                      id="staff-photo-upload"
                    />
                    <label
                      htmlFor="staff-photo-upload"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs cursor-pointer transition-all active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{previewUrl ? "เปลี่ยนรูปภาพ" : "เลือกรูปโปรไฟล์"}</span>
                    </label>
                    <p className="text-[11px] text-slate-400 mt-1">
                      รองรับ PNG, JPG, WebP (ขนาดไม่เกิน 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* 1. Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อช่าง (Staff Name) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น ช่างแมน หรือ ช่างโบว์"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-base sm:text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>

              {/* 2. Commission Percent */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ส่วนแบ่งค่าคอมมิชชัน (% Commission) *
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    step="1"
                    value={commissionPercent}
                    onChange={(e) => setCommissionPercent(e.target.value)}
                    placeholder="50"
                    className="w-full rounded-xl border border-slate-200 pl-3.5 pr-10 py-3 text-base sm:text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 font-bold text-sm">
                    %
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  เช่น 50% หมายถึง ช่างได้ 50% ของยอดบริการ และร้านได้ 50%
                </span>
              </div>

              {/* 3. Wage Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ประเภทค่าจ้าง (Wage Type)
                  </label>
                  <select
                    value={wageType}
                    onChange={(e) => setWageType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-base sm:text-sm bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  >
                    <option value="monthly">รายเดือน (Monthly Salary)</option>
                    <option value="daily">รายวัน (Daily Wage)</option>
                    <option value="none">ไม่มีเงินเดือน (คอมฯ ล้วน)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    จำนวนเงินค่าจ้าง (บาท)
                  </label>
                  <input
                    type="number"
                    disabled={wageType === "none"}
                    value={wageAmount}
                    onChange={(e) => setWageAmount(e.target.value)}
                    placeholder={wageType === "none" ? "ไม่มี" : "15000"}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-base sm:text-sm disabled:bg-slate-100 disabled:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
              </div>

              {/* 4. Start Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  วันที่เริ่มงาน (Start Date)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base sm:text-sm bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
              </div>

              {/* 5. Note / Skills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  บันทึกเพิ่มเติม / ทักษะความเชี่ยวชาญ
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="เช่น ถนัดตัดผมชายสไตล์วินเทจ, ทำสีแฟชั่น..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base sm:text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>

              {/* 6. Active Status Switch */}
              <div className="pt-2 flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    สถานะพร้อมให้บริการ
                  </div>
                  <div className="text-[11px] text-slate-400">
                    แสดงรายชื่อในหน้าจอคิดเงิน POS ทันที
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-5 w-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingPhoto}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 active:scale-95 disabled:opacity-60 transition-all cursor-pointer"
                >
                  {saving || uploadingPhoto ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{uploadingPhoto ? "กำลังอัปโหลดรูป..." : "กำลังบันทึก..."}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>บันทึกข้อมูลช่าง</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clean Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 mt-8">
        LUMINA &bull; ระบบจัดการช่างและค่าคอมมิชชัน &bull; {shop?.name}
      </footer>
    </div>
  );
}
