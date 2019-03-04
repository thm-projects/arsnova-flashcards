//If enabled then the card uses the aspect ratio defined by the user
//0: Presentation
//1: Demo / Making Of
//2: Leitner
//3: Wozniak
//4: Editor-Fullscreen
let aspectRatioEnabled = [0, 1, 2, 3, 4];

//Order and types for the aspect ratio dropdown list
//Add entries to /config/icons.js and the i18n file if you want to add new types
let aspectRatios = ['fill', 'din', '16:9', '16:10', '4:3'];

//Array index, only applied if the aspectRatio is enabled
//0: Presentation
//1: Demo / Making Of
//2: Leitner
//3: Wozniak
//4: Editor-Fullscreen
let defaultAspectRatio = ['fill', 'din', 'din', 'din', 'din'];
let defaultAspectRatioTablet = ['fill', 'fill', 'fill', 'fill', 'fill'];

//Scale the width of the top card navigation to match the card width
//0: Presentation
//1: Demo / Making Of
//2: Leitner
//3: Wozniak
//4: Editor-Fullscreen
let scaleCardNavigationWidth = [1, 2, 3, 4];

module.exports = {
	aspectRatioEnabled,
	aspectRatios,
	defaultAspectRatio,
	scaleCardNavigationWidth,
	defaultAspectRatioTablet
};
