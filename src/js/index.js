import "../sass/_index.scss";

// Component Loader
import componentLoader from "./loader";

// Component Imports
import Component_OffsetScroll from "./components/offsetScroll";
import Component_ScrollHandler from "./components/scrollHandler";
import Component_UpdateDynamicAnchors from "./components/updateDynamicAnchors";
import Component_SmoothScroll from "./components/smoothScroll";
import Component_Parallax from "./components/heroParallax";
import Component_SmartGrid from "./components/smartGrid";
import Component_ButtonRipple from "./components/buttonRipple";

/**
 * Component Registry
 * Hier alle Components definieren mit ihrer Priorität
 */
const components = [
	// Critical - Sofort laden
	{
		name: "ScrollHandler",
		init: Component_ScrollHandler,
		priority: "critical",
	},
	{ name: "SmoothScroll", init: Component_SmoothScroll, priority: "critical" },
	{ name: "ButtonRipple", init: Component_ButtonRipple, priority: "critical" },

	// Normal - Nach Page Load
	{ name: "OffsetScroll", init: Component_OffsetScroll, priority: "normal" },
	{
		name: "UpdateDynamicAnchors",
		init: Component_UpdateDynamicAnchors,
		priority: "normal",
	},

	// Low - Wenn Browser Zeit hat
	{ name: "Parallax", init: Component_Parallax, priority: "low" },
	{ name: "SmartGrid", init: Component_SmartGrid, priority: "low" },
];

/**
 * Initialize App
 */
componentLoader.register(components).init().setupDynamicContentHandler();
