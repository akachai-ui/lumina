"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Scissors, Menu, X, ArrowRight, Sparkles, LogIn, LayoutDashboard } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (isMounted) {
          setIsLoggedIn(!!session);
        }
      } catch (err) {
        console.error("Error checking auth status:", err);
      }
    }

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setIsLoggedIn(!!session);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20">
        {/* Brand Logo - Links to /dashboard if logged in, otherwise / */}
        <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 group shrink-0">
          <div className="relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Scissors className="h-4 w-4 sm:h-5 sm:w-5 rotate-[-45deg]" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900">
                LUMINA
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200/60">
                <Sparkles className="w-3 text-indigo-500" />
                Salon SaaS
              </span>
            </div>
            <span className="text-[9px] tracking-wider text-slate-400 font-semibold -mt-1 hidden sm:block">
              SALON MANAGEMENT
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a
            href="#features"
            className="hover:text-indigo-600 transition-colors py-1 hover:border-b-2 hover:border-indigo-600"
          >
            ฟีเจอร์หลัก
          </a>
          <a
            href="#highlights"
            className="hover:text-indigo-600 transition-colors py-1 hover:border-b-2 hover:border-indigo-600"
          >
            จุดเด่น
          </a>
          <a
            href="#pricing"
            className="hover:text-indigo-600 transition-colors py-1 hover:border-b-2 hover:border-indigo-600"
          >
            ตารางราคา
          </a>
          <a
            href="#contact"
            className="hover:text-indigo-600 transition-colors py-1 hover:border-b-2 hover:border-indigo-600"
          >
            ติดต่อเรา
          </a>
        </div>

        {/* Desktop Right Actions - Smart Auth-aware */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 active:scale-95 transition-all"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>ไปที่แดชบอร์ดร้านค้า</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-3 py-2"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/30 hover:shadow-md hover:shadow-indigo-500/40 hover:from-indigo-700 hover:to-violet-700 active:scale-95 transition-all"
              >
                <span>ทดลองใช้ฟรี 2 เดือน</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Right Actions - Smart Auth-aware */}
        <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm active:scale-95 transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>แดชบอร์ด</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-200/70 active:scale-95 transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-600" />
              <span>เข้าสู่ระบบ</span>
            </Link>
          )}

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-xl p-1.5 text-slate-700 hover:bg-slate-100 active:scale-90 transition-all focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-3 pb-6 md:hidden shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2 font-medium text-slate-700">
            <a
              href="#features"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-3.5 py-2.5 hover:bg-slate-50 hover:text-indigo-600 text-sm font-semibold"
            >
              ฟีเจอร์หลัก
            </a>
            <a
              href="#highlights"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-3.5 py-2.5 hover:bg-slate-50 hover:text-indigo-600 text-sm font-semibold"
            >
              จุดเด่น
            </a>
            <a
              href="#pricing"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-3.5 py-2.5 hover:bg-slate-50 hover:text-indigo-600 text-sm font-semibold"
            >
              ตารางราคา
            </a>
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-3.5 py-2.5 hover:bg-slate-50 hover:text-indigo-600 text-sm font-semibold"
            >
              ติดต่อเรา
            </a>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-600/25"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>เข้าสู่แดชบอร์ดร้านค้า</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100"
                  >
                    <LogIn className="w-4 h-4 text-indigo-600" />
                    <span>เข้าสู่ระบบจัดการร้าน</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                  >
                    <span>ทดลองใช้ฟรี 2 เดือน</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
