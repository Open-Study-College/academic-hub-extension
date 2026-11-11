import { isLate } from "./dates";
export type SubmissionStatus = "ontime" | "late";

export const getSubmissionStatus = ({
  submittedAt,
  dueAt,
  extensionDue,
}: {
  submittedAt: string;
  dueAt: string;
  extensionDue: string | null;
}): SubmissionStatus => {
  return isLate({
    submissionDate: submittedAt,
    deadlineDate: extensionDue ?? dueAt,
  })
    ? "late"
    : "ontime";
};
