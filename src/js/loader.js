/**
 * Component Loader
 * Lädt Components basierend auf ihrer Priorität
 */
class ComponentLoader {
	constructor() {
		this.components = [];
		this.initialized = false;

		// 🔧 DEBUG SCHALTER: true = Logs AN, false = Logs AUS
		this.debug = false;
	}

	/**
	 * Helper für bedingte Logs
	 */
	log(...args) {
		if (this.debug) console.log(...args);
	}

	error(...args) {
		if (this.debug) console.error(...args);
	}

	table(...args) {
		if (this.debug) console.table(...args);
	}

	/**
	 * Registriere Components
	 * @param {Array} components - Array mit Component-Definitionen
	 */
	register(components) {
		this.components = components;
		return this;
	}

	/**
	 * Starte das Laden der Components
	 */
	init() {
		if (this.initialized) return;
		this.initialized = true;

		// Gruppiere nach Priorität
		const grouped = {
			critical: this.components.filter((c) => c.priority === "critical"),
			high: this.components.filter((c) => c.priority === "high"),
			normal: this.components.filter((c) => c.priority === "normal"),
			low: this.components.filter((c) => c.priority === "low"),
		};

		// 1. Critical sofort
		this.loadComponents(grouped.critical, "🚨 Loading critical components...");

		// 2. High nach DOM ready
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", () => {
				this.loadComponents(
					grouped.high,
					"⚡ Loading high priority components..."
				);
			});
		} else {
			this.loadComponents(
				grouped.high,
				"⚡ Loading high priority components..."
			);
		}

		// 3. Normal nach window load
		window.addEventListener("load", () => {
			setTimeout(() => {
				this.loadComponents(
					grouped.normal,
					"📦 Loading normal priority components..."
				);
			}, 100);
		});

		// 4. Low wenn Browser idle
		if ("requestIdleCallback" in window) {
			requestIdleCallback(() => {
				this.loadComponents(
					grouped.low,
					"🐌 Loading low priority components..."
				);
			});
		} else {
			setTimeout(() => {
				this.loadComponents(
					grouped.low,
					"🐌 Loading low priority components..."
				);
			}, 2000);
		}

		// Setup dev helpers
		this.setupDevHelpers();

		return this;
	}

	/**
	 * Lade eine Gruppe von Components
	 */
	loadComponents(components, message) {
		if (components.length === 0) return;

		this.log(message);
		components.forEach((component) => {
			try {
				component.init();
				this.log(`✅ ${component.name} initialized (${component.priority})`);
			} catch (error) {
				this.error(`❌ Failed to initialize ${component.name}:`, error);
			}
		});
	}

	/**
	 * Setup Dynamic Content Handler
	 */
	setupDynamicContentHandler() {
		const observer = new MutationObserver((mutations) => {
			const hasNewButtons = mutations.some((mutation) => {
				return Array.from(mutation.addedNodes).some((node) => {
					return (
						node.nodeType === 1 &&
						(node.matches?.('a[class*="button"]') ||
							node.querySelector?.('a[class*="button"]'))
					);
				});
			});

			if (hasNewButtons && window.ButtonRipple?.reinitialize) {
				window.ButtonRipple.reinitialize();
			}
		});

		window.addEventListener("load", () => {
			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});
		});

		return this;
	}

	/**
	 * Dev Helper Functions
	 */
	setupDevHelpers() {
		// showComponentStats immer verfügbar, aber Logs nur wenn debug = true
		window.showComponentStats = () => {
			this.table(
				this.components.map((c) => ({
					name: c.name,
					priority: c.priority,
				}))
			);
		};

		// Tipp nur in Dev-Umgebung
		if (
			window.location.hostname === "localhost" ||
			window.location.hostname.includes("dev")
		) {
			this.log(
				"💡 Tipp: Nutze window.showComponentStats() für Component Übersicht"
			);
		}
	}

	/**
	 * Debug Mode setzen
	 */
	setDebug(enabled) {
		this.debug = enabled;
		return this;
	}
}

// Export Singleton Instance
const componentLoader = new ComponentLoader();
export default componentLoader;
