let games = [// Object order will be used for the dropdown-menu
	{
		"id": 1,// The id located in the public folder: gameID
		"name": {// The name of the game
			"de": "Bleibe in der Luft",
			"en": "Stay in the air"
		},
		"clockPosition": "top_right",//position of the clock if not top_right, can be following (top|bottom)_(right|left)
		"background": "#212529",//Background-color if not default background color
		"preview": "preview.png",//The path to preview image after /games/game${id}/, if not /games/game${id}/preview.png
		"features": {
			"safari": true,// Enable for safari
			"mobile": true// Enable on mobile
		},
		"maxWidth": {// Optional values, games only
			"desktop": 700,// Desktop size is a window width  >= 768 pixels (Bootstrap 3 xs breakpoint)
			"mobile": {// Mobile size is a window width  < 768 pixels (Bootstrap 3 xs breakpoint)
				"portrait": 500,
				"landscape": 400
			}
		},
		"maxHeight": {// Optional values, games only
			"desktop": 700,// Desktop size is a window height
			"mobile": {// Mobile size is a window height
				"portrait": 500,
				"landscape": 400
			}
		}
	},
	{
		"id": 2,
		"name": {
			"de": "Tic-Tac-Toe",
			"en": "Tic-Tac-Toe"
		},
		"background": "white",
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 3,
		"name": {
			"de": "Tangram Memory",
			"en": "Tangram Memory"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 4,
		"name": {
			"de": "Jahrmarkt-Automat",
			"en": "Fairground vending machine"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 5,
		"name": {
			"de": "Stoppe das Spiel",
			"en": "Stop the game"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 6,
		"name": {
			"de": "Magischer Donut",
			"en": "Magic donut"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 7,
		"name": {
			"de": "Wackelnde Fahne",
			"en": "Wobbling flag"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 8,
		"name": {
			"de": "Memory",
			"en": "Memory"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 9,
		"name": {
			"de": "Zombies",
			"en": "Zombies"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 10,
		"name": {
			"de": "Vier gewinnt",
			"en": "Connect Four"
		},
		"background": "white",
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 11,
		"name": {
			"de": "Blutgruppen",
			"en": "Blood groups"
		},
		"clockPosition": "top_left",
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 12,
		"name": {
			"de": "Fang ein Fisch",
			"en": "Catch a fish"
		},
		"clockPosition": "top_left",
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 13,
		"name": {
			"de": "Homer and Donuts",
			"en": "Homer and Donuts"
		},
		"clockPosition": "top_left",
		"features": {
			"safari": true,
			"mobile": true
		}
	}
];

let backgrounds = [// Object order will be used for the dropdown-menu
	{
		"id": 1,// The id located in the public folder: backgroundID
		"name": {// The name of the background
			"de": "Matrix",
			"en": "Matrix"
		},
		"clockPosition": "top_right",//position of the clock if not top_right, can be following (top|bottom)_(right|left)
		"preview": "preview.png",//The path to preview image after /gameBackgrounds/background${id}/, if not /gameBackgrounds/background${id}/preview.png
		"features": {
			"safari": true,// Enable for safari
			"mobile": true// Enable on mobile
		}
	},
	{
		"id": 2,
		"name": {
			"de": "Nachthimmel",
			"en": "Night sky"
		},
		"background": "white",//Background-color if not default background color
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 3,
		"name": {
			"de": "Schneelandschaft",
			"en": "Snow landscape"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 4,
		"name": {
			"de": "Kaffeepause",
			"en": "Coffee break"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 5,
		"name": {
			"de": "Gefärbter Vorhang",
			"en": "Colored curtain"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 6,
		"name": {
			"de": "Eingerollter Igel",
			"en": "Curled hedgehog"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 7,
		"name": {
			"de": "Regenbogenteddy",
			"en": "Rainbow teddy"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 8,
		"name": {
			"de": "Frühlingswetter",
			"en": "Spring weather"
		},
		"clockPosition": "top_left",
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 9,
		"name": {
			"de": "Wassergitter",
			"en": "Water grid"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 10,
		"name": {
			"de": "Neumond",
			"en": "New Moon"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 11,
		"name": {
			"de": "Ozean",
			"en": "Ocean"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 12,
		"name": {
			"de": "Keine Sorgen",
			"en": "Dont worry"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 13,
		"name": {
			"de": "Punktspirale",
			"en": "Dot spiral"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 14,
		"name": {
			"de": "Frontend",
			"en": "Frontend"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 15,
		"name": {
			"de": "Es ist nur Licht",
			"en": "It is only light"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 16,
		"name": {
			"de": "Mandala Würfel",
			"en": "Mandala cube"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 17,
		"name": {
			"de": "Zerschnittene Bilder",
			"en": "Cut up images"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 18,
		"name": {
			"de": "Homeoffice",
			"en": "Homeoffice"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 19,
		"name": {
			"de": "Unendliche Schlange",
			"en": "Infinite snake"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 20,
		"name": {
			"de": "Macintosh",
			"en": "Macintosh"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 21,
		"name": {
			"de": "Bleibe ruhig",
			"en": "Keep calm"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	},
	{
		"id": 22,
		"name": {
			"de": "Magische Farben",
			"en": "Magic Colours"
		},
		"features": {
			"safari": true,
			"mobile": true
		}
	}
];

module.exports = {
	backgrounds,
	games,
	"defaultBackground": 4
};
