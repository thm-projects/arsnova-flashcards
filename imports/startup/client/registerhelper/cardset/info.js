import {getAuthorName, getOriginalAuthorName} from "../../../../api/userdata";
import {Meteor} from "meteor/meteor";
import {CardsetVisuals} from "../../../../api/cardsetVisuals";
import DOMPurify from "dompurify";
import {DOMPurifyConfig} from "../../../../config/dompurify";

Template.registerHelper("getAuthorName", function (owner, lastNameFirst = true) {
	return getAuthorName(owner, lastNameFirst);
});

Template.registerHelper("getOriginalAuthorName", function (originalAuthorName, lastNameFirst = true) {
	return getOriginalAuthorName(originalAuthorName, lastNameFirst);
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
Template.registerHelper("getLicense", function (_id, license, isTextOnly) {
	return CardsetVisuals.getLicense(_id, license, isTextOnly);
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

Template.registerHelper("getKind", function (kind, displayType = 0) {
	if (displayType === 0) {
		switch (DOMPurify.sanitize(kind, DOMPurifyConfig)) {
			case "free":
				return '<span class="label label-kind label-free" data-id="free" title="' + TAPi18n.__('access-level.free.long') + '">' + TAPi18n.__('access-level.free.short') + '</span>';
			case "edu":
				return '<span class="label label-kind label-edu" data-id="edu" title="' + TAPi18n.__('access-level.edu.long') + '">' + TAPi18n.__('access-level.edu.short') + '</span>';
			case "pro":
				return '<span class="label label-kind label-pro" data-id="pro" title="' + TAPi18n.__('access-level.pro.long') + '">' + TAPi18n.__('access-level.pro.short') + '</span>';
			case "personal":
				return '<span class="label label-kind label-private" data-id="personal" title="' + TAPi18n.__('access-level.private.long') + '">' + TAPi18n.__('access-level.private.short') + '</span>';
			case "demo":
				return '<span class="label label-kind label-demo" data-id="demo" title="' + TAPi18n.__('access-level.demo.long') + '">' + TAPi18n.__('access-level.demo.short') + '</span>';
			default:
				return '<span class="label label-default">Undefined!</span>';
		}
	} else {
		switch (DOMPurify.sanitize(kind, DOMPurifyConfig)) {
			case "free":
				return '<span class="label label-kind label-free" data-id="free">' + TAPi18n.__('access-level.free.long') + '</span>';
			case "edu":
				return '<span class="label label-kind label-edu" data-id="edu">' + TAPi18n.__('access-level.edu.long') + '</span>';
			case "pro":
				return '<span class="label label-kind label-pro" data-id="pro">' + TAPi18n.__('access-level.pro.long') + '</span>';
			case "personal":
				return '<span class="label label-kind label-private" data-id="personal">' + TAPi18n.__('access-level.private.long') + '</span>';
			case "demo":
				return '<span class="label label-kind label-demo" data-id="demo">' + TAPi18n.__('access-level.demo.long') + '</span>';
			default:
				return '<span class="label label-default">Undefined!</span>';
		}
	}
});

Template.registerHelper("isPublished", function (kind) {
	return kind !== 'personal';
});

Template.registerHelper("getKindText", function (kind, displayType = 0) {
	return CardsetVisuals.getKindText(kind, displayType);
});
