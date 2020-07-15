//navigation Features
// 0 standard
// 1 edu
// 2 pro
// 3 lecturer
// 4 guest - Only works for public views
const FREE = 0;
const EDU = 1;
const PRO = 2;
const LECTURER = 3;
const GUEST = 4;

let defaultSettings = {
	"navigationFeatures": { //Excludes Super Admins (Backend) and Editors (Frontend)
		"simplifiedNav": true, // Removes dropdowns and groups content together
		"useCases": { //Will be only visible if the related navigation item is enabled
			"misc": {
				"create": [FREE, EDU, PRO, LECTURER],
				"workload":	[FREE, EDU, PRO, LECTURER],
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
				"search":  [FREE, EDU, PRO, LECTURER, GUEST],
				"wordcloud": [FREE, EDU, PRO, LECTURER, GUEST]
			},
			"repetitorium": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER, GUEST],
				"wordcloud": [FREE, EDU, PRO, LECTURER, GUEST]
			}
		},
		"personal": { // Excludes GUEST, requires 'roles.create' permission
			"cardset": {
				"enabled": [FREE, EDU, PRO, LECTURER],
				"filter": [FREE, EDU, PRO, LECTURER],
				"search":  [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
			},
			"repetitorium": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER],
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
		"cas": true,
		"guest": false,
		"pro": false,
		"facebook": false,
		"twitter": false,
		"google": false
	},
	"welcome": {
		"title": {
			"first": "THM",
			"last": "cards",
			"slogan_de": "ORGANIZE. LEARN. MEMORIZE!",
			"slogan_en": "ORGANIZE. LEARN. MEMORIZE!"
		},
		"button": {
			"about":  {
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
			"session": "61625449",
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
		"defaultID": 0, // The default theme id from the list
		"list": [
			{
				"theme": "arsnova", // The color theme
				"backgrounds": "arsnova" // The background images found in ./backgrounds.js
			}
		] // The list available to the theme switcher dropdown menu
	}
};

let debug = {
	"navigationFeatures": { //Excludes Super Admins (Backend) and Editors (Frontend)
		"simplifiedNav": true, // Removes dropdowns and groups content together
		"useCases": { //Will be only visible if the related navigation item is enabled
			"misc": {
				"create": [FREE, EDU, PRO, LECTURER],
				"workload":	[FREE, EDU, PRO, LECTURER],
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
				"search":  [FREE, EDU, PRO, LECTURER, GUEST],
				"wordcloud": [FREE, EDU, PRO, LECTURER, GUEST]
			},
			"repetitorium": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER, GUEST],
				"wordcloud": [FREE, EDU, PRO, LECTURER, GUEST]
			}
		},
		"personal": { // Excludes GUEST, requires 'roles.create' permission
			"cardset": {
				"enabled": [FREE, EDU, PRO, LECTURER],
				"filter": [FREE, EDU, PRO, LECTURER],
				"search":  [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
			},
			"repetitorium": {
				"enabled": [FREE, EDU, PRO, LECTURER],
				"filter": [FREE, EDU, PRO, LECTURER],
				"search":  [FREE, EDU, PRO, LECTURER],
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
		"cas": false,
		"guest": true,
		"pro": true,
		"facebook": false,
		"twitter": false,
		"google": false
	},
	"welcome": {
		"title": {
			"first": "debug",
			"last": "cards",
			"slogan_de": "ORGANIZE. LEARN. MEMORIZE!",
			"slogan_en": "ORGANIZE. LEARN. MEMORIZE!"
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
		"enabled": true
	},
	"help": {
		"style": "linux",
		"markdeepFormatingCardsetID": ""
	},
	"demo": {
		"folder": "informatik",
		"autoFullscreen": false,
		"exitOnFullscreenBackgroundClick": true,
		"fragJetzt": {
			"session": "61625449",
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
		"defaultID": 0, // The default theme id from the list
		"list": [
			{
				"theme": "arsnova", // The color theme
				"backgrounds": "arsnova" // The background images found in ./backgrounds.js
			}
		] // The list available to the theme switcher dropdown menu
	}
};

let linux = {
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
		"cas": true,
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
			"session": "17162382",
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
	}
};

let review = {
	"navigationFeatures": { //Excludes Super Admins (Backend) and Editors (Frontend)
		"simplifiedNav": true, // Removes dropdowns and groups content together
		"useCases": { //Will be only visible if the related navigation item is enabled
			"misc": {
				"create": [FREE, EDU, PRO, LECTURER],
				"workload":	[FREE, EDU, PRO, LECTURER],
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
				"search":  [FREE, EDU, PRO, LECTURER, GUEST],
				"wordcloud": [FREE, EDU, PRO, LECTURER, GUEST]
			},
			"repetitorium": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER, GUEST],
				"wordcloud": [FREE, EDU, PRO, LECTURER, GUEST]
			}
		},
		"personal": { // Excludes GUEST, requires 'roles.create' permission
			"cardset": {
				"enabled": [FREE, EDU, PRO, LECTURER],
				"filter": [FREE, EDU, PRO, LECTURER],
				"search":  [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
			},
			"repetitorium": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER],
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
		"cas": true,
		"guest": true,
		"pro": false,
		"facebook": false,
		"twitter": false,
		"google": false
	},
	"welcome": {
		"title": {
			"first": "review",
			"last": "cards",
			"slogan_de": "ORGANIZE. LEARN. MEMORIZE!",
			"slogan_en": "ORGANIZE. LEARN. MEMORIZE!"
		},
		"button": {
			"about":  {
				"default_de": "Erfahre mehr in unserer interaktiven Demo …",
				"default_en": "Learn more about 🍅cards in our interactive demo …",
				"mobile_de": "Erfahre mehr in unserer interaktiven Demo …",
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
		"enabled": true
	},
	"help": {
		"style": "default",
		"markdeepFormatingCardsetID": ""
	},
	"demo": {
		"folder": "informatik",
		"autoFullscreen": false,
		"exitOnFullscreenBackgroundClick": true,
		"fragJetzt": {
			"session": "61625449",
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
		"defaultID": 0, // The default theme id from the list
		"list": [
			{
				"theme": "arsnova", // The color theme
				"backgrounds": "arsnova" // The background images found in ./backgrounds.js
			}
		] // The list available to the theme switcher dropdown menu
	}
};

let staging = {
	"navigationFeatures": { //Excludes Super Admins (Backend) and Editors (Frontend)
		"simplifiedNav": true, // Removes dropdowns and groups content together
		"useCases": { //Will be only visible if the related navigation item is enabled
			"misc": {
				"create": [FREE, EDU, PRO, LECTURER],
				"workload":	[FREE, EDU, PRO, LECTURER],
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
				"search":  [FREE, EDU, PRO, LECTURER, GUEST],
				"wordcloud": [FREE, EDU, PRO, LECTURER, GUEST]
			},
			"repetitorium": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER, GUEST],
				"wordcloud": [FREE, EDU, PRO, LECTURER, GUEST]
			}
		},
		"personal": { // Excludes GUEST, requires 'roles.create' permission
			"cardset": {
				"enabled": [FREE, EDU, PRO, LECTURER],
				"filter": [FREE, EDU, PRO, LECTURER],
				"search":  [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
			},
			"repetitorium": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER],
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
		"cas": true,
		"guest": true,
		"pro": false,
		"facebook": false,
		"twitter": false,
		"google": false
	},
	"welcome": {
		"title": {
			"first": "staging",
			"last": "cards",
			"slogan_de": "ORGANIZE. LEARN. MEMORIZE!",
			"slogan_en": "ORGANIZE. LEARN. MEMORIZE!"
		},
		"button": {
			"about":  {
				"default_de": "Erfahre mehr in unserer interaktiven Demo …",
				"default_en": "Learn more about 🍅cards in our interactive demo …",
				"mobile_de": "Erfahre mehr in unserer interaktiven Demo …",
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
		"enabled": true
	},
	"help": {
		"style": "default",
		"markdeepFormatingCardsetID": ""
	},
	"demo": {
		"folder": "informatik",
		"autoFullscreen": false,
		"exitOnFullscreenBackgroundClick": true,
		"fragJetzt": {
			"session": "61625449",
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
		"defaultID": 0, // The default theme id from the list
		"list": [
			{
				"theme": "arsnova", // The color theme
				"backgrounds": "arsnova" // The background images found in ./backgrounds.js
			}
		] // The list available to the theme switcher dropdown menu
	}
};

module.exports = {
	defaultSettings,
	linux,
	debug,
	review,
	staging
};
