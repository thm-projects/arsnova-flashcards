// Background-Image settings for the default theme:
// - Set the Background-Colors inside the Theme Switcher files.
// - Set the Background-Image to "none" to enable the Background-Color.
// - Change the setting "backgrounds" in "/import/config/serverStyle/style/*.js" to select the background setting that the server should use.
// - Add additional attributes to the object if needed. For example: "background-size": "contain"


// Setting "arsnova"
let arsnova = {
	"landing-page": {
		"background-image": "url('/img/background/question-mark-1481601.jpg')"
	},
	"demo": {
		"background-image": "url('/img/background/question-mark-1481601.jpg')"
	}, // Defaults to landing-page if off
	"demoIndex": {
		"background-image": "url('/img/background/question-mark-1481601.jpg')"
	}, // Defaults to landing-page if off
	"about": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"learning": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"faq": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"help": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"impressum": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"agb": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"datenschutz": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"internal": {
		"background-image": "url('/img/background/question-mark-1481601.jpg')"
	},
	"pool": {
		"background-image": "none"
	}, // Defaults to internal if off
	"workload": {
		"background-image": "none"
	}, // Defaults to internal if off
	"personal": {
		"background-image": "none"
	}, // Defaults to internal if off
	"transcripts": {
		"background-image": "url('/img/background/pencil.png')",
		"background-size": "contain"
	}, // Defaults to internal if off
	"allPool": {
		"background-image": "none"
	}, // Defaults to internal if off
	"cardset": {
		"background-image": "none"
	}, // Defaults to internal if off
	"cardsetLeitnerStats": {
		"background-image": "none"
	}, // Defaults to cardset if off
	"cardsetTranscriptBonus": {
		"background-image": "url('/img/background/matrix.jpg')"
	}, // Defaults to cardset if off
	"leitner": {
		"background-image": "none"
	}, // Defaults to internal if off
	"wozniak": {
		"background-image": "none"
	}, // Defaults to internal if off
	"presentation": {
		"background-image": "none"
	}, // Defaults to internal if off
	"presentationIndex": {
		"background-image": "none"
	}, // Defaults to internal if off
	"editor": {
		"background-image": "url('/img/background/matrix.jpg')"
	}, // Defaults to internal if off
	"profileMembership": {
		"background-image": "none"
	}, // Defaults to internal if off
	"profileBilling": {
		"background-image": "none"
	}, // Defaults to internal if off
	"profileSettings": {
		"background-image": "none"
	}, // Defaults to internal if off
	"profileRequests": {
		"background-image": "none"
	}, // Defaults to internal if off
	"notFound": {
		"background-image": "none"
	}, // Defaults to internal if logged in, otherwise to landing-page
	"backend": {
		"background-image": "url('/img/background/matrix.jpg')"
	},
	"wordcloud": {
		"background-image": "url('/img/background/Tafel.jpg')"
	}
};

// Setting "linux"
let linux = {
	"landing-page": {
		"background-image": "url('/img/background/Linux-Regal.jpg')"
	},
	"demo": {
		"background-image": "url('/img/background/matrix.jpg')"
	},
	"demoIndex": {
		"background-image": "url('/img/background/matrix.jpg')"
	},
	"about": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"learning": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"faq": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"help": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"impressum": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"agb": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"datenschutz": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"internal": {
		"background-image": "url('/img/background/matrix.jpg')"
	},
	"pool": {
		"background-image": "none"
	}, // Defaults to internal if off
	"workload": {
		"background-image": "none"
	}, // Defaults to internal if off
	"personal": {
		"background-image": "none"
	}, // Defaults to internal if off
	"transcripts": {
		"background-image": "none"
	}, // Defaults to internal if off
	"allPool": {
		"background-image": "none"
	}, // Defaults to internal if off
	"cardset": {
		"background-image": "none"
	}, // Defaults to internal if off
	"cardsetLeitnerStats": {
		"background-image": "none"
	}, // Defaults to cardset if off
	"cardsetTranscriptBonus": {
		"background-image": "url('/img/background/matrix.jpg')"
	}, // Defaults to cardset if off
	"leitner": {
		"background-image": "none"
	}, // Defaults to internal if off
	"wozniak": {
		"background-image": "none"
	}, // Defaults to internal if off
	"presentation": {
		"background-image": "none"
	}, // Defaults to internal if off
	"presentationIndex": {
		"background-image": "none"
	}, // Defaults to internal if off
	"editor": {
		"background-image": "url('/img/background/matrix.jpg')"
	}, // Defaults to internal if off
	"profileMembership": {
		"background-image": "none"
	}, // Defaults to internal if off
	"profileBilling": {
		"background-image": "none"
	}, // Defaults to internal if off
	"profileSettings": {
		"background-image": "none"
	}, // Defaults to internal if off
	"profileRequests": {
		"background-image": "none"
	}, // Defaults to internal if off
	"notFound": {
		"background-image": "none"
	}, // Defaults to internal if logged in, otherwise to landing-page
	"backend": {
		"background-image": "url('/img/background/matrix.jpg')"
	},
	"wordcloud": {
		"background-image": "url('/img/background/Night.jpg')"
	}
};

