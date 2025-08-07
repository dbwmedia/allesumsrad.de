/**
 * DBW Apple-Style Parallax Component
 * Separater Transform für Background und Content mit antizyklischer Bewegung
 */
const Component_Parallax = () => {
	const CONFIG = {
		bgSpeed: 0.8,
		bgMaxMove: 400,
		bgMaxScale: 0.3,
		contentSpeed: 0.6,
		contentMaxMove: 250,
		contentMaxScale: 0.15,
		contentOpacity: true,
		contentOpacityMin: 0.2,
		throttleDelay: 0,
		smoothness: 0.15,
	};

	const heroElements = document.querySelectorAll('[class*="dbw-hero-"]');
	if (heroElements.length === 0) return;

	const isMobile = () => window.innerWidth <= 768;
	const prefersReducedMotion = () =>
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const lerp = (start, end, factor) => start + (end - start) * factor;
	const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
	const easeOutQuad = (t) => t * (2 - t);

	heroElements.forEach((hero) => {
		const bgElement = hero.querySelector(".dbw-hero-background");
		const heroContent = hero.querySelector(".dbw-hero-content");

		if (bgElement) {
			const hasImg = bgElement.querySelector("img");
			const hasBgImage =
				window.getComputedStyle(bgElement).backgroundImage !== "none";
			if (hasImg || hasBgImage) {
				hero.classList.add("has-bg-image");
			}
		}

		const inlineBgImage = hero.style.backgroundImage;
		if (inlineBgImage && bgElement) {
			bgElement.style.backgroundImage = inlineBgImage;
			hero.style.backgroundImage = "";
			hero.classList.add("has-bg-image");
		}

		if (!bgElement || isMobile() || prefersReducedMotion()) return;

		let currentBgY = 0;
		let currentBgScale = 1;
		let currentContentY = 0;
		let currentContentScale = 1;
		let currentContentOpacity = 1;
		let targetBgY = 0;
		let targetBgScale = 1;
		let targetContentY = 0;
		let targetContentScale = 1;
		let targetContentOpacity = 1;
		let ticking = false;

		const updateTransforms = () => {
			const rect = hero.getBoundingClientRect();
			const heroHeight = hero.offsetHeight;
			const windowHeight = window.innerHeight;

			const heroTop = rect.top;
			const heroBottom = rect.bottom;
			if (heroBottom < 0 || heroTop > windowHeight) {
				ticking = false;
				return;
			}

			let scrollProgress = 0;
			if (heroTop <= 0) {
				scrollProgress = Math.min(1, Math.abs(heroTop) / heroHeight);
			}

			const easedProgress = easeOutQuad(scrollProgress);

			targetBgY = easedProgress * CONFIG.bgMaxMove * CONFIG.bgSpeed;
			targetBgScale = 1 + easedProgress * CONFIG.bgMaxScale;
			targetContentY =
				easedProgress * CONFIG.contentMaxMove * CONFIG.contentSpeed * -1;
			targetContentScale = 1 - easedProgress * CONFIG.contentMaxScale;

			if (CONFIG.contentOpacity) {
				targetContentOpacity =
					1 - easedProgress * (1 - CONFIG.contentOpacityMin);
			}

			currentBgY = lerp(currentBgY, targetBgY, CONFIG.smoothness);
			currentBgScale = lerp(currentBgScale, targetBgScale, CONFIG.smoothness);
			currentContentY = lerp(
				currentContentY,
				targetContentY,
				CONFIG.smoothness
			);
			currentContentScale = lerp(
				currentContentScale,
				targetContentScale,
				CONFIG.smoothness
			);
			currentContentOpacity = lerp(
				currentContentOpacity,
				targetContentOpacity,
				CONFIG.smoothness
			);

			if (bgElement) {
				bgElement.style.transform = `translate3d(0, ${currentBgY}px, 0) scale(${currentBgScale})`;
			}
			if (heroContent) {
				heroContent.style.transform = `translate3d(0, ${currentContentY}px, 0) scale(${currentContentScale})`;
				if (CONFIG.contentOpacity) {
					heroContent.style.opacity = currentContentOpacity;
				}
			}

			const bgDiff = Math.abs(targetBgY - currentBgY);
			const bgScaleDiff = Math.abs(targetBgScale - currentBgScale);
			const contentDiff = Math.abs(targetContentY - currentContentY);
			const scaleDiff = Math.abs(targetContentScale - currentContentScale);

			if (
				bgDiff > 0.1 ||
				bgScaleDiff > 0.001 ||
				contentDiff > 0.1 ||
				scaleDiff > 0.001
			) {
				requestAnimationFrame(updateTransforms);
			} else {
				ticking = false;
			}
		};

		const onScroll = () => {
			if (!ticking) {
				requestAnimationFrame(updateTransforms);
				ticking = true;
			}
		};

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						window.addEventListener("scroll", onScroll, { passive: true });
						onScroll();
					} else {
						window.removeEventListener("scroll", onScroll);
						ticking = false;
					}
				});
			},
			{ rootMargin: "10% 0px" }
		);

		observer.observe(hero);

		const handleResize = () => {
			if (isMobile()) {
				if (bgElement) bgElement.style.transform = "";
				if (heroContent) heroContent.style.transform = "";
				window.removeEventListener("scroll", onScroll);
				observer.disconnect();
			}
		};

		window.addEventListener("resize", handleResize);

		if (bgElement) {
			bgElement.style.transformOrigin = "center center";
			const bgImg = bgElement.querySelector("img");
			if (bgImg) {
				bgImg.style.transformOrigin = "center center";
				bgImg.style.willChange = "transform";
			}
		}
		if (heroContent) {
			heroContent.style.transformOrigin = "center bottom";
		}
	});
};

export default Component_Parallax;
