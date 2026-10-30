# Academic Hub extensions

A standalone take-home exercise for Open Study College. Read
[CANDIDATE_GUIDE.md](./CANDIDATE_GUIDE.md) first: it covers the timebox, forking and submission.

## The task

Open Study College students submit assignments and tutors mark them. Sometimes a student needs more
time. Build the extension request flow and the tutor's queue.

### The domain

- A course has assignments. Each assignment has a due date and belongs to one course.
- Students are enrolled on courses.
- A student submits an assignment. There should only ever be one current submission per student per
  assignment, even if they are allowed to resubmit.
- A student can request an extension with a proposed date and a reason.
- Staff approve or decline the request. An approved extension moves the effective deadline for that
  student on that assignment.
- A tutor sees a queue of submissions for their courses, with a clear status.

### Must have

Aim for this in about two hours. Four hours is the maximum.

1. **Data model**
   - Add tables and constraints for submissions and extension requests.
   - Think about what stops a duplicate current submission, and what happens if two requests race.
   - Update the schema with `pnpm db:push`. No migration file needed; we will ask how you would
     migrate this on a live database in the conversation.
   - Extend the seed with a small mix: on-time, late, pending and declined cases.

2. **API**
   - List submissions with a computed status.
   - Create a submission.
   - Request an extension.
   - Approve or decline an extension.
   - Validate input with Zod and return a consistent error shape.

3. **UI**
   - A tutor-facing queue with status badges.
   - A detail view for one submission: deadline, extension request, approve or decline.
   - Loading, empty and error states.

4. **Failure and concurrency**
   - Approving the same request twice must not create a duplicate or a 500.
   - A duplicate submission must return a clear conflict, not a second row.
   - Invalid state transitions must be rejected clearly.

5. **Tests**
   - One unit test for the deadline and late calculation, including the boundary and timezone.
   - One integration test for either the idempotent decision or the duplicate submission.
   - Proportionate, not coverage chasing. Do not mock the database for the integration case.

6. **README**
   - How to run it.
   - Your schema decisions and tradeoffs.
   - What you would do with more time.
   - What you would monitor in production.

### Stretch (optional, at most one)

Only if the core is complete and tested. We do not expect these. A solid core with no stretch is a
good submission.

- Add a filter to the queue.
- Add optimistic UI for approve or decline, with a rollback on failure.
- Add the second integration test for the other risky transition.

We are not asking you to build a webhook receiver. We will talk about at-least-once delivery,
deduplication and idempotency in the follow-up conversation.

## What's in the starter

- React Router v7, tRPC, TanStack Query, Drizzle, SQLite, Zod, dayjs, Tailwind and Vitest.
- `students`, `courses`, `assignments` and `enrolments` tables.
- Seed data for two courses, six students and four assignments.
- A tRPC router with `assignments.list` and `assignments.byId`.
- A queue page and an assignment detail page reading through tRPC.
- No submissions, extension requests, decision flow, status calculation or tests. Those are yours.

## Getting started

Requires Node 24 and pnpm.

```sh
pnpm install
pnpm db:reset
pnpm dev
```

Open http://localhost:5173.

`pnpm db:reset` removes the local database, pushes the schema and seeds it. If you change the schema,
run it again.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build |
| `pnpm typecheck` | Generate route types and typecheck |
| `pnpm test` | Run Vitest |
| `pnpm db:push` | Push the Drizzle schema to `local.db` |
| `pnpm db:seed` | Reseed without recreating the database |
| `pnpm db:reset` | Recreate and seed the database |

## Notes

- Dates are stored as ISO 8601 UTC strings. Use `dayjs` and assume `Europe/London`.
  `app/lib/dates.ts` has a formatting helper and the timezone constant.
- `app/db/schema.ts` is the schema. `app/db/seed.ts` is the seed.
- This repository is standalone. Do not import from a monorepo or an internal package.
- If setup is broken, email George rather than burning the timebox.
