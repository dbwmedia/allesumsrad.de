/**
 * Button Ripple Effect Component
 * Optimiert für Performance und Web Standards 2025
 */
const Component_ButtonRipple = () => {
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;

	const buttonCache = new WeakMap();
	let rafId = null;

	const initButtonRipples = () => {
		if (prefersReducedMotion) return;

		const buttons = document.querySelectorAll(
			"a.button--primary, a.button--black, a.button--outline, a.button--glass, a.button--accent, a.button--success, a.button--warning, a.button--dbw"
		);

		if (buttons.length === 0) return;

		buttons.forEach((button) => {
			if (button.matches(".our-work, .button-icon, .gb-accordion__toggle")) {
				return;
			}
			setupButtonRipple(button);
		});
	};

	const setupButtonRipple = (button) => {
		const buttonData = {
			lastX: 0,
			lastY: 0,
			lastTime: 0,
		};
		buttonCache.set(button, buttonData);

		const handleMouseEnter = (e) => {
			const rect = button.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const maxDistance = calculateMaxDistance(x, y, rect.width, rect.height);
			const rippleSize = Math.ceil(maxDistance * 2.2);

			buttonData.lastX = x;
			buttonData.lastY = y;
			buttonData.lastTime = Date.now();

			requestAnimationFrame(() => {
				button.style.setProperty("--ripple-x", x + "px");
				button.style.setProperty("--ripple-y", y + "px");
				button.style.setProperty("--ripple-size", rippleSize + "px");
			});
		};

		const handleMouseMove = (e) => {
			const data = buttonCache.get(button);
			if (!data) return;

			const now = Date.now();
			if (now - data.lastTime < 16) return;

			const rect = button.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			const distance = Math.sqrt(
				Math.pow(x - data.lastX, 2) + Math.pow(y - data.lastY, 2)
			);
			if (distance < 5) return;

			const maxDistance = calculateMaxDistance(x, y, rect.width, rect.height);
			const rippleSize = Math.ceil(maxDistance * 2.2);

			data.lastX = x;
			data.lastY = y;
			data.lastTime = now;

			if (rafId) cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(() => {
				button.style.setProperty("--ripple-x", x + "px");
				button.style.setProperty("--ripple-y", y + "px");
				button.style.setProperty("--ripple-size", rippleSize + "px");
			});
		};

		button.addEventListener("mouseenter", handleMouseEnter, { passive: true });
		button.addEventListener("mousemove", handleMouseMove, { passive: true });

		if ("ontouchstart" in window) {
			button.addEventListener("touchstart", handleMouseEnter, {
				passive: true,
			});
		}
	};

	const calculateMaxDistance = (x, y, width, height) => {
		return Math.max(
			Math.hypot(x, y),
			Math.hypot(width - x, y),
			Math.hypot(x, height - y),
			Math.hypot(width - x, height - y)
		);
	};

	const reinitialize = () => {
		destroy();
		initButtonRipples();
	};

	const destroy = () => {
		const buttons = document.querySelectorAll('a[class*="button"]');
		buttons.forEach((button) => {
			button.style.removeProperty("--ripple-x");
			button.style.removeProperty("--ripple-y");
			button.style.removeProperty("--ripple-size");
			buttonCache.delete(button);
		});

		if (rafId) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
	};

	const init = () => {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", initButtonRipples);
		} else {
			initButtonRipples();
		}

		window.ButtonRipple = {
			reinitialize: reinitialize,
			destroy: destroy,
			setupButtonRipple: setupButtonRipple,
		};
	};

	init();
};

export default Component_ButtonRipple;
