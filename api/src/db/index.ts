import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';

import * as relations from './relations.js';
import * as schema from './schema.js';

const db = drizzle(process.env.DATABASE_URL!, { schema: { ...schema, ...relations } });

export { db };
