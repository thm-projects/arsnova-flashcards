import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../api/cardsets.js";
import {Cards} from "../../api/cards.js";
import {CollegesCourses} from "../../api/colleges_courses.js";
import {Workload} from "../../api/learned.js";
import {Session} from "meteor/session";
import {MeteorMathJax} from 'meteor/mrt:mathjax';
import {CardType} from "../../api/cardTypes";
import DOMPurify from 'dompurify';
import {DOMPurifyConfig} from "../../config/dompurify.js";
import {getAuthorName} from "../../api/userdata";
import {Route} from "../../api/route";
import {UserPermissions} from "../../api/permissions";
import {Bonus} from "../../api/bonus";
import {Profile} from "../../api/profile";
import {BonusForm} from "../../api/bonusForm";
import {MarkdeepContent} from "../../api/markdeep";
import {NavigatorCheck} from "../../api/navigatorCheck";
import {isNewCardset} from "../../ui/forms/cardsetForm";
import {ServerStyle} from "../../api/styles.js";
import {ServerInventoryTools} from "../../api/serverInventoryTools.js";
import {CardVisuals} from "../../api/cardVisuals";
import {AspectRatio} from "../../api/aspectRatio";
import {CardNavigation} from "../../api/cardNavigation";
import {Icons} from "../../api/icons";
import {FilterNavigation} from "../../api/filterNavigation";
import  * as FilterConfig from "../../config/filter.js";
import {MainNavigation} from "../../api/mainNavigation";
import {BarfyStarsConfig} from "../../api/barfyStars.js";
import {Utilities} from "../../api/utilities";
import {TranscriptBonus} from "../../api/transcriptBonus";

Meteor.subscribe("collegesCourses");

Template.registerHelper('isRepetitorium', function () {
	if (isNewCardset()) {
		return Route.isRepetitorienFilterIndex();
	} else {
		if (Session.get('activeCardset') !== undefined) {
			return Session.get('activeCardset').shuffled;
		}
	}
});

Template.registerHelper('isCardset', function () {
	return Route.isCardset();
});

Template.registerHelper('isWorkloadRoute', function () {
	return Route.isWorkload();
});


Template.registerHelper('gotTranscriptsEnabled', function () {
	return ServerStyle.gotTranscriptsEnabled();
});

Template.registerHelper('isTranscriptRoute', function () {
	return Route.isTranscript();
});

Template.registerHelper('isPresentation', function () {
	return Route.isPresentation();
});

Template.registerHelper('isMakingOf', function () {
	return Route.isMakingOf();
});

Template.registerHelper('isDemo', function () {
	return Route.isDemo();
});

Template.registerHelper('isEditMode', function () {
	return Route.isEditMode();
});

Template.registerHelper('isBox', function () {
	return Route.isBox();
});

Template.registerHelper('isMemo', function () {
	return Route.isMemo();
});


Template.registerHelper('gotResetButton', function () {
	return FilterNavigation.gotResetButton(FilterNavigation.getRouteId());
});

Template.registerHelper('gotDisplayModeButton', function () {
	return FilterNavigation.gotDisplayModeButton(FilterNavigation.getRouteId());
});

Template.registerHelper('gotSortButton', function () {
	return FilterNavigation.gotSortButton(FilterNavigation.getRouteId());
});

Template.registerHelper('gotAuthorFilter', function () {
	return FilterNavigation.gotAuthorFilter(FilterNavigation.getRouteId());
});

Template.registerHelper('gotCardTypeFilter', function () {
	return FilterNavigation.gotCardTypeFilter(FilterNavigation.getRouteId());
});

Template.registerHelper('gotDifficultyFilter', function () {
	return FilterNavigation.gotDifficultyFilter(FilterNavigation.getRouteId());
});

Template.registerHelper('gotBonusFilter', function () {
	return FilterNavigation.gotBonusFilter(FilterNavigation.getRouteId());
});

Template.registerHelper('gotWordcloudFilter', function () {
	return FilterNavigation.gotWordCloudFilter(FilterNavigation.getRouteId());
});

Template.registerHelper('gotLecturerAuthorizedFilter', function () {
	return FilterNavigation.gotLecturerAuthorizedFilter(FilterNavigation.getRouteId());
});

Template.registerHelper('gotKindFilter', function () {
	return FilterNavigation.gotKindFilter(FilterNavigation.getRouteId());
});

Template.registerHelper('isFilterIndex', function () {
	return Route.isFilterIndex();
});

Template.registerHelper('isFixedSidebar', function () {
	return CardVisuals.isFixedSidebar();
});

Template.registerHelper('isMobileView', function () {
	return CardNavigation.isMobileView();
});

