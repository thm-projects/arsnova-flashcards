//All values are set in pixel. Tablet size limit has to be defined in NavigatorCheck.
let defaultFontSize = {
	"portrait": {
		"mobile": 12,
		"tablet": {
			"normal": 16,
			"cube": 16
		},
		"desktop": {
			"normal": 24,
			"cube": 18
		}
	},
	"landscape": {
		"mobile": 12,
		"tablet": {
			"normal": 14,
			"cube": 10
		},
		"desktop": {
			"normal": 24,
			"cube": 18
		}
	}
};

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
let allow3DModeOnSingleSideCardsets = false;
let allow3DOverflow = true;

let cubeTransitionTime = 1.5;

module.exports = {
	defaultFontSize,
	defaultTextZoomValue,
	iFrameWidthRatio,
	iFrameHeightRatio,
	iFrameMaxHeight,
	fixedSidebarPosition,
	enabled3DModeByDefault,
	allow3DOverflow,
	got3DMode,
	allow3DModeOnSingleSideCardsets,
	cubeTransitionTime
};
