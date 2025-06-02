// Classe pour gérer le chiffre affine
class AffineChiffre {
    constructor() {
        this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.modulo = 26;
        this.validKeys = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25]; // Nombres premiers avec 26
    }

    // Vérifie si a est premier avec 26
    isValidKeyA(a) {
        return this.validKeys.includes(parseInt(a));
    }

    // Calcule le PGCD
    pgcd(a, b) {
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    // Trouve l'inverse modulaire de a modulo m (algorithme d'Euclide étendu)
    modInverse(a, m) {
        a = ((a % m) + m) % m; // S'assurer que a est positif
        
        // Méthode simple pour m = 26
        if (m === 26) {
            const inverses = {
                1: 1, 3: 9, 5: 21, 7: 15, 9: 3, 11: 19,
                15: 7, 17: 23, 19: 11, 21: 5, 23: 17, 25: 25
            };
            return inverses[a] || -1;
        }
        
        // Méthode générale
        for (let x = 1; x < m; x++) {
            if ((a * x) % m === 1) {
                return x;
            }
        }
        return -1;
    }

    // Chiffre un caractère
    encryptChar(char, a, b) {
        // S'assurer que a et b sont des nombres
        a = parseInt(a, 10);
        b = parseInt(b, 10);
        
        const upperChar = char.toUpperCase();
        if (!this.alphabet.includes(upperChar)) {
            return char; // Retourne le caractère non modifié s'il n'est pas dans l'alphabet
        }
        
        const x = this.alphabet.indexOf(upperChar);
        const encrypted = (a * x + b) % this.modulo;
        
        if (this.debug) {
            console.log(`Chiffrement: ${char}(${x}) -> (${a}×${x} + ${b}) mod 26 = ${encrypted} = ${this.alphabet[encrypted]}`);
        }
        
        return this.alphabet[encrypted];
    }

    // Déchiffre un caractère
    decryptChar(char, a, b) {
        // S'assurer que a et b sont des nombres
        a = parseInt(a, 10);
        b = parseInt(b, 10);
        
        const upperChar = char.toUpperCase();
        if (!this.alphabet.includes(upperChar)) {
            return char;
        }
        
        const y = this.alphabet.indexOf(upperChar);
        const aInverse = this.modInverse(a, this.modulo);
        if (aInverse === -1) {
            throw new Error(`Impossible de trouver l'inverse de ${a} modulo ${this.modulo}`);
        }
        
        // Gestion correcte du modulo pour les nombres négatifs
        let yMinusB = y - b;
        while (yMinusB < 0) {
            yMinusB += this.modulo;
        }
        
        const decrypted = (aInverse * yMinusB) % this.modulo;
        
        // Debug
        if (this.debug) {
            console.log(`Déchiffrement: ${char}(${y}) - ${b} = ${y-b}, ajusté = ${yMinusB}, ${aInverse} × ${yMinusB} mod 26 = ${decrypted} = ${this.alphabet[decrypted]}`);
        }
        
        return this.alphabet[decrypted];
    }

    // Active/désactive le mode debug
    setDebug(value) {
        this.debug = value;
    }

    // Chiffre un texte complet
    encrypt(text, a, b) {
        return text.split('').map(char => this.encryptChar(char, a, b)).join('');
    }

    // Déchiffre un texte complet
    decrypt(text, a, b) {
        return text.split('').map(char => this.decryptChar(char, a, b)).join('');
    }

    // Génère la table de correspondance
    generateMappingTable(a, b) {
        const mapping = [];
        for (let i = 0; i < this.alphabet.length; i++) {
            const original = this.alphabet[i];
            const encrypted = this.encryptChar(original, a, b);
            mapping.push({ original, encrypted });
        }
        return mapping;
    }

    // Analyse de fréquence
    frequencyAnalysis(text) {
        const frequency = {};
        const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
        
        // Initialise toutes les lettres à 0
        for (const letter of this.alphabet) {
            frequency[letter] = 0;
        }
        
        // Compte les occurrences
        for (const char of cleanText) {
            if (frequency[char] !== undefined) {
                frequency[char]++;
            }
        }
        
        // Convertit en pourcentages
        const total = cleanText.length || 1;
        for (const letter in frequency) {
            frequency[letter] = (frequency[letter] / total) * 100;
        }
        
        return frequency;
    }
}

// Instance globale
const affineChiffre = new AffineChiffre();

// Éléments DOM
const keyAInput = document.getElementById('keyA');
const keyBInput = document.getElementById('keyB');
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const encryptBtn = document.getElementById('encryptBtn');
const decryptBtn = document.getElementById('decryptBtn');
const clearBtn = document.getElementById('clearBtn');
const testBtn = document.getElementById('testBtn');
const swapBtn = document.getElementById('swapBtn');
const keyAValidity = document.getElementById('keyAValidity');
const alphabetMapping = document.getElementById('alphabetMapping');
const frequencyChart = document.getElementById('frequencyChart');
const statistics = document.getElementById('statistics');
const outputHint = document.getElementById('outputHint');

