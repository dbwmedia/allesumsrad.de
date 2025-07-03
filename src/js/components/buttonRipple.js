/**
 * Button Ripple Effect Component
 * Optimiert für Performance und Web Standards 2025
 */
const Component_ButtonRipple = () => {
	// Performance flag für reduced motion
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;

	// Cache für bessere Performance
	const buttonCache = new WeakMap();
	let rafId = null;

	/**
	 * Hauptfunktion zum Initialisieren der Button Ripple Effekte
	 */
	const initButtonRipples = () => {
		// Prüfe reduced motion preference
		if (prefersReducedMotion) {
			console.log(
				"🎯 Button Ripple: Disabled due to reduced motion preference"
			);
			return;
		}

		// Optimierter Selector für bessere Performance
		const buttons = document.querySelectorAll(
			"a.button--primary, a.button--black, a.button--outline, a.button--glass, a.button--accent, a.button--success, a.button--warning, a.button--dbw"
		);

		if (buttons.length === 0) {
			console.log("🎯 Button Ripple: No buttons found");
			return;
		}

		buttons.forEach((button, index) => {
			// Skip excluded buttons
			if (button.matches(".our-work, .button-icon, .gb-accordion__toggle")) {
				return;
			}
			setupButtonRipple(button, index);
		});

		console.log(
			`🎯 Button Ripple: Applied ripple effect to ${buttons.length} buttons`
		);
	};

	/**
	 * Setup ripple effect für einzelnen Button
	 * @param {Element} button - Das Button Element
	 * @param {number} index - Button Index für Debugging
	 */
	const setupButtonRipple = (button, index) => {
		// Cache button data für bessere Performance
		const buttonData = {
			lastX: 0,
			lastY: 0,
			lastTime: 0,
		};
		buttonCache.set(button, buttonData);

		// Event Handler mit optimierter Performance
		const handleMouseEnter = (e) => {
			const rect = button.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			// Berechne maximale Distanz
			const maxDistance = calculateMaxDistance(x, y, rect.width, rect.height);
			const rippleSize = Math.ceil(maxDistance * 2.2);

			// Update cache
			buttonData.lastX = x;
			buttonData.lastY = y;
			buttonData.lastTime = Date.now();

			// Batch DOM updates
			requestAnimationFrame(() => {
				button.style.setProperty("--ripple-x", x + "px");
				button.style.setProperty("--ripple-y", y + "px");
				button.style.setProperty("--ripple-size", rippleSize + "px");
			});
		};

		// Throttled mousemove handler
		const handleMouseMove = (e) => {
			const data = buttonCache.get(button);
			if (!data) return;

			// Throttle mit 16ms (60fps)
			const now = Date.now();
			if (now - data.lastTime < 16) return;

			const rect = button.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			// Nur updaten wenn signifikante Bewegung
			const distance = Math.sqrt(
				Math.pow(x - data.lastX, 2) + Math.pow(y - data.lastY, 2)
			);
			if (distance < 5) return;

			const maxDistance = calculateMaxDistance(x, y, rect.width, rect.height);
			const rippleSize = Math.ceil(maxDistance * 2.2);

			// Update cache
			data.lastX = x;
			data.lastY = y;
			data.lastTime = now;

			// Batch DOM updates
			if (rafId) cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(() => {
				button.style.setProperty("--ripple-x", x + "px");
				button.style.setProperty("--ripple-y", y + "px");
				button.style.setProperty("--ripple-size", rippleSize + "px");
			});
		};

		// Add event listeners mit passive flag für bessere Performance
		button.addEventListener("mouseenter", handleMouseEnter, { passive: true });
		button.addEventListener("mousemove", handleMouseMove, { passive: true });

		// Optional: Touch support
		if ("ontouchstart" in window) {
			button.addEventListener("touchstart", handleMouseEnter, {
				passive: true,
			});
		}
	};

	/**
	 * Berechne maximale Distanz (optimiert mit Math.hypot)
	 */
	const calculateMaxDistance = (x, y, width, height) => {
		return Math.max(
			Math.hypot(x, y),
			Math.hypot(width - x, y),
			Math.hypot(x, height - y),
			Math.hypot(width - x, height - y)
		);
	};

	/**
	 * Überprüfe ob Debug aktiv sein soll
	 */
	const shouldDebug = () => {
		return (
			window.location.hostname === "localhost" ||
			window.location.hostname.includes("dev") ||
			window.location.search.includes("debug=true")
		);
	};

	/**
	 * Reinitialisiere Ripple Effekte
	 */
	const reinitialize = () => {
		console.log("🔄 Button Ripple: Reinitializing...");
		destroy();
		initButtonRipples();
	};

	/**
	 * Entferne Ripple Effekte von allen Buttons
	 */
	const destroy = () => {
		const buttons = document.querySelectorAll('a[class*="button"]');
		buttons.forEach((button) => {
			// CSS Properties zurücksetzen
			button.style.removeProperty("--ripple-x");
			button.style.removeProperty("--ripple-y");
			button.style.removeProperty("--ripple-size");

			// Clear cache
			buttonCache.delete(button);
		});

		// Cancel any pending animations
		if (rafId) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}

		console.log("🗑️ Button Ripple: Effects removed");
	};

	/**
	 * Initialisiere bei DOM ready
	 */
	const init = () => {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", initButtonRipples);
		} else {
			initButtonRipples();
		}

		// Mache Funktionen global verfügbar
		window.ButtonRipple = {
			reinitialize: reinitialize,
			destroy: destroy,
			setupButtonRipple: setupButtonRipple,
		};
	};

	// Auto-initialisiere
	init();
};

export default Component_ButtonRipple;
