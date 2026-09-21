'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import ProtectedRoute from '@/components/ProtectedRoute';

import {
  useAppDispatch,
  useAppSelector,
} from '@/store/hooks';

import {
  fetchCourses,
} from '@/store/features/courses/courseSlice';

export default function CoursesPage() {
  const dispatch = useAppDispatch();

  const {
    courses,
    loading,
    error,
    page,
    totalPages,
  } = useAppSelector(
    (state) => state.courses,
  );

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] =
    useState('');

  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('latest');

  // --------------------------------
  // SEARCH DEBOUNCE
  // --------------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // --------------------------------
  // GET ALL COURSES
  // API: GET /v1/courses
  // --------------------------------
  useEffect(() => {
    dispatch(
      fetchCourses({
        page: 1,
        limit: 6,
        search: debouncedSearch,
        status: status || undefined,
        sort,
      }),
    );
  }, [
    dispatch,
    debouncedSearch,
    status,
    sort,
  ]);

  // --------------------------------
  // PAGINATION
  // --------------------------------
  const handlePageChange = (
    newPage: number,
  ) => {
    dispatch(
      fetchCourses({
        page: newPage,
        limit: 6,
        search: debouncedSearch,
        status: status || undefined,
        sort,
      }),
    );
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-100 p-6 md:p-10">

        <div className="mx-auto max-w-6xl">

          {/* HEADER */}
          <div className="mb-6 flex items-center justify-between">

            <div>
              <h1 className="text-3xl font-bold">
                Courses
              </h1>

              <p className="mt-2 text-gray-500">
                Browse available courses
              </p>
            </div>

            <Link
              href="/dashboard"
              className="rounded border px-4 py-2"
            >
              Back to Dashboard
            </Link>

          </div>

          {/* FILTER SECTION */}
          <section className="mb-6 grid gap-4 rounded-xl bg-white p-5 shadow md:grid-cols-3">

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search course..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />

            {/* STATUS */}
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none"
            >
              <option value="">
                All Status
              </option>

              <option value="published">
                Published
              </option>

              <option value="draft">
                Draft
              </option>
            </select>

            {/* SORT */}
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none"
            >
              <option value="latest">
                Latest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="price_asc">
                Price: Low to High
              </option>

              <option value="price_desc">
                Price: High to Low
              </option>
            </select>

          </section>

          {/* LOADING */}
          {loading && (
            <div className="rounded-xl bg-white p-6 shadow">
              Loading courses...
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-100 p-4 text-red-600">
              {error}
            </div>
          )}

          {/* NO DATA */}
          {!loading &&
            !error &&
            courses.length === 0 && (
              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-gray-500">
                  No courses found.
                </p>
              </div>
            )}

          {/* COURSE CARDS */}
          {!loading && (
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {courses.map((course) => (
                <div
                  key={course._id}
                  className="rounded-xl bg-white p-6 shadow"
                >

                  <div className="flex items-start justify-between gap-3">

                    <h2 className="text-xl font-bold">
                      {course.title}
                    </h2>

                    <span className="rounded bg-gray-100 px-3 py-1 text-xs">
                      {course.status}
                    </span>

                  </div>

                  <p className="mt-3 line-clamp-3 text-gray-600">
                    {course.description}
                  </p>

                  <p className="mt-5 text-xl font-semibold">
                    ₹{course.price}
                  </p>

                  {/* GO TO COURSE DETAIL */}
                  <Link
                    href={`/courses/${course._id}`}
                    className="mt-5 block rounded-lg bg-black px-4 py-3 text-center text-white"
                  >
                    View Course
                  </Link>

                </div>
              ))}

            </section>
          )}

          {/* PAGINATION */}
          {!loading &&
            totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">

                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    handlePageChange(page - 1)
                  }
                  className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="font-medium">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    handlePageChange(page + 1)
                  }
                  className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>

              </div>
            )}

        </div>

      </main>
    </ProtectedRoute>
  );
}