// Validation de la clé A
function validateKeyA() {
    const a = parseInt(keyAInput.value);
    const isValid = affineChiffre.isValidKeyA(a);
    
    if (isValid) {
        keyAValidity.classList.add('valid');
        keyAValidity.classList.remove('invalid');
        keyAValidity.title = 'Clé valide';
    } else {
        keyAValidity.classList.add('invalid');
        keyAValidity.classList.remove('valid');
        keyAValidity.title = 'La clé doit être première avec 26';
    }
    
    return isValid;
}

// Mise à jour de la table de correspondance
function updateMappingTable() {
    const a = parseInt(keyAInput.value, 10);
    const b = parseInt(keyBInput.value, 10);
    
    if (!affineChiffre.isValidKeyA(a)) return;
    
    const mapping = affineChiffre.generateMappingTable(a, b);
    alphabetMapping.innerHTML = '';
    
    mapping.forEach(({ original, encrypted }) => {
        const div = document.createElement('div');
        div.className = 'letter-mapping';
        div.innerHTML = `
            <span class="original">${original}</span>
            <span class="arrow">→</span>
            <span class="encrypted">${encrypted}</span>
        `;
        alphabetMapping.appendChild(div);
    });
}

// Dessine le graphique de fréquence
function drawFrequencyChart(originalFreq, encryptedFreq) {
    const ctx = frequencyChart.getContext('2d');
    const width = frequencyChart.width;
    const height = frequencyChart.height;
    const barWidth = width / 52; // 26 lettres * 2 (original + chiffré)
    const maxFreq = Math.max(...Object.values(originalFreq), ...Object.values(encryptedFreq));
    
    ctx.clearRect(0, 0, width, height);
    
    // Dessine les axes
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(30, height - 30);
    ctx.lineTo(width - 10, height - 30);
    ctx.moveTo(30, height - 30);
    ctx.lineTo(30, 10);
    ctx.stroke();
    
    // Dessine les barres
    let x = 40;
    for (const letter of affineChiffre.alphabet) {
        // Barre originale
        const origHeight = (originalFreq[letter] / maxFreq) * (height - 50);
        ctx.fillStyle = '#667eea';
        ctx.fillRect(x, height - 30 - origHeight, barWidth * 0.4, origHeight);
        
        // Barre chiffrée
        const encHeight = (encryptedFreq[letter] / maxFreq) * (height - 50);
        ctx.fillStyle = '#48bb78';
        ctx.fillRect(x + barWidth * 0.4, height - 30 - encHeight, barWidth * 0.4, encHeight);
        
        // Étiquette
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.fillText(letter, x, height - 15);
        
        x += barWidth * 2;
    }
    
    // Légende
    ctx.fillStyle = '#667eea';
    ctx.fillRect(width - 150, 20, 15, 15);
    ctx.fillStyle = '#333';
    ctx.fillText('Original', width - 130, 32);
    
    ctx.fillStyle = '#48bb78';
    ctx.fillRect(width - 150, 40, 15, 15);
    ctx.fillStyle = '#333';
    ctx.fillText('Chiffré', width - 130, 52);
}

// Met à jour les statistiques
function updateStatistics(text, encryptedText) {
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanEncrypted = encryptedText.toUpperCase().replace(/[^A-Z]/g, '');
    
    const stats = `
        <div class="stat-item">
            <div class="stat-label">Longueur du texte original</div>
            <div class="stat-value">${text.length} caractères</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Lettres uniquement</div>
            <div class="stat-value">${cleanText.length} lettres</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Caractères non-alphabétiques</div>
            <div class="stat-value">${text.length - cleanText.length}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Lettres uniques (original)</div>
            <div class="stat-value">${new Set(cleanText).size}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Lettres uniques (chiffré)</div>
            <div class="stat-value">${new Set(cleanEncrypted).size}</div>
        </div>
    `;
    
    statistics.innerHTML = stats;
}

// Fonction de chiffrement
function handleEncrypt() {
    if (!validateKeyA()) {
        alert('La clé A doit être première avec 26 !');
        return;
    }
    
    const a = parseInt(keyAInput.value, 10);
    const b = parseInt(keyBInput.value, 10);
    const text = inputText.value;
    
    if (!text) {
        alert('Veuillez entrer un texte à chiffrer.');
        return;
    }
    
    console.log(`Chiffrement avec a=${a}, b=${b}, texte="${text}"`);
    
    try {
        const encrypted = affineChiffre.encrypt(text, a, b);
        outputText.textContent = encrypted;
        outputHint.textContent = 'Texte chiffré. Cliquez sur "Déchiffrer" pour retrouver le texte original.';
        console.log(`Résultat du chiffrement: "${encrypted}"`);
        
        // Mise à jour des analyses
        const originalFreq = affineChiffre.frequencyAnalysis(text);
        const encryptedFreq = affineChiffre.frequencyAnalysis(encrypted);
        drawFrequencyChart(originalFreq, encryptedFreq);
        updateStatistics(text, encrypted);
    } catch (error) {
        alert('Erreur lors du chiffrement : ' + error.message);
        console.error(error);
    }
}

