const Component_OffsetScroll = () => {
	const smoothScrollLinks = document.querySelectorAll("a.smooth-scroll");

	smoothScrollLinks.forEach((link) => {
		link.addEventListener("click", function (e) {
			e.preventDefault();
			e.stopPropagation();

			const targetID = this.getAttribute("href").split("#")[1];
			const targetElement = document.getElementById(targetID);

			if (targetElement) {
				const hasOffset = this.hasAttribute("data-offset");
				const offset = hasOffset ? parseInt(this.dataset.offset, 10) : 0;

				const elementPosition =
					targetElement.getBoundingClientRect().top + window.scrollY;
				const offsetPosition = elementPosition - offset;

				window.scrollTo({
					top: offsetPosition,
					behavior: "smooth",
				});
			}
		});
	});
};

export default Component_OffsetScroll;
