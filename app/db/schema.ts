import { sql } from 'drizzle-orm';
import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const students = sqliteTable('students', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').notNull().unique(),
    createdAt: text('created_at')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const courses = sqliteTable('courses', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    code: text('code').notNull().unique(),
    title: text('title').notNull(),
    createdAt: text('created_at')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const assignments = sqliteTable(
    'assignments',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        courseId: integer('course_id')
            .notNull()
            .references(() => courses.id),
        title: text('title').notNull(),
        dueAt: text('due_at').notNull(),
        createdAt: text('created_at')
            .notNull()
            .default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => [
        index('assignments_course_id_idx').on(table.courseId),
        index('assignments_due_at_idx').on(table.dueAt),
    ]
);

export const enrolments = sqliteTable(
    'enrolments',
    {
        studentId: integer('student_id')
            .notNull()
            .references(() => students.id),
        courseId: integer('course_id')
            .notNull()
            .references(() => courses.id),
        enrolledAt: text('enrolled_at')
            .notNull()
            .default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => [primaryKey({ columns: [table.studentId, table.courseId] })]
);
