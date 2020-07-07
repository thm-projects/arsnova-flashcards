let footerNavigation = {
	"agb": "<i class='fas fa-gavel'></i>&nbsp;",
	"backToHome": "<i class='fas fa-home'></i>&nbsp;",
	"datenschutz": "<i class='fas fa-lock'></i>&nbsp;",
	"demo": "<i class='fas fa-desktop'></i>&nbsp;",
	"faq": "<i class='fas fa-question-circle'></i>&nbsp;",
	"help": "<i class='fas fa-medkit'></i>&nbsp;",
	"impressum": "<i class='fas fa-gavel'></i>&nbsp;",
	"learning": "<i class='fas fa-graduation-cap'></i>&nbsp;",
	"statistics": "<i class='fas fa-folder-open'></i>&nbsp;"
};

let landingPageNavigation = {
	"mobileInfo": "<i class='fas fa-info-circle'></i>",
	"wordcloud": "<i class='fas fa-cloud'></i>"
};

//Only used for the active route display on mobile. Will be carried over to desktop after the main template got refactored.
let topNavigation = {
	"workload": "<i class='fas fa-graduation-cap'></i>&nbsp;",
	"all": {
		"all": "<i class='fas fa-archive'></i>&nbsp;",
		"cardsets": "<i class='fas fa-archive'></i>&nbsp;",
		"repetitorien": "<span class='hidden-xs'><i class='fas fa-archive'></i>&nbsp;<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-ellipsis-h'></i>&nbsp;</span><span class='visible-xs'><i class='fas fa-archive'></i>&nbsp;<i class='fas fa-ellipsis-h'></i>&nbsp;</span>"
	},
	"public": {
		"public": "<i class='fas fa-folder-open'></i>&nbsp;",
		"cardsets": "<i class='fas fa-archive'></i>&nbsp;",
		"repetitorien": "<span class='hidden-xs'><i class='fas fa-archive'></i>&nbsp;<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-ellipsis-h'></i>&nbsp;</span><span class='visible-xs'><i class='fas fa-archive'></i>&nbsp;<i class='fas fa-ellipsis-h'></i>&nbsp;</span>"
	},
	"personal": {
		"personal": "<i class='fas fa-archive'></i>&nbsp;",
		"cardsets": "<i class='fas fa-archive'></i>&nbsp;",
		"repetitorien": "<span class='hidden-xs'><i class='fas fa-archive'></i>&nbsp;<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-ellipsis-h'></i>&nbsp;</span><span class='visible-xs'><i class='fas fa-archive'></i>&nbsp;<i class='fas fa-ellipsis-h'></i>&nbsp;</span>"

	},
	"transcripts": {
		"transcripts": "<i class='fas fa-clipboard'></i>&nbsp;",
		"personal": "<i class='fas fa-clipboard'></i>&nbsp;",
		"bonus": "<i class='fas fa-clipboard'></i>&nbsp;"
	},
	"profile": "<i class='fas fa-user'></i>&nbsp;",
	"profileOverview": "<i class='fas fa-trophy'></i>&nbsp;",
	"profileBilling": "<i class='fas fa-credit-card'></i>&nbsp;",
	"profileMembership": "<i class='fas fa-users'></i>&nbsp;",
	"profileNotifications": "<i class='fas fa-bell'></i>&nbsp;",
	"profileSettings": "<i class='fas fa-user'></i>&nbsp;",
	"profileRequests": "<i class='fas fa-check'></i>&nbsp;",
	"backend": "<i class='fas fa-server'></i>&nbsp;",
	"useCases": "<i class='fas fa-map-signs'></i>",
	"displayMode": {
		"wordcloud": "<i class='fas fa-cloud'></i>",
		"list": "<i class='fas fa-table'></i>"
	},
	"collapse": "<i class='fas fa-hamburger'></i>"
};

let labels = {
	"lecturerAuthorized": "<i class='fas fa-graduation-cap'></i>",
	"wordcloud": "<i class='fas fa-cloud'></i>"
};

//Only used for the active route display on mobile. Will be carried over to desktop after the main template got refactored.
let miscNavigation = {
	"cardset": "<i class='fas fa-archive'></i>&nbsp;",
	"repetitorium": "<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-ellipsis-h'></i>&nbsp;",
	"progress": "<i class='far fa-chart-bar'></i>&nbsp;",
	"toggleImpressum": "<i class='fas fa-medkit'></i>&nbsp;"
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
	"workload": "<i class='fas fa-graduation-cap'></i>&nbsp;",
	"myCardsets": "<i class='fas fa-archive'></i>&nbsp;",
	"myRepositories": "<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-ellipsis-h'></i>&nbsp;",
	"myTranscripts": "<i class='fas fa-clipboard'></i>&nbsp;",
	"create": "<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-plus'></i>&nbsp;",
	"search": "<i class='fa fas fa-search'></i>&nbsp;",
	"specialCardset": "<i class='fas fa-archive'></i>&nbsp;",
	"specialRepetitorium":  "<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-ellipsis-h'></i>&nbsp;"
};

let transcriptIcons = {
	"ratingPending": '<i class="transcript-rating-pending fas fa-hourglass" data-rating="0"></i>',
	"ratingAccepted": '<i class="transcript-rating-accepted fas fa-check-circle" data-rating="1"></i>',
	"ratingDenied": '<i class="transcript-rating-denied fas fa-times-circle" data-rating="2"></i>'
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