// Setting disabled
let disabled = {
	"landing-page": {
		"background-image": "none"
	},
	"internal": {
		"background-image": "none"
	},
	"demo": {
		"background-image": "none"
	},
	"presentation": {
		"background-image": "none"
	},
	"learning": {
		"background-image": "none"
	},
	"backend": {
		"background-image": "none"
	},
	"editor": {
		"background-image": "none"
	},
	"transcriptBonus": {
		"background-image": "none"
	}
};

// Setting "linux"
let dark = {
	"landing-page": {
		"background-image": "url('/img/background/Linux-Regal.jpg')"
	},
	"demo": {
		"background-image": "url('/img/background/matrix.jpg')"
	},
	"demoIndex": {
		"background-image": "url('/img/background/matrix.jpg')"
	},
	"about": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"learning": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"faq": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"help": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"impressum": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"agb": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"datenschutz": {
		"background-image": "none"
	}, // Defaults to landing-page if off
	"internal": {
		"background-image": "url('/img/background/matrix.jpg')"
	},
	"pool": {
		"background-image": "none"
	}, // Defaults to internal if off
	"workload": {
		"background-image": "none"
	}, // Defaults to internal if off
	"personal": {
		"background-image": "none"
	}, // Defaults to internal if off
	"transcripts": {
		"background-image": "none"
	}, // Defaults to internal if off
	"allPool": {
		"background-image": "none"
	}, // Defaults to internal if off
	"cardset": {
		"background-image": "none"
	}, // Defaults to internal if off
	"cardsetLeitnerStats": {
		"background-image": "none"
	}, // Defaults to cardset if off
	"cardsetTranscriptBonus": {
		"background-image": "url('/img/background/matrix.jpg')"
	}, // Defaults to cardset if off
	"leitner": {
		"background-image": "none"
	}, // Defaults to internal if off
	"wozniak": {
		"background-image": "none"
	}, // Defaults to internal if off
	"presentation": {
		"background-image": "none"
	}, // Defaults to internal if off
	"presentationIndex": {
		"background-image": "none"
	}, // Defaults to internal if off
	"editor": {
		"background-image": "url('/img/background/matrix.jpg')"
	}, // Defaults to internal if off
	"profileMembership": {
		"background-image": "none"
	}, // Defaults to internal if off
	"profileBilling": {
		"background-image": "none"
	}, // Defaults to internal if off
	"profileSettings": {
		"background-image": "none"
	}, // Defaults to internal if off
	"profileRequests": {
		"background-image": "none"
	}, // Defaults to internal if off
	"notFound": {
		"background-image": "none"
	}, // Defaults to internal if logged in, otherwise to landing-page
	"backend": {
		"background-image": "url('/img/background/matrix.jpg')"
	},
	"wordcloud": {
		"background-image": "url('/img/background/Night.jpg')"
	}
};

module.exports = {
	arsnova,
	linux,
	dark,
	disabled
};
