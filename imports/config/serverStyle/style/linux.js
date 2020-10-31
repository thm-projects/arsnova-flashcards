import {
	DEFAULT_REGISTRATION_DOMAIN_WHITELIST
} from "./global/config";
import {AUTO_FULLSCREEN, CHOOSE_FULLSCREEN, EDU, FREE, GUEST, LECTURER, MANUAL_FULLSCREEN, PRO} from "./global/const";

module.exports = {
	"fullscreen": {
		"settings": {
			"enabled": [FREE, EDU, LECTURER, PRO],
			"presentation": [FREE, EDU, LECTURER, PRO],
			"demo": [FREE, EDU, LECTURER, PRO],
			"leitner": [FREE, EDU, LECTURER, PRO],
			"wozniak": [FREE, EDU, LECTURER, PRO]
		},
		"defaults": { // Will be used if the user got not access to the fullscreen settings. Admin and editor only get used to setup the account
			"admin": {
				"presentation": MANUAL_FULLSCREEN,
				"demo": MANUAL_FULLSCREEN,
				"leitner": MANUAL_FULLSCREEN,
				"wozniak": MANUAL_FULLSCREEN
			},
			"editor": {
				"presentation": MANUAL_FULLSCREEN,
				"demo": MANUAL_FULLSCREEN,
				"leitner": MANUAL_FULLSCREEN,
				"wozniak": MANUAL_FULLSCREEN
			},
			"free": {
				"presentation": AUTO_FULLSCREEN,
				"demo": AUTO_FULLSCREEN,
				"leitner": AUTO_FULLSCREEN,
				"wozniak": AUTO_FULLSCREEN
			},
			"edu": {
				"presentation": AUTO_FULLSCREEN,
				"demo": AUTO_FULLSCREEN,
				"leitner": AUTO_FULLSCREEN,
				"wozniak": AUTO_FULLSCREEN
			},
			"pro": {
				"presentation": MANUAL_FULLSCREEN,
				"demo": MANUAL_FULLSCREEN,
				"leitner": MANUAL_FULLSCREEN,
				"wozniak": MANUAL_FULLSCREEN
			},
			"lecturer": {
				"presentation": CHOOSE_FULLSCREEN,
				"demo": CHOOSE_FULLSCREEN,
				"leitner": CHOOSE_FULLSCREEN,
				"wozniak": CHOOSE_FULLSCREEN
			},
			"guest": {
				"presentation": CHOOSE_FULLSCREEN,
				"demo": CHOOSE_FULLSCREEN,
				"leitner": CHOOSE_FULLSCREEN,
				"wozniak": CHOOSE_FULLSCREEN
			},
			"landingPage": {
				"demo": AUTO_FULLSCREEN
			}
		}
	},
	"navigationFeatures": { //Excludes Super Admins (Backend) and Editors (Frontend)
		"simplifiedNav": true, // Removes dropdowns and groups content together
		"useCases": { //Will be only visible if the related navigation item is enabled
			"misc": {
				"create": [PRO, LECTURER],
				"workload":	[FREE, EDU, PRO, LECTURER],
				"transcripts": [PRO, LECTURER],
				"specialCardsets": [FREE, EDU, PRO, LECTURER, GUEST]
			},
			"personal": {
				"cardset": [PRO, LECTURER],
				"repetitorium": [PRO, LECTURER]
			},
			"public": {
				"cardset": [PRO, LECTURER],
				"repetitorium": [PRO, LECTURER]
			}
		},
		"public": {
			"cardset": {
				"enabled": [EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER, GUEST],
				"wordcloud": [FREE, EDU, PRO, LECTURER, GUEST]
			},
			"repetitorium": {
				"enabled": [EDU, PRO, LECTURER, GUEST],
				"filter": [PRO, LECTURER],
				"search":  [PRO, LECTURER],
				"wordcloud": [PRO, LECTURER]
			}
		},
		"personal": { // Excludes GUEST, requires 'roles.create' permission
			"cardset": {
				"enabled": [PRO, LECTURER],
				"filter": [FREE, EDU, PRO, LECTURER],
				"search":  [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
			},
			"repetitorium": {
				"enabled": [PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
			}
		},
		"transcript": { // Excludes GUEST, requires 'roles.create' permission
			"personal": {
				"enabled": [PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST]
			},
			"bonus": {
				"enabled": [PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST]
			}
		},
		"misc": {
			"features": {
				"bonus": [FREE, EDU, PRO, LECTURER]
			}
		}
	},
	"login": {
		"cards": {
			"enabled": true,
			"domainWhitelist": DEFAULT_REGISTRATION_DOMAIN_WHITELIST
		},
		"cas": false,
		"guest": true,
		"pro": false,
		"facebook": false,
		"twitter": false,
		"google": false
	},
	"welcome": {
		"title": {
			"first": "Linux",
			"last": "cards",
			"slogan_de": "LERNEN FÜR DIE LPI-PRÜFUNGEN",
			"slogan_en": "Learning for the LPI exams"
		},
		"button": {
			"about":  {
				"default_de": "Um was es geht: eine interaktive Einführung …",
				"default_en": "Learn more about 🍅cards in our interactive demo …",
				"mobile_de": "Erfahre mehr in unserer interaktiven Einführung …",
				"mobile_en": "Learn more about 🍅cards…"
			}
		},
		"wordcloud": {
			"enabled": false
		},
		"centeredLandingPagePomodoro": false
	},
	"language": {
		"server": "de",
		"client": "de"
	},
	"transcripts": {
		"enabled": false
	},
	"help": {
		"style": "linux",
		"markdeepFormatingCardsetID": ""
	},
	"demo": {
		"folder": "linux",
		"autoFullscreen": false,
		"exitOnFullscreenBackgroundClick": true,
		"fragJetzt": {
			"session": "82871525",
			"overrideOnlyEmptySessions": true
		},
		"arsnovaClick": {
			"session": "",
			"overrideOnlyEmptySessions": true
		}
	},
	"presentation": {
		"exitOnFullscreenBackgroundClick": true
	},
	"imprint": {
		"folder": "linux"
	},
	"roles": {
		"create": {
			"standard": false,
			"edu": false,
			"pro": true,
			"lecturer": true
		}
	},
	"newUser": {
		"enabledNotifications": {
			"mail": true, //Excludes Free Users
			"web": true
		}
	},
	"leitner": {
		"randomCardsSelection": false
	},
	"themes": {
		"defaultID": 0, // The default theme id from the list
		"list": [
			{
				"theme": "linux", // The color theme
				"backgrounds": "linux" // The background images found in ./backgrounds.js
			}
		] // The list available to the theme switcher dropdown menu
	},
	"landingPage": ""
};
