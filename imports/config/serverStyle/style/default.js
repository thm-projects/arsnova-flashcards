import {
	DEFAULT_REGISTRATION_DOMAIN_WHITELIST
} from "./global/config";
import {AUTO_FULLSCREEN, CHOOSE_FULLSCREEN, EDU, FREE, GUEST, LECTURER, MANUAL_FULLSCREEN, PRO} from "./global/const";

module.exports = {
	"debugServerBoot": true,
	"notificationsBlacklist": [],
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
				"create": [FREE, EDU, PRO, LECTURER],
				"workload": [FREE, EDU, PRO, LECTURER],
				"transcripts": [FREE, EDU, PRO, LECTURER],
				"specialCardsets": [FREE, EDU, PRO, LECTURER, GUEST]
			},
			"personal": {
				"cardset": [FREE, EDU, PRO, LECTURER],
				"repetitorium": [FREE, EDU, PRO, LECTURER]
			},
			"public": {
				"cardset": [FREE, EDU, PRO, LECTURER, GUEST],
				"repetitorium": [FREE, EDU, PRO, LECTURER, GUEST]
			}
		},
		"public": {
			"cardset": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search": [FREE, EDU, PRO, LECTURER, GUEST],
				"wordcloud": [FREE, EDU, PRO, LECTURER, GUEST]
			},
			"repetitorium": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search": [FREE, EDU, PRO, LECTURER, GUEST],
				"wordcloud": [FREE, EDU, PRO, LECTURER, GUEST]
			}
		},
		"personal": { // Excludes GUEST, requires 'roles.create' permission
			"cardset": {
				"enabled": [FREE, EDU, PRO, LECTURER],
				"filter": [FREE, EDU, PRO, LECTURER],
				"search": [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
			},
			"repetitorium": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search": [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
			}
		},
		"transcript": { // Excludes GUEST, requires 'roles.create' permission
			"personal": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST]
			},
			"bonus": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
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
			"enabled": false,
			"domainWhitelist": DEFAULT_REGISTRATION_DOMAIN_WHITELIST
		},
		"cas": true,
		"guest": false,
		"pro": false,
		"facebook": false,
		"twitter": false,
		"google": false
	},
	"error": {
		"errorReporting": {
			"gitlabLink": "https://git.thm.de/arsnova/cards/-/issues"
		}
	},
	"welcome": {
		"title": {
			"first": "THM",
			"last": "cards",
			"slogan_de": "ORGANIZE. LEARN. MEMORIZE!",
			"slogan_en": "ORGANIZE. LEARN. MEMORIZE!"
		},
		"button": {
			"about": {
				"default_de": "Einführung in die Lernkartei-Plattform der THM …",
				"default_en": "Erfahre mehr über 🍅cards …",
				"mobile_de": "Erfahre mehr über 🍅cards …",
				"mobile_en": "Erfahre mehr über 🍅cards…"
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
		"enabled": true
	},
	"help": {
		"style": "default",
		"markdeepFormatingCardsetID": "AWNnFnzM9rt7fpfZa"
	},
	"demo": {
		"folder": "informatik",
		"autoFullscreen": false,
		"exitOnFullscreenBackgroundClick": true,
		"fragJetzt": {
			"session": "46091468",
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
		"folder": "cards"
	},
	"roles": {
		"create": {
			"standard": false,
			"edu": true,
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
		"default": "arsnova", // The default theme from the list
		"list": [
			{
				"theme": "arsnova", // The color theme
				"backgrounds": "arsnova" // The background images found in ./backgrounds.js
			},
			{
				"theme": "linux", // The color theme
				"backgrounds": "linux" // The background images found in ./backgrounds.js
			},
			{
				"theme": "dark", // The color theme
				"backgrounds": "dark" // The background images found in ./backgrounds.js
			}

		] // The list available to the theme switcher dropdown menu
	},
	"landingPage": ""
};
