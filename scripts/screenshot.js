const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Garante que o diretório de screenshots exista
const screenshotDir = path.join(__dirname, '..', 'docs', 'screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

(async () => {
  console.log('🚀 Iniciando capturas de tela profissionais do TaskFlow...\n');

  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: {
      width: 1440,
      height: 900,
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  const capture = async (name, description) => {
    console.log(`📸 Capturando: ${description}...`);
    const filePath = path.join(screenshotDir, `${name}.png`);
    await page.waitForTimeout(2000); // Espera animações
    await page.screenshot({ path: filePath, fullPage: false });
    console.log(`✅ Salvo: ${name}.png`);
  };

  try {
    // 1. Login
    console.log('🔑 Fazendo login...');
    await page.goto('http://localhost:3000/pt/auth/signin', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'demo@taskflow.com');
    await page.type('input[type="password"]', 'demo123456');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    // 2. Dashboard - Board View (Tema Claro)
    await page.goto('http://localhost:3000/pt', { waitUntil: 'networkidle0' });
    await capture('01-dashboard', 'Dashboard Principal');

    // 3. Kanban View
    // Já estamos nela, mas vamos garantir clicando no botão se necessário
    await capture('02-kanban', 'Quadro Kanban');

    // 4. List View
    const listBtn = await page.waitForSelector('button:has(svg.lucide-list)');
    await listBtn.click();
    await capture('04-list', 'Lista de Tarefas');

    // 5. Gantt View
    const ganttBtn = await page.waitForSelector('button:has(svg.lucide-calendar)');
    await ganttBtn.click();
    await capture('03-gantt', 'Gráfico de Gantt');

    // 6. Profile Page
    await page.goto('http://localhost:3000/pt/profile', { waitUntil: 'networkidle0' });
    await capture('06-profile', 'Perfil do Usuário');

    // 7. Dark Mode - Voltando para o Dashboard
    await page.goto('http://localhost:3000/pt', { waitUntil: 'networkidle0' });
    const themeBtn = await page.waitForSelector('button[aria-label="Toggle dark mode"]');
    await themeBtn.click();
    await capture('05-dark-mode', 'Dashboard em Dark Mode');

    console.log('\n🎉 Todas as capturas de tela foram finalizadas com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro durante as capturas:', error.message);
    console.log('Certifique-se de que o servidor está rodando em http://localhost:3000');
  } finally {
    await browser.close();
  }
})();
