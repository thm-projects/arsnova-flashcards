let wordcloudPomodoroSize = 0.6;
let defaultToFilterWordcloudThreshold = 100;

let wordcloudLandingPage = {
	"clearCanvas": true,
	"drawOutOfBound": false,
	"gridSize": 24,
	"weightFactor": 24,
	"rotateRatio": 0,
	"fontFamily": "Roboto Condensed, Arial Narrow, sans-serif",
	"color": "random-light",
	"backgroundColor": "rgba(255,255,255, 0)",
	"wait": 100
};

let wordcloudDefault = {
	"clearCanvas": true,
	"drawOutOfBound": false,
	"gridSize": 24,
	"weightFactor": 24,
	"rotateRatio": 0,
	"fontFamily": "Roboto Condensed, Arial Narrow, sans-serif",
	"color": "random-light",
	"backgroundColor": "rgba(255,255,255, 0)",
	"wait": 100
};

module.exports = {
	wordcloudPomodoroSize,
	defaultToFilterWordcloudThreshold,
	wordcloudLandingPage,
	wordcloudDefault
};
