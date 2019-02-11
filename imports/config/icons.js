let impressumNavigation = {
	agb: "<i class='fa fa-legal'></i>&nbsp;",
	backToHome: "<i class='fa fa-home'></i>&nbsp;",
	datenschutz: "<i class='fa fa-lock'></i>&nbsp;",
	demo: "<i class='fa fa-tv'></i>&nbsp;",
	faq: "<i class='fa fa-question-circle'></i>&nbsp;",
	help: "<i class='fa fa-medkit'></i>&nbsp;",
	impressum: "<i class='fa fa-legal'></i>&nbsp;",
	learning: "<i class='fa fa-graduation-cap'></i>&nbsp;",
	statistics: "<i class='fa fa-server'></i>&nbsp;"
};

let landingPageNavigation = {
	mobileInfo: "<i class='glyphicon glyphicon-info-sign'></i>"
};

//Only used for the active route display on mobile. Will be carried over to desktop after the main template got refactored.
let mainNavigation = {
	alldecks: "<i class='fa fa-archive'></i>&nbsp;<i class='fa fa-ellipsis-h'></i>&nbsp;",
	repetitorium: "<i class='fa fa-archive'></i>&nbsp;<i class='fa fa-ellipsis-h'></i>&nbsp;",
	learn: "<i class='fa fa-graduation-cap'></i>&nbsp;",
	pool: "<i class='fa fa-archive'></i>&nbsp;",
	profileOverview: "<i class='fa fa-trophy'></i>&nbsp;",
	profileBilling: "<i class='fa credit-card'></i>&nbsp;",
	profileMembership: "<i class='fa fa-users'></i>&nbsp;",
	profileNotifications: "<i class='fa fa-bell'></i>&nbsp;",
	profileSettings: "<i class='fa fa-user'></i>&nbsp;",
	profileRequests: "<i class='fa fa-check'></i>&nbsp;"
};

//Only used for the active route display on mobile. Will be carried over to desktop after the main template got refactored.
let miscNavigation = {
	cardset: "<i class='fa fa-fa-archive'></i>&nbsp;",
	repetitorium: "<i class='fa fa-archive'></i>&nbsp;<i class='fa fa-ellipsis-h'></i>&nbsp;",
	progress: "<i class='glyphicon glyphicon-stats'></i>&nbsp;",
	toggleImpressum: "<i class='fa fa-medkit'></i>&nbsp;"
};

module.exports = {
	impressumNavigation,
	mainNavigation,
	miscNavigation,
	landingPageNavigation
};
