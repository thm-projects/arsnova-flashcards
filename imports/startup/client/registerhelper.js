import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../api/cardsets.js";
import {CourseIterations} from "../../api/courseIterations.js";
import {Cards} from "../../api/cards.js";
import {CollegesCourses} from "../../api/colleges_courses.js";
import {Leitner} from "../../api/learned.js";
import {Session} from "meteor/session";
import {MeteorMathJax} from 'meteor/mrt:mathjax';
import * as lib from '/client/lib.js';
import {getAuthorName} from "../../api/cardsetUserlist.js";
import {toggleFullscreen} from "../../ui/card/card";
import {Paid} from "../../api/paid";
import {getUserLanguage} from "../../startup/client/i18n";
import {gotDifficultyLevel, gotNotesForDifficultyLevel} from "../../api/cardTypes";
import DOMPurify from 'dompurify';
import {DOMPurifyConfig} from "../../api/dompurify.js";

Meteor.subscribe("collegesCourses");


Template.registerHelper('extendContext', function (key, value) {
	let result = _.clone(this);
	result[key] = value;
	return result;
});

// Check if user has permission to look at a cardset
Template.registerHelper("hasPermission", function () {
	if (Roles.userIsInRole(Meteor.userId(), 'lecturer')) {
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

Template.registerHelper("isActiveLanguage", function (language) {
	return Session.get('activeLanguage') === language;
});


Template.registerHelper("getNextCardTime", function () {
	let nextCardDate = Leitner.findOne({
		cardset_id: Router.current().params._id,
		user_id: Meteor.userId(),
		box: {$ne: 6}
	}, {sort: {nextDate: 1}}).nextDate;
	let learningEnd = Cardsets.findOne({_id: Router.current().params._id}).learningEnd;
	if (nextCardDate.getTime() > learningEnd.getTime()) {
		return TAPi18n.__('noMoreCardsBeforeEnd');
	}
	let nextDate;
	if (nextCardDate.getTime() < new Date().getTime()) {
		nextDate = moment(new Date());
	} else {
		nextDate = moment(nextCardDate);
	}
	if (nextDate.get('hour') >= Meteor.settings.public.leitner.dayIntervalHour) {
		nextDate.add(1, 'day');
	}
	nextDate.hour(Meteor.settings.public.leitner.dayIntervalHour);
	nextDate.minute(0);
	return TAPi18n.__('noCardsToLearn') + nextDate.format("DD.MM.YYYY") + TAPi18n.__('at') + nextDate.format("HH:mm") + TAPi18n.__('released');
});

Template.registerHelper("getKind", function (kind) {
	switch (DOMPurify.sanitize(kind, DOMPurifyConfig)) {
		case "free":
			return '<span class="label label-free" data-id="free">Free</span>';
		case "edu":
			return '<span class="label label-edu" data-id="edu">Edu</span>';
		case "pro":
			return '<span class="label label-pro" data-id="pro">Pro</span>';
		case "personal":
			return '<span class="label label-private" data-id="personal">Private</span>';
		default:
			return '<span class="label label-default">Undefined!</span>';
	}
});

Template.registerHelper("isProfileCompleted", function (cardset_id) {
	let cardset = Cardsets.findOne({_id: cardset_id});
	if ((cardset.owner === Meteor.userId() || cardset.editors.includes(Meteor.userId())) && cardset.learningActive) {
		return true;
	}
	if ((Meteor.user().profile.birthname !== "" && Meteor.user().profile.birthname !== undefined) && (Meteor.user().profile.givenname !== "" && Meteor.user().profile.givenname !== undefined) && (Meteor.user().email !== "" && Meteor.user().email !== undefined)) {
		return true;
	} else {
		return false;
	}
});

Template.registerHelper("canShuffle", function () {
	return Roles.userIsInRole(Meteor.userId(), ['admin', 'editor', 'lecturer', 'university', 'pro']);
});

Template.registerHelper("canCopyCard", function (cardset_id) {
	let owner = Cardsets.findOne({"_id": cardset_id}).owner;
	return (Roles.userIsInRole(Meteor.userId(), ['admin']) || (owner === Meteor.userId())) && Cardsets.find({
		owner: Meteor.userId(),
		shuffled: false,
		_id: {$nin: [Router.current().params._id]}
	}).count();
});

Template.registerHelper("isCardsetOwner", function (cardset_id) {
	let cardset = Cardsets.findOne({"_id": cardset_id});
	if (cardset !== undefined) {
		return cardset.owner === Meteor.userId();
	} else {
		return false;
	}
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
		return (cardset.owner !== Meteor.userId() && !cardset.editors.includes(Meteor.userId())) && cardset.learningActive;
	}
});

Template.registerHelper("learningActiveAndEditor", function () {
	if (Router.current().params._id) {
		let cardset = Cardsets.findOne({"_id": Router.current().params._id});
		return (cardset.owner === Meteor.userId() || cardset.editors.includes(Meteor.userId())) && cardset.learningActive;
	}
});

Template.registerHelper("isEditor", function () {
	if (Router.current().params._id) {
		let cardset = Cardsets.findOne({"_id": Router.current().params._id});
		return (cardset.owner === Meteor.userId() || cardset.editors.includes(Meteor.userId()));
	}
});

Template.registerHelper("isCardEditor", function (cardset_id) {
	let cardset = Cardsets.findOne({_id: cardset_id});
	return (cardset.owner === Meteor.userId() || cardset.editors.includes(Meteor.userId()));
});

Template.registerHelper("isLecturerOrPro", function () {
	this.owner = Cardsets.findOne(Router.current().params._id).owner;
	if (Roles.userIsInRole(Meteor.userId(), 'lecturer') || Cardsets.findOne(Router.current().params._id).owner != Meteor.userId()) {
		return true;
	}
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

// Returns the number of cards in a carddeck
Template.registerHelper("countCards", function (cardset_id) {
	if (Router.current().route.getName() === 'courseIterations') {
		return CourseIterations.findOne({_id: cardset_id}).quantity;
	} else {
		return Cardsets.findOne({_id: cardset_id}).quantity;
	}
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

Template.registerHelper("isShuffledCardset", function (cardset_id) {
	return Cardsets.findOne({_id: cardset_id}).shuffled;
});

// Returns the locale date
Template.registerHelper("getDate", function () {
	let date;
	if (Router.current().route.getName() === "welcome") {
		date = Session.get('wordcloudItem')[10];
	} else {
		date = this.date;
	}
	return moment(date).locale(getUserLanguage()).format('LL');
});

// Returns the locale date
Template.registerHelper("getDateUpdated", function () {
	let dateUpdated;
	if (Router.current().route.getName() === "welcome") {
		dateUpdated = Session.get('wordcloudItem')[11];
	} else {
		dateUpdated = this.dateUpdated;
	}
	return moment(dateUpdated).locale(getUserLanguage()).format('LL');
});

// Returns the locale date with time
Template.registerHelper("getTimestamp", function () {
	return moment(this.date).locale(getUserLanguage()).format('LLLL');
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

Template.registerHelper("hasCardsetPermission", function (_id) {
	let cardset = Cardsets.findOne({_id});
	if (cardset === undefined) {
		return false;
	}
	let userId = Meteor.userId();
	let cardsetKind = cardset.kind;

	let hasRole = false;
	if (Roles.userIsInRole(userId, 'pro') ||
		(Roles.userIsInRole(userId, 'lecturer')) ||
		(Roles.userIsInRole(userId, 'admin')) ||
		(Roles.userIsInRole(userId, 'editor')) ||
		(Roles.userIsInRole(userId, 'university') && (cardsetKind === 'edu' || cardsetKind === 'free')) ||
		(cardsetKind === 'free') ||
		(Paid.find({cardset_id: cardset._id, user_id: userId}).count())) {
		hasRole = true;
	}
	return (cardset.owner === Meteor.userId() || cardset.editors.includes(Meteor.userId())) || hasRole;
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

Template.registerHelper("getAuthorName", function (owner) {
	return getAuthorName(owner);
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
Template.registerHelper("getLicense", function (_id) {
	var licenseString = "";

	if (this.license.length > 0) {
		if (this.license.includes('by')) {
			licenseString = licenseString.concat('<img src="/img/by.large.png" alt="Namensnennung" data-id="' + _id + '" />');
		}
		if (this.license.includes('nc')) {
			licenseString = licenseString.concat('<img src="/img/nc-eu.large.png" alt="Nicht kommerziell" data-id="' + _id + '" />');
		}
		if (this.license.includes('nd')) {
			licenseString = licenseString.concat('<img src="/img/nd.large.png" alt="Keine Bearbeitung" data-id="' + _id + '" />');
		}
		if (this.license.includes('sa')) {
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

Template.registerHelper("getCardBackground", function (difficulty, cardType, backgroundStyle) {
	if (!gotDifficultyLevel(cardType)) {
		if (backgroundStyle === 0) {
			return 'box-difficultyLined0';
		} else {
			return 'box-difficultyBlank0';
		}
	}
	if (difficulty === 0 && !gotNotesForDifficultyLevel(cardType)) {
		difficulty = 1;
	}
	if (backgroundStyle === 0) {
		switch (difficulty) {
			case 0:
				if (gotNotesForDifficultyLevel(cardType)) {
					return 'box-difficultyLinedNote0';
				} else {
					return 'box-difficultyLined0';
				}
				break;
			case 1:
				return 'box-difficultyLined1';
			case 2:
				return 'box-difficultyLined2';
			case 3:
				return 'box-difficultyLined3';
			default:
				return '';
		}
	} else {
		switch (difficulty) {
			case 0:
				if (gotNotesForDifficultyLevel(cardType)) {
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
				return '';
		}
	}
});

Template.registerHelper("fullscreenActive", function () {
	return Session.get('fullscreen');
});

Template.registerHelper("checkActiveRouteName", function () {
	let currentRoute = Router.current().route.getName();
	if (currentRoute !== Session.get('previousRouteName')) {
		Session.set('previousRouteName', currentRoute);
		toggleFullscreen(true);
	}
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

const helper = new MeteorMathJax.Helper({
	useCache: true,
	transform: function (x) {
		return DOMPurify.sanitize(lib.setLightBoxes(window.markdeep.format(x, true)));
	}
});

Template.registerHelper('mathjax', helper.getTemplate());
MeteorMathJax.sourceUrl = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js';
MeteorMathJax.defaultConfig = {
	config: ["TeX-AMS-MML_HTMLorMML.js"],
	jax: ["input/TeX", "input/MathML", "output/HTML-CSS", "output/NativeMML", "output/PreviewHTML"],
	extensions: ["tex2jax.js", "enclose.js", "Safe.js", "mml2jax.js", "fast-preview.js", "AssistiveMML.js", "[Contrib]/a11y/accessibility-menu.js"],
	TeX: {
		extensions: ["AMSmath.js", "AMSsymbols.js", "autoload-all.js"]
	},
	tex2jax: {
		inlineMath: [['$', '$'], ["\\(", "\\)"]],
		displayMath: [['$$', '$$'], ["\\[", "\\]"]],
		processEscapes: true,
		preview: 'none'
	},
	styles: {
		".MathJax_Display": {
			display: "table"
		}
	},
	messageStyle: 'none',
	showProcessingMessages: false,
	showMathMenu: false
};
