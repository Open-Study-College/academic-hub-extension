import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { db } from './client.server';
import { assignments, courses, enrolments, students } from './schema';

dayjs.extend(utc);
dayjs.extend(timezone);

const UK_TIMEZONE = 'Europe/London';

const dueAt = ({ days, hour = 23, minute = 59 }: { days: number; hour?: number; minute?: number }) =>
    dayjs()
        .tz(UK_TIMEZONE)
        .add(days, 'day')
        .hour(hour)
        .minute(minute)
        .second(0)
        .millisecond(0)
        .utc()
        .toISOString();

const run = () => {
    db.delete(enrolments).run();
    db.delete(assignments).run();
    db.delete(students).run();
    db.delete(courses).run();

    db.insert(courses)
        .values([
            { id: 1, code: 'L3-HSC', title: 'Level 3 Diploma in Health and Social Care' },
            { id: 2, code: 'A-BIO', title: 'A Level Biology' },
        ])
        .run();

    db.insert(students)
        .values([
            { id: 1, firstName: 'Amara', lastName: 'Okafor', email: 'amara.okafor@example.com' },
            { id: 2, firstName: 'Ben', lastName: 'Carter', email: 'ben.carter@example.com' },
            { id: 3, firstName: 'Chloe', lastName: 'Davies', email: 'chloe.davies@example.com' },
            { id: 4, firstName: 'Dev', lastName: 'Patel', email: 'dev.patel@example.com' },
            { id: 5, firstName: 'Erin', lastName: 'Walsh', email: 'erin.walsh@example.com' },
            { id: 6, firstName: 'Farah', lastName: 'Ahmed', email: 'farah.ahmed@example.com' },
        ])
        .run();

    db.insert(enrolments)
        .values([
            { studentId: 1, courseId: 1 },
            { studentId: 2, courseId: 1 },
            { studentId: 3, courseId: 1 },
            { studentId: 4, courseId: 2 },
            { studentId: 5, courseId: 2 },
            { studentId: 6, courseId: 2 },
        ])
        .run();

    db.insert(assignments)
        .values([
            {
                id: 1,
                courseId: 1,
                title: 'Unit 1: Human Lifespan Development',
                dueAt: dueAt({ days: -3 }),
            },
            {
                id: 2,
                courseId: 1,
                title: 'Unit 2: Working in Health and Social Care',
                dueAt: dueAt({ days: 2 }),
            },
            {
                id: 3,
                courseId: 2,
                title: 'Practical 1: Microscopy',
                dueAt: dueAt({ days: 6 }),
            },
            {
                id: 4,
                courseId: 2,
                title: 'Essay: Cell Structure',
                dueAt: dueAt({ days: 14 }),
            },
        ])
        .run();

    console.log('Seeded 2 courses, 6 students and 4 assignments.');
};

run();
