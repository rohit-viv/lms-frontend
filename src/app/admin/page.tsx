'use client';

import { useEffect, useState } from 'react';
import RoleGuard from '@/components/RoleGuard';
import {
  fetchCourses,
} from '@/store/features/courses/courseSlice';
import {
  useAppDispatch,
  useAppSelector,
} from '@/store/hooks';
import api from '@/services/api';

type UserRecord = {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
};

type UsersResponse = {
  data: UserRecord[];
};

export default function AdminPage() {
  const dispatch = useAppDispatch();
  const { courses } = useAppSelector(
    (state) => state.courses,
  );

  const [users, setUsers] = useState<UserRecord[]>(
    [],
  );
  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState<
    string | null
  >(null);

  useEffect(() => {
    dispatch(
      fetchCourses({
        page: 1,
        limit: 20,
        status: 'published',
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          '/users',
          {
            params: {
              page: 1,
              limit: 50,
            },
          },
        );
        const payload =
          response.data.data as UsersResponse;
        setUsers(payload.data);
        setError(null);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Failed to load users',
        );
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, []);

  const updateRole = async (
    userId: string,
    role: UserRecord['role'],
  ) => {
    try {
      await api.patch(
        `/users/${userId}/role`,
        {
          role,
        },
      );

      setUsers((current) =>
        current.map((user) =>
          user._id === userId
            ? { ...user, role }
            : user,
        ),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Failed to update role',
      );
    }
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <main className="min-h-screen bg-slate-100 p-6 md:p-10">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900">
              Admin Control Panel
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Review platform users and current course catalog.
            </p>
          </section>

          {error && (
            <div className="rounded-2xl bg-red-50 p-4 text-red-600 shadow-sm">
              {error}
            </div>
          )}

          <section className="grid gap-6 xl:grid-cols-2">
            <div
              id="users"
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  Users
                </h2>
                <span className="text-sm text-slate-500">
                  {users.length} records
                </span>
              </div>

              {loading ? (
                <p className="mt-5 text-sm text-slate-500">
                  Loading users...
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {user.email}
                          </p>
                        </div>

                        <select
                          value={user.role}
                          onChange={(event) =>
                            updateRole(
                              user._id,
                              event.target
                                .value as UserRecord['role'],
                            )
                          }
                          className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
                        >
                          <option value="student">
                            Student
                          </option>
                          <option value="instructor">
                            Instructor
                          </option>
                          <option value="admin">
                            Admin
                          </option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              id="courses"
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  Published Courses
                </h2>
                <span className="text-sm text-slate-500">
                  {courses.length} courses
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {course.title}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          {course.description}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase text-slate-600">
                        {course.status}
                      </span>
                    </div>
                  </div>
                ))}

                {courses.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                    No published courses available yet.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </RoleGuard>
  );
}
