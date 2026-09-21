'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] =
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
    setError('');
    setMessage('');

    try {
      const response = await api.post(
        '/auth/register',
        {
          name,
          email,
          password,
        },
      );

      setMessage(
        response.data.data?.message ||
          'Account created successfully.',
      );
      setTimeout(() => {
        router.replace('/login');
      }, 1200);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Registration failed',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          Create account
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Start your LMS journey.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >
          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Full name"
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          />
          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Email address"
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          />
          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Password"
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
              ? 'Creating account...'
              : 'Register'}
          </button>
        </form>
      </div>
    </main>
  );
}
