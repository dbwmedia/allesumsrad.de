const Component_ScrollHandler = () => {
	const header = document.querySelector("header");

	if (!header) {
		console.warn("Header element not found");
		return null;
	}

	const isHome =
		typeof window !== "undefined" && window.location.pathname === "/";

	if (isHome) {
		// Scroll-abhängige Klasse auf Startseite
		const updateHeaderClass = () => {
			if (window.scrollY > 0) {
				header.classList.add("scroll");
			} else {
				header.classList.remove("scroll");
			}
		};

		updateHeaderClass(); // Direkt beim Laden
		window.addEventListener("scroll", updateHeaderClass, { passive: true });
	} else {
		// Auf allen anderen Seiten direkt Klasse setzen
		header.classList.add("scroll");
	}

	return null;
};

export default Component_ScrollHandler;
