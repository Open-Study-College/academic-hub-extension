# Candidate guide

Thanks for taking the time to look at this. This repository is a small, self-contained exercise. It
is designed to take a few focused hours, not a weekend.

Read this page before you start. The task itself is in [README.md](./README.md).

## Timebox

- You have **one week from the date you receive the repository link**.
- Aim for the core in **about two hours**. The **maximum is four hours**. We would much rather see
  two focused hours than a week of polish.
- You can go over two hours if you are enjoying it or want to finish something, up to four. The
  timebox is there to protect your time and make sure we are not asking you to spend a weekend on
  this. It is not there to create artificial pressure.
- If you do not finish everything, that is fine. We are assessing how you think about the problem and
  how you structure the solution, not whether every requirement is complete.
- If you finish early, we may be able to bring you in for a conversation sooner. Either way, please
  allow **two working days** for us to assess your work before we confirm next steps.
- If you submit close to the deadline, we will do a quick technical review first. If it passes, we
  will contact you to arrange the technical conversation about your work.
- If you get stuck on environment setup, email us. That is not the test.

## The process

1. **Recruiter screen.** A short conversation about the role, your experience and logistics.
2. **This exercise.** Up to one week, with the four-hour guidance above.
3. **Technical conversation.** 45 to 60 minutes, **in person**, with two of our engineers. Details
   below.
4. **Director conversation.** A 30 minute **remote video call** and final sign-off, not another
   technical test.
5. **Decision.** We aim to finish the whole process within three weeks of you receiving the
   repository link.

## Get your own copy

Work in your own repository, not in this one. We will not merge your work into this repository.

1. Click **Fork** at the top right of this page and choose your own account.
2. Make sure your fork is **public**. A fork of a public repository is public by default. If yours
   is private, open **Settings → General → Danger Zone → Change repository visibility** and make it
   public.
3. Work only in your fork. Do not open a pull request against this repository.
4. Commit as you go. We like seeing the history.

If GitHub will not let you change a fork's visibility, create a new public repository and push your
work there instead:

```sh
git clone https://github.com/<your-account>/<repo>.git
cd <repo>
git remote remove origin
gh repo create <your-name>-take-home --public --source=. --remote=origin --push
```

Or create the repository on github.com and follow the "push an existing repository" instructions it
shows you. Either way, send us the URL.

## What to build

The task, requirements and any stretch goals are in [README.md](./README.md).

## What to put in your README

Replace or extend the README in your fork so that someone can run and understand the work without
asking you questions. It should cover:

- **How to install and run it**, including prerequisites and any environment variables. Use
  `.env.example` for placeholders and never commit a real `.env`.
- **The data model and why** you modelled it that way.
- **The decisions and tradeoffs** you made, especially around failure and concurrency.
- **What you would do with more time.**
- **What you would monitor in production**, and what you would alert on.
- **Known gaps**, anything that does not work, and anything you would change.

Short bullets are fine. We care about the reasoning, not the prose.

## Submitting

Email both of:

- george.fincher@openstudycollege.com
- jonathan.hall@openstudycollege.com

Use this subject:

```
[Take-home] <Your name> - <Exercise name>
```

Include:

- A link to your **public** repository.
- Roughly how long you spent.
- Anything you want us to know: what you are happy with, what you would change, and anything you
  could not get working.

AI tools are completely fine, and we expect people to use them. We only ask that you can explain the
work and the decisions behind it in the technical conversation.

You do not need to send a zip if the repository link works. If you would rather send a zip, say so
in the email.

## How we assess it

We are looking for evidence of judgement, not volume:

- How you modelled the data, and why.
- How you handled the awkward cases: duplicate actions, concurrent requests, invalid state changes.
- Whether the API is pleasant to consume and the errors tell you what broke.
- Whether the UI handles loading, empty and error states.
- Whether the tests are proportionate and actually exercise the risks.
- Whether the README explains the tradeoffs rather than restating the code.

We do not chase coverage numbers, and there are no trick questions.

## The technical conversation

If your submission passes the review, we will invite you to a 45 to 60 minute **in-person**
conversation with two of our engineers. It is a discussion about your work and your experience, not
an interrogation, and there is no live coding exercise. We will send the location and arrival details
in advance. If travelling is difficult, tell us and we will work something out.

The conversation usually has three parts:

1. **Your submission.** You walk us through it, starting with the part you are least happy with. We
   will ask why you made certain choices, what you would change, what happens under concurrent or
   duplicate requests, and what you would monitor in production.
2. **Your experience.** We will ask about work you have done: a hard bug you found and fixed, a
   project you led, and how you work with people outside engineering.
3. **Your questions.** We will leave time for you to ask us about the team, the work, the stack and
   what the role looks like in practice.

This is just as much an opportunity for you to interview us. We would much rather see you at your
best than catch you out, so if a question does not land, ask us to reframe it or say you would rather
approach it in a different way.

We will probably ask:

- Why this schema? What would you change if the requirements shifted?
- What breaks under concurrency, and how does your design prevent it?
- What changes if this runs on two instances?
- What would you monitor, and what would you alert on?
- What would you do differently with another day?

## The director conversation

If the technical conversation goes well, the final step is a 30 minute **remote video call** with our
Digital and Marketing Director. It is a sign-off conversation about how you work, what you are
looking for, and the commercial side of the role. It is not another technical test.

## Ground rules

- Do not commit secrets, real customer data, or anything you do not have the right to share.
- The timebox is a guide, not a rule. If you run over, tell us roughly how long you spent. If you
  want to stop, tell us what you would have done next. An unfinished submission is fine.
- Asking a clarifying question is fine and does not count against you.
- Use whatever tools help you. AI is completely fine. We only ask that you understand the result
  and can explain it.
