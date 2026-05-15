const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  
  console.log('Navigating to sign-in page...');
  await page.goto('http://localhost:3000/pt/auth/signin', { waitUntil: 'networkidle0', timeout: 30000 });
  
  const html = await page.content();
  console.log('Page title:', await page.title());
  console.log('URL:', page.url());
  
  // Check for input fields
  const inputs = await page.evaluate(() => {
    const allInputs = document.querySelectorAll('input');
    return Array.from(allInputs).map(i => ({ type: i.type, name: i.name, id: i.id, placeholder: i.placeholder, class: i.className }));
  });
  console.log('Input fields:', JSON.stringify(inputs, null, 2));
  
  // Check for buttons
  const buttons = await page.evaluate(() => {
    const allButtons = document.querySelectorAll('button, input[type="submit"]');
    return Array.from(allButtons).map(b => ({ type: b.type, text: b.textContent?.trim().substring(0, 50), id: b.id, class: b.className.substring(0, 80) }));
  });
  console.log('Buttons:', JSON.stringify(buttons, null, 2));
  
  // Check for error messages
  const errors = await page.evaluate(() => {
    const errEls = document.querySelectorAll('[role="alert"], .error, .text-red');
    return Array.from(errEls).map(e => e.textContent?.trim());
  });
  console.log('Errors:', JSON.stringify(errors));
  
  await browser.close();
})();
