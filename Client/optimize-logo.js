const sharp = require("sharp");
const fs = require("fs");

const inputPath = "./public/img/OFFICIAL-LOGO.png";
const webpPath = "./public/img/OFFICIAL-LOGO.webp";
const optimizedPngPath = "./public/img/OFFICIAL-LOGO-optimized.png";

async function optimizeLogo() {
  try {
    // Create WebP version (modern browsers, best compression)
    await sharp(inputPath).webp({ quality: 85 }).toFile(webpPath);

    const webpStats = fs.statSync(webpPath);
    console.log(`✓ WebP created: ${(webpStats.size / 1024).toFixed(2)}KB`);

    // Optimize PNG as fallback
    await sharp(inputPath)
      .png({ quality: 85, compressionLevel: 9 })
      .toFile(optimizedPngPath);

    const pngStats = fs.statSync(optimizedPngPath);
    console.log(
      `✓ Optimized PNG created: ${(pngStats.size / 1024).toFixed(2)}KB`
    );

    // Replace original with optimized
    fs.copyFileSync(optimizedPngPath, inputPath);
    fs.unlinkSync(optimizedPngPath);
    console.log("✓ Original PNG replaced with optimized version");

    const originalStats = fs.statSync(inputPath);
    console.log(`\n✓ Final sizes:`);
    console.log(`  PNG: ${(originalStats.size / 1024).toFixed(2)}KB`);
    console.log(`  WebP: ${(webpStats.size / 1024).toFixed(2)}KB`);
    console.log(
      `\n✓ Savings: ${(127 - webpStats.size / 1024).toFixed(2)}KB (${(
        (1 - webpStats.size / (127 * 1024)) *
        100
      ).toFixed(1)}%)`
    );
  } catch (error) {
    console.error("Error optimizing logo:", error);
  }
}

optimizeLogo();