Template.registerHelper('isFirstTimeVisitNavigation', function () {
	return (Route.isFirstTimeVisit() && (Route.isHome() || Route.isDemo() || Route.isMakingOf()));
});

Template.registerHelper('isSelectingCardsetToLearn', function () {
	return Session.get("selectingCardsetToLearn");
});

Template.registerHelper('getFirstAppTitle', function () {
	return ServerStyle.getFirstAppTitle();
});

Template.registerHelper('getLastAppTitle', function () {
	return ServerStyle.getLastAppTitle();
});

Template.registerHelper('getAppSlogan', function () {
	return ServerStyle.getAppSlogan();
});

Template.registerHelper('getBarfyStarsConfig', function (type = "default") {
	return JSON.stringify(BarfyStarsConfig.getConfig(type));
});

Template.registerHelper('getBarfyStarsStyle', function (type = "default") {
	return BarfyStarsConfig.getStyle(type);
});

Template.registerHelper('getAboutButton', function (isMobile = false) {
	return ServerStyle.getAboutButton(isMobile);
});

Template.registerHelper('isInBonus', function () {
	return Bonus.isInBonus(Router.current().params._id, Meteor.userId());
});

Template.registerHelper('isImpressum', function () {
	return Route.isImpressum();
});

Template.registerHelper('gotAspectRatio', function () {
	return AspectRatio.isEnabled();
});

Template.registerHelper('isInBonusAndNotOwner', function () {
	return Bonus.isInBonus(Router.current().params._id) && (!UserPermissions.isOwner(Cardsets.findOne({_id: Router.current().params._id}).owner) && !UserPermissions.isAdmin());
});

Template.registerHelper('gotFeatureSupport', function (feature) {
	return NavigatorCheck.gotFeatureSupport(feature);
});

Template.registerHelper('getNavigationName', function (name = undefined) {
	if (name === undefined) {
		return Route.getNavigationName(Router.current().route.getName());
	} else {
		return Route.getNavigationName(name);
	}
});

Template.registerHelper('isPublicRoute', function () {
	return Route.isPublic();
});

Template.registerHelper('isPersonalRoute', function () {
	return Route.isPersonal();
});

Template.registerHelper('isAllRoute', function () {
	return Route.isAll();
});


Template.registerHelper('isFilterIndexRoute', function () {
	return Route.isFilterIndex();
});

Template.registerHelper('isAllRepetitorienRoute', function () {
	return Route.isAllRepetitorien();
});

Template.registerHelper('isMyCardsetsRoute', function () {
	return Route.isMyCardsets();
});

Template.registerHelper('isMyTranscriptsRoute', function () {
	return Route.isMyTranscripts();
});

Template.registerHelper('isMyBonusTranscriptsRoute', function () {
	return Route.isMyBonusTranscripts();
});


Template.registerHelper('isBonusTranscriptsRoute', function () {
	return Route.isMyBonusTranscripts() || Route.isTranscriptBonus();
});

Template.registerHelper('isPersonalTranscriptsRoute', function () {
	return Route.isMyTranscripts() || Route.isMyBonusTranscripts();
});

Template.registerHelper('isPersonalRepetitorienRoute', function () {
	return Route.isPersonalRepetitorien();
});

Template.registerHelper('isRepetitorienFilterIndex', function () {
	return Route.isRepetitorienFilterIndex();
});

Template.registerHelper('isRepetitorienFilterIndexOrShuffle', function () {
	if (Route.isCardset()) {
		return this.shuffled;
	}
	return Route.isRepetitorienFilterIndex() || Route.isShuffle() || Route.isEditShuffle();
});

Template.registerHelper('isNotPublicItemView', function () {
	return Route.isAllCardsets() || Route.isAllRepetitorien() || Route.isPersonalRepetitorien() || Route.isMyCardsets();
});

Template.registerHelper('isPoolRoute', function () {
	return Route.isPool();
});

Template.registerHelper('isRepetitoriumRoute', function () {
	return Route.isRepetitorium();
});

Template.registerHelper('extendContext', function (key, value) {
	let result = _.clone(this);
	result[key] = value;
	return result;
});

Template.registerHelper('isInBonusAndProfileIncomplete', function () {
	return Bonus.isInBonus(Router.current().params._id) && !Profile.isCompleted();
});

// Check if user has permission to look at a cardset
Template.registerHelper("hasPermission", function () {
	if (UserPermissions.isAdmin()) {
		return true;
	} else if (UserPermissions.isLecturer()) {
		return this.owner === Meteor.userId() || this.visible === true || this.request === true;
	} else {
		return this.owner === Meteor.userId() || this.visible === true;
	}
});

// Check if user has is lecturer
Template.registerHelper("isLecturer", function () {
	if (Roles.userIsInRole(Meteor.userId(), 'lecturer')) {
		return true;
	}
});

