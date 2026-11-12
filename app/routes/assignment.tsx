import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { formatUkDateTime } from "~/lib/dates";
import { trpc } from "~/lib/trpc";

export default function AssignmentDetail() {
  const { assignmentId } = useParams();
  const id = Number(assignmentId);

  const assignment = useQuery({
    queryKey: ["assignment", id],
    queryFn: () => trpc.assignments.byId.query({ id }),
    enabled: Number.isInteger(id) && id > 0,
  });

  const submissions = useQuery({
    queryKey: ["assignmentId", id],
    queryFn: () =>
      trpc.submissions.listByAssignmentId.query({ assignmentId: id }),
    enabled: Number.isInteger(id) && id > 0,
  });

  if (!Number.isInteger(id) || id <= 0) {
    return <main className="p-10">Invalid assignment.</main>;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link to="/" className="text-sm text-slate-500 hover:text-slate-900">
        Back to queue
      </Link>

      {assignment.isPending ? <p className="mt-6">Loading...</p> : null}

      {assignment.isError ? (
        <p className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
          Could not load the assignment: {assignment.error.message}
        </p>
      ) : null}

      {assignment.data === null ? (
        <p className="mt-6">Assignment not found.</p>
      ) : null}

      {assignment.data ? (
        <>
          <header className="mt-4 border-b border-slate-200 pb-6">
            <p className="text-sm text-slate-500">
              {assignment.data.courseTitle} ({assignment.data.courseCode})
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {assignment.data.title}
            </h1>
            <p className="mt-2 text-slate-600">
              Due {formatUkDateTime({ value: assignment.data.dueAt })}
            </p>
          </header>

          <section className="mt-6">
            <h2 className="font-semibold">Students on this course</h2>
            <ul className="mt-3 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
              {assignment.data.roster.map((student) => (
                <li key={student.id} className="flex justify-between px-5 py-3">
                  <span>
                    {student.firstName} {student.lastName}
                  </span>
                  <span className="text-sm text-slate-500">
                    {student.email}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {submissions.data ? (
            <section className="mt-6">
              <h2 className="font-semibold">Submissions for this Assignment</h2>
              <ul className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white">
                {submissions.data.map((submission) => (
                  <li key={submission.id}>
                    <Link
                      to={`/assignments/${id}/submissions/${submission.id}`}
                      className="flex flex-col gap-1 px-5 py-4 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span>
                        <span className="block font-medium">
                          {submission.studentFirstName +
                            submission.studentLastName}
                        </span>
                      </span>
                      <span className="text-sm text-slate-600">
                        Due{" "}
                        {formatUkDateTime({
                          value: submission.assignmentDueAt,
                        })}
                        <span className="block text-sm text-slate-500">
                          {submission.status}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : null}
    </main>
  );
}
