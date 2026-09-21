
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import ProtectedRoute from '@/components/ProtectedRoute';

import {
  useAppDispatch,
  useAppSelector,
} from '@/store/hooks';

import {
  fetchMyCourses,
} from '@/store/features/enrollments/enrollmentSlice';

export default function MyCoursesPage() {
  const dispatch = useAppDispatch();

  const {
    myCourses,
    loading,
    error,
  } = useAppSelector(
    (state) => state.enrollments,
  );

  // --------------------------------
  // FETCH LOGGED-IN USER COURSES
  // API: GET /v1/courses/my/enrollments
  // --------------------------------
  useEffect(() => {
    dispatch(fetchMyCourses());
  }, [dispatch]);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-100 p-6 md:p-10">

        <div className="mx-auto max-w-6xl">

          {/* HEADER */}
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>
              <h1 className="text-3xl font-bold">
                My Courses
              </h1>

              <p className="mt-2 text-gray-500">
                View and continue your enrolled courses
              </p>
            </div>

            <div className="flex gap-3">

              <Link
                href="/courses"
                className="rounded-lg border bg-white px-4 py-2"
              >
                Browse Courses
              </Link>

              <Link
                href="/dashboard"
                className="rounded-lg bg-black px-4 py-2 text-white"
              >
                Dashboard
              </Link>

            </div>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="rounded-xl bg-white p-6 shadow">
              Loading your courses...
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="rounded-xl bg-red-100 p-4 text-red-600">
              {error}
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading &&
            !error &&
            myCourses.length === 0 && (
              <div className="rounded-xl bg-white p-8 text-center shadow">

                <h2 className="text-xl font-bold">
                  No enrolled courses
                </h2>

                <p className="mt-2 text-gray-500">
                  You have not enrolled in any course yet.
                </p>

                <Link
                  href="/courses"
                  className="mt-5 inline-block rounded-lg bg-black px-5 py-3 text-white"
                >
                  Browse Courses
                </Link>

              </div>
            )}

          {/* COURSE LIST */}
          {!loading &&
            !error &&
            myCourses.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {myCourses.map((enrollment) => {
                  const course =
                    enrollment.course;

                  if (!course) {
                    return null;
                  }

                  if (typeof course === 'string') {
                    return null;
                  }

                  const progress =
                    enrollment.progress ?? 0;

                  return (
                    <div
                      key={enrollment._id}
                      className="rounded-xl bg-white p-6 shadow"
                    >

                      {/* COURSE TITLE */}
                      <h2 className="text-xl font-bold">
                        {course.title || 'Course'}
                      </h2>

                      {/* DESCRIPTION */}
                      <p className="mt-3 line-clamp-3 text-gray-600">
                        {course.description ||
                          'No description available'}
                      </p>

                      {/* PROGRESS */}
                      <div className="mt-6">

                        <div className="flex items-center justify-between">

                          <span className="text-sm text-gray-500">
                            Progress
                          </span>

                          <span className="font-semibold">
                            {progress}%
                          </span>

                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">

                          <div
                            className="h-full bg-green-600 transition-all"
                            style={{
                              width: `${Math.min(
                                progress,
                                100,
                              )}%`,
                            }}
                          />

                        </div>

                      </div>

                      {/* STATUS */}
                      <div className="mt-4">

                        <span className="text-sm text-gray-500">
                          Status:
                        </span>

                        <span className="ml-2 rounded bg-gray-100 px-3 py-1 text-sm font-medium">
                          {enrollment.status ||
                            'active'}
                        </span>

                      </div>

                      {/* CONTINUE */}
                      <Link
                        href={`/courses/${course._id}`}
                        className="mt-6 block rounded-lg bg-black px-4 py-3 text-center text-white"
                      >
                        Continue Course
                      </Link>

                    </div>
                  );
                })}

              </div>
            )}

        </div>

      </main>
    </ProtectedRoute>
  );
}
