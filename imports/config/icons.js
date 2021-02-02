let footerNavigation = {
	"agb": "<span class='fas fa-gavel'></span>&nbsp;",
	"backToHome": "<span class='fas fa-home'></span>&nbsp;",
	"datenschutz": "<span class='fas fa-lock'></span>&nbsp;",
	"demo": "<span class='fas fa-desktop'></span>&nbsp;",
	"faq": "<span class='fas fa-question-circle'></span>&nbsp;",
	"help": "<span class='fas fa-medkit'></span>&nbsp;",
	"impressum": "<span class='fas fa-gavel'></span>&nbsp;",
	"learning": "<span class='fas fa-graduation-cap'></span>&nbsp;",
	"statistics": "<span class='fas fa-archive'></span>&nbsp;"
};

let landingPageNavigation = {
	"mobileInfo": "<span class='fas fa-info-circle'></span>",
	"wordcloud": "<span class='fas fa-cloud'></span>"
};

//Only used for the active route display on mobile. Will be carried over to desktop after the main template got refactored.
let topNavigation = {
	"workload": "<span class='fas fa-graduation-cap'></span>&nbsp;",
	"all": {
		"all": "<span class='fas fa-archive'></span>&nbsp;",
		"cardsets": "<span class='fas fa-archive'></span>&nbsp;",
		"repetitorien": "<span class='hidden-xs'><span class='fas fa-archive'></span>&nbsp;<span class='fas fa-archive'></span>&nbsp;<span class='fas fa-archive'></span>&nbsp;<span class='fas fa-ellipsis-h'></span>&nbsp;</span><span class='visible-xs'><span class='fas fa-archive'></span>&nbsp;<span class='fas fa-ellipsis-h'></span>&nbsp;</span>"
	},
	"public": {
		"public": "<span class='fas fa-archive'></span>&nbsp;",
		"cardsets": "<span class='fas fa-archive'></span>&nbsp;",
		"repetitorien": "<span class='hidden-xs'><span class='fas fa-archive'></span>&nbsp;<span class='fas fa-archive'></span>&nbsp;<span class='fas fa-archive'></span>&nbsp;<span class='fas fa-ellipsis-h'></span>&nbsp;</span><span class='visible-xs'><span class='fas fa-archive'></span>&nbsp;<span class='fas fa-ellipsis-h'></span>&nbsp;</span>"
	},
	"personal": {
		"personal": "<span class='fas fa-archive'></span>&nbsp;",
		"cardsets": "<span class='fas fa-archive'></span>&nbsp;",
		"repetitorien": "<span class='hidden-xs'><span class='fas fa-archive'></span>&nbsp;<span class='fas fa-archive'></span>&nbsp;<span class='fas fa-archive'></span>&nbsp;<span class='fas fa-ellipsis-h'></span>&nbsp;</span><span class='visible-xs'><span class='fas fa-archive'></span>&nbsp;<span class='fas fa-ellipsis-h'></span>&nbsp;</span>"

	},
	"transcripts": {
		"transcripts": "<span class='fas fa-clipboard'></span>&nbsp;",
		"personal": "<span class='fas fa-clipboard'></span>&nbsp;",
		"bonus": "<span class='fas fa-clipboard'></span>&nbsp;"
	},
	"profile": "<span class='fas fa-user'></span>&nbsp;",
	"profileOverview": "<span class='fas fa-trophy'></span>&nbsp;",
	"profileBilling": "<span class='fas fa-credit-card'></span>&nbsp;",
	"profileMembership": "<span class='fas fa-users'></span>&nbsp;",
	"profileNotifications": "<span class='fas fa-bell'></span>&nbsp;",
	"profileSettings": "<span class='fas fa-user'></span>&nbsp;",
	"profileRequests": "<span class='fas fa-check'></span>&nbsp;",
	"backend": "<span class='fas fa-server'></span>&nbsp;",
	"useCases": "<span class='fas fa-map-signs'></span>",
	"displayMode": {
		"wordcloud": "<span class='fas fa-cloud'></span>",
		"list": "<span class='fas fa-table'></span>"
	},
	"collapse": "<span class='fas fa-hamburger'></span>",
	"news": "<span class='fas fa-bell'></span>&nbsp;"
};

let labels = {
	"lecturerAuthorized": "<span class='fas fa-graduation-cap'></span>",
	"wordcloud": "<span class='fas fa-cloud'></span>"
};

//Only used for the active route display on mobile. Will be carried over to desktop after the main template got refactored.
let miscNavigation = {
	"cardset": "<span class='fas fa-archive'></span>&nbsp;",
	"repetitorium": "<span class='fas fa-archive'></span>&nbsp;<span class='fas fa-archive'></span>&nbsp;<span class='fas fa-archive'></span>&nbsp;<span class='fas fa-ellipsis-h'></span>&nbsp;",
	"progress": "<span class='far fa-chart-bar'></span>&nbsp;",
	"toggleImpressum": "<span class='fas fa-medkit'></span>&nbsp;"
};

let aspectRatio = {
	"53": "fas fa-id-card",
	"169": "fas fa-desktop",
	"1610": "fas fa-desktop",
	"43": "fas fa-desktop",
	"fill": "fas fa-arrows-alt",
	"din": "fas fa-id-card"
};

let useCasesIcons = {
	"workload": "<span class='fas fa-graduation-cap'></span>&nbsp;",
	"myCardsets": "<span class='fas fa-archive'></span>&nbsp;",
	"myRepositories": "<span class='fas fa-archive'></span>&nbsp;<span class='fas fa-archive'></span>&nbsp;<span class='fas fa-archive'></span>&nbsp;<span class='fas fa-ellipsis-h'></span>&nbsp;",
	"myTranscripts": "<span class='fas fa-clipboard'></span>&nbsp;",
	"create": "<span class='fas fa-archive'></span>&nbsp;<span class='fas fa-plus'></span>&nbsp;",
	"search": "<span class='fa fas fa-search'></span>&nbsp;",
	"specialCardset": "<span class='fas fa-archive'></span>&nbsp;",
	"specialRepetitorium":  "<span class='fas fa-archive'></span>&nbsp;<span class='fas fa-archive'></span>&nbsp;<span class='fas fa-archive'></span>&nbsp;<span class='fas fa-ellipsis-h'></span>&nbsp;"
};

let transcriptIcons = {
	"ratingPending": '<span class="transcript-rating-pending fas fa-hourglass" data-rating="0"></span>',
	"ratingAccepted": '<span class="transcript-rating-accepted fas fa-check-circle" data-rating="1"></span>',
	"ratingDenied": '<span class="transcript-rating-denied fas fa-times-circle" data-rating="2"></span>'
};

module.exports = {
	footerNavigation: footerNavigation,
	topNavigation: topNavigation,
	miscNavigation,
	landingPageNavigation,
	aspectRatio,
	useCasesIcons,
	labels,
	transcriptIcons
};