Template.registerHelper("isPublished", function (kind) {
	return kind !== 'personal';
});

Template.registerHelper("isAdmin", function () {
	return UserPermissions.isAdmin();
});

Template.registerHelper("gotBackendAccess", function () {
	return UserPermissions.gotBackendAccess();
});

Template.registerHelper("isActiveLanguage", function (language) {
	if (Session.get('activeLanguage') === undefined) {
		Session.set('activeLanguage', 'de');
	}
	return Session.get('activeLanguage') === language;
});


Template.registerHelper("getNextCardTime", function () {
	let workload = Workload.findOne({cardset_id: Router.current().params._id, user_id: Meteor.userId()});
	let learningEnd = Cardsets.findOne({_id: Router.current().params._id}).learningEnd;
	if (workload.leitner.nextDate.getTime() > learningEnd.getTime()) {
		return TAPi18n.__('noMoreCardsBeforeEnd');
	}
	let nextDate;
	if (workload.leitner.nextDate.getTime() < new Date().getTime()) {
		nextDate = moment(new Date()).locale(Session.get('activeLanguage'));
	} else {
		nextDate = moment(workload.leitner.nextDate).locale(Session.get('activeLanguage'));
	}
	if (nextDate.get('hour') >= Meteor.settings.public.dailyCronjob.executeAtHour) {
		nextDate.add(1, 'day');
	}
	nextDate.hour(Meteor.settings.public.dailyCronjob.executeAtHour);
	nextDate.minute(0);
	return TAPi18n.__('noCardsToLearn') + nextDate.format("D. MMMM") + TAPi18n.__('at') + nextDate.format("HH:mm") + TAPi18n.__('released');
});

Template.registerHelper("getKindText", function (kind, displayType = 0) {
	if (displayType === 0) {
		switch (DOMPurify.sanitize(kind, DOMPurifyConfig)) {
			case "free":
				return TAPi18n.__('access-level.free.short');
			case "edu":
				return TAPi18n.__('access-level.edu.short');
			case "pro":
				return TAPi18n.__('access-level.pro.short');
			case "personal":
				return TAPi18n.__('access-level.private.short');
			case "demo":
				return TAPi18n.__('access-level.demo.short');
			default:
				return 'Undefined!';
		}
	} else {
		switch (DOMPurify.sanitize(kind, DOMPurifyConfig)) {
			case "free":
				return TAPi18n.__('access-level.free.long');
			case "edu":
				return TAPi18n.__('access-level.edu.long');
			case "pro":
				return TAPi18n.__('access-level.pro.long');
			case "personal":
				return TAPi18n.__('access-level.private.long');
			case "demo":
				return TAPi18n.__('access-level.demo.long');
			default:
				return 'Undefined!';
		}
	}
});

Template.registerHelper("getCardTypeLabel", function (cardType) {
	return '<span class="label label-card-type" data-id="difficulty" title="' + TAPi18n.__('card.cardType' + cardType + '.longName') + '">' + TAPi18n.__('card.cardType' + cardType + '.name') + '</span>';
});

Template.registerHelper("getDifficultyLabel", function (cardType, difficulty) {
	if (!CardType.gotDifficultyLevel(cardType)) {
		return;
	}
	return '<span class="label label-difficulty' + difficulty + '" data-id="difficulty" title="' + TAPi18n.__('difficulty' + difficulty) + '">' + TAPi18n.__('difficulty' + difficulty) + '</span>';
});

Template.registerHelper("getShuffleLabel", function (shuffled = false) {
	if (shuffled) {
		return '<span class="label label-shuffled" data-id="shuffled" title="' + TAPi18n.__('cardset.shuffled.long') + '">' + TAPi18n.__('cardset.shuffled.short') + '</span>';
	}
});

Template.registerHelper("isCardsetAndFixedSidebar", function () {
	return Route.isCardset() && CardVisuals.isFixedSidebar();
});

Template.registerHelper("getBonusLabel", function (shuffled = false) {
	if (shuffled) {
		return '<span class="label label-bonus" data-id="bonus" title="' + TAPi18n.__('cardset.bonus.long') + '">' + TAPi18n.__('cardset.bonus.short') + '</span>';
	}
});

Template.registerHelper("getLecturerAuthorizedLabel", function (cardset) {
	if (cardset.lecturerAuthorized !== undefined) {
		return '<span class="label label-lecturer-authorized" data-id="lecturer-authorized" title="' + TAPi18n.__('label.lecturerAuthorized.long') + '"><i class="fa fa-graduation-cap"></i></span>';
	}
});

