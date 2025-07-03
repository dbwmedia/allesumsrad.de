# 📦 Component System Guide

Dieses Theme nutzt ein Priority-basiertes Component Loading System für optimale Performance.

## 🚀 Neue Component hinzufügen

### 1. Component-Datei erstellen

Erstelle eine neue Datei im `components` Ordner:

```javascript
// components/meinFeature.js
const Component_MeinFeature = () => {
	// Dein JavaScript Code hier
	console.log("Mein Feature wurde geladen!");

	// Optional: Funktionen global verfügbar machen
	window.MeinFeature = {
		doSomething: () => console.log("Hello!"),
	};
};

export default Component_MeinFeature;
```

### 2. In index.js importieren

Füge den Import zu den anderen hinzu:

```javascript
import Component_MeinFeature from "./components/meinFeature";
```

### 3. Zur Component Registry hinzufügen

Füge deine Component mit der passenden Priorität hinzu:

```javascript
const components = [
	// ... andere Components ...
	{ name: "MeinFeature", init: Component_MeinFeature, priority: "normal" },
];
```

**Das war's!** 🎉 Die Component wird automatisch zur richtigen Zeit geladen.

## ⚡ Prioritäten verstehen

### `'critical'` - Sofort beim Seitenaufruf

Für Components die **sofort** benötigt werden:

- Navigation/Menu
- Cookie Banner
- Kritische UI Elemente
- Scroll-Verhalten

### `'high'` - Nach DOM Ready

Für wichtige aber nicht kritische Features:

- Formulare
- Wichtige Interaktionen
- Header-Features

### `'normal'` - Nach Page Load

Für Standard-Features:

- Tooltips
- Accordions
- Tab-Navigation
- Popups

### `'low'` - Wenn Browser idle

Für Nice-to-have Features:

- Animationen
- Social Media Feeds
- Parallax Effekte
- Analytics

## 📝 Praktische Beispiele

### Cookie Banner (Critical)

```javascript
// Rechtlich wichtig = critical
{ name: 'CookieBanner', init: Component_CookieBanner, priority: 'critical' },
```

### Contact Form (Normal)

```javascript
// Wichtig aber nicht sofort = normal
{ name: 'ContactForm', init: Component_ContactForm, priority: 'normal' },
```

### Instagram Feed (Low)

```javascript
// Nice-to-have = low
{ name: 'InstaFeed', init: Component_InstaFeed, priority: 'low' },
```

## 🛠️ Component Template

Hier ein Basis-Template für neue Components:

```javascript
/**
 * Component Name
 * Beschreibung was die Component macht
 */
const Component_Name = () => {
	// Check if elements exist
	const elements = document.querySelectorAll(".my-selector");
	if (elements.length === 0) {
		console.log("🎯 Component Name: No elements found");
		return;
	}

	// Initialize functionality
	const init = () => {
		// Component logic here
	};

	// Optional: Reinitialize function for dynamic content
	const reinitialize = () => {
		console.log("🔄 Component Name: Reinitializing...");
		init();
	};

	// Optional: Destroy/cleanup function
	const destroy = () => {
		console.log("🗑️ Component Name: Destroyed");
		// Cleanup code here
	};

	// Start initialization
	init();

	// Optional: Make functions globally available
	window.ComponentName = {
		reinitialize,
		destroy,
	};

	console.log("✅ Component Name initialized");
};

export default Component_Name;
```

## 🔧 Debugging

In der Entwicklungsumgebung kannst du folgende Befehle nutzen:

```javascript
// Zeige alle registrierten Components
window.showComponentStats();

// Reinitialize specific component (wenn verfügbar)
window.ButtonRipple.reinitialize();
```

## 📊 Performance Tipps

1. **Wähle die richtige Priorität**: Im Zweifel lieber `'normal'` oder `'low'` statt `'critical'`
2. **Prüfe ob Elemente existieren**: Verhindert unnötige Initialisierung
3. **Nutze Event Delegation**: Für bessere Performance bei vielen Elementen
4. **Cleanup beachten**: Entferne Event Listener wenn Component zerstört wird

## 🚨 Häufige Fehler

❌ **Falsch**: Alles als `'critical'` markieren
✅ **Richtig**: Nur wirklich kritische Components als `'critical'`

❌ **Falsch**: Component ohne Element-Check
✅ **Richtig**: Immer prüfen ob Elemente existieren

❌ **Falsch**: Vergessen zu exportieren
✅ **Richtig**: `export default Component_Name;`
