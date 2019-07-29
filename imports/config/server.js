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
				"default_de": "Erfahre mehr in unserer interaktiven Einführung …",
				"default_en": "Erfahre mehr über 🍅cards …",
				"mobile_de": "Erfahre mehr in unserer interaktiven Einführung ……",
				"mobile_en": "Erfahre mehr über 🍅cards…"
			}
		}
	},
	"language": {
		"server": "de",
		"client": "de"
	},
	"backgrounds": "default",
	"transcripts": {
		"enabled": true
	},
	"demo": {
		"folder": "informatik"
	},
	"roles": {
		"create": {
			"standard": false,
			"edu": true,
			"pro": true,
			"lecturer": true
		}
	}
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
				"default_de": "Erfahre mehr in unserer interaktiven Einführung …",
				"default_en": "Learn more about 🍅cards in our interactive demo …",
				"mobile_de": "Erfahre mehr in unserer interaktiven Einführung …",
				"mobile_en": "Learn more about 🍅cards…"
			}
		}
	},
	"language": {
		"server": "de",
		"client": "de"
	},
	"backgrounds": "default",
	"transcripts": {
		"enabled": true
	},
	"demo": {
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
	"leitner": {
		"randomCardsSelection": false
	}
};

let linux = {
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
			"slogan_de": "Lernen für die LPIC-Prüfungen",
			"slogan_en": "Learning for the LPIC exams"
		},
		"button": {
			"about":  {
				"default_de": "Erfahre mehr in unserer interaktiven Einführung …",
				"default_en": "Learn more about 🍅cards in our interactive demo …",
				"mobile_de": "Erfahre mehr in unserer interaktiven Einführung …",
				"mobile_en": "Learn more about 🍅cards…"
			}
		}
	},
	"language": {
		"server": "de",
		"client": "de"
	},
	"backgrounds": "linux",
	"transcripts": {
		"enabled": false
	},
	"demo": {
		"folder": "linux"
	},
	"roles": {
		"create": {
			"standard": false,
			"edu": false,
			"pro": true,
			"lecturer": true
		}
	}
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
	"backgrounds": "default",
	"transcripts": {
		"enabled": true
	},
	"demo": {
		"folder": "informatik"
	},
	"roles": {
		"create": {
			"standard": false,
			"edu": true,
			"pro": true,
			"lecturer": true
		}
	},
	"leitner": {
		"randomCardsSelection": false
	}
};

let staging = {
	"login": {
		"cas": true,
		"guest": true,
		"pro": true,
		"facebook": true,
		"twitter": true,
		"google": true
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
		"server": "de",
		"client": "de"
	},
	"backgrounds": "default",
	"transcripts": {
		"enabled": true
	},
	"demo": {
		"folder": "informatik"
	},
	"roles": {
		"create": {
			"standard": false,
			"edu": true,
			"pro": true,
			"lecturer": true
		}
	}
};

module.exports = {
	defaultSettings,
	linux,
	debug,
	review,
	staging
};