Template.registerHelper("getTranscriptBonusLabel", function (cardset) {
	if ((cardset.transcriptBonus !== undefined && cardset.transcriptBonus.enabled) || Route.isMyBonusTranscripts() || Route.isTranscriptBonus() || Route.isPresentationTranscriptBonus() || Route.isPresentationTranscriptBonusCardset()) {
		return '<span class="label label-transcript-bonus" data-id="bonus-transcript" title="' + TAPi18n.__('cardset.transcriptBonus.long') + '">' + TAPi18n.__('cardset.transcriptBonus.short') + '</span>';
	}
});

Template.registerHelper("getCardsetIcons", function (isShuffled) {
	if (isShuffled) {
		return "<i class='fa fa-archive'></i>&nbsp;<i class='fa fa-archive'></i>&nbsp;<i class='fa fa-archive'></i>&nbsp;<i class='fa fa-ellipsis-h'></i>&nbsp;";
	} else {
		return "<i class='fa fa-archive'></i>&nbsp;";
	}
});

Template.registerHelper("isUseCasesModalOpen", function () {
	return Session.get('useCasesModalOpen');
});

Template.registerHelper("isSocialLogin", function () {
	return UserPermissions.isSocialLogin();
});

Template.registerHelper("getServerInventory", function (type) {
	return ServerInventoryTools.getServerInventory(type);
});

Template.registerHelper("isSidebarHidden", function () {
	return Session.get('hideSidebar');
});

Template.registerHelper("getUseCasesIcon", function (type) {
	return Icons.useCases(type);
});


Template.registerHelper("getDisplayModeIcons", function (type) {
	return Icons.displayMode(type);
});

Template.registerHelper("getKind", function (kind, displayType = 0) {
	if (displayType === 0) {
		switch (DOMPurify.sanitize(kind, DOMPurifyConfig)) {
			case "free":
				return '<span class="label label-free" data-id="free"title="' + TAPi18n.__('access-level.free.long') + '">' + TAPi18n.__('access-level.free.short') + '</span>';
			case "edu":
				return '<span class="label label-edu" data-id="edu"title="' + TAPi18n.__('access-level.edu.long') + '">' + TAPi18n.__('access-level.edu.short') + '</span>';
			case "pro":
				return '<span class="label label-pro" data-id="pro"title="' + TAPi18n.__('access-level.pro.long') + '">' + TAPi18n.__('access-level.pro.short') + '</span>';
			case "personal":
				return '<span class="label label-private" data-id="personal"title="' + TAPi18n.__('access-level.private.long') + '">' + TAPi18n.__('access-level.private.short') + '</span>';
			case "demo":
				return '<span class="label label-demo" data-id="demo"title="' + TAPi18n.__('access-level.demo.long') + '">' + TAPi18n.__('access-level.demo.short') + '</span>';
			default:
				return '<span class="label label-default">Undefined!</span>';
		}
	} else {
		switch (DOMPurify.sanitize(kind, DOMPurifyConfig)) {
			case "free":
				return '<span class="label label-free" data-id="free">' + TAPi18n.__('access-level.free.long') + '</span>';
			case "edu":
				return '<span class="label label-edu" data-id="edu">' + TAPi18n.__('access-level.edu.long') + '</span>';
			case "pro":
				return '<span class="label label-pro" data-id="pro">' + TAPi18n.__('access-level.pro.long') + '</span>';
			case "personal":
				return '<span class="label label-private" data-id="personal">' + TAPi18n.__('access-level.private.long') + '</span>';
			case "demo":
				return '<span class="label label-demo" data-id="demo">' + TAPi18n.__('access-level.demo.long') + '</span>';
			default:
				return '<span class="label label-default">Undefined!</span>';
		}
	}
});

Template.registerHelper("canShuffle", function () {
	return Roles.userIsInRole(Meteor.userId(), ['admin', 'editor', 'lecturer', 'university', 'pro']);
});

Template.registerHelper("canCopyCard", function (cardset_id) {
	if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor'])) {
		return true;
	}
	let owner = Cardsets.findOne({"_id": cardset_id}).owner;
	return (Roles.userIsInRole(Meteor.userId(), ['admin']) || (owner === Meteor.userId())) && Cardsets.find({
		owner: Meteor.userId(),
		shuffled: false,
		_id: {$nin: [Router.current().params._id]}
	}).count();
});

Template.registerHelper("isCardsetOwner", function (cardset_id) {
	if (UserPermissions.gotBackendAccess() || (Route.isDemo() || Route.isMakingOf())) {
		return true;
	}
	let cardset = Cardsets.findOne({"_id": cardset_id});
	if (cardset !== undefined) {
		return cardset.owner === Meteor.userId();
	} else {
		return false;
	}
});

