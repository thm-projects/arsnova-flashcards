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

//Viewer doesn't work atm without herokuapp
let viewerLink = "/pdf/web/viewer.html?file=https://cors-anywhere.herokuapp.com/";
let markdeepPDFRegex = /\[.*?\]\((.*?\.pdf.*?)\)/;

module.exports = {
	smartphoneSize,
	tabletSize,
	desktopSize,
	viewerLink,
	markdeepPDFRegex
};
