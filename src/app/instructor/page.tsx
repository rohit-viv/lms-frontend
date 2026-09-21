'use client';

import { FormEvent, useEffect, useState } from 'react';
import RoleGuard from '@/components/RoleGuard';
import {
  createCourse,
  deleteCourse,
  fetchInstructorCourses,
  publishCourse,
  updateCourse,
} from '@/store/features/courses/courseSlice';
import {
  createLesson,
  deleteLesson,
  fetchLessons,
  reorderLessons,
  updateLesson,
} from '@/store/features/lessons/lessonSlice';
import {
  useAppDispatch,
  useAppSelector,
} from '@/store/hooks';

type CourseFormState = {
  title: string;
  description: string;
  price: string;
};

type LessonFormState = {
  title: string;
  content: string;
  isPublished: boolean;
};

const emptyCourseForm: CourseFormState = {
  title: '',
  description: '',
  price: '0',
};

const emptyLessonForm: LessonFormState = {
  title: '',
  content: '',
  isPublished: false,
};

export default function InstructorPage() {
  const dispatch = useAppDispatch();
  const { courses, loading, error } = useAppSelector(
    (state) => state.courses,
  );
  const { lessons } = useAppSelector(
    (state) => state.lessons,
  );

  const [selectedCourseId, setSelectedCourseId] =
    useState<string>('');
  const [createCourseForm, setCreateCourseForm] =
    useState<CourseFormState>(emptyCourseForm);
  const [editCourseForm, setEditCourseForm] =
    useState<CourseFormState>(emptyCourseForm);
  const [lessonForm, setLessonForm] =
    useState<LessonFormState>(emptyLessonForm);

  const selectedCourse =
    courses.find(
      (course) =>
        course._id === selectedCourseId,
    ) ||
    courses[0] ||
    null;

  const activeCourseForm = selectedCourse
    ? selectedCourseId
      ? editCourseForm
      : {
          title: selectedCourse.title,
          description:
            selectedCourse.description,
          price: String(selectedCourse.price),
        }
    : emptyCourseForm;

  useEffect(() => {
    dispatch(fetchInstructorCourses());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCourse) {
      dispatch(fetchLessons(selectedCourse._id));
    }
  }, [dispatch, selectedCourse]);

  const handleSelectCourse = (
    courseId: string,
  ) => {
    const course = courses.find(
      (current) => current._id === courseId,
    );

    setSelectedCourseId(courseId);

    if (course) {
      setEditCourseForm({
        title: course.title,
        description: course.description,
        price: String(course.price),
      });
    }
  };

  const handleCreateCourse = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const result = await dispatch(
      createCourse({
        title: createCourseForm.title,
        description:
          createCourseForm.description,
        price:
          Number(createCourseForm.price) || 0,
      }),
    );

    if (createCourse.fulfilled.match(result)) {
      setCreateCourseForm(emptyCourseForm);
      handleSelectCourse(result.payload._id);
    }
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse) {
      return;
    }

    await dispatch(
      updateCourse({
        id: selectedCourse._id,
        data: {
          title: activeCourseForm.title,
          description:
            activeCourseForm.description,
          price:
            Number(activeCourseForm.price) || 0,
        },
      }),
    );
  };

  const handleCreateLesson = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedCourse) {
      return;
    }

    const result = await dispatch(
      createLesson({
        courseId: selectedCourse._id,
        data: {
          title: lessonForm.title,
          content: lessonForm.content,
          order: lessons.length + 1,
          isPublished:
            lessonForm.isPublished,
        },
      }),
    );

    if (createLesson.fulfilled.match(result)) {
      setLessonForm(emptyLessonForm);
    }
  };

  const moveLesson = async (
    lessonId: string,
    direction: 'up' | 'down',
  ) => {
    if (!selectedCourse) {
      return;
    }

    const currentIndex = lessons.findIndex(
      (lesson) => lesson._id === lessonId,
    );
    const targetIndex =
      direction === 'up'
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      currentIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >= lessons.length
    ) {
      return;
    }

    const reordered = [...lessons];
    const [movedLesson] = reordered.splice(
      currentIndex,
      1,
    );
    reordered.splice(targetIndex, 0, movedLesson);

    await dispatch(
      reorderLessons({
        courseId: selectedCourse._id,
        lessonIds: reordered.map(
          (lesson) => lesson._id,
        ),
      }),
    );
  };

  return (
    <RoleGuard
      allowedRoles={[
        'admin',
        'instructor',
      ]}
    >
      <main className="min-h-screen bg-slate-100 p-6 md:p-10">
        <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">
              Instructor Workspace
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Create, update, publish, and
              manage your course lessons.
            </p>

            <form
              className="mt-6 space-y-4"
              onSubmit={handleCreateCourse}
            >
              <input
                value={createCourseForm.title}
                onChange={(event) =>
                  setCreateCourseForm(
                    (current) => ({
                      ...current,
                      title: event.target.value,
                    }),
                  )
                }
                placeholder="Course title"
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
              <textarea
                value={createCourseForm.description}
                onChange={(event) =>
                  setCreateCourseForm(
                    (current) => ({
                      ...current,
                      description:
                        event.target.value,
                    }),
                  )
                }
                placeholder="Course description"
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
              <input
                type="number"
                min="0"
                value={createCourseForm.price}
                onChange={(event) =>
                  setCreateCourseForm(
                    (current) => ({
                      ...current,
                      price: event.target.value,
                    }),
                  )
                }
                placeholder="Price"
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-slate-950 px-4 py-3 text-white"
              >
                Create Course
              </button>
            </form>

            <div className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Your Courses
              </h2>
              <div className="mt-3 space-y-3">
                {courses.map((course) => (
                  <button
                    key={course._id}
                    type="button"
                    onClick={() =>
                      handleSelectCourse(
                        course._id,
                      )
                    }
                    className={`w-full rounded-xl border p-4 text-left ${
                      selectedCourse?._id ===
                      course._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-900">
                        {course.title}
                      </p>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase text-slate-600">
                        {course.status}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                      {course.description}
                    </p>
                  </button>
                ))}
                {!loading &&
                  courses.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                      No courses yet.
                    </div>
                  )}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            {error && (
              <div className="rounded-2xl bg-red-50 p-4 text-red-600 shadow-sm">
                {error}
              </div>
            )}

            {selectedCourse ? (
              <>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {selectedCourse.title}
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Course editor
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleUpdateCourse}
                        className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            publishCourse(
                              selectedCourse._id,
                            ),
                          )
                        }
                        className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white"
                      >
                        Publish
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await dispatch(
                            deleteCourse(
                              selectedCourse._id,
                            ),
                          );
                          setSelectedCourseId('');
                          setEditCourseForm(
                            emptyCourseForm,
                          );
                        }}
                        className="rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <input
                      value={activeCourseForm.title}
                      onChange={(event) => {
                        if (
                          selectedCourse &&
                          !selectedCourseId
                        ) {
                          handleSelectCourse(
                            selectedCourse._id,
                          );
                        }

                        setEditCourseForm(
                          (current) => ({
                            ...current,
                            title:
                              event.target.value,
                          }),
                        );
                      }}
                      className="rounded-xl border border-slate-200 px-4 py-3"
                    />
                    <textarea
                      value={
                        activeCourseForm.description
                      }
                      onChange={(event) => {
                        if (
                          selectedCourse &&
                          !selectedCourseId
                        ) {
                          handleSelectCourse(
                            selectedCourse._id,
                          );
                        }

                        setEditCourseForm(
                          (current) => ({
                            ...current,
                            description:
                              event.target.value,
                          }),
                        );
                      }}
                      rows={4}
                      className="rounded-xl border border-slate-200 px-4 py-3"
                    />
                    <input
                      type="number"
                      min="0"
                      value={activeCourseForm.price}
                      onChange={(event) => {
                        if (
                          selectedCourse &&
                          !selectedCourseId
                        ) {
                          handleSelectCourse(
                            selectedCourse._id,
                          );
                        }

                        setEditCourseForm(
                          (current) => ({
                            ...current,
                            price:
                              event.target.value,
                          }),
                        );
                      }}
                      className="rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900">
                    Add Lesson
                  </h3>
                  <form
                    className="mt-5 space-y-4"
                    onSubmit={handleCreateLesson}
                  >
                    <input
                      value={lessonForm.title}
                      onChange={(event) =>
                        setLessonForm(
                          (current) => ({
                            ...current,
                            title:
                              event.target.value,
                          }),
                        )
                      }
                      placeholder="Lesson title"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                    <textarea
                      value={lessonForm.content}
                      onChange={(event) =>
                        setLessonForm(
                          (current) => ({
                            ...current,
                            content:
                              event.target.value,
                          }),
                        )
                      }
                      rows={4}
                      placeholder="Lesson content"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                    <label className="flex items-center gap-3 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={
                          lessonForm.isPublished
                        }
                        onChange={(event) =>
                          setLessonForm(
                            (current) => ({
                              ...current,
                              isPublished:
                                event.target.checked,
                            }),
                          )
                        }
                      />
                      Publish this lesson
                    </label>
                    <button
                      type="submit"
                      className="rounded-xl bg-slate-950 px-4 py-3 text-white"
                    >
                      Add Lesson
                    </button>
                  </form>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900">
                    Lessons
                  </h3>
                  <div className="mt-5 space-y-4">
                    {lessons.map(
                      (lesson, index) => (
                        <div
                          key={lesson._id}
                          className="rounded-xl border border-slate-200 p-5"
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex-1">
                              <input
                                value={lesson.title}
                                onChange={(event) =>
                                  dispatch(
                                    updateLesson({
                                      courseId:
                                        selectedCourse._id,
                                      lessonId:
                                        lesson._id,
                                      data: {
                                        title:
                                          event.target.value,
                                      },
                                    }),
                                  )
                                }
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 font-semibold"
                              />
                              <textarea
                                value={
                                  lesson.content
                                }
                                onChange={(event) =>
                                  dispatch(
                                    updateLesson({
                                      courseId:
                                        selectedCourse._id,
                                      lessonId:
                                        lesson._id,
                                      data: {
                                        content:
                                          event.target.value,
                                      },
                                    }),
                                  )
                                }
                                rows={3}
                                className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                              />
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  moveLesson(
                                    lesson._id,
                                    'up',
                                  )
                                }
                                disabled={index === 0}
                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40"
                              >
                                Up
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  moveLesson(
                                    lesson._id,
                                    'down',
                                  )
                                }
                                disabled={
                                  index ===
                                  lessons.length - 1
                                }
                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40"
                              >
                                Down
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  dispatch(
                                    updateLesson({
                                      courseId:
                                        selectedCourse._id,
                                      lessonId:
                                        lesson._id,
                                      data: {
                                        isPublished:
                                          !lesson.isPublished,
                                      },
                                    }),
                                  )
                                }
                                className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700"
                              >
                                {lesson.isPublished
                                  ? 'Unpublish'
                                  : 'Publish'}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  dispatch(
                                    deleteLesson({
                                      courseId:
                                        selectedCourse._id,
                                      lessonId:
                                        lesson._id,
                                    }),
                                  )
                                }
                                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                    {lessons.length === 0 && (
                      <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                        No lessons yet.
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
                Select or create a course to start managing lessons.
              </div>
            )}
          </section>
        </div>
      </main>
    </RoleGuard>
  );
}