Template.registerHelper("isCardsetOwnerAndLecturer", function (cardset_id) {
	if (UserPermissions.gotBackendAccess() || (Route.isDemo() || Route.isMakingOf())) {
		return true;
	}
	let cardset = Cardsets.findOne({"_id": cardset_id});
	if (cardset !== undefined) {
		return cardset.owner === Meteor.userId() && UserPermissions.isLecturer();
	} else {
		return false;
	}
});

Template.registerHelper("gotCardsetsForFilter", function () {
	return Session.get('cardsetIndexResults') > 0;
});

Template.registerHelper("canAccessFrontend", function () {
	return Meteor.user() || MainNavigation.isGuestLoginActive();
});

Template.registerHelper("isGuestLogin", function () {
	return MainNavigation.isGuestLoginActive();
});

Template.registerHelper("isCardsetTranscriptBonusRoute", function () {
	return Route.isTranscriptBonus();
});

Template.registerHelper("gotAllUnfilteredCardsetsVisible", function () {
	return Session.get('cardsetIndexResults') <= Session.get('maxItemsCounter') || Session.get('cardsetIndexResults') <= FilterConfig.itemStartingValue;
});

Template.registerHelper("isShuffleRoute", function () {
	return (Router.current().route.getName() === "shuffle" || Router.current().route.getName() === "editshuffle");
});

Template.registerHelper("isCardsetEditor", function (user_id) {
	return Cardsets.findOne({"_id": Router.current().params._id, "editors": {$in: [user_id]}});
});

Template.registerHelper("learningActiveAndNotEditor", function () {
	if (Router.current().params._id) {
		let cardset = Cardsets.findOne({"_id": Router.current().params._id});
		if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor']) && cardset.learningActive) {
			return false;
		}
		return (cardset.owner !== Meteor.userId() && !cardset.editors.includes(Meteor.userId())) && cardset.learningActive;
	}
});

Template.registerHelper("learningActiveAndEditor", function () {
	if (Router.current().params._id) {
		let cardset = Cardsets.findOne({"_id": Router.current().params._id});
		if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor']) && cardset.learningActive) {
			return true;
		}
		return (cardset.owner === Meteor.userId() || cardset.editors.includes(Meteor.userId())) && cardset.learningActive;
	}
});

Template.registerHelper("isProLoginActive", function () {
	return (ServerStyle.isLoginEnabled("legacy") || ServerStyle.isLoginEnabled("pro"));
});

Template.registerHelper("isEditor", function () {
	if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor'])) {
		return true;
	}
	if (Router.current().params._id) {
		let cardset = Cardsets.findOne({"_id": Router.current().params._id});
		return (cardset.owner === Meteor.userId() || cardset.editors.includes(Meteor.userId()));
	}
});

Template.registerHelper("canAccessEditor", function () {
	if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor']) || Route.isNewTranscript()) {
		return true;
	}
	if (Route.isTranscript()) {
		let card = Cards.findOne(Router.current().params.card_id);
		return card.owner === Meteor.userId();
	} else {
		if (Router.current().params._id) {
			let cardset = Cardsets.findOne(Router.current().params._id);
			return (cardset.owner === Meteor.userId() || cardset.editors.includes(Meteor.userId()));
		}
	}
});

Template.registerHelper("isCardEditor", function (cardset_id) {
	if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor'])) {
		return true;
	}
	let cardset = Cardsets.findOne({_id: cardset_id});
	return (cardset.owner === Meteor.userId() || cardset.editors.includes(Meteor.userId()));
});


Template.registerHelper("canDeleteCard", function () {
	if (UserPermissions.gotBackendAccess()) {
		return true;
	}
	if (Session.get('activeCard') !== undefined) {
		let card = Cards.findOne({_id: Session.get('activeCard')}, {fields: {_id: 1, cardset_id: 1}});
		if (card !== undefined) {
			let cardset = Cardsets.findOne({_id: card.cardset_id});
			if (cardset !== undefined) {
				return (cardset.owner === Meteor.userId() || cardset.editors.includes(Meteor.userId()));
			}
		}
	}
});

Template.registerHelper("canEditCard", function () {
	if (UserPermissions.isAdmin()) {
		return true;
	}
	if (Session.get('activeCard') !== undefined) {
		let card = Cards.findOne({_id: Session.get('activeCard')}, {fields: {_id: 1, cardset_id: 1}});
		if (card !== undefined) {
			let cardset = Cardsets.findOne({_id: card.cardset_id});
			if (cardset !== undefined) {
				return (cardset.owner === Meteor.userId() || cardset.editors.includes(Meteor.userId()));
			}
		}
	}
});

Template.registerHelper("isLecturerOrPro", function () {
	this.owner = Cardsets.findOne(Router.current().params._id).owner;
	if (Roles.userIsInRole(Meteor.userId(), 'lecturer') || Cardsets.findOne(Router.current().params._id).owner != Meteor.userId()) {
		return true;
	}
});

