let wordcloudPomodoroSize = 0.6;
let defaultToFilterWordcloudThreshold = 100;

let wordcloudLandingPage = {
	"clearCanvas": true,
	"drawOutOfBound": false,
	"gridSize": 15,
	"weightFactor": 15,
	"rotateRatio": 0,
	"fontFamily": "Roboto, Arial, sans-serif",
	"color": "random-light",
	"backgroundColor": "rgba(000, 000, 000, 0.0)",
	"wait": 100
};

let wordcloudDefault = {
	"clearCanvas": true,
	"drawOutOfBound": false,
	"gridSize": 15,
	"weightFactor": 15,
	"rotateRatio": 0,
	"fontFamily": "Roboto , Arial, sans-serif",
	"color": "random-light",
	"backgroundColor": "rgba(255,255,255, 0.0)",
	"wait": 100
};

module.exports = {
	wordcloudPomodoroSize,
	defaultToFilterWordcloudThreshold,
	wordcloudLandingPage,
	wordcloudDefault
};
