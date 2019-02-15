// Background-Image settings for the default theme:
// - Set the Background-Colors inside the Theme Switcher files.
// - Set the Background-Image to "none" to enable the Background-Color.
// - Change the setting "backgrounds" in "/import/config/server.js" to select the background setting that the server should use.

// Setting "default"
let defaultBackgrounds = {
	"landing-page": "/img/background/Mac-Tastatur.jpg",
	"internal": "/img/background/Buchladen.jpg",
	"demo": "/img/background/Mac-Tastatur.jpg",
	"presentation": "none",
	"learning": "none",
	"backend": "none",
	"editor": "none"
};

// Setting "linux"
let linuxBackgrounds = {
	"landing-page": "/img/background/Mac-Tastatur.jpg",
	"internal": "/img/background/Buchladen.jpg",
	"demo": "/img/background/Mac-Tastatur.jpg",
	"presentation": "none",
	"learning": "none",
	"backend": "none",
	"editor": "none"
};

module.exports = {
	defaultBackgrounds,
	linuxBackgrounds
};
