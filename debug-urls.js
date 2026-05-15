const http = require('http');

const urls = [
  'http://localhost:3000/',
  'http://localhost:3000/pt',
  'http://localhost:3000/en',
  'http://localhost:3000/pt/auth/signin',
  'http://localhost:3000/api/health',
];

async function check(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        console.log(`${url}: Status ${res.statusCode}`);
        // Check for 404 vs real page
        if (data.includes('__next_builtin__not-found') || data.includes('next-error-h1')) {
          console.log('  -> 404 page');
        } else if (data.includes('__NEXT_DATA__') || data.includes('next_f')) {
          console.log('  -> Next.js page (likely working)');
        } else {
          console.log(`  -> Content length: ${data.length}`);
        }
        resolve();
      });
    }).on('error', (e) => {
      console.log(`${url}: Error - ${e.message}`);
      resolve();
    });
  });
}

(async () => {
  for (const url of urls) {
    await check(url);
  }
})();
