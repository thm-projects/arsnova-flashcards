let defaultSettings = {
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
			"first": "",
			"last": "cards",
			"slogan_de": "ORGANIZE. LEARN. MEMORIZE.",
			"slogan_en": "ORGANIZE. LEARN. MEMORIZE."
		},
		"button": {
			"about":  {
				"default_de": "Erfahre mehr in unserer interaktiven Demo …",
				"default_en": "Erfahre alles über 🍅cards …",
				"mobile_de": "Erfahre mehr in unserer interaktiven Demo ……",
				"mobile_en": "Erfahre mehr über 🍅cards…"
			}
		}
	},
	"language": {
		"server": "de",
		"client": "de"
	},
	"backgrounds": "default"
};

let debug = {
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
			"slogan_de": "ORGANIZE. LEARN. MEMORIZE.",
			"slogan_en": "ORGANIZE. LEARN. MEMORIZE."
		},
		"button": {
			"about":  {
				"default_de": "Erfahre mehr in unserer interaktiven Demo …",
				"default_en": "Learn more about 🍅cards in our interactive demo …",
				"mobile_de": "Erfahre mehr in unserer interaktiven Demo …",
				"mobile_en": "Learn more about 🍅cards…"
			}
		}
	},
	"language": {
		"server": "de",
		"client": "de"
	},
	"backgrounds": "default"
};

let linux = {
	"login": {
		"cas": true,
		"guest": false,
		"pro": false,
		"facebook": true,
		"twitter": true,
		"google": true
	},
	"welcome": {
		"title": {
			"first": "Linux",
			"last": "cards",
			"slogan_de": "Lernen für die LPIC-Prüfungen",
			"slogan_en": "Learning for the LPIC exams"
		},
		"button": {
			"about":  {
				"default_de": "Erfahre mehr in unserer interaktiven Demo …",
				"default_en": "Learn more about 🍅cards in our interactive demo …",
				"mobile_de": "Erfahre mehr in unserer interaktiven Demo …",
				"mobile_en": "Learn more about 🍅cards…"
			}
		}
	},
	"language": {
		"server": "de",
		"client": "de"
	},
	"backgrounds": "linux"
};

let review = {
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
			"slogan_de": "ORGANIZE. LEARN. MEMORIZE.",
			"slogan_en": "ORGANIZE. LEARN. MEMORIZE."
		},
		"button": {
			"about":  {
				"default_de": "Erfahre mehr in unserer interaktiven Demo …",
				"default_en": "Learn more about 🍅cards in our interactive demo …",
				"mobile_de": "Erfahre mehr in unserer interaktiven Demo …",
				"mobile_en": "Learn more about 🍅cards…"
			}
		}
	},
	"language": {
		"server": "de",
		"client": "de"
	},
	"backgrounds": "default"
};

let staging = {
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
			"slogan_de": "ORGANIZE. LEARN. MEMORIZE.",
			"slogan_en": "ORGANIZE. LEARN. MEMORIZE."
		},
		"button": {
			"about":  {
				"default_de": "Erfahre mehr in unserer interaktiven Demo …",
				"default_en": "Learn more about 🍅cards in our interactive demo …",
				"mobile_de": "Erfahre mehr in unserer interaktiven Demo …",
				"mobile_en": "Learn more about 🍅cards…"
			}
		}
	},
	"language": {
		"server": "en",
		"client": "en"
	},
	"backgrounds": "default"
};

module.exports = {
	defaultSettings,
	linux,
	debug,
	review,
	staging
};
