//If enabled then the card uses the aspect ratio defined by the user
//0: Presentation
//1: Demo / Making Of
//2: Leitner
//3: Wozniak
//4: Editor-Fullscreen
let aspectRatioEnabled = [0, 1, 2, 3, 4];

//Order and types for the aspect ratio dropdown list
//Add entries to /config/icons.js and the i18n file if you want to add new types
let aspectRatios = ['16:10', '16:9', '4:3', 'fill'];

//Array index, only applied if the aspectRatio is enabled
//0: Presentation
//1: Demo / Making Of
//2: Leitner
//3: Wozniak
//4: Editor-Fullscreen
let defaultAspectRatio = ['16:10', '16:10', '16:10', '16:10', 'fill'];
let defaultAspectRatioTablet = ['fill', 'fill', 'fill', 'fill', 'fill'];

//Scale the width of the top card navigation to match the card width
//0: Presentation
//1: Demo / Making Of
//2: Leitner
//3: Wozniak
//4: Editor-Fullscreen
let scaleCardNavigationWidth = [0, 1, 2, 3, 4];
let scale3DCardNavigationWidth = [0, 1, 2, 3, 4];

module.exports = {
	aspectRatioEnabled,
	aspectRatios,
	defaultAspectRatio,
	scaleCardNavigationWidth,
	defaultAspectRatioTablet,
	scale3DCardNavigationWidth
};
