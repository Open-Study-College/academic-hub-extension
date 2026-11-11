import { asc, eq, and } from "drizzle-orm";
import { z } from "zod";
import {
  assignments,
  courses,
  enrolments,
  students,
  submissions,
  extensions,
} from "~/db/schema";
import { publicProcedure, router } from "../trpc";
import { getSubmissionStatus } from "../../lib/submissionStatus";

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
  submissions: router({
    listByAssignmentId: publicProcedure
      .input(z.object({ assignmentId: z.number().int().positive() }))
      .query(async ({ ctx, input }) => {
        const submissionRows = await ctx.db
          .select({
            id: submissions.id,
            submittedAt: submissions.submittedAt,
            submissionLink: submissions.submissionLink,
            assignmentId: assignments.id,
            assignmentTitle: assignments.title,
            assignmentDueAt: assignments.dueAt,
            studentId: students.id,
            studentFirstName: students.firstName,
            studentLastName: students.lastName,
            extensionStatus: extensions.status,
            extensionDueDate: extensions.extensionDeadline,
          })
          .from(submissions)
          .innerJoin(assignments, eq(submissions.assignmentId, assignments.id))
          .innerJoin(students, eq(submissions.studentId, students.id))
          .leftJoin(
            extensions,
            and(
              eq(extensions.studentId, submissions.studentId),
              eq(extensions.assignmentId, submissions.assignmentId),
            ),
          )
          .where(eq(submissions.assignmentId, input.assignmentId))
          .orderBy(asc(submissions.createdAt));

        if (!submissionRows) {
          return null;
        }

        return submissionRows.map((row) => ({
          ...row,
          status: getSubmissionStatus({
            submittedAt: row.submittedAt,
            dueAt: row.assignmentDueAt,
            extensionDue:
              row.extensionStatus === "approved" ? row.extensionDueDate : null,
          }),
        }));
      }),
  }),
});

export type AppRouter = typeof appRouter;
