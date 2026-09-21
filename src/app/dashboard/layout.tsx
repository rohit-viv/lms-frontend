'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  usePathname,
  useRouter,
} from 'next/navigation';

import ProtectedRoute from '@/components/ProtectedRoute';

import {
  useAppDispatch,
  useAppSelector,
} from '@/store/hooks';

import {
  logout,
} from '@/store/features/auth/authSlice';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const user = useAppSelector(
    (state) => state.auth.user,
  );

  const role =
    user?.role?.toLowerCase() || '';

  const handleLogout = () => {
    dispatch(logout());

    router.replace('/login');
  };

  const isActive = (
    href: string,
  ) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }

    return pathname.startsWith(href);
  };

  const menuClass = (
    href: string,
  ) => {
    return `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive(href)
        ? 'bg-blue-600 text-white'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-100">

        {/* ============================= */}
        {/* MOBILE OVERLAY */}
        {/* ============================= */}

        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}

        {/* ============================= */}
        {/* SIDEBAR */}
        {/* ============================= */}

        <aside
          className={`fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col bg-slate-950 transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }`}
        >
          {/* LOGO */}

          <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">

            <Link
              href="/dashboard"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                L
              </div>

              <div>
                <h1 className="text-lg font-bold text-white">
                  LearnFlow
                </h1>

                <p className="text-xs text-slate-500">
                  LMS Platform
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="text-2xl text-white lg:hidden"
            >
              ×
            </button>

          </div>

          {/* ============================= */}
          {/* USER */}
          {/* ============================= */}

          <div className="border-b border-slate-800 p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                {user?.name
                  ?.charAt(0)
                  .toUpperCase() || 'U'}
              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-white">
                  {user?.name || 'User'}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {user?.email}
                </p>

                <span className="mt-1 inline-block rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-blue-400">
                  {role || 'user'}
                </span>

              </div>

            </div>

          </div>

          {/* ============================= */}
          {/* MENU */}
          {/* ============================= */}

          <nav className="flex-1 overflow-y-auto p-4">

            <p className="mb-3 px-4 text-[11px] font-semibold uppercase tracking-widest text-slate-600">
              Overview
            </p>

            <div className="space-y-1">

              <Link
                href="/dashboard"
                onClick={() =>
                  setSidebarOpen(false)
                }
                className={menuClass(
                  '/dashboard',
                )}
              >
                <span className="text-lg">
                  ▦
                </span>

                Dashboard
              </Link>

              <Link
                href="/courses"
                onClick={() =>
                  setSidebarOpen(false)
                }
                className={menuClass(
                  '/courses',
                )}
              >
                <span className="text-lg">
                  ▤
                </span>

                Courses
              </Link>

              {role === 'student' && (
                <Link
                  href="/my-courses"
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                  className={menuClass(
                    '/my-courses',
                  )}
                >
                  <span className="text-lg">
                    ◉
                  </span>

                  My Courses
                </Link>
              )}

            </div>

            {/* ============================= */}
            {/* ADMIN MENU */}
            {/* ============================= */}

            {role === 'admin' && (
              <>
                <p className="mb-3 mt-8 px-4 text-[11px] font-semibold uppercase tracking-widest text-slate-600">
                  Management
                </p>

                <div className="space-y-1">

                  <Link
                    href="/admin"
                    onClick={() =>
                      setSidebarOpen(false)
                    }
                    className={menuClass(
                      '/admin',
                    )}
                  >
                    <span className="text-lg">
                      ⚙
                    </span>

                    Admin Panel
                  </Link>

                  <Link
                    href="/admin#users"
                    onClick={() =>
                      setSidebarOpen(false)
                    }
                    className={menuClass(
                      '/admin',
                    )}
                  >
                    <span>👨‍🎓</span>

                    Students
                  </Link>

                  <Link
                    href="/admin#users"
                    onClick={() =>
                      setSidebarOpen(false)
                    }
                    className={menuClass(
                      '/admin',
                    )}
                  >
                    <span>👨‍🏫</span>

                    Instructors
                  </Link>

                  <Link
                    href="/admin#courses"
                    onClick={() =>
                      setSidebarOpen(false)
                    }
                    className={menuClass(
                      '/admin',
                    )}
                  >
                    <span>✓</span>

                    Enrollments
                  </Link>

                  <Link
                    href="/admin#courses"
                    onClick={() =>
                      setSidebarOpen(false)
                    }
                    className={menuClass(
                      '/admin',
                    )}
                  >
                    <span>▥</span>

                    Reports
                  </Link>

                </div>
              </>
            )}

            {/* ============================= */}
            {/* INSTRUCTOR MENU */}
            {/* ============================= */}

            {role === 'instructor' && (
              <>
                <p className="mb-3 mt-8 px-4 text-[11px] font-semibold uppercase tracking-widest text-slate-600">
                  Instructor
                </p>

                <Link
                  href="/instructor"
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                  className={menuClass(
                    '/instructor',
                  )}
                >
                  <span>□</span>

                  Instructor Panel
                </Link>
              </>
            )}

          </nav>

          {/* ============================= */}
          {/* LOGOUT */}
          {/* ============================= */}

          <div className="border-t border-slate-800 p-4">

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-400 hover:bg-red-500/10"
            >
              <span>↪</span>

              Logout
            </button>

          </div>

        </aside>

        {/* ============================= */}
        {/* RIGHT CONTENT */}
        {/* ============================= */}

        <div className="min-h-screen lg:ml-[270px]">

          {/* ============================= */}
          {/* HEADER */}
          {/* ============================= */}

          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">

            <div className="flex items-center gap-4">

              {/* MOBILE SIDEBAR */}

              <button
                type="button"
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-xl lg:hidden"
              >
                ☰
              </button>

              {/* SEARCH */}

              <div className="hidden w-[350px] items-center rounded-xl bg-slate-100 px-4 md:flex">

                <span className="mr-2 text-slate-400">
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Search courses, students..."
                  className="h-11 w-full bg-transparent text-sm outline-none"
                />

              </div>

            </div>

            {/* RIGHT HEADER */}

            <div className="flex items-center gap-4">

              {/* NOTIFICATION */}

              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200"
              >
                🔔

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {/* PROFILE */}

              <div className="flex items-center gap-3">

                <div className="hidden text-right sm:block">

                  <p className="text-sm font-semibold text-slate-900">
                    {user?.name}
                  </p>

                  <p className="text-xs capitalize text-slate-500">
                    {role}
                  </p>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  {user?.name
                    ?.charAt(0)
                    .toUpperCase() || 'U'}
                </div>

              </div>

            </div>

          </header>

          {/* ============================= */}
          {/* PAGE */}
          {/* ============================= */}

          <main className="p-4 md:p-6 xl:p-8">
            {children}
          </main>

        </div>

      </div>
    </ProtectedRoute>
  );
}