Template.registerHelper("getNavigationIcon", function (type) {
	return Icons.getNavigationIcon(type);
});

Template.registerHelper("canCreateContent", function () {
	return UserPermissions.canCreateContent();
});

Template.registerHelper("getRoles", function (roles) {
	roles.sort();
	let translatedRoles = "";
	for (let i = 0; i < roles.length; i++) {
		switch (roles[i]) {
			case 'admin':
				translatedRoles += (TAPi18n.__('admin.superAdmin') + ", ");
				break;
			case 'editor':
				translatedRoles += (TAPi18n.__('admin.admin') + ", ");
				break;
			case 'lecturer':
				translatedRoles += (TAPi18n.__('admin.lecturer') + ", ");
				break;
		}
	}
	return translatedRoles.substring(0, translatedRoles.length - 2);
});


// Check if multiple universities are enabled
Template.registerHelper("singleUniversity", function () {
	return Meteor.settings.public.university.singleUniversity;
});

// Returns all Cards of a Carddeck
Template.registerHelper("getCards", function () {
	return Cards.find({
		cardset_id: this._id
	});
});

Template.registerHelper("getSignal", function () {
	switch (Session.get('connectionStatus')) {
		case (0):
			return "disconnected";
		case (1):
			return "connected";
		case (2):
			return "connecting";
	}
});

Template.registerHelper("gotInventoryData", function (dataCount) {
	return dataCount > 0;
});

Template.registerHelper("getSignalTooltip", function () {
	switch (Session.get('connectionStatus')) {
		case (0):
			return TAPi18n.__('connection.disconnected');
		case (1):
			return TAPi18n.__('connection.connected');
		case (2):
			return TAPi18n.__('connection.connecting');
	}
});

Template.registerHelper("isShuffledCardset", function (cardset_id) {
	if (cardset_id !== undefined) {
		let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {shuffled: 1}});
		if (cardset !== undefined) {
			return cardset.shuffled;
		} else {
			return false;
		}
	}
});

// Returns the locale date
Template.registerHelper("getDate", function () {
	let date;
	if (Router.current().route.getName() === "welcome") {
		date = Session.get('wordcloudItem')[10];
	} else {
		date = this.dateCreated;
	}
	return moment(date).locale(Session.get('activeLanguage')).format('LL');
});

Template.registerHelper("getMomentsDate", function (date, displayMinutes = false, displayAsDeadline = false, transformToSpeech = true) {
	return Utilities.getMomentsDate(date, displayMinutes, displayAsDeadline, transformToSpeech);
});

Template.registerHelper("getMomentsDateShort", function (date) {
	return Utilities.getMomentsDateShort(date);
});

Template.registerHelper("getTranscriptSubmissions", function (cardset) {
	if (Route.isMyBonusTranscripts() || Route.isTranscriptBonus()) {
		let transcriptBonus = TranscriptBonus.findOne({card_id: cardset._id}, {fields: {cardset_id: 1}});
		cardset = Cardsets.findOne({_id: transcriptBonus.cardset_id});
	}
	if (cardset.transcriptBonus !== undefined && cardset.transcriptBonus.stats !== undefined) {
		return cardset.transcriptBonus.stats.submissions;
	} else {
		return 0;
	}
});

// Returns the locale date
Template.registerHelper("getDateUpdated", function () {
	let dateUpdated;
	if (Router.current().route.getName() === "welcome") {
		dateUpdated = Session.get('wordcloudItem')[11];
	} else {
		dateUpdated = this.dateUpdated;
	}
	return moment(dateUpdated).locale(Session.get('activeLanguage')).format('LL');
});

// Returns the locale date with time
Template.registerHelper("getTimestamp", function () {
	return moment(this.dateCreated).locale(Session.get('activeLanguage')).format('LLLL');
});

// Returns all courses
Template.registerHelper("getCourses", function () {
	var query = {};
	if (Session.get('poolFilterCollege')) {
		query.college = Session.get('poolFilterCollege');
	}
	return _.uniq(CollegesCourses.find(query, {sort: {course: 1}}).fetch(), function (item) {
		return item.course;
	});
});

Template.registerHelper("hasCardsetPermission", function () {
	return UserPermissions.hasCardsetPermission(Router.current().params._id);
});

Template.registerHelper("isEditCard", function () {
	return Route.isEditCard();
});

Template.registerHelper("isNewCard", function () {
	return Route.isNewCard();
});

Template.registerHelper("getNotificationStatus", function (user) {
	return Bonus.getNotificationStatus(user);
});

