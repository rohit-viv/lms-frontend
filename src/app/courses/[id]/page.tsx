'use client';

import {
  use,
  useEffect,
} from 'react';

import Link from 'next/link';

import ProtectedRoute from '@/components/ProtectedRoute';

import {
  useAppDispatch,
  useAppSelector,
} from '@/store/hooks';

import {
  fetchCourseById,
} from '@/store/features/courses/courseSlice';

import {
  fetchLessons,
} from '@/store/features/lessons/lessonSlice';

import {
  completeLesson,
  enrollCourse,
  fetchMyCourses,
  resetEnrollment,
} from '@/store/features/enrollments/enrollmentSlice';

export default function CourseDetailsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);

  const dispatch = useAppDispatch();

  // ========================================
  // AUTH
  // ========================================

  const user = useAppSelector(
    (state) => state.auth.user,
  );

  // ========================================
  // COURSE
  // ========================================

  const {
    selectedCourse,
    detailLoading,
    error: courseError,
  } = useAppSelector(
    (state) => state.courses,
  );

  // ========================================
  // LESSONS
  // ========================================

  const {
    lessons,
    loading: lessonsLoading,
    error: lessonsError,
  } = useAppSelector(
    (state) => state.lessons,
  );

  // ========================================
  // ENROLLMENTS
  // ========================================

  const {
    myCourses,
    loading: enrollmentLoading,
    error: enrollmentError,
    enrollSuccess,
    completingLessonId,
  } = useAppSelector(
    (state) => state.enrollments,
  );

  // ========================================
  // FIND CURRENT COURSE ENROLLMENT
  // ========================================

  const currentEnrollment =
    myCourses.find(
      (enrollment) => {
        if (
          typeof enrollment.course ===
          'string'
        ) {
          return enrollment.course === id;
        }

        return (
          enrollment.course?._id === id
        );
      },
    );

  const isEnrolled =
    Boolean(currentEnrollment) ||
    enrollSuccess;

  const progress =
    currentEnrollment?.progress ?? 0;

  const completedLessons =
    currentEnrollment?.completedLessons ??
    [];

  // ========================================
  // FETCH PAGE DATA
  // ========================================

  useEffect(() => {
    dispatch(fetchCourseById(id));

    dispatch(fetchLessons(id));

    // Sirf student ke liye enrollment fetch karo.
    if (
      user?.role === 'student'
    ) {
      dispatch(fetchMyCourses());
    }
  }, [
    dispatch,
    id,
    user?.role,
  ]);

  // ========================================
  // CLEANUP
  // ========================================

  useEffect(() => {
    return () => {
      dispatch(resetEnrollment());
    };
  }, [dispatch]);

  // ========================================
  // ENROLL COURSE
  // ========================================

  const handleEnroll = async () => {
    const result = await dispatch(
      enrollCourse(id),
    );

    if (
      enrollCourse.fulfilled.match(
        result,
      )
    ) {
      // Successful enrollment ke baad
      // updated enrollment list fetch karo.
      dispatch(fetchMyCourses());
    }
  };

  // ========================================
  // COMPLETE LESSON
  // ========================================

  const handleCompleteLesson = async (
    lessonId: string,
  ) => {
    await dispatch(
      completeLesson({
        courseId: id,
        lessonId,
      }),
    );
  };

  return (
    <ProtectedRoute>

      <main className="min-h-screen bg-gray-100 p-6 md:p-10">

        <div className="mx-auto max-w-5xl">

          {/* ================================= */}
          {/* BACK */}
          {/* ================================= */}

          <div className="mb-6 flex items-center justify-between">

            <Link
              href="/courses"
              className="rounded-lg border bg-white px-4 py-2"
            >
              ← Back to Courses
            </Link>

            {user?.role ===
              'student' && (
              <Link
                href="/my-courses"
                className="rounded-lg bg-black px-4 py-2 text-white"
              >
                My Courses
              </Link>
            )}

          </div>

          {/* ================================= */}
          {/* COURSE LOADING */}
          {/* ================================= */}

          {detailLoading && (
            <div className="rounded-xl bg-white p-6 shadow">
              Loading course...
            </div>
          )}

          {/* ================================= */}
          {/* COURSE ERROR */}
          {/* ================================= */}

          {courseError && (
            <div className="mb-6 rounded-xl bg-red-100 p-4 text-red-600">
              {courseError}
            </div>
          )}

          {/* ================================= */}
          {/* COURSE DETAIL */}
          {/* ================================= */}

          {!detailLoading &&
            selectedCourse && (
              <section className="rounded-xl bg-white p-6 shadow">

                <div className="flex flex-col justify-between gap-6 md:flex-row">

                  <div className="flex-1">

                    <h1 className="text-3xl font-bold">
                      {
                        selectedCourse.title
                      }
                    </h1>

                    <p className="mt-4 text-gray-600">
                      {
                        selectedCourse.description
                      }
                    </p>

                  </div>

                  <div className="min-w-[220px] rounded-xl bg-gray-100 p-5">

                    <p className="text-sm text-gray-500">
                      Course Price
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      ₹
                      {
                        selectedCourse.price
                      }
                    </p>

                    <div className="mt-4">

                      <p className="text-sm text-gray-500">
                        Status
                      </p>

                      <span className="mt-1 inline-block rounded bg-white px-3 py-1 text-sm font-medium">
                        {
                          selectedCourse.status
                        }
                      </span>

                    </div>

                  </div>

                </div>

                {/* ================================= */}
                {/* ENROLL BUTTON */}
                {/* ================================= */}

                {user?.role ===
                  'student' && (
                  <div className="mt-6">

                    {isEnrolled ? (
                      <div className="inline-block rounded-lg bg-green-100 px-5 py-3 font-medium text-green-700">
                        ✓ Enrolled
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={
                          handleEnroll
                        }
                        disabled={
                          enrollmentLoading
                        }
                        className="rounded-lg bg-black px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {enrollmentLoading
                          ? 'Enrolling...'
                          : 'Enroll Now'}
                      </button>
                    )}

                  </div>
                )}

              </section>
            )}

          {/* ================================= */}
          {/* ENROLLMENT ERROR */}
          {/* ================================= */}

          {enrollmentError && (
            <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-600">
              {enrollmentError}
            </div>
          )}

          {/* ================================= */}
          {/* COURSE PROGRESS */}
          {/* ================================= */}

          {user?.role ===
            'student' &&
            isEnrolled && (
              <section className="mt-6 rounded-xl bg-white p-6 shadow">

                <div className="flex items-center justify-between">

                  <h2 className="text-xl font-bold">
                    Course Progress
                  </h2>

                  <span className="font-semibold">
                    {progress}%
                  </span>

                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">

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

              </section>
            )}

          {/* ================================= */}
          {/* LESSON SECTION */}
          {/* ================================= */}

          <section className="mt-6 rounded-xl bg-white p-6 shadow">

            <div className="mb-5">

              <h2 className="text-2xl font-bold">
                Course Lessons
              </h2>

              <p className="mt-1 text-gray-500">
                Lessons available in this course
              </p>

            </div>

            {lessonsLoading && (
              <p>
                Loading lessons...
              </p>
            )}

            {lessonsError && (
              <div className="rounded-lg bg-red-100 p-4 text-red-600">
                {lessonsError}
              </div>
            )}

            {!lessonsLoading &&
              !lessonsError &&
              lessons.length ===
                0 && (
                <p className="text-gray-500">
                  No lessons available.
                </p>
              )}

            {!lessonsLoading &&
              lessons.length >
                0 && (
                <div className="space-y-4">

                  {lessons.map(
                    (lesson) => {
                      const isCompleted =
                        completedLessons.includes(
                          lesson._id,
                        );

                      return (
                        <div
                          key={
                            lesson._id
                          }
                          className="rounded-xl border border-gray-200 p-5"
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div className="flex-1">

                              <h3 className="text-lg font-semibold">
                                {
                                  lesson.order
                                }
                                .{' '}
                                {
                                  lesson.title
                                }
                              </h3>

                              <p className="mt-2 text-gray-600">
                                {
                                  lesson.content
                                }
                              </p>

                              {/* ============================= */}
                              {/* COMPLETE BUTTON */}
                              {/* ============================= */}

                              {user?.role ===
                                'student' &&
                                isEnrolled && (
                                  <div className="mt-4">

                                    {isCompleted ? (
                                      <span className="inline-block rounded-lg bg-green-100 px-4 py-2 font-medium text-green-700">
                                        ✓ Completed
                                      </span>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleCompleteLesson(
                                            lesson._id,
                                          )
                                        }
                                        disabled={
                                          completingLessonId ===
                                          lesson._id
                                        }
                                        className="rounded-lg bg-green-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        {completingLessonId ===
                                        lesson._id
                                          ? 'Completing...'
                                          : 'Mark Complete'}
                                      </button>
                                    )}

                                  </div>
                                )}

                              {/* NOT ENROLLED MESSAGE */}

                              {user?.role ===
                                'student' &&
                                !isEnrolled && (
                                  <p className="mt-4 text-sm text-gray-500">
                                    Enroll in this course to complete lessons.
                                  </p>
                                )}

                            </div>

                            {/* LESSON STATUS */}

                            <span
                              className={`rounded px-3 py-1 text-xs font-medium ${
                                lesson.isPublished
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {lesson.isPublished
                                ? 'Published'
                                : 'Draft'}
                            </span>

                          </div>

                        </div>
                      );
                    },
                  )}

                </div>
              )}

          </section>

        </div>

      </main>

    </ProtectedRoute>
  );
}

