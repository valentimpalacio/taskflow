import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export default {
  connectionString: process.env.DATABASE_URL,
  adapter: new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL })),
};