Template.registerHelper("isMobilePreview", function () {
	return (Route.isNewCard() || Route.isEditCard()) && Session.get('mobilePreview');
});


Template.registerHelper("isLeitnerWozniakRoute", function () {
	return (Route.isBox() || Route.isMemo());
});

//Returns all Colleges
Template.registerHelper("getColleges", function () {
	return _.uniq(CollegesCourses.find({}, {sort: {college: 1}}).fetch(), function (item) {
		return item.college;
	});
});

// Return the name of a College
Template.registerHelper("getCollege", function (value) {
	if (value !== null) {
		var id = value.toString();
		if (id.length === 1) {
			id = "0" + id;
		}

		var college = CollegesCourses.findOne(id);
		if (college !== undefined) {
			return college.name;
		}
	}
});

Template.registerHelper("getAuthorName", function (owner, lastNameFirst = true) {
	return getAuthorName(owner, lastNameFirst);
});

Template.registerHelper("getOriginalAuthorName", function (originalAuthorName, lastNameFirst = true) {
	if (originalAuthorName.birthname === undefined) {
		return originalAuthorName.legacyName;
	}
	let name = "";
	if (lastNameFirst) {
		if (originalAuthorName.birthname) {
			name += originalAuthorName.birthname;
		}
		if (originalAuthorName.givenname) {
			name += (", " + originalAuthorName.givenname);
		}
		if (originalAuthorName.title) {
			name += (", " + originalAuthorName.title);
		}
	} else {
		if (originalAuthorName.title) {
			name += originalAuthorName.title + " ";
		}
		if (originalAuthorName.givenname) {
			name += originalAuthorName.givenname + " ";
		}
		if (originalAuthorName.birthname) {
			name += originalAuthorName.birthname;
		}
	}
	return name;
});

Template.registerHelper("getAuthor", function (owner) {
	var author = Meteor.users.findOne({"_id": owner});
	if (author) {
		var degree;
		if (author.profile.title) {
			degree = author.profile.title;
		} else {
			degree = TAPi18n.__('navbar-collapse.none');
		}
		if (author.profile.givenname === undefined && author.profile.birthname === undefined) {
			author.profile.givenname = TAPi18n.__('cardset.info.undefinedAuthor');
			return author.profile.givenname;
		}
		return {
			degree: degree,
			givenname: author.profile.givenname,
			birthname: author.profile.birthname
		};
	}
});

// Return the cardset license
Template.registerHelper("getLicense", function (_id, license) {
	var licenseString = "";

	if (license !== undefined && license !== null && license.length > 0) {
		if (license.includes('by')) {
			licenseString = licenseString.concat('<img src="/img/by.large.png" alt="Namensnennung" data-id="' + _id + '" />');
		}
		if (license.includes('nc')) {
			licenseString = licenseString.concat('<img src="/img/nc-eu.large.png" alt="Nicht kommerziell" data-id="' + _id + '" />');
		}
		if (license.includes('nd')) {
			licenseString = licenseString.concat('<img src="/img/nd.large.png" alt="Keine Bearbeitung" data-id="' + _id + '" />');
		}
		if (license.includes('sa')) {
			licenseString = licenseString.concat('<img src="/img/sa.large.png" alt="Weitergabe unter gleichen Bedingungen" data-id="' + _id + '" />');
		}

		return new Spacebars.SafeString(licenseString);
	} else {
		return new Spacebars.SafeString('<img src="/img/zero.large.png" alt="Kein Copyright" data-id="' + _id + '" />');
	}
});

// Returns if user is deleted or not
Template.registerHelper("userExists", function (userDeleted) {
	return userDeleted !== true;
});

// i18n type notifications
Template.registerHelper("getType", function (type) {
	if (type === 'Gemeldeter Benutzer') {
		type = TAPi18n.__('notifications.reporteduser');
	} else if (type === 'Gemeldeter Kartensatz') {
		type = TAPi18n.__('notifications.reportedcardset');
	} else if (type === 'Adminbenachrichtigung (Beschwerde Benutzer)') {
		type = TAPi18n.__('notifications.reporteduseradmin');
	} else if (type === 'Adminbenachrichtigung (Beschwerde Kartensatz)') {
		type = TAPi18n.__('notifications.reportedcardsetadmin');
	} else if (type === 'Dozenten-Anfrage') {
		type = TAPi18n.__('notifications.lecturer');
	}

	return type;
});

Template.registerHelper("getPrice", function (price, returnCurrency = false) {
	if (price === undefined || price === null) {
		return;
	}
	if (TAPi18n.getLanguage() === 'de') {
		if (returnCurrency) {
			return price.toString().replace(".", ",") + ' €';
		} else {
			return price.toString().replace(".", ",");
		}
	} else {
		if (returnCurrency) {
			return price + '€';
		} else {
			return price;
		}
	}
});

