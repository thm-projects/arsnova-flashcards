let footerNavigation = {
	"agb": "<i class='fa fa-legal'></i>&nbsp;",
	"backToHome": "<i class='fa fa-home'></i>&nbsp;",
	"datenschutz": "<i class='fa fa-lock'></i>&nbsp;",
	"demo": "<i class='fa fa-tv'></i>&nbsp;",
	"faq": "<i class='fa fa-question-circle'></i>&nbsp;",
	"help": "<i class='fa fa-medkit'></i>&nbsp;",
	"impressum": "<i class='fa fa-legal'></i>&nbsp;",
	"learning": "<i class='fa fa-graduation-cap'></i>&nbsp;",
	"statistics": "<i class='fa fa-folder-open'></i>&nbsp;"
};

let landingPageNavigation = {
	"mobileInfo": "<i class='glyphicon glyphicon-info-sign'></i>",
	"wordcloud": "<i class='fa fa-archive'></i>"
};

//Only used for the active route display on mobile. Will be carried over to desktop after the main template got refactored.
let topNavigation = {
	"workload": "<i class='fa fa-graduation-cap'></i>&nbsp;",
	"all": {
		"all": "<i class='fa fa-archive'></i>&nbsp;",
		"cardsets": "<i class='fa fa-archive'></i>&nbsp;",
		"repetitorien": "<span class='hidden-xs'><i class='fa fa-archive'></i>&nbsp;<i class='fa fa-archive'></i>&nbsp;<i class='fa fa-archive'></i>&nbsp;<i class='fa fa-ellipsis-h'></i>&nbsp;</span><span class='visible-xs'><i class='fa fa-archive'></i>&nbsp;<i class='fa fa-ellipsis-h'></i>&nbsp;</span>"
	},
	"public": {
		"public": "<i class='fa fa-archive'></i>&nbsp;",
		"cardsets": "<i class='fa fa-archive'></i>&nbsp;",
		"repetitorien": "<span class='hidden-xs'><i class='fa fa-archive'></i>&nbsp;<i class='fa fa-archive'></i>&nbsp;<i class='fa fa-archive'></i>&nbsp;<i class='fa fa-ellipsis-h'></i>&nbsp;</span><span class='visible-xs'><i class='fa fa-archive'></i>&nbsp;<i class='fa fa-ellipsis-h'></i>&nbsp;</span>"
	},
	"personal": {
		"personal": "<i class='fa fa-archive'></i>&nbsp;",
		"cardsets": "<i class='fa fa-archive'></i>&nbsp;",
		"repetitorien": "<span class='hidden-xs'><i class='fa fa-archive'></i>&nbsp;<i class='fa fa-archive'></i>&nbsp;<i class='fa fa-archive'></i>&nbsp;<i class='fa fa-ellipsis-h'></i>&nbsp;</span><span class='visible-xs'><i class='fa fa-archive'></i>&nbsp;<i class='fa fa-ellipsis-h'></i>&nbsp;</span>"
	},
	"profile": "<i class='fa fa-user'></i>&nbsp;",
	"profileOverview": "<i class='fa fa-trophy'></i>&nbsp;",
	"profileBilling": "<i class='fa fa-credit-card'></i>&nbsp;",
	"profileMembership": "<i class='fa fa-users'></i>&nbsp;",
	"profileNotifications": "<i class='fa fa-bell'></i>&nbsp;",
	"profileSettings": "<i class='fa fa-user'></i>&nbsp;",
	"profileRequests": "<i class='fa fa-check'></i>&nbsp;",
	"backend": "<i class='fa fa-server'></i>&nbsp;",
	"useCases": "<i class='fa fa-map-signs'></i>"
};

//Only used for the active route display on mobile. Will be carried over to desktop after the main template got refactored.
let miscNavigation = {
	"cardset": "<i class='fa fa-archive'></i>&nbsp;",
	"repetitorium": "<i class='fa fa-archive'></i>&nbsp;<i class='fa fa-ellipsis-h'></i>&nbsp;",
	"progress": "<i class='glyphicon glyphicon-stats'></i>&nbsp;",
	"toggleImpressum": "<i class='fa fa-medkit'></i>&nbsp;"
};

let aspectRatio = {
	"169": "<i class='fa fa-desktop'></i>&nbsp;",
	"1610": "<i class='fa fa-desktop'></i>&nbsp;",
	"43": "<i class='fa fa-desktop'></i>&nbsp;",
	"fill": "<i class='fa fa-arrows-alt'></i>&nbsp;",
	"din": "<i class='fa fa-id-card'></i>&nbsp;"
};

let useCasesIcons = {
	"workload": "<i class='fa fa-graduation-cap'></i>&nbsp;",
	"myCardsets": "<i class='fa fa-archive'></i>&nbsp;",
	"myRepositories": "<i class='fa fa-archive'></i>&nbsp;<i class='fa fa-ellipsis-h'></i>&nbsp;",
	"create": "<i class='fa fa-archive'></i>&nbsp;<i class='fa fa-plus'></i>&nbsp;",
	"search": "<i class='fa fa fa-search'></i>&nbsp;"
};

module.exports = {
	footerNavigation: footerNavigation,
	topNavigation: topNavigation,
	miscNavigation,
	landingPageNavigation,
	aspectRatio,
	useCasesIcons
};
