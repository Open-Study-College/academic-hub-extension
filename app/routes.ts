import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
    index('routes/home.tsx'),
    route('assignments/:assignmentId', 'routes/assignment.tsx'),
    route('api/trpc/*', 'routes/trpc.ts'),
] satisfies RouteConfig;
