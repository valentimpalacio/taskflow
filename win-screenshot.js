const puppeteer = require('puppeteer');
const path = require('path');

/** Use production server to avoid Next.js dev "N issue" badge, e.g. SCREENSHOT_BASE_URL=http://localhost:3001 */
const baseUrl = (process.env.SCREENSHOT_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

const screenshotDir = path.join(__dirname, 'screenshots');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const capture = async (page, name) => {
  console.log(`Capturing ${name}...`);
  await sleep(3000);
  await page.screenshot({ path: path.join(screenshotDir, `${name}.png`), fullPage: false });
  console.log(`Saved: ${name}.png`);
};

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  try {
    // Login
    console.log('Logging in...');
    await page.goto(`${baseUrl}/pt/auth/signin`, { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(1000);
    await page.type('input[type="email"]', 'demo@taskflow.com');
    await page.type('input[type="password"]', 'demo123456');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }),
    ]);
    console.log('Logged in!');

    // PT Sign In
    await page.goto(`${baseUrl}/pt/auth/signin`, { waitUntil: 'networkidle0', timeout: 30000 });
    await capture(page, '01-pt-signin');

    // EN Sign In
    await page.goto(`${baseUrl}/en/auth/signin`, { waitUntil: 'networkidle0', timeout: 30000 });
    await capture(page, '02-en-signin');

    // ES Sign In
    await page.goto(`${baseUrl}/es/auth/signin`, { waitUntil: 'networkidle0', timeout: 30000 });
    await capture(page, '03-es-signin');

    // Login again for dashboard
    await page.goto(`${baseUrl}/pt/auth/signin`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.type('input[type="email"]', 'demo@taskflow.com');
    await page.type('input[type="password"]', 'demo123456');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }),
    ]);

    // PT Dashboard
    await page.goto(`${baseUrl}/pt`, { waitUntil: 'networkidle0', timeout: 30000 });
    await capture(page, '04-pt-dashboard');

    // EN Dashboard
    await page.goto(`${baseUrl}/en`, { waitUntil: 'networkidle0', timeout: 30000 });
    await capture(page, '05-en-dashboard');

    // ES Dashboard
    await page.goto(`${baseUrl}/es`, { waitUntil: 'networkidle0', timeout: 30000 });
    await capture(page, '06-es-dashboard');

    // Kanban (PT)
    await page.goto(`${baseUrl}/pt`, { waitUntil: 'networkidle0', timeout: 30000 });
    await capture(page, '07-pt-kanban');

    // Gantt (PT)
    await page.goto(`${baseUrl}/pt`, { waitUntil: 'networkidle0', timeout: 30000 });
    try {
      const ganttBtn = await page.waitForSelector('button:has(svg.lucide-calendar)', { timeout: 5000 });
      await ganttBtn.click();
      await sleep(2000);
    } catch (e) { console.log('Gantt button not found, continuing...'); }
    await capture(page, '08-pt-gantt');

    // Calendar
    await page.goto(`${baseUrl}/pt`, { waitUntil: 'networkidle0', timeout: 30000 });
    await capture(page, '09-pt-calendar');

    // Analytics (PT)
    await capture(page, '10-pt-analytics');

    // Reports (PT)
    await capture(page, '11-pt-reports');

    // Dark Mode (PT)
    await page.goto(`${baseUrl}/pt`, { waitUntil: 'networkidle0', timeout: 30000 });
    try {
      const themeBtn = await page.waitForSelector('button[aria-label="Toggle dark mode"], button:has(svg.lucide-moon), button:has(svg.lucide-sun)', { timeout: 5000 });
      await themeBtn.click();
      await sleep(2000);
    } catch (e) { console.log('Theme button not found, continuing...'); }
    await capture(page, '12-pt-dark-mode');

    // Mobile (PT)
    await page.setViewport({ width: 375, height: 667 });
    await page.goto(`${baseUrl}/pt`, { waitUntil: 'networkidle0', timeout: 30000 });
    await capture(page, '13-pt-mobile');

    console.log('\nAll screenshots captured successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
