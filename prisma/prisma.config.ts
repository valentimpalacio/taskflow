import 'dotenv/config';
import { PrismaNeon } from '@prisma/adapter-neon';

export default {
  connectionString: process.env.DATABASE_URL,
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
};
