// Vertical and Horizontal size of the iframe
// 0 = 0 %, 1.00 = 100 %
let smartphoneSize = {
	landscape: {
		height: 1,
		width: 0.85
	},
	portrait: {
		height: 0.85,
		width: 1
	}
};

let tabletSize = {
	landscape: {
		height: 1,
		width: 0.85
	},
	portrait: {
		height: 0.85,
		width: 1
	}
};

let desktopSize = {
	height: 0.95,
	width: 0.8
};

module.exports = {
	smartphoneSize,
	tabletSize,
	desktopSize
};
