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
	"navigationFeatures": {
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
		"personal": {
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
		"transcript": {
			"personal": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
			},
			"bonus": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
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
	}
};

let debug = {
	"navigationFeatures": {
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
		"personal": {
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
		"transcript": {
			"personal": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
			},
			"bonus": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
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
		"folder": "informatik"
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
	"leitner": {
		"randomCardsSelection": false
	}
};

let linux = {
	"navigationFeatures": {
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
		"personal": {
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
		"transcript": {
			"personal": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
			},
			"bonus": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
			}
		}
	},
	"login": {
		"cas": true,
		"guest": true,
		"pro": false,
		"facebook": true,
		"twitter": true,
		"google": true
	},
	"welcome": {
		"title": {
			"first": "Linux",
			"last": "cards",
			"slogan_de": "Lernen für die LPI-Prüfungen",
			"slogan_en": "Learning for the LPI exams"
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
	}
};

let review = {
	"navigationFeatures": {
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
		"personal": {
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
		"transcript": {
			"personal": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
			},
			"bonus": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
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
	"leitner": {
		"randomCardsSelection": false
	}
};

let staging = {
	"navigationFeatures": {
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
		"personal": {
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
		"transcript": {
			"personal": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
			},
			"bonus": {
				"enabled": [FREE, EDU, PRO, LECTURER, GUEST],
				"filter": [FREE, EDU, PRO, LECTURER, GUEST],
				"search":  [FREE, EDU, PRO, LECTURER],
				"wordcloud": [FREE, EDU, PRO, LECTURER]
			}
		}
	},
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
	}
};

module.exports = {
	defaultSettings,
	linux,
	debug,
	review,
	staging
};
