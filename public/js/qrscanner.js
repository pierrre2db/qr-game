// QR Scanner functionality
let html5QrCode;

// Initialize QR Scanner
function initQRScanner() {
  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode("qr-reader");
  }
  
  const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };
  
  // Start scanner with camera
  html5QrCode.start(
    { facingMode: "environment" }, 
    qrConfig,
    onScanSuccess,
    onScanFailure
  ).catch(err => {
    console.error(`Unable to start scanning: ${err}`);
    showToast('Camera access denied or not available');
  });
}

// Success callback when QR code is scanned
function onScanSuccess(decodedText, decodedResult) {
  // Stop scanning
  closeQRScanner();
  
  // Process the result
  console.log(`QR Code detected: ${decodedText}`);
  processQRResult(decodedText);
}

// Failure callback
function onScanFailure(error) {
  // Handle scan failure, usually better to ignore and keep scanning
  console.warn(`QR scan error: ${error}`);
}

// Close QR Scanner
function closeQRScanner() {
  if (html5QrCode && html5QrCode.isScanning) {
    html5QrCode.stop().catch(err => {
      console.error(`Unable to stop scanning: ${err}`);
    });
  }
}
