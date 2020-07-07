// Background-Image settings for the default theme:
// - Set the Background-Colors inside the Theme Switcher files.
// - Set the Background-Image to "none" to enable the Background-Color.
// - Change the setting "backgrounds" in "/import/config/server.js" to select the background setting that the server should use.

// Setting "arsnova"
let arsnova = {
	"landing-page": "/img/background/question-mark-1481601.jpg",
	"demo": "/img/background/question-mark-1481601.jpg", // Defaults to landing-page if off
	"demoIndex": "/img/background/question-mark-1481601.jpg", // Defaults to landing-page if off
	"about": "none", // Defaults to landing-page if off
	"learning": "none", // Defaults to landing-page if off
	"faq": "none", // Defaults to landing-page if off
	"help": "none", // Defaults to landing-page if off
	"impressum": "none", // Defaults to landing-page if off
	"agb": "none", // Defaults to landing-page if off
	"datenschutz": "none", // Defaults to landing-page if off
	"internal": "/img/background/question-mark-1481601.jpg",
	"pool": "none", // Defaults to internal if off
	"workload": "none", // Defaults to internal if off
	"personal": "none", // Defaults to internal if off
	"transcripts": "none", // Defaults to internal if off
	"allPool": "none", // Defaults to internal if off
	"cardset": "none", // Defaults to internal if off
	"cardsetLeitnerStats": "none", // Defaults to cardset if off
	"cardsetTranscriptBonus": "none", // Defaults to cardset if off
	"leitner": "none", // Defaults to internal if off
	"wozniak": "none", // Defaults to internal if off
	"presentation": "none", // Defaults to internal if off
	"presentationIndex": "none", // Defaults to internal if off
	"editor": "/img/background/matrix.jpg", // Defaults to internal if off
	"profileMembership": "none", // Defaults to internal if off
	"profileBilling": "none", // Defaults to internal if off
	"profileSettings": "none", // Defaults to internal if off
	"profileRequests": "none", // Defaults to internal if off
	"backend": "/img/background/matrix.jpg"
};

// Setting "linux"
let linux = {
	"landing-page": "/img/background/Linux-Regal.jpg",
	"demo": "/img/background/matrix.jpg",
	"demoIndex": "/img/background/matrix.jpg",
	"about": "none", // Defaults to landing-page if off
	"learning": "none", // Defaults to landing-page if off
	"faq": "none", // Defaults to landing-page if off
	"help": "none", // Defaults to landing-page if off
	"impressum": "none", // Defaults to landing-page if off
	"agb": "none", // Defaults to landing-page if off
	"datenschutz": "none", // Defaults to landing-page if off
	"internal": "/img/background/matrix.jpg",
	"pool": "none", // Defaults to internal if off
	"workload": "none", // Defaults to internal if off
	"personal": "none", // Defaults to internal if off
	"transcripts": "none", // Defaults to internal if off
	"allPool": "none", // Defaults to internal if off
	"cardset": "none", // Defaults to internal if off
	"cardsetLeitnerStats": "none", // Defaults to cardset if off
	"cardsetTranscriptBonus": "/img/background/pencil.png", // Defaults to cardset if off
	"leitner": "none", // Defaults to internal if off
	"wozniak": "none", // Defaults to internal if off
	"presentation": "none", // Defaults to internal if off
	"presentationIndex": "none", // Defaults to internal if off
	"editor": "/img/background/matrix.jpg", // Defaults to internal if off
	"profileMembership": "none", // Defaults to internal if off
	"profileBilling": "none", // Defaults to internal if off
	"profileSettings": "none", // Defaults to internal if off
	"profileRequests": "none", // Defaults to internal if off
	"backend": "/img/background/matrix.jpg"
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
