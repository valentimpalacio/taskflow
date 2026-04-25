const fs = require('fs');
const data = {
  "name": "taskflow",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "jest",
    "seed": "npx tsx prisma/seed.ts",
    "db:push": "npx prisma db push",
    "db:generate": "npx prisma generate"
  },
  "prisma": {
    "seed": "npx tsx prisma/seed.ts"
  },
  "dependencies": {
    "@types/bcrypt": "^6.0.0",
    "bcrypt": "^6.0.0",
    "next": "16.2.4",
    "next-auth": "^4.24.14",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@prisma/client": "^7.7.0",
    "@tailwindcss/postcss": "^4",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.4",
    "jest-environment-jsdom": "^30.3.0",
    "prettier": "^3.8.3",
    "prisma": "^7.7.0",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
};
fs.writeFileSync('package.json', JSON.stringify(data, null, 2));
