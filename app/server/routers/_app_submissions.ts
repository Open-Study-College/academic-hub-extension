import { asc, eq, and } from "drizzle-orm";
import { z } from "zod";
import { assignments, students, submissions, extensions } from "~/db/schema";
import { publicProcedure, router } from "../trpc";
import { getSubmissionStatus } from "../../lib/submissionStatus";

export const submissionsRouter = router({
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
  listById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const [submission] = await ctx.db
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
        .where(eq(submissions.id, input.id))
        .orderBy(asc(submissions.createdAt));

      if (!submission) {
        return null;
      }
      let status = getSubmissionStatus({
        submittedAt: submission.submittedAt,
        dueAt: submission.assignmentDueAt,
        extensionDue:
          submission.extensionStatus === "approved"
            ? submission.extensionDueDate
            : null,
      });
      return { submission, status };
    }),
});
