let defaultSettings = {
	"login": {
		"legacyMode": {
			"enabled": false,
			"facebook": true,
			"twitter": true,
			"google": true
		},
		"cas": true,
		"guest": false,
		"pro": false
	},
	"welcome": {
		"title": {
			"first": "informatik",
			"last": "cards",
			"slogan": "ORGANIZE. LEARN. MEMORIZE."
		}
	},
	"backgrounds": "default"
};

let debug = {
	"login": {
		"legacyMode": {
			"enabled": false,
			"facebook": true,
			"twitter": true,
			"google": true
		},
		"cas": true,
		"guest": true,
		"pro": true
	},
	"welcome": {
		"title": {
			"first": "debug",
			"last": "cards",
			"slogan": "ORGANIZE. LEARN. MEMORIZE."
		}
	},
	"backgrounds": "default"
};

let informatik = {
	"login": {
		"legacyMode": {
			"enabled": false,
			"facebook": true,
			"twitter": true,
			"google": true
		},
		"cas": true,
		"guest": true,
		"pro": false
	},
	"welcome": {
		"title": {
			"first": "informatik",
			"last": "cards",
			"slogan": "ORGANIZE. LEARN. MEMORIZE."
		}
	},
	"backgrounds": "default"
};

let linux = {
	"login": {
		"legacyMode": {
			"enabled": false,
			"facebook": true,
			"twitter": true,
			"google": true
		},
		"cas": true,
		"guest": true,
		"pro": false
	},
	"welcome": {
		"title": {
			"first": "Linux",
			"last": "cards",
			"slogan": "Lernen für die LPIC-Prüfungen"
		}
	},
	"backgrounds": "linux"
};

let review = {
	"login": {
		"legacyMode": {
			"enabled": false,
			"facebook": true,
			"twitter": true,
			"google": true
		},
		"cas": false,
		"guest": false,
		"pro": false
	},
	"welcome": {
		"title": {
			"first": "review",
			"last": "cards",
			"slogan": "ORGANIZE. LEARN. MEMORIZE."
		}
	},
	"backgrounds": "default"
};

let staging = {
	"login": {
		"legacyMode": {
			"enabled": false,
			"facebook": true,
			"twitter": true,
			"google": true
		},
		"cas": true,
		"guest": true,
		"pro": true
	},
	"welcome": {
		"title": {
			"first": "staging",
			"last": "cards",
			"slogan": "ORGANIZE. LEARN. MEMORIZE."
		}
	},
	"backgrounds": "default"
};

module.exports = {
	defaultSettings,
	informatik,
	linux,
	debug,
	review,
	staging
};