// Fonction de déchiffrement
function handleDecrypt() {
    if (!validateKeyA()) {
        alert('La clé A doit être première avec 26 !');
        return;
    }
    
    const a = parseInt(keyAInput.value, 10);
    const b = parseInt(keyBInput.value, 10);
    
    // Prendre le texte du champ d'entrée pour déchiffrer
    const text = inputText.value;
    
    if (!text) {
        alert('Veuillez entrer un texte à déchiffrer.');
        return;
    }
    
    console.log(`Déchiffrement avec a=${a}, b=${b}, texte="${text}"`);
    affineChiffre.setDebug(true); // Active le debug pour voir les détails
    
    try {
        const decrypted = affineChiffre.decrypt(text, a, b);
        
        // Afficher le résultat dans la zone de sortie
        outputText.textContent = decrypted;
        outputHint.textContent = 'Texte déchiffré avec succès.';
        
        console.log(`Résultat du déchiffrement: "${decrypted}"`);
        
        // Mise à jour des analyses
        const originalFreq = affineChiffre.frequencyAnalysis(text);
        const decryptedFreq = affineChiffre.frequencyAnalysis(decrypted);
        drawFrequencyChart(decryptedFreq, originalFreq);
        updateStatistics(text, decrypted);
    } catch (error) {
        alert('Erreur lors du déchiffrement : ' + error.message);
        console.error(error);
    } finally {
        affineChiffre.setDebug(false); // Désactive le debug
    }
}

// Fonction pour effacer
function handleClear() {
    inputText.value = '';
    outputText.textContent = '';
    outputHint.textContent = '';
    const ctx = frequencyChart.getContext('2d');
    ctx.clearRect(0, 0, frequencyChart.width, frequencyChart.height);
    statistics.innerHTML = '';
}

// Fonction pour échanger entrée et sortie
function handleSwap() {
    const temp = inputText.value;
    inputText.value = outputText.textContent;
    outputText.textContent = temp;
    outputHint.textContent = 'Textes échangés entre entrée et sortie.';
}

// Gestion des exemples
function handleExample(event) {
    if (event.target.classList.contains('example-btn')) {
        const text = event.target.dataset.text;
        const a = event.target.dataset.a;
        const b = event.target.dataset.b;
        
        inputText.value = text;
        keyAInput.value = a;
        keyBInput.value = b;
        
        validateKeyA();
        updateMappingTable();
    }
}

// Fonction de test pour déboguer
function handleTest() {
    // Active le mode debug
    affineChiffre.setDebug(true);
    
    // Test avec les valeurs connues
    keyAInput.value = 5;
    keyBInput.value = 8;
    validateKeyA();
    updateMappingTable();
    
    console.log('=== TEST DE CHIFFREMENT/DÉCHIFFREMENT ===');
    console.log('Clés: a=5, b=8');
    console.log('Inverse de 5 mod 26 =', affineChiffre.modInverse(5, 26));
    
    // Test de chiffrement
    inputText.value = 'BONJOUR';
    const encrypted = affineChiffre.encrypt('BONJOUR', 5, 8);
    console.log('BONJOUR chiffré:', encrypted);
    outputText.textContent = 'Chiffré: ' + encrypted;
    
    // Test de déchiffrement
    setTimeout(() => {
        console.log('\n--- Déchiffrement de NAVBAEP ---');
        const decrypted = affineChiffre.decrypt('NAVBAEP', 5, 8);
        console.log('NAVBAEP déchiffré:', decrypted);
        outputText.textContent += '\nDéchiffré: ' + decrypted;
        
        // Désactive le mode debug
        affineChiffre.setDebug(false);
    }, 1000);
}

// Event listeners
keyAInput.addEventListener('input', () => {
    validateKeyA();
    updateMappingTable();
});

keyBInput.addEventListener('input', updateMappingTable);
encryptBtn.addEventListener('click', handleEncrypt);
decryptBtn.addEventListener('click', handleDecrypt);
clearBtn.addEventListener('click', handleClear);
swapBtn.addEventListener('click', handleSwap);
testBtn.addEventListener('click', handleTest);
document.querySelector('.example-buttons').addEventListener('click', handleExample);

// Initialisation
validateKeyA();
updateMappingTable();

// Animation d'entrée
window.addEventListener('load', () => {
    document.querySelectorAll('.info-section, .input-section, .output-section, .visualization-section, .analysis-section, .examples-section').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        setTimeout(() => {
            section.style.transition = 'opacity 0.5s, transform 0.5s';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 100);
    });
});