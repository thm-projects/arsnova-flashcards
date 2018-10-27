//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Leitner, Wozniak} from "../../../../api/learned";
import {Ratings} from "../../../../api/ratings";
import {CardType} from "../../../../api/cardTypes";
import {Cardsets} from "../../../../api/cardsets";
import {Paid} from "../../../../api/paid";
import "./cardset.html";
import {CardsetVisuals} from "../../../../api/cardsetVisuals";

/*
 * ############################################################################
 * cardsetInfoBox
 * ############################################################################
 */

Template.cardsetInfoBox.onRendered(function () {
	$('[data-toggle="tooltip"]').tooltip({
		container: 'body'
	});
});

Template.cardsetInfoBox.helpers({
	getColors: function () {
		switch (this.kind) {
			case "personal":
				return "btn-warning";
			case "free":
				return "btn-info";
			case "edu":
				return "btn-success";
			case "pro":
				return "btn-danger";
			case "demo":
				return "btn-demo";
		}
	},
	getName: function () {
		let shuffled = "";
		if (this.shuffled) {
			shuffled = TAPi18n.__('admin.shuffled') + " ";
		}
		return shuffled;
	}
});

/*
* ############################################################################
* cardsetInfoBox
* ############################################################################
*/
Template.cardsetInfoBox.events({
	"click #collapseCardsetInfoButton": function () {
		CardsetVisuals.changeCollapseIcon("#collapseCardsetInfoIcon");
	}
});

/*
 * ############################################################################
 * cardsetInfoBoxContentOne
 * ############################################################################
 */

Template.cardsetInfoBoxContentOne.helpers({
	canViewForFree: function () {
		return (this.kind === "edu" && (Roles.userIsInRole(Meteor.userId(), ['university', 'lecturer'])));
	},
	ratingEnabled: function () {
		return this.ratings === true;
	},
	canRateCardset: function () {
		let result = Cardsets.findOne({_id: this._id}, {fields: {owner: 1}});
		if (result !== undefined) {
			return result.owner !== Meteor.userId();
		} else {
			return false;
		}
	},
	getAverageRating: function () {
		let ratings = Ratings.find({cardset_id: this._id}).fetch();
		let averageRating = 0;
		for (let i = 0; i < ratings.length; i++) {
			averageRating += ratings[i].rating;
		}
		return averageRating / ratings.length;
	},
	getUserRating: function () {
		var userrating = Ratings.findOne({
			cardset_id: this._id,
			user: Meteor.userId()
		});
		if (userrating) {
			return userrating.rating;
		} else {
			return 0 + " " + TAPi18n.__('cardset.info.notRated');
		}
	},
	gotOriginalAuthorData: function () {
		if (this.originalAuthorName !== undefined) {
			return (this.originalAuthorName.birthname !== undefined || this.originalAuthorName.legacyName !== undefined);
		} else {
			return "";
		}
	},
	hasAmount: function () {
		return this.kind === 'pro' || this.kind === 'edu';
	},
	isPurchased: function () {
		return Paid.findOne({cardset_id: this._id}) !== undefined;
	},
	getDateOfPurchase: function () {
		return moment(Paid.findOne({cardset_id: this._id}).date).locale(Session.get('activeLanguage')).format('LL');
	},
	getReviewer: function () {
		var reviewer = Meteor.users.findOne(this.reviewer);
		return (reviewer !== undefined) ? reviewer.profile.name : undefined;
	},
	getCardType: function () {
		return CardType.getCardTypeName(this.cardType);
	},
	gotNotesForDifficultyLevel: function () {
		return CardType.gotNotesForDifficultyLevel(this.cardType);
	},
	getDifficultyName: function () {
		if (CardType.gotNotesForDifficultyLevel(this.cardType)) {
			return TAPi18n.__('difficultyNotes' + this.difficulty);
		} else {
			if (!CardType.gotDifficultyLevel(this.cardType)) {
				return TAPi18n.__('difficulty0');
			} else {
				return TAPi18n.__('difficulty' + this.difficulty);
			}
		}
	},
	getLearningMode: function () {
		let actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		actualDate.setHours(0, 0, 0, 0);
		let count = 0;
		if (Leitner.find({cardset_id: this._id, user_id: Meteor.userId(), active: true}).count()) {
			count += 1;
		}
		if (Wozniak.find({
			cardset_id: this._id, user_id: Meteor.userId(), nextDate: {
				$lte: actualDate
			}
		}).count()) {
			count += 2;
		}
		switch (count) {
			case 0:
				return TAPi18n.__('set-list.none');
			case 1:
				return TAPi18n.__('set-list.leitner');
			case 2:
				return TAPi18n.__('set-list.wozniak');
			case 3:
				return TAPi18n.__('set-list.both');
		}
	}
});

