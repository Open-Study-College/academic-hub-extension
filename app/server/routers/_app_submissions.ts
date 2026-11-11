import { asc, eq, and } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Submissions for this assignment do not exist",
        });
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
  getById: publicProcedure
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Submission does not exist",
        });
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
  create: publicProcedure
    .input(
      z.object({
        assignmentId: z.number().int().positive(),
        studentId: z.number().int().positive(),
        submissionLink: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const [created] = await ctx.db
          .insert(submissions)
          .values({
            assignmentId: input.assignmentId,
            studentId: input.studentId,
            submissionLink: input.submissionLink,
            submittedAt: new Date().toISOString(),
          })
          .returning();
        return created;
      } catch (err) {
        const code = (err as { code?: string }).code;
        if (code === "SQLITE_CONSTRAINT_UNIQUE") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This student has already submitted this assignment.",
          });
        }
        if (code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Assignment or student does not exist.",
          });
        }
        throw err;
      }
    }),
});
