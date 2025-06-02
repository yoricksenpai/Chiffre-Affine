# Simulateur de Chiffre Affine

Un outil éducatif interactif pour explorer et comprendre le chiffrement affine, une méthode classique de cryptographie.

![Chiffre Affine](https://img.shields.io/badge/Cryptographie-Chiffre%20Affine-purple)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![HTML5](https://img.shields.io/badge/HTML5-CSS3-orange)

## 📋 Description

Ce projet est une application web interactive qui permet de :
- **Chiffrer** et **déchiffrer** des messages en utilisant le chiffre affine
- **Visualiser** la table de correspondance des lettres
- **Analyser** les fréquences des lettres avant et après chiffrement
- **Comprendre** les principes mathématiques du chiffrement affine

## 🚀 Démarrage rapide

1. **Cloner ou télécharger** le projet
2. **Ouvrir** `Chiffrement.html` dans un navigateur web moderne
3. **C'est prêt !** Aucune installation requise

```bash
# Ouvrir directement dans le navigateur
start Chiffrement.html
```

## 📖 Comment utiliser

### Chiffrement
1. Entrez votre texte dans le champ "Texte à traiter"
2. Choisissez vos clés :
   - **Clé a** : doit être première avec 26 (valeurs valides : 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25)
   - **Clé b** : peut être n'importe quel nombre entre 0 et 25
3. Cliquez sur **"Chiffrer"**
4. Le texte chiffré apparaît dans la zone de résultat

### Déchiffrement
1. Entrez le texte chiffré dans le champ "Texte à traiter"
2. Utilisez les mêmes clés que pour le chiffrement
3. Cliquez sur **"Déchiffrer"**
4. Le texte original apparaît dans la zone de résultat

### Fonctionnalités supplémentaires
- **↕ Échanger** : Inverse le contenu entre l'entrée et la sortie
- **Effacer** : Réinitialise tous les champs
- **Test BONJOUR** : Démonstration rapide avec un exemple
- **Exemples prédéfinis** : Trois exemples avec différentes clés

## 🔢 Principe mathématique

Le chiffre affine utilise deux formules :

### Chiffrement
```
E(x) = (ax + b) mod 26
```

### Déchiffrement
```
D(y) = a⁻¹(y - b) mod 26
```

Où :
- `x` : position de la lettre originale (A=0, B=1, ..., Z=25)
- `y` : position de la lettre chiffrée
- `a` : première clé (doit être premier avec 26)
- `b` : deuxième clé (décalage)
- `a⁻¹` : inverse modulaire de a modulo 26

## 📊 Fonctionnalités

### Interface principale
- ✅ Chiffrement et déchiffrement en temps réel
- ✅ Validation automatique des clés
- ✅ Préservation des espaces et caractères spéciaux

### Visualisations
- 📊 **Table de correspondance** : Montre la transformation de chaque lettre
- 📈 **Graphique de fréquence** : Compare les fréquences avant/après chiffrement
- 📋 **Statistiques** : Informations détaillées sur le texte

### Sécurité et validation
- 🔒 Vérification que la clé `a` est première avec 26
- ⚠️ Messages d'erreur clairs
- 🟢 Indicateur visuel de validité des clés

## 🗂️ Structure du projet

```
Chiffre Affine/
│
├── Chiffrement.html          # Interface utilisateur
├── Chiffrement.css           # Styles et mise en page
├── Chiffrement.js            # Logique du chiffrement
├── Guide_Chiffrement_Affine.md  # Documentation technique détaillée
├── test_debug.html           # Page de test et débogage
└── README.md                 # Ce fichier
```

## 💡 Exemples d'utilisation

### Exemple 1 : Message simple
```
Texte original : BONJOUR
Clés : a=5, b=8
Texte chiffré : NAVBAEP
```

### Exemple 2 : Avec espaces
```
Texte original : BONJOUR LE MONDE
Clés : a=5, b=8
Texte chiffré : NAVBAEP LC QAVXC
```

### Exemple 3 : Clés différentes
```
Texte original : CRYPTOGRAPHIE
Clés : a=7, b=3
Texte chiffré : FUBSWRJUDSKNH
```

## 🛠️ Technologies utilisées

- **HTML5** : Structure de l'application
- **CSS3** : Design moderne avec gradients et animations
- **JavaScript ES6+** : Logique de chiffrement orientée objet
- **Canvas API** : Graphiques de fréquence
- **Google Fonts** : Police Roboto

## 📚 Documentation

Pour une documentation technique complète sur l'implémentation du chiffre affine, consultez le fichier [`Guide_Chiffrement_Affine.md`](Guide_Chiffrement_Affine.md).

## ⚠️ Avertissement

Le chiffre affine est un outil **pédagogique** pour comprendre les bases de la cryptographie. Il ne doit **PAS** être utilisé pour sécuriser des informations sensibles car il est facilement cassable par :
- Analyse de fréquence
- Force brute (seulement 312 clés possibles)
- Attaque par texte clair connu

## 🤝 Contribution

Les suggestions d'amélioration sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation

## 📝 Licence

Ce projet est à des fins éducatives. Libre d'utilisation et de modification.

## 🎯 Objectifs pédagogiques

Ce projet aide à comprendre :
- Les bases de la cryptographie
- L'arithmétique modulaire
- L'importance de la sélection des clés
- Les limites des chiffrements classiques
- L'analyse de fréquence en cryptanalyse

---

**Note** : Pour une expérience optimale, utilisez un navigateur moderne (Chrome, Firefox, Edge, Safari).