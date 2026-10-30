import { db } from '~/db/client.server';

export type Context = {
    db: typeof db;
};

export const createContext = () => ({ db });
