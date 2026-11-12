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

If you do not finish everything, that is fine. This task is about how you think about the problem and
how you structure the solution, not about ticking every box.

# 1. **Data model**

- Add tables and constraints for submissions and extension requests.
- Think about what stops a duplicate current submission, and what happens if two requests race.
- Update the schema with `pnpm db:push`. No migration file needed; we will ask how you would
  migrate this on a live database in the conversation.
- Extend the seed with a small mix: on-time, late, pending and declined cases.

# Emma's Notes

## Submissions Table

The [Submission model](./app/db/schema.ts) contains all the data needed for a student to submit their work and receive feedback from the tutor. Any other data needed can be retrieved via a join to the students, assignment and extensiosn table. A unique constraint on the studentId and assignmentId means a student can only submit their work once per assignment. I decided not to add the assignment title or assignemnt due date to the db model as this could become stale if an extension is granted or would need to be updated when an extension is granted, but this data can be found in the extensions table so it can be retrieved via a join.
As every submission must have a student and be submitted against an assignment their respective ids are stored as foreign keys.
The majority of the keys are not null as they are required when a student submits some work. The tutorName, grade and feedback can be null as they will be updated after the initial creation of a submisison record - when a tutor marks the work.

### Improvements

If I had more time I would:

- lock the record to updates, unless its from the tutor who would submit a grade update.
- check the student actually enrolled on course before allowing a submission.

## Extensions Table

The [Extension model](./app/db/schema.ts) contains all the data needed for a student to submit an extension request. A unique constraint on the studentId and assignmentId means a student can only submit an extension request once per assignment.
As every submission must have a student and be submitted against an assignment their respective ids are stored as foreign keys.
The majority of the keys are not null as they are required when a student submits some work. TutorName and decidedAt can be null as they will be updated after the initial creation of an extension record - when a tutor declines or approves the request.

### Improvements

If had more time would add a lock to status field and a check so that only the tutor could update the extension table (could be done in api)

# 2. **API**

- ✅List submissions with a computed status.
- ✅Create a submission.
- ✅Request an extension.
- ✅Approve or decline an extension.
- ✅Validate input with Zod and return a consistent error shape.
- ✅getSubmission
  - get submissionById, join with extension (studentId, courseId, assignmentId)

# Emma's Notes

## API

The api updates can be found [here for submissions](./app/server/routers/_app_submissions.ts) and [here for extensions](./app/server/routers/_app_extensions.ts).

For the submission api I added 3 api calls: listByAssignmentId, getById, and create.
For the Extension api I added 2 api calls: create and update.

**Submissions**
I decided to create listByAssignment as, per the project description and UI requirements, a tutor would like to see a queue of submissions per assignment, so this filters the submissions based on the assignmentId.

A tutor can then click on a submission to see more details, therefore I created a getById.

A student needs to be able to submit a submission, which is the create

**Extensions**
The extension api has a create and update- which allows students to create an extension request, and an update to allow tutors to approve or decline the request.

## Improvements

- If I had more time I would show all students enroled on course then get their submissions to show anyone who has not submitted work
- The plan for this project which I didnt manage to implement would be to see if an extension had been requested on the detail for the submission - hence returning this data in the submission.getById. However, there is no way for a tutor to see if someone has requested an extension before they have submitted thier work. I would therefore, create a extensions.GetByAssignment to add a view fo requested extensions.

## Below are curl commands added operations

### getSubmissionsByAssignment

```
curl -s -G 'http://localhost:5173/api/trpc/submissions.listByAssignmentId' \
--data-urlencode 'input={"assignmentId":3}' | python3 -m json.tool
```

### getSubmissionById

```
curl -s -G 'http://localhost:5173/api/trpc/submissions.getById' \
 --data-urlencode 'input={"id":6}' | python3 -m json.tool
```

### createSubmission

```
curl -s -X POST 'http://localhost:5173/api/trpc/submissions.create' \
 -H 'content-type: application/json' \
 -d '{"assignmentId":3,"studentId":7,"submissionLink":"https://www.example.com/submission7"}'
```

### createExtension

```
curl -s -X POST 'http://localhost:5173/api/trpc/submissions.create' \
  -H 'content-type: application/json' \
  -d '{"assignmentId":3,"studentId":7,"submissionLink":"https://www.example.com/submission7"}'
```

### updateExtension

```
curl -s -X POST 'http://localhost:5173/api/trpc/extensions.update' \
  -H 'content-type: application/json' \
  -d '{"id":5,"decision":"approved","tutorName":"Emma Randle"}'
```

# 3. **UI**

- A tutor-facing queue with status badges.
- A detail view for one submission: deadline, extension request, approve or decline. (new page? popout? collapseable)
- Loading, empty and error states.

# Emma's Notes

## UI

I only managed to implement the submissions queue on the assignment page.
This inlcudes a list of submissions per assignemnt under the list of enrolled students.

## Improvements

If i had mroe time i would tidy the UI - adding a badge to the status, I would implement the onRowClick route - which would take to a detailed view of the submission, with a way to approve/decline an extension if one had been granted.

# Emma's Notes

Unfortunately i did not have time to implement the tasks below.

# 4. **Failure and concurrency**

- Approving the same request twice must not create a duplicate or a 500.
- A duplicate submission must return a clear conflict, not a second row.
- Invalid state transitions must be rejected clearly.

# 5. **Tests**

- One unit test for the deadline and late calculation, including the boundary and timezone.
- One integration test for either the idempotent decision or the duplicate submission.
- Proportionate, not coverage chasing. Do not mock the database for the integration case.

# 6. **README**

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

## Getting started

Requires Node 24 and pnpm.

```sh
git checkout model-plan
pnpm install
pnpm db:reset
pnpm dev
```

Open http://localhost:5173.
