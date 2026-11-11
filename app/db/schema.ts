import { sql } from "drizzle-orm";

import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

export const students = sqliteTable("students", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const assignments = sqliteTable(
  "assignments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id),
    title: text("title").notNull(),
    dueAt: text("due_at").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("assignments_course_id_idx").on(table.courseId),
    index("assignments_due_at_idx").on(table.dueAt),
  ],
);

export const enrolments = sqliteTable(
  "enrolments",
  {
    studentId: integer("student_id")
      .notNull()
      .references(() => students.id),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id),
    enrolledAt: text("enrolled_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [primaryKey({ columns: [table.studentId, table.courseId] })],
);

export const submissions = sqliteTable(
  "submissions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    assignmentId: integer("assignment_id")
      .notNull()
      .references(() => assignments.id),
    studentId: integer("student_id")
      .notNull()
      .references(() => students.id),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    submittedAt: text("submitted_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
    submissionLink: text("submission_link").notNull(),
  },
  (table) => [
    index("submissions_assignment_id_idx").on(table.assignmentId),
    index("submissions_student_id_idx").on(table.studentId),
    unique("submissions_assignment_student").on(
      table.studentId,
      table.assignmentId,
    ),
  ],
);

export const extensions = sqliteTable(
  "extensions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    assignmentId: integer("assignment_id")
      .notNull()
      .references(() => assignments.id),
    studentId: integer("student_id")
      .notNull()
      .references(() => students.id),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
    status: text("status", {
      enum: ["pending", "approved", "declined"],
    }).notNull(),
    extensionDeadline: text("extension_deadline").notNull(),
    reason: text("reason").notNull(),
    decidedBy: text("decided_by"),
    decidedAt: text("decided_at").$onUpdate(() => new Date().toISOString()),
  },
  (table) => [
    index("extensions_assignment_id_idx").on(table.assignmentId),
    index("extensions_student_id_idx").on(table.studentId),
    unique("extensions_assignment_student").on(
      table.studentId,
      table.assignmentId,
    ),
  ],
);
