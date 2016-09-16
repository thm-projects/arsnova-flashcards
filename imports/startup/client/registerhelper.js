import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../api/cardsets.js";
import {Cards} from "../../api/cards.js";
import {CollegesCourses} from "../../api/colleges_courses.js";


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

// Check if user is owner of a cardset
Template.registerHelper("isOwnerCard", function () {
	var owner;
	if (this._id) {
		owner = Cardsets.findOne(Router.current().params._id).owner;
	}
	return owner === Meteor.userId();
});

Template.registerHelper("isOwner", function () {
	var owner;
	if (this.owner) {
		owner = this.owner;
	} else if (Template.parentData(1)) {
		owner = Template.parentData(1).owner;
	}
	return owner === Meteor.userId();
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
	return _.uniq(CollegesCourses.find().fetch(), function (item) {
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
