
'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  useAppDispatch,
  useAppSelector,
} from '@/store/hooks';

import {
  loginUser,
} from '@/store/features/auth/authSlice';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    loading,
    error,
    isAuthenticated,
    initialized,
  } = useAppSelector(
    (state) => state.auth,
  );

  // Already logged-in user ko dashboard bhej do
  useEffect(() => {
    if (initialized && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [
    initialized,
    isAuthenticated,
    router,
  ]);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    const result = await dispatch(
      loginUser({
        email,
        password,
      }),
    );

    if (loginUser.fulfilled.match(result)) {
      router.replace('/dashboard');
    }
  };

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">

      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">

        <h1 className="text-center text-3xl font-bold text-gray-900">
          LMS Login
        </h1>

        <p className="mt-2 text-center text-gray-500">
          Login to continue
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              required
            />
          </div>

          {/* LOGIN ERROR */}
          {error && (
            <div className="rounded-lg bg-red-100 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? 'Logging in...'
              : 'Login'}
          </button>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <a
              href="/register"
              className="hover:text-black"
            >
              Create account
            </a>
            <a
              href="/forgot-password"
              className="hover:text-black"
            >
              Forgot password?
            </a>
          </div>

        </form>

      </div>

    </main>
  );
}
