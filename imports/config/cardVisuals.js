let defaultFontSize = 16;
let defaultFontSizeMobile = 12;
let defaultTextZoomValue = 100;
let iFrameWidthRatio = 16;
let iFrameHeightRatio = 9;
let iFrameMaxHeight = 0.8;


//If enabled then the sidebar is fixed to the border of the screen (Only for iPad and Desktop)
//0: Default (Cardset and other views), Currently not supported
//1: Presentation
//2: Demo / Making Of
//3: Editor
//4: Leitner
//5: Wozniak
let fixedSidebarPosition = [1, 2, 3, 4, 5];

//Order and types for the aspect ratio dropdown list
//Add entries to /main/overlay/aspectRatio.js events and the i18n file if you want to add new types
let aspectRatios = ['din', 'stretched', '16:9', '4:3'];

module.exports = {
	defaultFontSize,
	defaultFontSizeMobile,
	defaultTextZoomValue,
	iFrameWidthRatio,
	iFrameHeightRatio,
	iFrameMaxHeight,
	fixedSidebarPosition,
	aspectRatios
};
