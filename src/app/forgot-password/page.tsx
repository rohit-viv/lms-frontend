'use client';

import { FormEvent, useState } from 'react';
import api from '@/services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] =
    useState(false);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setToken('');
    setError('');

    try {
      const response = await api.post(
        '/auth/forgot-password',
        {
          email,
        },
      );
      const payload =
        response.data.data || {};
      setMessage(
        payload.message ||
          'Reset instructions generated.',
      );
      setToken(payload.resetToken || '');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Request failed',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          Reset password
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Generate a reset token for your account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >
          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Email address"
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          />

          {message && (
            <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
              {message}
            </div>
          )}
          {token && (
            <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
              Reset token: {token}
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
              ? 'Generating...'
              : 'Generate Token'}
          </button>
        </form>

        <a
          href="/reset-password"
          className="mt-4 block text-sm font-medium text-blue-600"
        >
          Already have a token?
        </a>
      </div>
    </main>
  );
}
