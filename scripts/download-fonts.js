/**
 * Script untuk download Inter font files dari Google Fonts
 * Run: node scripts/download-fonts.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(__dirname, '..', 'public', 'fonts');

// Font files yang perlu di-download
const FONT_FILES = [
  { name: 'Inter-Light.woff2', weight: 300 },
  { name: 'Inter-Regular.woff2', weight: 400 },
  { name: 'Inter-Medium.woff2', weight: 500 },
  { name: 'Inter-SemiBold.woff2', weight: 600 },
  { name: 'Inter-Bold.woff2', weight: 700 },
];

// Google Fonts API URL untuk download font files
// Menggunakan Google Fonts API untuk mendapatkan direct download links
const GOOGLE_FONTS_API = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';

// Function untuk download file
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        file.close();
        fs.unlinkSync(filepath);
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download: ${url} (Status: ${response.statusCode})`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

// Function untuk extract font URLs dari Google Fonts CSS
async function getFontUrls() {
  return new Promise((resolve, reject) => {
    https.get(GOOGLE_FONTS_API, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        // Parse CSS untuk extract font URLs
        const urls = {};
        const regex = /url\(([^)]+)\)/g;
        let match;
        let currentWeight = 400;
        
        // Extract weight dari CSS
        const weightRegex = /font-weight:\s*(\d+)/g;
        const weights = [];
        let weightMatch;
        while ((weightMatch = weightRegex.exec(data)) !== null) {
          weights.push(parseInt(weightMatch[1]));
        }
        
        // Extract URLs
        const urlMatches = data.match(/url\(([^)]+)\)/g);
        if (urlMatches) {
          urlMatches.forEach((urlMatch, index) => {
            const url = urlMatch.replace(/url\(|\)/g, '').replace(/['"]/g, '');
            if (index < weights.length) {
              urls[weights[index]] = url;
            }
          });
        }
        
        resolve(urls);
      });
    }).on('error', reject);
  });
}

// Main function
async function main() {
  console.log('🚀 Starting Inter font download...\n');
  
  // Create fonts directory if it doesn't exist
  if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
    console.log(`📁 Created directory: ${FONTS_DIR}\n`);
  }
  
  try {
    // Get font URLs from Google Fonts
    console.log('📡 Fetching font URLs from Google Fonts...');
    const fontUrls = await getFontUrls();
    
    if (Object.keys(fontUrls).length === 0) {
      console.log('⚠️  Could not extract font URLs from Google Fonts CSS.');
      console.log('📝 Please download fonts manually from: https://gwfh.mranftl.com/fonts/inter');
      console.log('   Or follow instructions in FONT_SETUP.md\n');
      return;
    }
    
    // Download each font file
    console.log('\n📥 Downloading font files...\n');
    for (const fontFile of FONT_FILES) {
      const url = fontUrls[fontFile.weight];
      if (!url) {
        console.log(`⚠️  No URL found for weight ${fontFile.weight}, skipping...`);
        continue;
      }
      
      const filepath = path.join(FONTS_DIR, fontFile.name);
      try {
        await downloadFile(url, filepath);
      } catch (error) {
        console.error(`❌ Error downloading ${fontFile.name}:`, error.message);
      }
    }
    
    console.log('\n✨ Done! Font files downloaded to:', FONTS_DIR);
    console.log('\n📝 Next steps:');
    console.log('   1. Verify all font files are present in public/fonts/');
    console.log('   2. Test the website - fonts should load from local files');
    console.log('   3. Check Network tab - no requests to fonts.googleapis.com');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n📝 Alternative: Download fonts manually from:');
    console.log('   https://gwfh.mranftl.com/fonts/inter');
    console.log('   Or follow instructions in FONT_SETUP.md');
  }
}

// Run script
if (require.main === module) {
  main();
}

module.exports = { main };

