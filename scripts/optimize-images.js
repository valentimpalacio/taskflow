const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function optimizeImages() {
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  const files = fs.readdirSync(screenshotsDir);
  
  console.log('📸 Otimizando imagens...');
  
  for (const file of files) {
    if (file.endsWith('.png')) {
      const filePath = path.join(screenshotsDir, file);
      const stats = fs.statSync(filePath);
      
      // Otimizar apenas imagens maiores que 300KB
      if (stats.size > 300 * 1024) {
        console.log(`🔄 Otimizando ${file} (${(stats.size / 1024).toFixed(1)} KB)...`);
        
        try {
          await sharp(filePath)
            .png({ quality: 80, compressionLevel: 9 })
            .resize(1200) // Reduzir para largura máxima de 1200px
            .toFile(path.join(screenshotsDir, `optimized-${file}`));
          
          // Deletar original e renomear otimizada
          fs.unlinkSync(filePath);
          fs.renameSync(
            path.join(screenshotsDir, `optimized-${file}`),
            filePath
          );
          
          const newStats = fs.statSync(filePath);
          console.log(`✅ ${file} otimizada: ${(stats.size / 1024).toFixed(1)}KB → ${(newStats.size / 1024).toFixed(1)}KB`);
        } catch (error) {
          console.error(`❌ Erro otimizando ${file}:`, error.message);
        }
      } else {
        console.log(`✅ ${file} já otimizada (${(stats.size / 1024).toFixed(1)} KB)`);
      }
    }
  }
  
  console.log('🎉 Todas as imagens foram otimizadas!');
}

optimizeImages().catch(console.error);