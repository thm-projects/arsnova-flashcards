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

//3D Mode settings
//0: Default (Cardset and other views), Currently not supported
//1: Presentation
//2: Demo / Making Of
//3: Editor
//4: Leitner
//5: Wozniak
let enabled3DModeByDefault = [1, 2, 3, 4, 5];
let got3DMode = [1, 2, 3, 4, 5];

let cubeTransitionTime = 1.5;
let cubeMaxNavigationWidth = 1200;

module.exports = {
	defaultFontSize,
	defaultFontSizeMobile,
	defaultTextZoomValue,
	iFrameWidthRatio,
	iFrameHeightRatio,
	iFrameMaxHeight,
	fixedSidebarPosition,
	enabled3DModeByDefault,
	got3DMode,
	cubeTransitionTime,
	cubeMaxNavigationWidth
};
