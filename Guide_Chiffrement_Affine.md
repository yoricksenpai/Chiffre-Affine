# Guide du Chiffrement Affine - Analyse du Code

## Table des matières
1. [Introduction](#introduction)
2. [Principe mathématique](#principe-mathématique)
3. [Étapes du chiffrement](#étapes-du-chiffrement)
4. [Étapes du déchiffrement](#étapes-du-déchiffrement)
5. [Implémentation dans le code](#implémentation-dans-le-code)
6. [Exemple détaillé](#exemple-détaillé)

## Introduction

Le chiffre affine est une méthode de chiffrement par substitution monoalphabétique qui utilise des fonctions mathématiques pour transformer chaque lettre de l'alphabet. Notre implémentation JavaScript suit rigoureusement les principes mathématiques de ce chiffrement.

## Principe mathématique

### Formules de base

**Chiffrement :** `E(x) = (ax + b) mod 26`  
**Déchiffrement :** `D(y) = a⁻¹(y - b) mod 26`

Où :
- `x` : position de la lettre originale (A=0, B=1, ..., Z=25)
- `y` : position de la lettre chiffrée
- `a` : première clé (doit être premier avec 26)
- `b` : deuxième clé (décalage)
- `a⁻¹` : inverse modulaire de `a` modulo 26

### Contraintes sur les clés

La clé `a` doit être première avec 26 (PGCD(a, 26) = 1). Les valeurs valides sont :
```javascript
validKeys = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25]
```

## Étapes du chiffrement

### 1. Validation des paramètres

```javascript
// Dans encryptChar()
a = parseInt(a, 10);  // Conversion en nombre entier
b = parseInt(b, 10);
```

### 2. Conversion du caractère

```javascript
const upperChar = char.toUpperCase();  // Normalisation en majuscule
if (!this.alphabet.includes(upperChar)) {
    return char;  // Les caractères non-alphabétiques sont préservés
}
```

### 3. Calcul de la position

```javascript
const x = this.alphabet.indexOf(upperChar);  // A=0, B=1, ..., Z=25
```

### 4. Application de la formule affine

```javascript
const encrypted = (a * x + b) % this.modulo;  // (ax + b) mod 26
```

### 5. Conversion en lettre chiffrée

```javascript
return this.alphabet[encrypted];  // Retour de la lettre correspondante
```

## Étapes du déchiffrement

### 1. Calcul de l'inverse modulaire

```javascript
// Dans modInverse()
// Pour m = 26, utilisation d'une table précalculée
const inverses = {
    1: 1, 3: 9, 5: 21, 7: 15, 9: 3, 11: 19,
    15: 7, 17: 23, 19: 11, 21: 5, 23: 17, 25: 25
};
```

Par exemple : `5⁻¹ mod 26 = 21` car `5 × 21 = 105 = 4 × 26 + 1`

### 2. Conversion et validation

```javascript
const y = this.alphabet.indexOf(upperChar);  // Position de la lettre chiffrée
const aInverse = this.modInverse(a, this.modulo);
```

### 3. Gestion des nombres négatifs

```javascript
let yMinusB = y - b;
while (yMinusB < 0) {
    yMinusB += this.modulo;  // Ajout de 26 jusqu'à obtenir un nombre positif
}
```

### 4. Application de la formule de déchiffrement

```javascript
const decrypted = (aInverse * yMinusB) % this.modulo;
```

### 5. Retour de la lettre déchiffrée

```javascript
return this.alphabet[decrypted];
```

## Implémentation dans le code

### Structure de la classe AffineChiffre

```javascript
class AffineChiffre {
    constructor() {
        this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.modulo = 26;
        this.validKeys = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
    }
}
```

### Méthodes principales

1. **isValidKeyA(a)** : Vérifie si `a` est premier avec 26
2. **modInverse(a, m)** : Calcule l'inverse modulaire
3. **encryptChar(char, a, b)** : Chiffre un caractère
4. **decryptChar(char, a, b)** : Déchiffre un caractère
5. **encrypt(text, a, b)** : Chiffre un texte complet
6. **decrypt(text, a, b)** : Déchiffre un texte complet

### Traitement du texte complet

```javascript
// Chiffrement
encrypt(text, a, b) {
    return text.split('').map(char => this.encryptChar(char, a, b)).join('');
}

// Déchiffrement
decrypt(text, a, b) {
    return text.split('').map(char => this.decryptChar(char, a, b)).join('');
}
```

## Exemple détaillé

### Chiffrement de "BONJOUR" avec a=5, b=8

1. **B** (position 1)
   - Calcul : (5 × 1 + 8) mod 26 = 13
   - Résultat : **N**

2. **O** (position 14)
   - Calcul : (5 × 14 + 8) mod 26 = 78 mod 26 = 0
   - Résultat : **A**

3. **N** (position 13)
   - Calcul : (5 × 13 + 8) mod 26 = 73 mod 26 = 21
   - Résultat : **V**

4. **J** (position 9)
   - Calcul : (5 × 9 + 8) mod 26 = 53 mod 26 = 1
   - Résultat : **B**

5. **O** (position 14)
   - Calcul : (5 × 14 + 8) mod 26 = 78 mod 26 = 0
   - Résultat : **A**

6. **U** (position 20)
   - Calcul : (5 × 20 + 8) mod 26 = 108 mod 26 = 4
   - Résultat : **E**

7. **R** (position 17)
   - Calcul : (5 × 17 + 8) mod 26 = 93 mod 26 = 15
   - Résultat : **P**

**Résultat final : NAVBAEP**

### Déchiffrement de "NAVBAEP" avec a=5, b=8

Inverse de 5 modulo 26 = 21

1. **N** (position 13)
   - Calcul : 21 × (13 - 8) mod 26 = 21 × 5 mod 26 = 105 mod 26 = 1
   - Résultat : **B**

2. **A** (position 0)
   - Calcul : 21 × (0 - 8 + 26) mod 26 = 21 × 18 mod 26 = 378 mod 26 = 14
   - Résultat : **O**

3. **V** (position 21)
   - Calcul : 21 × (21 - 8) mod 26 = 21 × 13 mod 26 = 273 mod 26 = 13
   - Résultat : **N**

4. **B** (position 1)
   - Calcul : 21 × (1 - 8 + 26) mod 26 = 21 × 19 mod 26 = 399 mod 26 = 9
   - Résultat : **J**

5. **A** (position 0)
   - Calcul : 21 × (0 - 8 + 26) mod 26 = 21 × 18 mod 26 = 378 mod 26 = 14
   - Résultat : **O**

6. **E** (position 4)
   - Calcul : 21 × (4 - 8 + 26) mod 26 = 21 × 22 mod 26 = 462 mod 26 = 20
   - Résultat : **U**

7. **P** (position 15)
   - Calcul : 21 × (15 - 8) mod 26 = 21 × 7 mod 26 = 147 mod 26 = 17
   - Résultat : **R**

**Résultat final : BONJOUR**

## Points importants de l'implémentation

### 1. Gestion des caractères spéciaux
Les espaces, ponctuation et autres caractères non-alphabétiques sont préservés tels quels.

### 2. Mode debug
```javascript
if (this.debug) {
    console.log(`Déchiffrement: ${char}(${y}) - ${b} = ${y-b}, ajusté = ${yMinusB}, ${aInverse} × ${yMinusB} mod 26 = ${decrypted} = ${this.alphabet[decrypted]}`);
}
```

### 3. Validation des clés
La fonction `isValidKeyA()` vérifie que la clé `a` appartient à la liste des valeurs valides.

### 4. Interface utilisateur
- Le texte chiffré apparaît dans la zone de résultat
- Le bouton "Déchiffrer" utilise automatiquement le texte chiffré s'il existe
- Le texte déchiffré remplace le texte original dans le champ d'entrée

## Sécurité du chiffre affine

### Forces
- Simple à comprendre et implémenter
- Rapide à exécuter
- Bon pour l'apprentissage de la cryptographie

### Faiblesses
- Vulnérable à l'analyse de fréquence
- Seulement 12 × 26 = 312 clés possibles
- Facilement cassable par force brute
- Ne convient pas pour une utilisation sécurisée moderne

## Conclusion

Le chiffre affine est un excellent exemple pédagogique pour comprendre les bases de la cryptographie. Notre implémentation JavaScript respecte fidèlement les principes mathématiques tout en offrant une interface utilisateur intuitive et des fonctionnalités d'analyse avancées.