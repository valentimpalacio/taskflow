import 'dotenv/config';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';

export default {
  connectionString: process.env.DATABASE_URL,
  adapter: new PrismaNeon(new Pool({ connectionString: process.env.DATABASE_URL })),
};
