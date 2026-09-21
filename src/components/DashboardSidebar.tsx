'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/features/auth/authSlice';

type DashboardSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function DashboardSidebar({
  open,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector(
    (state) => state.auth.user,
  );

  const role =
    user?.role?.toLowerCase() || '';

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }

    return pathname.startsWith(href);
  };

  const menuClass = (href: string) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive(href)
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col bg-slate-950 transition-transform duration-300 lg:translate-x-0 ${
          open
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >
        {/* LOGO */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <Link
            href="/dashboard"
            onClick={onClose}
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
            onClick={onClose}
            className="text-2xl text-slate-400 lg:hidden"
          >
            ×
          </button>
        </div>

        {/* PROFILE */}
        <div className="border-b border-slate-800 px-5 py-5">
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

              <span className="mt-1 inline-block rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium uppercase text-blue-400">
                {role || 'user'}
              </span>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-2 px-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600">
            Overview
          </p>

          <div className="space-y-1">
            <Link
              href="/dashboard"
              onClick={onClose}
              className={menuClass('/dashboard')}
            >
              <span className="w-5 text-center text-lg">
                ▦
              </span>
              Dashboard
            </Link>

            <Link
              href="/courses"
              onClick={onClose}
              className={menuClass('/courses')}
            >
              <span className="w-5 text-center text-lg">
                ▤
              </span>
              Courses
            </Link>

            {role === 'student' && (
              <Link
                href="/my-courses"
                onClick={onClose}
                className={menuClass(
                  '/my-courses',
                )}
              >
                <span className="w-5 text-center text-lg">
                  ◉
                </span>
                My Courses
              </Link>
            )}
          </div>

          {role === 'admin' && (
            <>
              <p className="mb-2 mt-7 px-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                Management
              </p>

              <div className="space-y-1">
                <Link
                  href="/admin"
                  onClick={onClose}
                  className={menuClass('/admin')}
                >
                  <span className="w-5 text-center text-lg">
                    ⚙
                  </span>
                  Admin Panel
                </Link>
              </div>
            </>
          )}

          {role === 'instructor' && (
            <>
              <p className="mb-2 mt-7 px-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                Instructor
              </p>

              <Link
                href="/instructor"
                onClick={onClose}
                className={menuClass(
                  '/instructor',
                )}
              >
                <span className="w-5 text-center">
                  □
                </span>
                Instructor Panel
              </Link>
            </>
          )}
        </nav>

        {/* LOGOUT */}
        <div className="border-t border-slate-800 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <span className="text-lg">↪</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
