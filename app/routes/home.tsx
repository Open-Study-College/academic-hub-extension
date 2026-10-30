import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { formatUkDateTime } from '~/lib/dates';
import { trpc } from '~/lib/trpc';

export default function Home() {
    const assignments = useQuery({
        queryKey: ['assignments'],
        queryFn: () => trpc.assignments.list.query(),
    });

    return (
        <main className="mx-auto max-w-5xl px-6 py-10">
            <header className="mb-8">
                <p className="text-sm font-medium text-slate-500">Academic Hub</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight">Assignment queue</h1>
                <p className="mt-2 max-w-2xl text-slate-600">
                    This is the starter. The data below is read through tRPC from a local SQLite
                    database. Your job is to add submissions, extension requests and the tutor
                    decision flow.
                </p>
            </header>

            {assignments.isPending ? (
                <p className="text-slate-600">Loading assignments...</p>
            ) : null}

            {assignments.isError ? (
                <p className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
                    Could not load assignments: {assignments.error.message}
                </p>
            ) : null}

            {assignments.data?.length === 0 ? (
                <p className="text-slate-600">
                    No assignments yet. Run <code className="font-mono">pnpm db:reset</code> to seed
                    the database.
                </p>
            ) : null}

            <ul className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white">
                {assignments.data?.map((assignment) => (
                    <li key={assignment.id}>
                        <Link
                            to={`/assignments/${assignment.id}`}
                            className="flex flex-col gap-1 px-5 py-4 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <span>
                                <span className="block font-medium">{assignment.title}</span>
                                <span className="block text-sm text-slate-500">
                                    {assignment.courseTitle} ({assignment.courseCode})
                                </span>
                            </span>
                            <span className="text-sm text-slate-600">
                                Due {formatUkDateTime({ value: assignment.dueAt })}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>

            <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="font-semibold">What to build</h2>
                <p className="mt-2 text-sm text-slate-600">
                    Read <code className="font-mono">README.md</code> for the full task, and{' '}
                    <code className="font-mono">CANDIDATE_GUIDE.md</code> for the timebox and how to
                    submit.
                </p>
            </section>
        </main>
    );
}
