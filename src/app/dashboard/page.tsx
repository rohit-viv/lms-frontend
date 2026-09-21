'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  fetchCourses,
  fetchInstructorCourses,
} from '@/store/features/courses/courseSlice';
import {
  fetchDashboardStats,
} from '@/store/features/dashboard/dashboardSlice';
import {
  fetchMyCourses,
} from '@/store/features/enrollments/enrollmentSlice';
import {
  useAppDispatch,
  useAppSelector,
} from '@/store/hooks';

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-400">
        {hint}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(
    (state) => state.auth.user,
  );
  const role =
    user?.role?.toLowerCase() || '';

  const courseState = useAppSelector(
    (state) => state.courses,
  );
  const enrollmentState = useAppSelector(
    (state) => state.enrollments,
  );
  const dashboardState = useAppSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    if (role === 'admin') {
      dispatch(fetchDashboardStats());
      return;
    }

    if (role === 'instructor') {
      dispatch(fetchInstructorCourses());
      return;
    }

    if (role === 'student') {
      dispatch(
        fetchCourses({
          page: 1,
          limit: 6,
        }),
      );
      dispatch(fetchMyCourses());
    }
  }, [dispatch, role]);

  const enrolledCount =
    enrollmentState.myCourses.length;
  const completedCount =
    enrollmentState.myCourses.filter(
      (enrollment) =>
        enrollment.status === 'completed',
    ).length;
  const averageProgress =
    enrolledCount > 0
      ? Math.round(
          enrollmentState.myCourses.reduce(
            (total, enrollment) =>
              total +
              (enrollment.progress ?? 0),
            0,
          ) / enrolledCount,
        )
      : 0;
  const publishedCourses =
    courseState.courses.filter(
      (course) =>
        course.status === 'published',
    ).length;

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.name || 'User'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Your LMS workspace is ready.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {role === 'admin' && (
            <Link
              href="/admin"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Open Admin Panel
            </Link>
          )}
          {role === 'instructor' && (
            <Link
              href="/instructor"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Manage Courses
            </Link>
          )}
          {role === 'student' && (
            <>
              <Link
                href="/courses"
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Browse Courses
              </Link>
              <Link
                href="/my-courses"
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              >
                My Learning
              </Link>
            </>
          )}
        </div>
      </section>

      {role === 'admin' && (
        <>
          {dashboardState.error && (
            <div className="mb-6 rounded-2xl bg-red-50 p-4 text-red-600">
              {dashboardState.error}
            </div>
          )}

          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total Courses"
              value={dashboardState.stats.totalCourses}
              hint="All catalog entries"
            />
            <MetricCard
              label="Students"
              value={dashboardState.stats.totalStudents}
              hint="Registered learners"
            />
            <MetricCard
              label="Instructors"
              value={dashboardState.stats.totalInstructors}
              hint="Course creators"
            />
            <MetricCard
              label="Enrollments"
              value={dashboardState.stats.totalEnrollments}
              hint="Platform activity"
            />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Enrollments
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {dashboardState.recentEnrollments.map(
                  (item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between gap-4 p-6"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.student?.name || 'Student'}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.course?.title || 'Course'}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-600">
                        {item.status || 'active'}
                      </span>
                    </div>
                  ),
                )}
                {dashboardState.recentEnrollments.length ===
                  0 && (
                  <div className="p-6 text-sm text-slate-500">
                    No enrollments yet.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Course Status
              </h2>
              <div className="mt-6 space-y-5">
                <MetricCard
                  label="Published"
                  value={
                    dashboardState.courseStatus
                      .published
                  }
                  hint="Visible to students"
                />
                <MetricCard
                  label="Draft"
                  value={
                    dashboardState.courseStatus.draft
                  }
                  hint="Still in progress"
                />
              </div>
            </div>
          </section>
        </>
      )}

      {role === 'instructor' && (
        <>
          <section className="grid gap-5 sm:grid-cols-3">
            <MetricCard
              label="My Courses"
              value={courseState.courses.length}
              hint="Courses you own"
            />
            <MetricCard
              label="Published"
              value={publishedCourses}
              hint="Student-facing courses"
            />
            <MetricCard
              label="Draft"
              value={
                courseState.courses.length -
                publishedCourses
              }
              hint="Ready for editing"
            />
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Course Pipeline
              </h2>
              <Link
                href="/instructor"
                className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
              >
                Open Workspace
              </Link>
            </div>

            <div className="mt-5 space-y-4">
              {courseState.courses.map((course) => (
                <div
                  key={course._id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
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
              {courseState.courses.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                  No courses created yet.
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {role === 'student' && (
        <>
          <section className="grid gap-5 sm:grid-cols-3">
            <MetricCard
              label="Enrolled Courses"
              value={enrolledCount}
              hint="Active learning paths"
            />
            <MetricCard
              label="Completed"
              value={completedCount}
              hint="Finished courses"
            />
            <MetricCard
              label="Average Progress"
              value={`${averageProgress}%`}
              hint="Across all enrollments"
            />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  Continue Learning
                </h2>
                <Link
                  href="/my-courses"
                  className="text-sm font-semibold text-blue-600"
                >
                  View all
                </Link>
              </div>
              <div className="mt-5 space-y-4">
                {enrollmentState.myCourses.map(
                  (enrollment) => {
                    const course =
                      typeof enrollment.course ===
                      'string'
                        ? null
                        : enrollment.course;

                    if (!course) {
                      return null;
                    }

                    return (
                      <Link
                        key={enrollment._id}
                        href={`/courses/${course._id}`}
                        className="block rounded-xl border border-slate-200 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {course.title}
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                              {course.description}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-slate-700">
                            {enrollment.progress ?? 0}%
                          </span>
                        </div>
                      </Link>
                    );
                  },
                )}
                {enrollmentState.myCourses.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                    You have not enrolled in any course yet.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  Discover Courses
                </h2>
                <Link
                  href="/courses"
                  className="text-sm font-semibold text-blue-600"
                >
                  Browse
                </Link>
              </div>
              <div className="mt-5 space-y-4">
                {courseState.courses.map((course) => (
                  <Link
                    key={course._id}
                    href={`/courses/${course._id}`}
                    className="block rounded-xl border border-slate-200 p-4"
                  >
                    <p className="font-semibold text-slate-900">
                      {course.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {course.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
