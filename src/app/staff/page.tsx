"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Users,
  Plus,
  Scissors,
  ArrowLeft,
  Loader2,
  Trash2,
  Edit3,
  Check,
  Percent,
  Banknote,
  AlertCircle,
  Search,
  Camera,
  Upload,
  X,
  UserCheck,
  Calendar,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import { compressImage } from "@/lib/image-compression";

type Staff = Database["public"]["Tables"]["staff"]["Row"];
type Shop = Database["public"]["Tables"]["shops"]["Row"];

/**
 * Helper to extract relative storage path from Supabase Public URL
 * e.g. "https://.../staff_photos/shop-id/123.jpg" -> "shop-id/123.jpg"
 */
function extractStoragePath(url: string, bucketName: string): string | null {
  try {
    const marker = `/${bucketName}/`;
    const index = url.indexOf(marker);
    if (index !== -1) {
      return decodeURIComponent(url.substring(index + marker.length));
    }
    return null;
  } catch {
    return null;
  }
}

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
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);

  // Delete Confirmation Modal State
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setCompressionInfo(null);
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
    setCompressionInfo(null);
    setIsActive(staff.is_active ?? true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  // Handle Photo File Selection with Automatic Mobile Compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const rawFile = e.target.files[0];
      const originalSizeMB = (rawFile.size / (1024 * 1024)).toFixed(2);

      try {
        setUploadingPhoto(true);
        // Automatically compress large smartphone photos to standard ~1000px and ~150-300KB
        const compressed = await compressImage(rawFile, 1000, 1000, 0.82);
        const compressedSizeKB = Math.round(compressed.size / 1024);

        setSelectedFile(compressed);
        setPreviewUrl(URL.createObjectURL(compressed));
        setCompressionInfo(
          `ปรับขนาดรูปภาพอัตโนมัติแล้ว: จาก ${originalSizeMB} MB เหลือ ${compressedSizeKB} KB`
        );
        setErrorMessage(null);
      } catch (err) {
        console.error("Image compression error:", err);
        setSelectedFile(rawFile);
        setPreviewUrl(URL.createObjectURL(rawFile));
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageUrl("");
    setCompressionInfo(null);
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

      // Upload compressed photo to Supabase Storage bucket 'staff_photos'
      if (selectedFile) {
        setUploadingPhoto(true);
        const cleanFileName = `${shop.id}/${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 7)}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("staff_photos")
          .upload(cleanFileName, selectedFile, {
            contentType: "image/jpeg",
            cacheControl: "31536000",
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`อัปโหลดรูปไม่สำเร็จ: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("staff_photos")
          .getPublicUrl(cleanFileName);

        // If editing and had an old photo in storage, delete old photo
        if (editingStaff?.image_url) {
          const oldPath = extractStoragePath(editingStaff.image_url, "staff_photos");
          if (oldPath) {
            await supabase.storage.from("staff_photos").remove([oldPath]);
          }
        }

        finalImageUrl = publicUrlData.publicUrl;
        setUploadingPhoto(false);
      } else if (!imageUrl && editingStaff?.image_url) {
        // User explicitly clicked remove photo during edit -> delete from storage
        const oldPath = extractStoragePath(editingStaff.image_url, "staff_photos");
        if (oldPath) {
          await supabase.storage.from("staff_photos").remove([oldPath]);
        }
        finalImageUrl = null;
      }

      const parsedWageAmount =
        wageType === "none" || !wageAmount ? null : parseFloat(wageAmount);
      const parsedCommission = commissionPercent
        ? parseFloat(commissionPercent)
        : null;

      if (editingStaff) {
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
      setStaffList((prev) =>
        prev.map((s) => (s.id === staff.id ? { ...s, is_active: staff.is_active } : s))
      );
    }
  };

  /**
   * Execute deletion with automatic storage cleanup
   */
  const handleConfirmDelete = async () => {
    if (!staffToDelete) return;

    setIsDeleting(true);
    try {
      // 1. Remove photo from storage if exists
      if (staffToDelete.image_url) {
        const filePath = extractStoragePath(staffToDelete.image_url, "staff_photos");
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from("staff_photos")
            .remove([filePath]);

          if (storageError) {
            console.warn("Could not delete photo from storage:", storageError.message);
          }
        }
      }

      // 2. Delete staff row from database
      const { error } = await supabase.from("staff").delete().eq("id", staffToDelete.id);
      if (error) throw error;

      setStaffList((prev) => prev.filter((s) => s.id !== staffToDelete.id));
      setStaffToDelete(null);
    } catch (err) {
      console.error("Delete staff error:", err);
      alert("ไม่สามารถลบข้อมูลช่างได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredStaff = staffList.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeStaffCount = staffList.filter((s) => s.is_active).length;

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
    <div className="min-h-screen bg-gradient-to-b from-slate-100/70 via-slate-50 to-slate-100/40 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar - Ultra Clean, No Overflow on Mobile */}
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
              <span>ระบบจัดการช่าง</span>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all shadow-2xs active:scale-95 whitespace-nowrap shrink-0"
              title="จัดการเมนูบริการ"
            >
              <Scissors className="w-3.5 h-3.5 text-amber-600 rotate-[-45deg]" />
              <span className="hidden xs:inline">บริการ</span>
            </Link>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>เพิ่มช่างใหม่</span>
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
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900">
                จัดการรายชื่อช่าง & ค่าคอมมิชชัน
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              กำหนดส่วนแบ่ง % ค่าคอมมิชชัน บันทึกเงินเดือน และเปิด/ปิดสถานะพร้อมให้บริการ
            </p>
          </div>

          {/* Quick Metrics & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
            {/* Staff Counter Pills */}
            <div className="flex items-center justify-between sm:justify-start gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                <span>ทั้งหมด:</span>
                <span className="text-slate-900 font-extrabold">{staffList.length}</span>
              </div>
              <span className="text-slate-300">&bull;</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>พร้อมทำงาน:</span>
                <span className="font-extrabold">{activeStaffCount}</span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-52 md:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อช่าง..."
                className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Staff Cards Grid - Responsive across devices */}
        {filteredStaff.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-14 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto space-y-4">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
              <Users className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {searchQuery ? "ไม่พบรายชื่อช่างที่ค้นหา" : "ยังไม่มีรายชื่อช่างในร้าน"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                เริ่มต้นเพิ่มช่างคนแรกของร้านคุณ เพื่อนำไปใช้คิดเงินในหน้าจอ POS และคำนวณค่าคอมฯ อัตโนมัติ
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={openAddModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ เพิ่มช่างคนแรกของร้าน</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {filteredStaff.map((staff) => {
              const initial = staff.name.trim().charAt(0) || "ช";

              const formattedDate = staff.start_date
                ? new Date(staff.start_date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : null;

              return (
                <div
                  key={staff.id}
                  className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg ${
                    staff.is_active
                      ? "border-slate-200/80 hover:border-indigo-400"
                      : "border-slate-200/50 bg-slate-50/40 opacity-75"
                  }`}
                >
                  <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4">
                    {/* Header: Stylist Profile & Status Switch */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-3">
                        {/* Profile Picture / Avatar */}
                        {staff.image_url ? (
                          <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-white ring-2 ring-indigo-500/20">
                            <Image
                              src={staff.image_url}
                              alt={staff.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center text-lg sm:text-xl font-black shadow-md shadow-purple-500/25 shrink-0 border-2 border-white ring-2 ring-purple-500/20">
                            {initial}
                          </div>
                        )}

                        {/* Name & Start Date */}
                        <div className="space-y-0.5">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate max-w-[140px] sm:max-w-[170px]">
                            {staff.name}
                          </h3>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">เริ่ม: {formattedDate || "ไม่ระบุ"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Active Status Badge Button */}
                      <button
                        onClick={() => handleToggleActive(staff)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer shadow-2xs select-none shrink-0 ${
                          staff.is_active
                            ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200"
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

                    {/* Financial Metrics Cards (Commission & Wage) */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                      {/* Commission % Card */}
                      <div className="bg-gradient-to-br from-purple-50/70 to-indigo-50/50 border border-purple-100/80 rounded-2xl p-3 shadow-2xs">
                        <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                          <Percent className="w-3 h-3 text-purple-600 shrink-0" />
                          <span>ค่าคอมมิชชัน</span>
                        </div>
                        <div className="text-lg sm:text-xl font-black text-purple-900 tracking-tight">
                          {staff.commission_percent ?? 0}%
                        </div>
                        <div className="text-[10px] text-purple-600/70 font-medium mt-0.5">
                          ส่วนแบ่งต่อบิล
                        </div>
                      </div>

                      {/* Wage / Salary Card */}
                      <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 shadow-2xs">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-0.5 truncate">
                          <Banknote className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>
                            {staff.wage_type === "monthly"
                              ? "รายเดือน"
                              : staff.wage_type === "daily"
                              ? "รายวัน"
                              : "คอมฯ ล้วน"}
                          </span>
                        </div>
                        <div className="text-base sm:text-xl font-black text-slate-900 tracking-tight truncate">
                          {staff.wage_type === "none" || !staff.wage_amount
                            ? "ไม่มีเงินเดือน"
                            : `฿${staff.wage_amount.toLocaleString()}`}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">
                          {staff.wage_type === "monthly"
                            ? "เงินเดือนพื้นฐาน"
                            : staff.wage_type === "daily"
                            ? "ค่าจ้างรายวัน"
                            : "รับเฉพาะค่าคอมฯ"}
                        </div>
                      </div>
                    </div>

                    {/* Note / Skill Pill */}
                    {staff.note && (
                      <p className="text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-2.5 leading-relaxed line-clamp-2">
                        {staff.note}
                      </p>
                    )}
                  </div>

                  {/* Card Bottom Actions Bar */}
                  <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>ช่างของร้าน</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Edit Button */}
                      <button
                        onClick={() => openEditModal(staff)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                        <span>แก้ไข</span>
                      </button>

                      {/* Delete Button -> Opens Confirmation Modal */}
                      <button
                        onClick={() => setStaffToDelete(staff)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer active:scale-95"
                        title="ลบช่าง"
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
      {staffToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150">
            {/* Header Icon & Title */}
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  ยืนยันการลบข้อมูลช่าง?
                </h3>
                <p className="text-xs text-slate-500">
                  โปรดตรวจสอบข้อมูลก่อนดำเนินการ
                </p>
              </div>
            </div>

            {/* Stylist Profile Preview Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              {staffToDelete.image_url ? (
                <div className="relative h-11 w-11 rounded-xl overflow-hidden shadow-xs shrink-0 border border-slate-200">
                  <Image
                    src={staffToDelete.image_url}
                    alt={staffToDelete.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-11 w-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm shrink-0">
                  {staffToDelete.name.charAt(0)}
                </div>
              )}

              <div className="min-w-0">
                <div className="text-sm font-extrabold text-slate-900 truncate">
                  {staffToDelete.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  คอมมิชชัน {staffToDelete.commission_percent ?? 0}% &bull;{" "}
                  {staffToDelete.wage_type === "none"
                    ? "คอมฯ ล้วน"
                    : staffToDelete.wage_type === "monthly"
                    ? "รายเดือน"
                    : "รายวัน"}
                </div>
              </div>
            </div>

            {/* Warning Text */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/70 text-xs text-amber-800 leading-relaxed">
              ⚠️ ข้อมูลช่างและไฟล์รูปภาพในคลาวด์จะถูกลบออกถาวรทันที และไม่สามารถกู้คืนได้
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setStaffToDelete(null)}
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
                    <span>ลบข้อมูลถาวร</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Staff Modal - Responsive for Landscape & Mobile */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-white/10 text-white flex items-center justify-center border border-white/10 shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-lg font-bold">
                    {editingStaff ? "แก้ไขข้อมูลช่าง" : "เพิ่มช่างใหม่ในร้าน"}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300">
                    {shop?.name} &bull; กำหนดค่าจ้างและ % ส่วนแบ่ง
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

            {/* Modal Form - Scrollable */}
            <form onSubmit={handleSaveStaff} className="p-4 sm:p-6 overflow-y-auto space-y-3.5 sm:space-y-4 flex-1">
              {errorMessage && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Photo Upload Area with Automatic Compression */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  รูปถ่ายโปรไฟล์ช่าง (Profile Photo)
                </label>
                <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="relative">
                    {previewUrl ? (
                      <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl overflow-hidden shadow-md border-2 border-indigo-500">
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
                      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-slate-200 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                        <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-[9px] font-semibold mt-0.5">ไม่มีรูป</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="staff-photo-upload"
                    />
                    <label
                      htmlFor="staff-photo-upload"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs cursor-pointer transition-all active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{previewUrl ? "เปลี่ยนรูปภาพ" : "เลือกรูปถ่ายจากมือถือ"}</span>
                    </label>

                    {compressionInfo ? (
                      <p className="text-[10px] sm:text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span>{compressionInfo}</span>
                      </p>
                    ) : (
                      <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">
                        ระบบบีบอัดรูปถ่ายมือถือขนาดใหญ่ให้อัตโนมัติ (โหลดไว คมชัด)
                      </p>
                    )}
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
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 sm:py-3 text-base sm:text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
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
                    className="w-full rounded-xl border border-slate-200 pl-3.5 pr-10 py-2.5 sm:py-3 text-base sm:text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 font-bold text-sm">
                    %
                  </div>
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1 block">
                  เช่น 40% หมายถึง ช่างได้ 40% ของยอดบริการ และร้านได้ 60%
                </span>
              </div>

              {/* 3. Wage Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ประเภทค่าจ้าง (Wage Type)
                  </label>
                  <select
                    value={wageType}
                    onChange={(e) => setWageType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 sm:py-3 text-base sm:text-sm bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  >
                    <option value="none">ไม่มีเงินเดือน (คอมฯ ล้วน)</option>
                    <option value="monthly">รายเดือน (Monthly Salary)</option>
                    <option value="daily">รายวัน (Daily Wage)</option>
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
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 sm:py-3 text-base sm:text-sm disabled:bg-slate-100 disabled:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
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
              <div className="pt-1 flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    สถานะพร้อมให้บริการ
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400">
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
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer active:scale-95"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingPhoto}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 active:scale-95 disabled:opacity-60 transition-all cursor-pointer"
                >
                  {saving || uploadingPhoto ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{uploadingPhoto ? "กำลังประมวลผลรูป..." : "กำลังบันทึก..."}</span>
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

      {/* Clean Responsive Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 py-3.5 sm:py-4 text-center text-[11px] sm:text-xs text-slate-400 border-t border-slate-200/60 mt-6">
        LUMINA &bull; ระบบจัดการช่างและค่าคอมมิชชัน &bull; {shop?.name}
      </footer>
    </div>
  );
}
