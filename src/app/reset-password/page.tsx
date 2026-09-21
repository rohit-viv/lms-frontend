'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] =
    useState('');
  const [loading, setLoading] =
    useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post(
        '/auth/reset-password',
        {
          token,
          newPassword,
        },
      );

      setMessage(
        response.data.data?.message ||
          'Password reset successfully.',
      );
      setTimeout(() => {
        router.replace('/login');
      }, 1200);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Reset failed',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          Set a new password
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >
          <input
            value={token}
            onChange={(event) =>
              setToken(event.target.value)
            }
            placeholder="Reset token"
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(
                event.target.value,
              )
            }
            placeholder="New password"
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          />

          {message && (
            <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white"
          >
            {loading
              ? 'Resetting...'
              : 'Reset Password'}
          </button>
        </form>
      </div>
    </main>
  );
}
