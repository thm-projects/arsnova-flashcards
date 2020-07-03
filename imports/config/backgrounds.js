// Background-Image settings for the default theme:
// - Set the Background-Colors inside the Theme Switcher files.
// - Set the Background-Image to "none" to enable the Background-Color.
// - Change the setting "backgrounds" in "/import/config/server.js" to select the background setting that the server should use.

// Setting "arsnova"
let arsnova = {
	"landing-page": "/img/background/question-mark-1481601.jpg",
	"internal": "/img/background/question-mark-1481601.jpg",
	"demo": "/img/background/question-mark-1481601.jpg",
	"presentation": "/img/background/question-mark-1481601.jpg",
	"learning": "/img/background/question-mark-1481601.jpg",
	"backend": "/img/background/matrix.jpg",
	"editor": "/img/background/matrix.jpg",
	"transcriptBonus": "none"
};

// Setting "linux"
let linux = {
	"landing-page": "/img/background/Linux-Regal.jpg",
	"internal": "/img/background/Mac-Tastatur.jpg",
	"demo": "none",
	"presentation": "none",
	"learning": "none",
	"backend": "/img/background/matrix.jpg",
	"editor": "/img/background/matrix.jpg",
	"transcriptBonus": "none"
};

// Setting disabled
let disabled = {
	"landing-page": "none",
	"internal": "none",
	"demo": "none",
	"presentation": "none",
	"learning": "none",
	"backend": "none",
	"editor": "none",
	"transcriptBonus": "none"
};

module.exports = {
	arsnova,
	linux,
	disabled
};
