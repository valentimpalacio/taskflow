const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

// Demo credentials for screenshots
const DEMO_EMAIL = 'demo@taskflow.com';
const DEMO_PASSWORD = 'Demo@123456';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshot(page, name, options = {}) {
  const filepath = path.join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path: filepath, fullPage: options.fullPage || false });
  console.log(`📸 Saved: ${name}.png`);
  return filepath;
}

async function login(page) {
  console.log('🔐 Logging in...');
  await page.goto(`${BASE_URL}/pt/auth/signin`, { waitUntil: 'networkidle2' });
  await sleep(1000);
  
  try {
    // Wait for and fill email input
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    console.log('  Found email input');
    await page.type('input[type="email"]', DEMO_EMAIL, { delay: 30 });
    
    // Wait for and fill password input
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
    console.log('  Found password input');
    await page.type('input[type="password"]', DEMO_PASSWORD, { delay: 30 });
    
    console.log('  Clicking login button...');
    // Click login button
    const submitButton = await page.$('button[type="submit"]');
    if (!submitButton) {
      // Try to find button by text
      const buttons = await page.$$('button');
      for (let btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text && (text.includes('Entrar') || text.includes('Sign in') || text.includes('Iniciar'))) {
          await btn.click();
          break;
        }
      }
    } else {
      await submitButton.click();
    }
    
    console.log('  Waiting for dashboard to load...');
    // Wait for dashboard to load - check for projects API call
    await page.waitForFunction(
      () => document.querySelector('[data-testid="dashboard"]') || document.body.innerHTML.includes('TaskFlow'),
      { timeout: 20000 }
    );
    
    await sleep(3000); // Wait for data to load
    console.log('✅ Logged in successfully');
  } catch (error) {
    console.error('  Login error:', error.message);
    throw error;
  }
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
    console.log('\n--- Authentication Screens ---');
    await page.goto(`${BASE_URL}/pt/auth/signin`, { waitUntil: 'networkidle2' });
    await takeScreenshot(page, '01-pt-signin');

    await page.goto(`${BASE_URL}/en/auth/signin`, { waitUntil: 'networkidle2' });
    await takeScreenshot(page, '02-en-signin');

    await page.goto(`${BASE_URL}/es/auth/signin`, { waitUntil: 'networkidle2' });
    await takeScreenshot(page, '03-es-signin');

    // Login before accessing authenticated pages
    await login(page);

    console.log('\n--- Dashboard ---');
    await page.goto(`${BASE_URL}/pt`, { waitUntil: 'networkidle2' });
    await sleep(2000);
    await takeScreenshot(page, '04-pt-dashboard');

    await page.goto(`${BASE_URL}/en`, { waitUntil: 'networkidle2' });
    await sleep(2000);
    await takeScreenshot(page, '05-en-dashboard');

    await page.goto(`${BASE_URL}/es`, { waitUntil: 'networkidle2' });
    await sleep(2000);
    await takeScreenshot(page, '06-es-dashboard');

    console.log('\n--- Kanban Board ---');
    await page.goto(`${BASE_URL}/pt?view=kanban`, { waitUntil: 'networkidle2' });
    await sleep(2000);
    await takeScreenshot(page, '07-pt-kanban');

    console.log('\n--- Gantt Chart ---');
    await page.goto(`${BASE_URL}/pt?view=gantt`, { waitUntil: 'networkidle2' });
    await sleep(2000);
    await takeScreenshot(page, '08-pt-gantt');

    console.log('\n--- Calendar View ---');
    await page.goto(`${BASE_URL}/pt?view=calendar`, { waitUntil: 'networkidle2' });
    await sleep(2000);
    await takeScreenshot(page, '09-pt-calendar');

    console.log('\n--- Analytics ---');
    await page.goto(`${BASE_URL}/pt?view=analytics`, { waitUntil: 'networkidle2' });
    await sleep(2000);
    await takeScreenshot(page, '10-pt-analytics');

    console.log('\n--- Reports ---');
    await page.goto(`${BASE_URL}/pt?view=reports`, { waitUntil: 'networkidle2' });
    await sleep(2000);
    await takeScreenshot(page, '11-pt-reports');

    console.log('\n--- Dark Mode ---');
    await page.goto(`${BASE_URL}/pt`, { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await sleep(2000);
    await takeScreenshot(page, '12-pt-dark-mode');

    console.log('\n--- Mobile View ---');
    await page.setViewport({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/pt`, { waitUntil: 'networkidle2' });
    await sleep(2000);
    await takeScreenshot(page, '13-pt-mobile');

    console.log('\n✅ All screenshots taken successfully!');
    console.log(`📁 Saved to: ${SCREENSHOTS_DIR}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
}

main();