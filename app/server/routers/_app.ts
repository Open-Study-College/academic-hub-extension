import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { assignments, courses, enrolments, students } from '~/db/schema';
import { publicProcedure, router } from '../trpc';

export const appRouter = router({
    assignments: router({
        list: publicProcedure.query(async ({ ctx }) => {
            return ctx.db
                .select({
                    id: assignments.id,
                    title: assignments.title,
                    dueAt: assignments.dueAt,
                    courseId: courses.id,
                    courseTitle: courses.title,
                    courseCode: courses.code,
                })
                .from(assignments)
                .innerJoin(courses, eq(assignments.courseId, courses.id))
                .orderBy(asc(assignments.dueAt));
        }),
        byId: publicProcedure
            .input(z.object({ id: z.number().int().positive() }))
            .query(async ({ ctx, input }) => {
                const [assignment] = await ctx.db
                    .select({
                        id: assignments.id,
                        title: assignments.title,
                        dueAt: assignments.dueAt,
                        courseId: courses.id,
                        courseTitle: courses.title,
                        courseCode: courses.code,
                    })
                    .from(assignments)
                    .innerJoin(courses, eq(assignments.courseId, courses.id))
                    .where(eq(assignments.id, input.id));

                if (!assignment) {
                    return null;
                }

                const roster = await ctx.db
                    .select({
                        id: students.id,
                        firstName: students.firstName,
                        lastName: students.lastName,
                        email: students.email,
                    })
                    .from(enrolments)
                    .innerJoin(students, eq(enrolments.studentId, students.id))
                    .where(eq(enrolments.courseId, assignment.courseId))
                    .orderBy(asc(students.lastName));

                return { ...assignment, roster };
            }),
    }),
});

export type AppRouter = typeof appRouter;
