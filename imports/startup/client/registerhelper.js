import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../api/cardsets.js";
import {Cards} from "../../api/cards.js";
import {CollegesCourses} from "../../api/colleges_courses.js";
import {Learned} from "../../api/learned.js";
import {Session} from "meteor/session";
import {Showdown} from 'meteor/markdown';
import {MeteorMathJax} from 'meteor/mrt:mathjax';
import * as lib from '/client/lib.js';
import {getAuthorName} from "../../api/cardset.js";

Meteor.subscribe("collegesCourses");


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

Template.registerHelper("isCardsetOwner", function (cardset_id) {
	var owner = Cardsets.findOne({"_id": cardset_id}).owner;
	return owner === Meteor.userId();
});

Template.registerHelper("isLecturerOrPro", function () {
	this.owner = Cardsets.findOne(Router.current().params._id).owner;
	if (Roles.userIsInRole(Meteor.userId(), 'lecturer') || Cardsets.findOne(Router.current().params._id).owner != Meteor.userId()) {
		return true;
	}
});

// Returns the number of cards in a carddeck
Template.registerHelper("countCards", function (cardset_id) {
	return Cardsets.findOne({_id: cardset_id}).quantity;
});

// Returns all Cards of a Carddeck
Template.registerHelper("getCards", function () {
	return Cards.find({
		cardset_id: this._id
	});
});

//Returns the number of active learners in a cardset
Template.registerHelper("getActiveLearners", function (id) {
	var data = Learned.find({cardset_id: id, box: {$gt: 1}}).fetch();
	var distinctData = _.uniq(data, false, function (d) {
		return d.user_id;
	});
	return (_.pluck(distinctData, "user_id").length);
});

// Returns the locale date
Template.registerHelper("getDate", function () {
	return moment(this.date).locale(getUserLanguage()).format('LL');
});

// Returns the locale date
Template.registerHelper("getDateUpdated", function () {
	return moment(this.dateUpdated).locale(getUserLanguage()).format('LL');
});

// Returns the locale date with time
Template.registerHelper("getTimestamp", function () {
	return moment(this.date).locale(getUserLanguage()).format('LLLL');
});

// Returns all Courses
Template.registerHelper("getCourses", function () {
	var query = {};
	if (Session.get('poolFilterCollege')) {
		query.college = Session.get('poolFilterCollege');
	}
	return _.uniq(CollegesCourses.find(query).fetch(), function (item) {
		return item.course;
	});
});

//Returns all Colleges
Template.registerHelper("getColleges", function () {
	return _.uniq(CollegesCourses.find().fetch(), function (item) {
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
Template.registerHelper("getLicense", function () {
	var licenseString = "";

	if (this.license.length > 0) {
		if (this.license.includes('by')) {
			licenseString = licenseString.concat('<img src="/img/by.large.png" alt="Namensnennung" />');
		}
		if (this.license.includes('nc')) {
			licenseString = licenseString.concat('<img src="/img/nc-eu.large.png" alt="Nicht kommerziell" />');
		}
		if (this.license.includes('nd')) {
			licenseString = licenseString.concat('<img src="/img/nd.large.png" alt="Keine Bearbeitung" />');
		}
		if (this.license.includes('sa')) {
			licenseString = licenseString.concat('<img src="/img/sa.large.png" alt="Weitergabe unter gleichen Bedingungen" />');
		}

		return new Spacebars.SafeString(licenseString);
	} else {
		return new Spacebars.SafeString('<img src="/img/zero.large.png" alt="Kein Copyright" />');
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

Template.registerHelper("getSkillLevel", function (skillLevel) {
	switch (skillLevel) {
		case 1:
			return TAPi18n.__('modal-dialog.skillLevel1');
		case 2:
			return TAPi18n.__('modal-dialog.skillLevel2');
		case 3:
			return TAPi18n.__('modal-dialog.skillLevel3');
		default:
			return TAPi18n.__('modal-dialog.skillLevel0');
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

Template.registerHelper("getCardBackground", function (difficulty) {
	switch (difficulty) {
		case 0:
			return 'box-difficulty0';
		case 1:
			return 'box-difficulty1';
		case 2:
			return 'box-difficulty2';
		case 3:
			return 'box-difficulty3';
		default:
			return '';
	}
});

// detects if the app is offline or not
Template.registerHelper("isOffline", function () {
	return !Meteor.status().connected;
});

// Adds the "disabled" attribute to Elements if the app is offline
// use it like this: <button {{disableIfOffline}}>...</button>
Template.registerHelper("disableIfOffline", function () {
	return Meteor.status().connected ? "" : "disabled";
});

const converter = new Showdown.converter({
	simplifiedAutoLink: true,
	strikethrough: true,
	tables: true
});

const helper = new MeteorMathJax.Helper({
	useCache: true,
	transform: function (x) {
		x = x.split("\n");
		x = lib.parseGithubFlavoredMarkdown(x);
		return lib.setLightBoxes(converter.makeHtml(x));
	}
});

Template.registerHelper('mathjax', helper.getTemplate());
MeteorMathJax.sourceUrl = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js';
MeteorMathJax.defaultConfig = {
	config: ["TeX-AMS-MML_HTMLorMML.js"],
	jax: ["input/TeX", "input/MathML", "output/HTML-CSS", "output/NativeMML", "output/PreviewHTML"],
	extensions: ["tex2jax.js", "enclose.js", "Safe.js", "mml2jax.js", "fast-preview.js", "AssistiveMML.js", "[Contrib]/a11y/accessibility-menu.js"],
	TeX: {
		extensions: ["AMSmath.js", "AMSsymbols.js", "autoload-all.js"]
	},
	tex2jax: {
		inlineMath: [['$', '$'], ["\(", "\)"]],
		displayMath: [['$$', '$$'], ["\[", "\]"]],
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
