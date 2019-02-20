let minimumTabletWidth = 768;
let minimumTabletHeight = 1024;
let iOSPlatforms = ['iPhone', 'iPad', 'iPod'];
let macOSPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];

//  Feature List
//0: Minute jump clock
//1: WordCloud - Landing Page
//2: WordCloud - Filter
//3: Demo
let enabledSmartphoneFeatures = [0, 1, 2, 3];
let enabledIOSFeatures = [3];
let enabledMacOSSafariFeatures = [3];

module.exports = {
	minimumTabletWidth,
	minimumTabletHeight,
	iOSPlatforms: iOSPlatforms,
	macOSPlatforms: macOSPlatforms,
	enabledIOSFeatures,
	enabledMacOSSafariFeatures,
	enabledSmartphoneFeatures
};
