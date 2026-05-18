const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

const DEMO_EMAIL = 'demo@taskflow.com';
const DEMO_PASSWORD = 'demo123456';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshot(page, name) {
  const filepath = path.join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path: filepath, fullPage: false });
  console.log(`📸 Saved: ${name}.png`);
  return filepath;
}

async function login(page) {
  console.log('🔐 Logging in...');
  await page.goto(`${BASE_URL}/pt/auth/signin`, { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(2000);

  await page.waitForSelector('input[type="email"]', { timeout: 20000 });
  await page.type('input[type="email"]', DEMO_EMAIL, { delay: 20 });

  await page.waitForSelector('input[type="password"]', { timeout: 20000 });
  await page.type('input[type="password"]', DEMO_PASSWORD, { delay: 20 });

  // Click submit and wait for navigation
  await Promise.all([
    page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (btn) btn.click();
    }),
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {}),
  ]);

  // Wait for dashboard content
  await page.waitForFunction(
    () => window.location.pathname.endsWith('/pt'),
    { timeout: 30000 }
  );
  await sleep(5000);
  console.log('✅ Logged in successfully');
}

async function clickViewButton(page, text) {
  await page.evaluate((btnText) => {
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      if (btn.textContent && btn.textContent.trim().toLowerCase() === btnText.toLowerCase()) {
        btn.click();
        return;
      }
    }
    // Try partial match
    for (const btn of buttons) {
      if (btn.textContent && btn.textContent.toLowerCase().includes(btnText.toLowerCase())) {
        btn.click();
        return;
      }
    }
  }, text);
  await sleep(1500);
}

async function takeFullPageScreenshot(page, name) {
  // Take a bigger viewport to capture more of the page
  await page.setViewport({ width: 1920, height: 2000 });
  await sleep(500);
  const filepath = path.join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path: filepath, fullPage: false });
  console.log(`📸 Saved: ${name}.png`);
  // Reset viewport back
  await page.setViewport({ width: 1920, height: 1080 });
  return filepath;
}

async function main() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    // ========== AUTH SCREENS ==========
    console.log('\n=== Authentication Screens ===');

    await page.goto(`${BASE_URL}/pt/auth/signin`, { waitUntil: 'networkidle0' });
    await sleep(1000);
    await takeScreenshot(page, '01-pt-signin');

    await page.goto(`${BASE_URL}/en/auth/signin`, { waitUntil: 'networkidle0' });
    await sleep(1000);
    await takeScreenshot(page, '02-en-signin');

    await page.goto(`${BASE_URL}/es/auth/signin`, { waitUntil: 'networkidle0' });
    await sleep(1000);
    await takeScreenshot(page, '03-es-signin');
    console.log('✅ Completed authentication screens');

    // ========== LOGIN ==========
    console.log('🔐 Starting login process...');
    await login(page);
    console.log('✅ Login completed successfully');

    // ========== DASHBOARD in 3 languages ==========
    console.log('\n=== Dashboard ===');

    // Portuguese - Dashboard in List View (shows all tasks, stats, charts)
    await page.goto(`${BASE_URL}/pt`, { waitUntil: 'networkidle0' });
    await sleep(3000);
    await takeFullPageScreenshot(page, '04-pt-dashboard');

    // English - Dashboard
    await page.goto(`${BASE_URL}/en`, { waitUntil: 'networkidle0' });
    await sleep(3000);
    await takeFullPageScreenshot(page, '05-en-dashboard');

    // Spanish - Dashboard
    await page.goto(`${BASE_URL}/es`, { waitUntil: 'networkidle0' });
    await sleep(3000);
    await takeFullPageScreenshot(page, '06-es-dashboard');

    // ========== KANBAN BOARD ==========
    console.log('\n=== Kanban Board ===');
    await page.goto(`${BASE_URL}/pt`, { waitUntil: 'networkidle0' });
    await sleep(3000);
    // Click Board button
    await clickViewButton(page, 'Board');
    await sleep(2000);
    await takeFullPageScreenshot(page, '07-pt-kanban');

    // ========== GANTT CHART ==========
    console.log('\n=== Gantt Chart ===');
    await page.goto(`${BASE_URL}/pt`, { waitUntil: 'networkidle0' });
    await sleep(3000);
    // Click Gantt button
    await clickViewButton(page, 'Gantt');
    await sleep(2000);
    await takeFullPageScreenshot(page, '08-pt-gantt');

    // ========== CALENDAR VIEW ==========
    console.log('\n=== Calendar View ===');
    await page.goto(`${BASE_URL}/pt`, { waitUntil: 'networkidle0' });
    await sleep(3000);
    // Click List button first, then scroll to show CalendarView component
    await clickViewButton(page, 'List');
    await sleep(1500);
    // Scroll to show the full calendar/analytics section below
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await sleep(1000);
    await takeFullPageScreenshot(page, '09-pt-calendar');

    // ========== ANALYTICS ==========
    console.log('\n=== Analytics ===');
    await page.goto(`${BASE_URL}/pt`, { waitUntil: 'networkidle0' });
    await sleep(3000);
    await clickViewButton(page, 'Board');
    await sleep(1500);
    await takeFullPageScreenshot(page, '10-pt-analytics');

    // ========== REPORTS ==========
    console.log('\n=== Reports ===');
    await page.goto(`${BASE_URL}/pt`, { waitUntil: 'networkidle0' });
    await sleep(3000);
    await takeFullPageScreenshot(page, '11-pt-reports');

    // ========== DARK MODE ==========
    console.log('\n=== Dark Mode ===');
    await page.goto(`${BASE_URL}/pt`, { waitUntil: 'networkidle0' });
    await sleep(2000);
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(3000);
    await takeFullPageScreenshot(page, '12-pt-dark-mode');

    // ========== MOBILE VIEW ==========
    console.log('\n=== Mobile View ===');
    await page.setViewport({ width: 375, height: 812 });
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
    });
    await page.goto(`${BASE_URL}/pt`, { waitUntil: 'networkidle0' });
    await sleep(3000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13-pt-mobile.png'), fullPage: true });
    console.log('📸 Saved: 13-pt-mobile.png');

    console.log('\n✅ All screenshots taken successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
    console.error('❌ Error details:', JSON.stringify(error, null, 2));
  } finally {
    await browser.close();
  }
}

main();