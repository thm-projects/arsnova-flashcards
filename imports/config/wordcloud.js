let wordcloudPomodoroSize = 0.6;
// Default to wordcloud on first load if support
let defaultToFilterWordcloudOnFirstLoad = false;
// Threshold for the default
let defaultToFilterWordcloudThreshold = 100;



//type
//0: Show once (local storage)
//1: Show once per session
//2: Show each time on wordcloud construction

let displayHelpModalSettings = {
	"landingPage": {
		"active": true,
		"type": 1
	},
	"filter": {
		"active": true,
		"type": 1
	}
};

let wordcloudLandingPage = {
	"clearCanvas": true,
	"drawOutOfBound": false,
	"gridSize": 10,
	"weightFactor": 18,
	"rotateRatio": 0,
	"fontFamily": "Roboto, Arial, sans-serif",
	"color": "random-light",
	"backgroundColor": "rgba(000, 000, 000, 0.0)",
	"wait": 100
};

let wordcloudDefault = {
	"clearCanvas": true,
	"drawOutOfBound": false,
	"gridSize": 10,
	"weightFactor": 18,
	"rotateRatio": 0,
	"fontFamily": "Roboto , Arial, sans-serif",
	"color": "random-light",
	"backgroundColor": "rgba(255,255,255, 0.0)",
	"wait": 100
};

module.exports = {
	wordcloudPomodoroSize,
	defaultToFilterWordcloudOnFirstLoad,
	defaultToFilterWordcloudThreshold,
	wordcloudLandingPage,
	wordcloudDefault,
	displayHelpModalSettings
};
