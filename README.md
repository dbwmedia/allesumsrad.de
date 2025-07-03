# dbw base theme

Ein modernes, performanceoptimiertes WordPress-Theme mit modularer Komponenten-Architektur von **dbw media**.

---

## 🔍 Übersicht

**dbw base** ist unser hauseigenes Theme-Framework, das nach folgenden Prinzipien entwickelt wurde:

- **Performance First**: Priority-basiertes Component Loading
- **Modulare Architektur**: Wiederverwendbare Vanilla JS Komponenten
- **Modern Standards 2025**: Barrierefreiheit, GPU-Acceleration, Touch-Optimierung
- **Developer Experience**: Klare Struktur, ausführliche Dokumentation

---

## 🚀 Quickstart

```bash
# Installation
cd wp-content/themes/dbw-base/
npm install

# Entwicklungsserver starten
npm start

# Production Build
npm run build
```

---

## 💻 Entwicklungs-Workflow

### Component System

Unser Theme nutzt ein **Priority-basiertes Loading System** für optimale Performance:

- **Critical**: Sofort beim Seitenaufruf (Navigation, Scroll-Verhalten)
- **High**: Nach DOM Ready (wichtige Interaktionen)
- **Normal**: Nach Page Load (Forms, Tooltips)
- **Low**: Wenn Browser idle (Animationen, Social Feeds)

📚 **[Ausführliche Component-Dokumentation →](src/js/components/README.md)**

### SCSS-Struktur

Wir nutzen die [7-1 Pattern Architektur](https://sass-guidelin.es/#architecture):

- `base/` – Reset, Typography, Variables
- `components/` – UI-Komponenten (Buttons, Cards, etc.)
- `layout/` – Gridsysteme & Layouts
- `abstracts/` – Mixins, Funktionen, globale Variablen

📌 **Wichtig:** In `src/sass/utils/_variables.scss` die Variable `$themePath:` auf die korrekte Theme-URL setzen.

---

## 🔌 Neue JS-Komponenten hinzufügen

**Kurzanleitung** (Details in der [Component-Dokumentation](/src/js/readme.md)):

1. **Component erstellen** in `src/js/components/`:

```javascript
const Component_MeinFeature = () => {
	console.log("Feature loaded!");
};
export default Component_MeinFeature;
```

2. **In index.js importieren**:

```javascript
import Component_MeinFeature from "./components/meinFeature";
```

3. **Zur Registry hinzufügen**:

```javascript
{ name: 'MeinFeature', init: Component_MeinFeature, priority: 'normal' },
```

---

## 🎯 Performance Features

- **Lazy Loading**: Komponenten laden nur wenn nötig
- **GPU Acceleration**: Smooth 60fps Animationen
- **Memory Management**: Automatisches Cleanup mit WeakMaps
- **Touch Optimized**: Angepasste Event-Handler für Mobile
- **Reduced Motion**: Respektiert Nutzer-Präferenzen

---

## 🔧 Verfügbare npm-Befehle

```bash
npm start          # Entwicklungsserver mit Hot Reloading
npm run build      # Produktions-Build erstellen
npm run lint       # Code-Qualität prüfen
```

---

## 📁 Projekt-Struktur

```
dbw-base/
├── src/
│   ├── js/
│   │   ├── components/     # Alle JS-Komponenten
│   │   ├── componentLoader.js
│   │   └── index.js
│   └── sass/
│       ├── base/           # Grundstyles
│       ├── components/     # UI-Komponenten
│       └── utils/          # Variablen & Mixins
├── includes/               # PHP-Module
├── functions.php          # Theme-Setup
└── style.css             # Theme-Info
```

---

## 📝 Coding Standards

- **JavaScript**: ES6+, Vanilla JS, keine jQuery-Abhängigkeit
- **SCSS**: BEM-Methodologie, Mobile-First
- **PHP**: PSR-12 und WordPress Standards
- **Performance**: Core Web Vitals optimiert

---

## 🛠️ Development Tools

```javascript
// Component-Status anzeigen (nur in Dev)
window.showComponentStats();

// Button Ripple neu initialisieren
window.ButtonRipple.reinitialize();
```

---

## 📚 Weitere Ressourcen

- [Component System Guide](src/js/components/README.md)
- [Changelog](CHANGELOG.md)
- [SCSS Variables Guide](src/sass/utils/_variables.scss)

---

© **dbw media**  
_Dein Web, unsere Mission._
