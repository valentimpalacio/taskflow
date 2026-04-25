import '@testing-library/jest-dom';

// Mock Request and Response for Next.js
if (!global.Request) {
  global.Request = class Request {
    constructor(input, init) {
      this.url = typeof input === 'string' ? input : input.url;
      this.method = init?.method || 'GET';
      this.headers = new Map(Object.entries(init?.headers || {}));
      this.body = init?.body;
    }
  };
}

if (!global.Response) {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body;
      this.status = init?.status || 200;
      this.headers = new Map(Object.entries(init?.headers || {}));
    }
    json() {
      return Promise.resolve(this.body);
    }
  };
}

// Mock TextEncoder/TextDecoder for Prisma
if (!global.TextEncoder) {
  // @ts-ignore
  const { TextEncoder, TextDecoder } = await import('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}