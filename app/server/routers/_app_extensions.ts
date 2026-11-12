import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { extensions } from "~/db/schema";
import { publicProcedure, router } from "../trpc";

export const extensionsRouter = router({
  create: publicProcedure
    .input(
      z.object({
        assignmentId: z.number().int().positive(),
        studentId: z.number().int().positive(),
        extensionDeadline: z.string().datetime(),
        reason: z.string().trim().min(1).max(200),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const [created] = await ctx.db
          .insert(extensions)
          .values({
            assignmentId: input.assignmentId,
            studentId: input.studentId,
            extensionDeadline: input.extensionDeadline,
            reason: input.reason,
            status: "pending",
          })
          .returning();
        return created;
      } catch (err) {
        const code = (err as { code?: string }).code;
        if (code === "SQLITE_CONSTRAINT_UNIQUE") {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "This student has already requested an extension for this assignment.",
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
  update: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        decision: z.enum(["approved", "declined"]),
        tutorName: z.string().min(1).max(50).trim(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const now = new Date().toISOString();
      try {
        const [created] = await ctx.db
          .update(extensions)
          .set({
            status: input.decision,
            tutorName: input.tutorName,
            decidedAt: now,
          })
          .where(
            and(eq(extensions.id, input.id), eq(extensions.status, "pending")),
          )
          .returning();
        return created;
      } catch (err) {
        const code = (err as { code?: string }).code;
        if (code === "SQLITE_CONSTRAINT_UNIQUE") {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "This student has already requested an extension for this assignment.",
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
