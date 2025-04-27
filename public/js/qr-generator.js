/**
 * Module de génération de codes QR utilisant la bibliothèque jsQR
 * Permet de configurer le nombre de codes et d'exporter en PNG/SVG
 */

class QRCodeGenerator {
  constructor() {
    this.defaultConfig = {
      size: 300,
      margin: 10,
      color: {
        dark: '#4285F4',
        light: '#FFFFFF'
      },
      format: 'png',
      errorCorrectionLevel: 'M'
    };
  }

  /**
   * Initialise le générateur de codes QR
   * @returns {Promise} Promesse résolue lorsque le générateur est prêt
   */
  async initialize() {
    // Vérifier si jsQR est déjà chargé
    if (window.QRCode) {
      console.log('jsQR déjà chargé');
      return Promise.resolve();
    }

    console.log('Chargement de la bibliothèque QR Code...');
    
    // Charger dynamiquement la bibliothèque jsQR
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
      script.onload = () => {
        console.log('Bibliothèque QR Code chargée avec succès');
        if (!window.QRCode) {
          console.error('La bibliothèque a été chargée mais l\'objet QRCode n\'est pas disponible');
          reject(new Error('QRCode non disponible après chargement'));
          return;
        }
        resolve();
      };
      script.onerror = (error) => {
        console.error('Erreur lors du chargement de la bibliothèque QR Code:', error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  }

  /**
   * Génère un code QR et le retourne sous forme de données URL
   * @param {string} data - Données à encoder dans le code QR
   * @param {object} options - Options de configuration
   * @returns {Promise<string>} Promesse résolue avec les données URL du code QR
   */
  async generateQRCodeDataURL(data, options = {}) {
    try {
      await this.initialize();
      
      if (!window.QRCode) {
        throw new Error('La bibliothèque QRCode n\'est pas disponible');
      }
      
      console.log('Génération du QR code avec les données:', data);
      console.log('Options:', JSON.stringify(options));

      const config = { ...this.defaultConfig, ...options };
      
      return new Promise((resolve, reject) => {
        try {
          QRCode.toDataURL(data, {
            width: config.size,
            margin: config.margin,
            color: config.color,
            errorCorrectionLevel: config.errorCorrectionLevel
          }, (err, url) => {
            if (err) {
              console.error('Erreur lors de la génération du code QR:', err);
              reject(err);
              return;
            }
            
            if (!url) {
              console.error('URL du QR code vide ou invalide');
              reject(new Error('URL du QR code invalide'));
              return;
            }
            
            console.log('QR code généré avec succès');
            resolve(url);
          });
        } catch (error) {
          console.error('Exception lors de la génération du code QR:', error);
          reject(error);
        }
      });
    } catch (error) {
      console.error('Erreur dans generateQRCodeDataURL:', error);
      throw error;
    }
  }

  /**
   * Génère un code QR et le dessine sur un élément canvas
   * @param {string} data - Données à encoder dans le code QR
   * @param {HTMLCanvasElement} canvas - Élément canvas sur lequel dessiner
   * @param {object} options - Options de configuration
   * @returns {Promise<void>} Promesse résolue lorsque le code QR est dessiné
   */
  async generateQRCodeToCanvas(data, canvas, options = {}) {
    await this.initialize();

    const config = { ...this.defaultConfig, ...options };
    
    return new Promise((resolve, reject) => {
      try {
        QRCode.toCanvas(canvas, data, {
          width: config.size,
          margin: config.margin,
          color: config.color,
          errorCorrectionLevel: config.errorCorrectionLevel
        }, (err) => {
          if (err) {
            console.error('Erreur lors de la génération du code QR:', err);
            reject(err);
            return;
          }
          resolve();
        });
      } catch (error) {
        console.error('Erreur lors de la génération du code QR:', error);
        reject(error);
      }
    });
  }

  /**
   * Génère un code QR et le retourne sous forme de chaîne SVG
   * @param {string} data - Données à encoder dans le code QR
   * @param {object} options - Options de configuration
   * @returns {Promise<string>} Promesse résolue avec la chaîne SVG du code QR
   */
  async generateQRCodeSVG(data, options = {}) {
    await this.initialize();

    const config = { ...this.defaultConfig, ...options };
    
    return new Promise((resolve, reject) => {
      try {
        QRCode.toString(data, {
          type: 'svg',
          width: config.size,
          margin: config.margin,
          color: config.color,
          errorCorrectionLevel: config.errorCorrectionLevel
        }, (err, svg) => {
          if (err) {
            console.error('Erreur lors de la génération du code QR en SVG:', err);
            reject(err);
            return;
          }
          resolve(svg);
        });
      } catch (error) {
        console.error('Erreur lors de la génération du code QR en SVG:', error);
        reject(error);
      }
    });
  }

  /**
   * Génère plusieurs codes QR à partir d'une liste de données
   * @param {Array<string>} dataList - Liste des données à encoder
   * @param {object} options - Options de configuration
   * @returns {Promise<Array<string>>} Promesse résolue avec un tableau de données URL
   */
  async generateMultipleQRCodes(dataList, options = {}) {
    const results = [];
    
    for (const data of dataList) {
      try {
        const dataURL = await this.generateQRCodeDataURL(data, options);
        results.push({
          data,
          dataURL,
          success: true
        });
      } catch (error) {
        results.push({
          data,
          error: error.message,
          success: false
        });
      }
    }
    
    return results;
  }

  /**
   * Télécharge un code QR en tant que fichier
   * @param {string} dataURL - Données URL du code QR
   * @param {string} fileName - Nom du fichier
   * @param {string} format - Format du fichier (png ou svg)
   */
  downloadQRCode(dataURL, fileName, format = 'png') {
    const link = document.createElement('a');
    
    if (format === 'svg' && dataURL.startsWith('<svg')) {
      // Pour SVG, nous avons une chaîne SVG, pas une dataURL
      const blob = new Blob([dataURL], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `${fileName}.svg`;
    } else {
      // Pour PNG, nous avons une dataURL
      link.href = dataURL;
      link.download = `${fileName}.png`;
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Crée une interface utilisateur pour générer des codes QR
   * @param {HTMLElement} container - Élément conteneur pour l'interface
   */
  createUI(container) {
    // Créer l'interface utilisateur
    const uiHTML = `
      <div class="qr-generator-ui">
        <h3>Générateur de Codes QR</h3>
        
        <div class="form-group">
          <label for="qr-data-type">Type de données:</label>
          <select id="qr-data-type" class="form-control">
            <option value="url">URL</option>
            <option value="text">Texte</option>
            <option value="game">ID de jeu</option>
          </select>
        </div>
        
        <div class="form-group" id="qr-url-group">
          <label for="qr-url">URL:</label>
          <input type="url" id="qr-url" class="form-control" placeholder="https://exemple.com">
        </div>
        
        <div class="form-group" id="qr-text-group" style="display: none;">
          <label for="qr-text">Texte:</label>
          <textarea id="qr-text" class="form-control" rows="3" placeholder="Entrez votre texte ici"></textarea>
        </div>
        
        <div class="form-group" id="qr-game-group" style="display: none;">
          <label for="qr-game-id">ID de jeu:</label>
          <select id="qr-game-id" class="form-control">
            <option value="start">Départ</option>
            <option value="challenge1">Défi 1</option>
            <option value="challenge2">Défi 2</option>
            <option value="challenge3">Défi 3</option>
            <option value="challenge4">Défi 4</option>
            <option value="finish">Fin</option>
          </select>
          <div class="form-group">
            <label for="qr-base-url">URL de base:</label>
            <input type="url" id="qr-base-url" class="form-control" value="https://qr-game.example.com/game/">
          </div>
        </div>
        
        <div class="form-group">
          <label for="qr-size">Taille:</label>
          <input type="range" id="qr-size" min="100" max="500" value="300" class="form-control">
          <span id="qr-size-value">300 x 300</span>
        </div>
        
        <div class="form-group">
          <label for="qr-format">Format:</label>
          <select id="qr-format" class="form-control">
            <option value="png">PNG</option>
            <option value="svg">SVG</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="qr-color">Couleur:</label>
          <input type="color" id="qr-color" value="#4285F4" class="form-control">
        </div>
        
        <div class="form-group">
          <button id="qr-generate-btn" class="primary-button">Générer</button>
          <button id="qr-download-btn" class="secondary-button" disabled>Télécharger</button>
        </div>
        
        <div class="qr-preview">
          <canvas id="qr-canvas"></canvas>
        </div>
      </div>
    `;
    
    // Injecter l'interface dans le conteneur
    container.innerHTML = uiHTML;
    
    // Ajouter les styles CSS
    const style = document.createElement('style');
    style.textContent = `
      .qr-generator-ui {
        padding: 1rem;
        background-color: var(--card-background);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
      }
      
      .qr-generator-ui h3 {
        margin-bottom: 1rem;
      }
      
      .qr-preview {
        margin-top: 1rem;
        text-align: center;
      }
      
      #qr-canvas {
        max-width: 100%;
        border: 1px solid #ddd;
        border-radius: var(--border-radius);
      }
      
      #qr-size-value {
        display: inline-block;
        width: 80px;
        text-align: right;
      }
    `;
    document.head.appendChild(style);
    
    // Récupérer les éléments de l'interface
    const dataTypeSelect = document.getElementById('qr-data-type');
    const urlGroup = document.getElementById('qr-url-group');
    const textGroup = document.getElementById('qr-text-group');
    const gameGroup = document.getElementById('qr-game-group');
    const urlInput = document.getElementById('qr-url');
    const textInput = document.getElementById('qr-text');
    const gameIdSelect = document.getElementById('qr-game-id');
    const baseUrlInput = document.getElementById('qr-base-url');
    const sizeInput = document.getElementById('qr-size');
    const sizeValue = document.getElementById('qr-size-value');
    const formatSelect = document.getElementById('qr-format');
    const colorInput = document.getElementById('qr-color');
    const generateBtn = document.getElementById('qr-generate-btn');
    const downloadBtn = document.getElementById('qr-download-btn');
    const canvas = document.getElementById('qr-canvas');
    
    // Gérer le changement de type de données
    dataTypeSelect.addEventListener('change', () => {
      const dataType = dataTypeSelect.value;
      
      urlGroup.style.display = dataType === 'url' ? 'block' : 'none';
      textGroup.style.display = dataType === 'text' ? 'block' : 'none';
      gameGroup.style.display = dataType === 'game' ? 'block' : 'none';
    });
    
    // Mettre à jour la valeur de taille affichée
    sizeInput.addEventListener('input', () => {
      const size = sizeInput.value;
      sizeValue.textContent = `${size} x ${size}`;
    });
    
    // Variable pour stocker les données URL générées
    let generatedDataURL = null;
    
    // Gérer la génération de code QR
    generateBtn.addEventListener('click', async () => {
      const dataType = dataTypeSelect.value;
      let data = '';
      
      // Récupérer les données en fonction du type
      if (dataType === 'url') {
        data = urlInput.value.trim();
        if (!data) {
          alert('Veuillez entrer une URL valide');
          return;
        }
      } else if (dataType === 'text') {
        data = textInput.value.trim();
        if (!data) {
          alert('Veuillez entrer un texte');
          return;
        }
      } else if (dataType === 'game') {
        const gameId = gameIdSelect.value;
        const baseUrl = baseUrlInput.value.trim();
        if (!baseUrl) {
          alert('Veuillez entrer une URL de base valide');
          return;
        }
        data = baseUrl + gameId;
      }
      
      // Configurer les options
      const options = {
        size: parseInt(sizeInput.value),
        color: {
          dark: colorInput.value,
          light: '#FFFFFF'
        },
        format: formatSelect.value
      };
      
      try {
        // Générer le code QR
        if (options.format === 'svg') {
          const svg = await this.generateQRCodeSVG(data, options);
          const img = new Image();
          img.onload = () => {
            const ctx = canvas.getContext('2d');
            canvas.width = options.size;
            canvas.height = options.size;
            ctx.drawImage(img, 0, 0, options.size, options.size);
          };
          img.src = 'data:image/svg+xml;base64,' + btoa(svg);
          generatedDataURL = svg;
        } else {
          await this.generateQRCodeToCanvas(data, canvas, options);
          generatedDataURL = canvas.toDataURL('image/png');
        }
        
        // Activer le bouton de téléchargement
        downloadBtn.disabled = false;
      } catch (error) {
        console.error('Erreur lors de la génération du code QR:', error);
        alert('Erreur lors de la génération du code QR: ' + error.message);
      }
    });
    
    // Gérer le téléchargement du code QR
    downloadBtn.addEventListener('click', () => {
      if (!generatedDataURL) {
        alert('Veuillez d\'abord générer un code QR');
        return;
      }
      
      const format = formatSelect.value;
      const dataType = dataTypeSelect.value;
      let fileName = 'qrcode';
      
      // Définir le nom du fichier en fonction du type de données
      if (dataType === 'game') {
        fileName = `qrcode-${gameIdSelect.value}`;
      }
      
      // Télécharger le code QR
      this.downloadQRCode(generatedDataURL, fileName, format);
    });
  }

  /**
   * Génère des codes QR pour tous les défis du jeu
   * @param {Array} challenges - Liste des défis
   * @param {string} baseUrl - URL de base
   * @param {object} options - Options de configuration
   * @returns {Promise<Array>} Promesse résolue avec un tableau de résultats
   */
  async generateGameQRCodes(challenges, baseUrl, options = {}) {
    const dataList = challenges.map(challenge => baseUrl + challenge.id);
    return this.generateMultipleQRCodes(dataList, options);
  }
}

// Créer une instance globale
const qrCodeGenerator = new QRCodeGenerator();

// Exporter l'instance pour une utilisation dans d'autres modules
window.qrCodeGenerator = qrCodeGenerator;
