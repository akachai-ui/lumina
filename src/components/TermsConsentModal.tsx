"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Lock,
  Sparkles,
  Gift,
  Loader2,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TermsConsentModalProps {
  isOpen: boolean;
  userEmail?: string;
  userName?: string;
  onAccepted: () => void;
  onDeclined: () => void;
}

export default function TermsConsentModal({
  isOpen,
  userEmail,
  userName,
  onAccepted,
  onDeclined,
}: TermsConsentModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAccept = async () => {
    if (!agreed) return;

    setSaving(true);
    setErrorMessage(null);

    try {
      const now = new Date().toISOString();

      // 1. Update Auth User Metadata
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: {
          terms_accepted: true,
          terms_accepted_at: now,
          terms_version: "1.0",
        },
      });

      if (authError) {
        throw authError;
      }

      // 2. Also update terms_accepted_at in shops table for this owner if shop exists
      if (authData.user) {
        await (supabase.from("shops") as ReturnType<typeof supabase.from>)
          .update({ terms_accepted_at: now } as never)
          .eq("owner_id", authData.user.id);
      }

      onAccepted();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 text-white relative">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-white/10 backdrop-blur-md text-emerald-400 flex items-center justify-center shrink-0 border border-white/10">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  ยินดีต้อนรับสู่ LUMINA
                </span>
                <span className="text-[10px] text-slate-400 font-medium">PDPA & Terms</span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white mt-1">
                เงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            สวัสดีคุณ <strong className="text-white">{userName || userEmail}</strong> เพื่อความปลอดภัยและความโปร่งใสในการดูแลข้อมูลร้านค้าของคุณ กรุณาอ่านและยอมรับเงื่อนไขก่อนเริ่มต้นใช้งานระบบ
          </p>
        </div>

        {/* Scrollable Terms Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 divide-y divide-slate-200/60">
          {/* Clause 1: 2-Month Free Trial */}
          <div className="pt-2 first:pt-0 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs sm:text-sm">
              <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>1. สิทธิ์การทดลองใช้งานฟรี 2 เดือนเต็ม (60 วัน)</span>
            </div>
            <p className="text-xs text-slate-600 pl-6">
              ระบบ LUMINA มอบสิทธิ์การทดลองใช้งานฟังก์ชันระดับพรีเมียมครบวงจรฟรีเป็นเวลา 60 วัน โดยไม่มีการผูกมัดบัตรเครดิต และไม่มีการเรียกเก็บค่าบริการย้อนหลังใดๆ เมื่อครบกำหนดคุณสามารถตัดสินใจเลือกแพ็กเกจที่เหมาะสมกับร้านค้าของคุณได้ตามความสมัครใจ
            </p>
          </div>

          {/* Clause 2: PDPA & Data Privacy */}
          <div className="pt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs sm:text-sm">
              <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>2. การคุ้มครองข้อมูลส่วนบุคคลและข้อมูลร้านค้า (PDPA)</span>
            </div>
            <p className="text-xs text-slate-600 pl-6">
              เราให้ความสำคัญสูงสุดกับความเป็นส่วนตัวของคุณ ข้อมูลยอดขาย รายได้ รายชื่อลูกค้า และข้อมูลช่างในร้าน ถือเป็นทรัพย์สินส่วนบุคคลของคุณแต่เพียงผู้เดียว ระบบ LUMINA มีมาตรการเข้ารหัสความปลอดภัยระดับมาตรฐานสากล และจะไม่นำข้อมูลทางธุรกิจของคุณไปเผยแพร่ หรือจำหน่ายให้แก่บุคคลภายนอกโดยเด็ดขาด
            </p>
          </div>

          {/* Clause 3: Account Security */}
          <div className="pt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs sm:text-sm">
              <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>3. หน้าที่และความรับผิดชอบของผู้ใช้งาน</span>
            </div>
            <p className="text-xs text-slate-600 pl-6">
              ผู้ใช้งานมีหน้าที่รักษาความปลอดภัยของบัญชีเข้าสู่ระบบ (รวมถึงบัญชี Google, Facebook หรือรหัสผ่าน) มิให้บุคคลอื่นเข้าถึงโดยไม่ได้รับอนุญาต และต้องไม่ใช้ระบบเพื่อการกระทำที่ผิดกฎหมายหรือละเมิดสิทธิของผู้อื่น
            </p>
          </div>

          {/* Clause 4: Service Availability */}
          <div className="pt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>4. ความเสถียรและการสำรองข้อมูล</span>
            </div>
            <p className="text-xs text-slate-600 pl-6">
              ระบบ LUMINA ดำเนินการบนโครงสร้างคลาวด์ความเสถียรสูง (Cloud Database Infrastructure) มีระบบสำรองข้อมูลอัตโนมัติ เพื่อให้ร้านค้าของคุณสามารถเปิดบิลและจัดการคิวได้อย่างราบรื่นทุกวัน
            </p>
          </div>
        </div>

        {/* Modal Footer / Acceptance Checkbox & Actions */}
        <div className="p-5 sm:p-6 bg-white border-t border-slate-200 space-y-4">
          {errorMessage && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
              {errorMessage}
            </div>
          )}

          {/* Agreement Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-5 w-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer mt-0.5"
            />
            <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
              ข้าพเจ้าได้อ่าน เข้าใจ และตกลงยอมรับเงื่อนไขการให้บริการ และนโยบายความเป็นส่วนตัว (PDPA) ของระบบ LUMINA ทั้งหมด
            </span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={onDeclined}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ปฏิเสธและออกจากระบบ</span>
            </button>

            <button
              type="button"
              disabled={!agreed || saving}
              onClick={handleAccept}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 hover:from-indigo-700 hover:to-violet-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังบันทึกข้อมูล...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>ยอมรับเงื่อนไขและเริ่มต้นใช้งาน</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
