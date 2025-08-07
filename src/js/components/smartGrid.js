/**
 * Smart Grid Component
 * Automatically assigns grid classes based on number of children
 * + Handles spacing between consecutive grids
 */
const Component_SmartGrid = () => {
	const initSmartGrids = () => {
		const autoGrids = document.querySelectorAll(".grid.auto");
		if (autoGrids.length === 0) return;

		autoGrids.forEach((grid, index) => {
			processGrid(grid, index);
		});

		handleConsecutiveGridSpacing(autoGrids);
	};

	const handleConsecutiveGridSpacing = (grids) => {
		grids.forEach((grid) => {
			const prevSibling = grid.previousElementSibling;

			if (prevSibling && prevSibling.classList.contains("grid")) {
				grid.classList.add("grid-follows-grid");
			} else {
				grid.classList.remove("grid-follows-grid");
			}
		});
	};

	const processGrid = (grid, index) => {
		const children = Array.from(grid.children).filter(
			(child) => child.tagName.toLowerCase() === "div"
		);
		const childCount = children.length;

		removeExistingAutoClasses(grid);
		const gridClass = getGridClass(childCount);
		grid.classList.add(gridClass);

		grid.setAttribute("data-smart-grid-children", childCount);
		grid.setAttribute("data-smart-grid-class", gridClass);
	};

	const removeExistingAutoClasses = (grid) => {
		const autoClasses = [
			"grid-auto-1",
			"grid-auto-2",
			"grid-auto-3",
			"grid-auto-4",
			"grid-auto-5",
			"grid-auto-6",
			"grid-auto-many",
		];
		autoClasses.forEach((className) => {
			grid.classList.remove(className);
		});
	};

	const getGridClass = (count) => {
		if (count === 0) return "grid-auto-1";
		if (count === 1) return "grid-auto-1";
		if (count === 2) return "grid-auto-2";
		if (count === 3) return "grid-auto-3";
		if (count === 4) return "grid-auto-4";
		if (count === 5) return "grid-auto-5";
		if (count === 6) return "grid-auto-6";
		return "grid-auto-many";
	};

	const reinitialize = () => {
		initSmartGrids();
	};

	const init = () => {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", initSmartGrids);
		} else {
			initSmartGrids();
		}

		window.SmartGrid = {
			reinitialize: reinitialize,
			processGrid: processGrid,
		};
	};

	init();
};

export default Component_SmartGrid;
