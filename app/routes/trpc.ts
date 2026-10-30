import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext } from '~/server/context';
import { appRouter } from '~/server/routers/_app';

const handle = ({ request }: { request: Request }) =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req: request,
        router: appRouter,
        createContext,
    });

export const loader = ({ request }: { request: Request }) => handle({ request });
export const action = ({ request }: { request: Request }) => handle({ request });
