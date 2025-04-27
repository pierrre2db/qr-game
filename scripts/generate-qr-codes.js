const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '..', 'qr-codes');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Base URL for the QR codes
const baseUrl = 'https://qr-game.example.com/game/';

// Challenge IDs from the app
const challengeIds = [
  'start',
  'challenge1',
  'challenge2',
  'challenge3',
  'challenge4',
  'finish'
];

// Generate QR codes for each challenge
async function generateQRCodes() {
  console.log('Generating QR codes for challenges...');
  
  for (const id of challengeIds) {
    const url = baseUrl + id;
    const outputPath = path.join(outputDir, `${id}.png`);
    
    try {
      await QRCode.toFile(outputPath, url, {
        color: {
          dark: '#4285F4',
          light: '#FFFFFF'
        },
        width: 300,
        margin: 1
      });
      console.log(`Created QR code for ${id} at ${outputPath}`);
    } catch (err) {
      console.error(`Error generating QR code for ${id}:`, err);
    }
  }
  
  console.log('QR code generation complete!');
}

generateQRCodes();