Template.registerHelper("getLearnphase", function (state) {
	if (state === true) {
		return TAPi18n.__('set-list.activeLearnphase');
	} else if (state === false) {
		return TAPi18n.__('set-list.inactiveLearnphase');
	} else {
		return TAPi18n.__('set-list.learnphase');
	}
});

Template.registerHelper("getDefaultMaxBonusPoints", function () {
	return BonusForm.getDefaultMaxBonusPoints();
});

Template.registerHelper("getDefaultMinBonusPoints", function () {
	return BonusForm.getDefaultMinBonusPoints();
});

Template.registerHelper("getCurrentMaxBonusPoints", function (cardset) {
	return BonusForm.getCurrentMaxBonusPoints(cardset);
});

Template.registerHelper("getCardsetBackground", function (difficulty, cardType) {
	if (cardType === -1) {
		return 'box-difficultyBlank0';
	}
	let cubeSides = CardType.getCardTypeCubeSides(cardType);
	if (cubeSides[0].defaultStyle !== "default") {
		return "box-" + cubeSides[0].defaultStyle;
	}
	if (!CardType.gotDifficultyLevel(cardType)) {
		return 'box-difficultyBlank0';
	}
	switch (difficulty) {
		case 0:
			if (CardType.gotNotesForDifficultyLevel(cardType)) {
				return 'box-difficultyBlankNote0';
			} else {
				return 'box-difficultyBlank0';
			}
			break;
		case 1:
			return 'box-difficultyBlank1';
		case 2:
			return 'box-difficultyBlank2';
		case 3:
			return 'box-difficultyBlank3';
		default:
			return 'box-difficultyBlank0';
	}
});

Template.registerHelper("fullscreenActive", function () {
	return Session.get('fullscreen');
});

Template.registerHelper("oddRow", function (index) {
	return (index % 2 === 1);
});

// detects if the app is offline or not
Template.registerHelper("isConnected", function () {
	return Session.get("connectionStatus") === 1;
});

// Adds the "disabled" attribute to Elements if the app is offline
// use it like this: <button {{disableIfOffline}}>...</button>
Template.registerHelper("disableIfOffline", function () {
	return Session.get("connectionStatus") === 1 ? "" : "disabled";
});

Template.registerHelper("getMaximumText", function (text) {
	const maxLength = 15;
	const textSplitted = text.split(" ");
	if (textSplitted.length > maxLength) {
		return textSplitted.slice(0, maxLength).toString().replace(/,/g, ' ') + "...";
	}
	return text;
});

Template.registerHelper("isIOSOrSafari", function () {
	return (NavigatorCheck.isIOS() | NavigatorCheck.isSafari());
});

Template.registerHelper("isIOSSafari", function () {
	return (NavigatorCheck.isIOS() && NavigatorCheck.isSafari());
});

Template.registerHelper("isIOS", function () {
	return NavigatorCheck.isIOS();
});

Template.registerHelper("isSmartphone", function () {
	return NavigatorCheck.isSmartphone();
});

Template.registerHelper("is3DActive", function () {
	return Session.get('is3DActive');
});

Template.registerHelper("got3DMode", function () {
	return CardVisuals.got3DMode();
});

const markdeepHelper = new MeteorMathJax.Helper({
	useCache: false,
	transform: function (content) {
		return MarkdeepContent.convert(content);
	}
});

Template.registerHelper("gotTranscriptBonus", function (cardset_id) {
	if (Route.isTranscriptBonus() || Route.isMyBonusTranscripts() || Route.isTranscriptBonus()) {
		return true;
	}
	let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, cardGroups: 1, shuffled: 1, cardType: 1}});
	if (cardset !== undefined) {
		if (cardset.shuffled) {
			let cardsetGroup;
			for (let i = 0; i < cardset.cardGroups.length; i++) {
				cardsetGroup = Cardsets.findOne({_id: cardset.cardGroups[i]}, {fields: {_id: 1, cardType: 1}});
				if (cardsetGroup !== undefined && CardType.gotTranscriptBonus(cardsetGroup.cardType)) {
					return true;
				}
			}
		} else if (CardType.gotTranscriptBonus(cardset.cardType)) {
			return true;
		}
	}
});

Template.registerHelper("gotTranscriptBonusAndIsNotShuffled", function (cardset_id) {
	if (Route.isTranscript() || Route.isTranscriptBonus()) {
		return true;
	}
	let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, cardGroups: 1, shuffled: 1, cardType: 1}});
	if (cardset !== undefined && !cardset.shuffled) {
		return CardType.gotTranscriptBonus(cardset.cardType);
	}
});

Template.registerHelper('markdeep', markdeepHelper.getTemplate());
