/**
 * Hero setup: marks heroes with a background image and moves an inline
 * background image onto the parallax layer. The parallax motion is CSS.
 */
const Component_Parallax = () => {
	const heroElements = document.querySelectorAll('[class*="dbw-hero-"]');
	if (heroElements.length === 0) return;

	heroElements.forEach((hero) => {
		const bgElement = hero.querySelector(".dbw-hero-background");

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

		// Motion itself is CSS (scroll-driven animations in _hero.scss).
	});
};

export default Component_Parallax;
