import {UserPermissions} from "../../../util/permissions";
import {Session} from "meteor/session";
import {Cards} from "../../../api/subscriptions/cards";
import {Cardsets} from "../../../api/subscriptions/cardsets";
import {Meteor} from "meteor/meteor";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {Route} from "../../../util/route";
import {MainNavigation} from "../../../util/mainNavigation";
import {Bonus} from "../../../util/bonus";


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

Template.registerHelper("isCardsLogin", function () {
	return UserPermissions.isCardsLogin();
});


Template.registerHelper("isAdmin", function () {
	return UserPermissions.isAdmin();
});

Template.registerHelper("gotBackendAccess", function () {
	return UserPermissions.gotBackendAccess();
});

Template.registerHelper("isSocialLogin", function () {
	return UserPermissions.isSocialLogin();
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
		_id: {$nin: [FlowRouter.getParam('_id')]}
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

Template.registerHelper("canAccessFrontend", function () {
	return (UserPermissions.canAccessFrontend());
});

Template.registerHelper("isGuestLogin", function () {
	return MainNavigation.isGuestLoginActive();
});

Template.registerHelper("isCardsetEditor", function (user_id) {
	return Cardsets.findOne({"_id": FlowRouter.getParam('_id'), "editors": {$in: [user_id]}});
});

Template.registerHelper("isEditor", function () {
	if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor'])) {
		return true;
	}
	if (FlowRouter.getParam('_id')) {
		let cardset = Cardsets.findOne({"_id": FlowRouter.getParam('_id')});
		return (cardset.owner === Meteor.userId() || cardset.editors.includes(Meteor.userId()));
	}
});

Template.registerHelper("canAccessEditor", function () {
	if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor']) || Route.isNewTranscript()) {
		return true;
	}
	if (Route.isTranscript()) {
		let card = Cards.findOne(FlowRouter.getParam('card_id'));
		return card.owner === Meteor.userId();
	} else {
		if (FlowRouter.getParam('_id')) {
			let cardset = Cardsets.findOne(FlowRouter.getParam('_id'));
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

Template.registerHelper("canCreateContent", function () {
	return UserPermissions.canCreateContent();
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
	return UserPermissions.canEditCard();
});

Template.registerHelper("isLecturerOrPro", function () {
	this.owner = Cardsets.findOne(FlowRouter.getParam('_id')).owner;
	if (Roles.userIsInRole(Meteor.userId(), 'lecturer') || Cardsets.findOne(FlowRouter.getParam('_id')).owner != Meteor.userId()) {
		return true;
	}
});

Template.registerHelper("hasCardsetPermission", function () {
	return UserPermissions.hasCardsetPermission(FlowRouter.getParam('_id'));
});

Template.registerHelper('isInBonusAndNotOwner', function () {
	return Bonus.isInBonus(FlowRouter.getParam('_id')) && (!UserPermissions.isOwner(Cardsets.findOne({_id: FlowRouter.getParam('_id')}).owner) && !UserPermissions.isAdmin());
});