Template.cardsetInfoBoxContentOne.events({
	'click #rating': function () {
		var cardset_id = Template.parentData(1)._id;
		var rating = $('#rating').data('userrating');
		var count = Ratings.find({
			cardset_id: cardset_id,
			user: Meteor.userId()
		}).count();
		if (count === 0) {
			Meteor.call("addRating", cardset_id, rating);
		} else {
			Meteor.call("updateRating", cardset_id, rating);
		}
	},
	'click .showLicense': function (event) {
		event.preventDefault();
		Session.set('selectedCardset', $(event.target).data('id'));
	}
});

/*
 * ############################################################################
 * cardsetInfoBoxContentTwo
 * ############################################################################
 */

Template.cardsetInfoBoxContentTwo.helpers({
	canViewForFree: function () {
		return (this.kind === "edu" && (Roles.userIsInRole(Meteor.userId(), ['university', 'lecturer'])));
	},
	ratingEnabled: function () {
		return this.ratings === true && Session.get('ratingsLoaded');
	},
	hasRated: function () {
		var count = Ratings.find({
			cardset_id: this._id,
			user: Meteor.userId()
		}).count();
		var cardset = Cardsets.findOne(this._id);
		if (cardset !== null) {
			return count !== 0;
		}
	},
	canRateCardset: function () {
		let result = Cardsets.findOne({_id: this._id}, {fields: {owner: 1}});
		if (result !== undefined) {
			return result.owner !== Meteor.userId();
		} else {
			return false;
		}
	},
	getAverageRating: function () {
		let ratings = Ratings.find({cardset_id: this._id}).fetch();
		let averageRating = 0;
		for (let i = 0; i < ratings.length; i++) {
			averageRating += ratings[i].rating;
		}
		return averageRating / ratings.length;
	},
	getUserRating: function () {
		var userrating = Ratings.findOne({
			cardset_id: this._id,
			user: Meteor.userId()
		});
		if (userrating) {
			return userrating.rating;
		} else {
			return 0 + " " + TAPi18n.__('cardset.info.notRated');
		}
	},
	hasAmount: function () {
		return this.kind === 'pro' || this.kind === 'edu';
	},
	isPurchased: function () {
		return Paid.findOne({cardset_id: this._id}) !== undefined;
	},
	getDateOfPurchase: function () {
		return moment(Paid.findOne({cardset_id: this._id}).date).locale(Session.get('activeLanguage')).format('LL');
	},
	getReviewer: function () {
		var reviewer = Meteor.users.findOne(this.reviewer);
		return (reviewer !== undefined) ? reviewer.profile.name : undefined;
	},
	getCardType: function () {
		return CardType.getCardTypeName(this.cardType);
	},
	gotNotesForDifficultyLevel: function () {
		return CardType.gotNotesForDifficultyLevel(this.cardType);
	},
	getDifficultyName: function () {
		if (CardType.gotNotesForDifficultyLevel(this.cardType)) {
			return TAPi18n.__('difficultyNotes' + this.difficulty);
		} else {
			return TAPi18n.__('difficulty' + this.difficulty);
		}
	}
});

Template.cardsetInfoBoxContentTwo.events({
	'click #rating': function () {
		var cardset_id = Template.parentData(1)._id;
		var rating = $('#rating').data('userrating');
		var count = Ratings.find({
			cardset_id: cardset_id,
			user: Meteor.userId()
		}).count();
		if (count === 0) {
			Meteor.call("addRating", cardset_id, rating);
		} else {
			Meteor.call("updateRating", cardset_id, rating);
		}
	}
});
