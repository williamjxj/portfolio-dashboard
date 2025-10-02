const fs = require('fs');
const path = require('path');
const https = require('https');

// Create the logos directory if it doesn't exist
const logosDir = './frontend/public/assets/logos';
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Logo URLs and their target filenames
const logos = [
  {
    url: 'https://icon.icepanel.io/Technology/svg/Next.js.svg',
    filename: 'nextjs-logo.svg'
  },
  {
    url: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/react-js-icon.svg',
    filename: 'react-logo.svg'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg',
    filename: 'typescript-logo.svg'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png',
    filename: 'javascript-logo.png'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg',
    filename: 'tailwind-logo.svg'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg',
    filename: 'tensorflow-logo.svg'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/10/PyTorch_logo_icon.svg',
    filename: 'pytorch-logo.svg'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/OpenAI_logo.svg',
    filename: 'openai-logo.svg'
  }
];

function downloadLogo(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(logosDir, filename));
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve();
        });
      } else {
        console.log(`❌ Failed to download ${filename}: ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.log(`❌ Error downloading ${filename}:`, err.message);
      reject(err);
    });
  });
}

async function downloadAllLogos() {
  console.log('🚀 Starting logo downloads...');
  
  for (const logo of logos) {
    try {
      await downloadLogo(logo.url, logo.filename);
    } catch (error) {
      console.log(`⚠️  Skipped ${logo.filename}: ${error.message}`);
    }
  }
  
  console.log('✨ Logo download complete!');
}

downloadAllLogos();
