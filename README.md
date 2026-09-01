# LUMINA - All-in-One Salon & Barbershop Platform 💈✂️

แพลตฟอร์มบริหารจัดการร้านตัดผม ซาลอน และบาร์เบอร์ยุคใหม่ — คิดเงินไว สรุปค่าคอมมิชชันช่างแม่นยำ รู้กำไรสุทธิเรียลไทม์ใน 3 วินาที

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16.3](https://nextjs.org/) (App Router + Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Auth**: [Supabase Cloud](https://supabase.com/) (PostgreSQL + Auth + RLS)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🏆 Phase 1: Authentication & Compliance (100% Passed & Verified)

ระบบสมาชิกและความปลอดภัยผ่านการทดสอบครบถ้วน 100% พร้อมใช้งานจริง:

1. **ระบบเข้าสู่ระบบ (Login Flow - `/login`)**:
   - รองรับ **Google OAuth** และ **Facebook OAuth** (ผ่าน Meta App ID `1837996634280236`)
   - รองรับ **Email & Password** พร้อมระบบเปิด/ปิดดูลูกตารหัสผ่าน
   - ดีไซน์คลีนตา ปรับสัดส่วนรองรับหน้าจอมือถือและเดสก์ท็อปอย่างลงตัว

2. **ระบบสมัครเปิดร้านค้าใหม่ (Registration Flow - `/register`)**:
   - สิทธิ์ทดลองใช้งานฟรี **2 เดือนเต็ม (All-Access 60 วัน)** โดยไม่ต้องกรอกบัตรเครดิต
   - บันทึกข้อมูลร้านค้าลงตาราง `shops` อัตโนมัติ พร้อมตั้งค่า `plan_status = 'trial'`

3. **ระบบกู้คืนรหัสผ่าน (Password Recovery - `/forgot-password` & `/reset-password`)**:
   - ส่งลิงก์ยืนยันความปลอดภัยไปยังอีเมลจริงผ่าน Supabase
   - ระบบตั้งรหัสผ่านใหม่ พร้อม Security Guard ป้องกันการเข้าถึงโดยตรง และระบบ Single-Use Token

4. **ระบบยินยอมเงื่อนไขการใช้งาน & PDPA (Consent Modal)**:
   - ป๊อปอัปต้อนรับอัตโนมัติสำหรับการเข้าสู่ระบบครั้งแรก (First-Time Login)
   - สรุปสิทธิ์ 2 เดือน และการคุ้มครองข้อมูลยอดขายร้านค้าตาม พ.ร.บ. PDPA
   - บันทึกเวลาที่ยินยอมลงในตาราง `shops` (`terms_accepted_at`) และ `auth.users` (`user_metadata`)

5. **Mobile Native Experience**:
   - ปรับแต่ง `viewport` และ `font-size: 16px` สำหรับช่องกรอกข้อมูลบนมือถือ ป้องกันปัญหา iOS Safari Auto-Zoom ให้ความรู้สึกนิ่งสนิทเหมือนใช้งาน Mobile App จริง

---

## 🗺️ Phase 2 Roadmap (แผนการพัฒนารอบถัดไป)

1. 💈 **สเต็ป 1: ระบบจัดการรายการบริการและราคา (`/services`)**:
   - เชื่อมต่อตาราง `services` (`name`, `price`, `duration`, `shop_id`)
   - ฟังก์ชันเพิ่ม แก้ไข ลบรายการตัดผม สระไดร์ ทำสี ดัด ยืด ทรีตเมนต์
   - ปุ่มคลิกเดียวโหลดเมนูมาตรฐานซาลอนไทย (Quick Sample Template)
2. 👥 **สเต็ป 2: ระบบจัดการช่างและค่าคอมมิชชัน (`/staff`)**:
   - เชื่อมต่อตาราง `staff`
   - เพิ่มช่าง รูปโปรไฟล์ กำหนดประเภทค่าจ้าง และตั้งค่า `% commission_percent`
3. 🧾 **สเต็ป 3: ระบบคิดเงิน Fast POS (`/pos`)**:
   - หน้าจอแตะคิดเงินสำหรับ iPad/แท็บเล็ต/มือถือ
   - คำนวณราคา ค่าคอมฯ ช่างอัตโนมัติ และบันทึกลงตาราง `transactions`

---

## ⚙️ Environment Variables (สำหรับ Vercel Deployment)

ตั้งค่าใน Vercel Dashboard -> Project Settings -> Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dkpaqevtxvtbaoedoipj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_AqLPCg2si88nvDrg3f6thw_b8M1QWCB
```

---

## 💻 Local Development

```bash
cd ~/.gemini/antigravity/scratchs/lumina
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) บนเบราว์เซอร์
