//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Leitner, Wozniak} from "../../api/learned.js";
import "../cardset/cardset.js";
import "../cardsets/resultItem.html";
import {CardType} from "../../api/cardTypes";
import {BertAlertVisuals} from "../../api/bertAlertVisuals";

Session.setDefault('cardsetId', undefined);
Session.set('moduleActive', true);

Meteor.subscribe("cardsets");


function getLeitnerCount(cardset) {
	return Leitner.find({
		cardset_id: cardset._id,
		user_id: Meteor.userId(),
		active: true
	}).count();
}

function getWozniakCount(cardset) {
	let actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	actualDate.setHours(0, 0, 0, 0);
	return Wozniak.find({
		cardset_id: cardset._id, user_id: Meteor.userId(), nextDate: {
			$lte: actualDate
		}
	}).count();
}

/*
 * ############################################################################
 * cardsetCourseIterationResultRow
 * ############################################################################
 */

Template.cardsetCourseIterationResultRow.events({
	"click .addShuffleCardset": function (event) {
		let array = Session.get("ShuffledCardsets");
		let arrayExclude = Session.get("ShuffledCardsetsExclude");
		let cardset = Cardsets.findOne({_id: $(event.target).data('id')}, {shuffled: 1, cardGroups: 1});
		if (cardset.shuffled) {
			for (let i = 0; i < cardset.cardGroups.length; i++) {
				if (!array.includes(cardset.cardGroups[i])) {
					array.push(cardset.cardGroups[i]);
				}
			}
			arrayExclude.push($(event.target).data('id'));
			Session.set("ShuffledCardsetsExclude", arrayExclude);
		} else {
			array.push($(event.target).data('id'));
		}
		Session.set("ShuffledCardsets", array);
	},
	'click .deleteCourseIteration': function (event) {
		Session.set('courseIterationId', $(event.target).data('id'));
	},
	'click .deleteCardset': function (event) {
		Session.set('cardsetId', $(event.target).data('id'));
	},
	"click .removeShuffleCardset": function (event) {
		let array = Session.get("ShuffledCardsets");
		let arrayExclude = Session.get("ShuffledCardsetsExclude");
		let cardset = Cardsets.findOne({_id: $(event.target).data('id')}, {shuffled: 1, cardGroups: 1});
		if (cardset.shuffled) {
			array = jQuery.grep(array, function (value) {
				for (let i = 0; i < cardset.cardGroups.length; i++) {
					if (value === cardset.cardGroups[i]) {
						return false;
					}
				}
				return true;
			});
			arrayExclude = jQuery.grep(arrayExclude, function (value) {
				return value !== $(event.target).data('id');
			});
			Session.set("ShuffledCardsetsExclude", arrayExclude);
		} else {
			array = jQuery.grep(array, function (value) {
				return value !== $(event.target).data('id');
			});
			for (let i = 0; i < Session.get("ShuffledCardsetsExclude").length; i++) {
				cardset = Cardsets.findOne({_id: Session.get("ShuffledCardsetsExclude")[i]}, {cardGroups: 1});
				let brokenHeart = true;
				for (let k = 0; k < cardset.cardGroups.length; k++) {
					if (array.includes(cardset.cardGroups[k])) {
						brokenHeart = false;
					}
				}
				if (brokenHeart) {
					arrayExclude.splice(i, 1);
				}
			}
			Session.set("ShuffledCardsetsExclude", arrayExclude);
		}
		Session.set("ShuffledCardsets", array);
	},
	"click .learnLeitner": function (event) {
		event.preventDefault();
		Session.set("workloadFullscreenMode", true);
		Router.go('box', {
			_id: $(event.target).data('id')
		});
	},
	"click .learnWozniak": function (event) {
		event.preventDefault();
		Session.set("workloadFullscreenMode", true);
		Router.go('box', {
			_id: $(event.target).data('id')
		});
	},
	"click .learnSelect": function (event) {
		Session.set("activeCardset", Cardsets.findOne($(event.target).data('id')));
	},
	'click .authorProfile': function (event) {
		event.preventDefault();
		Router.go('profileOverview', {
			_id: $(event.target).data('id')
		});
	},
	'click .resultName': function (event) {
		event.preventDefault();
		Router.go('cardsetdetailsid', {
			_id: $(event.target).data('id')
		});
	},
	'click .editShuffle': function (event) {
		event.preventDefault();
		Router.go('editshuffle', {
			_id: $(event.target).data('id')
		});
	},
	'click .editCardset, click .editAdminCardset': function (event) {
		Session.set('isNewCardset', false);
		Session.set('activeCardset', Cardsets.findOne($(event.target).data('id')));
		Session.set('previousCardsetData', Cardsets.findOne($(event.target).data('id')));
	},
	'click .collapseCardsetInfoButton': function (event) {
		if ($(event.target).hasClass('glyphicon-collapse-up')) {
			$(event.target).addClass('glyphicon-collapse-down').removeClass('glyphicon-collapse-up');
		} else {
			$(event.target).addClass('glyphicon-collapse-up').removeClass('glyphicon-collapse-down');
		}
	},
	'click .exportCardset': function (event) {
		let name = $(event.target).data('name');
		Meteor.call('exportCardset', $(event.target).data('id'), function (error, result) {
			if (error) {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('export.failure.cardset'), 'danger', 'growl-top-left');
			} else {
				let exportData = new Blob([result], {
					type: "application/json"
				});
				saveAs(exportData, TAPi18n.__('export.filename.export') + "_" + TAPi18n.__('export.filename.cardset') + "_" + name + moment().format('_YYYY_MM_DD') + ".json");
			}
		});
	}
});

Template.cardsetCourseIterationResultRow.helpers({
	inShuffleSelection: function (cardset_id) {
		if (Session.get("ShuffledCardsets").includes(cardset_id) || Session.get("ShuffledCardsetsExclude").includes(cardset_id)) {
			return true;
		}
	},
	getLink: function (cardset_id) {
		return ActiveRoute.name('shuffle') ? "#" : ("/cardset/" + cardset_id);
	},
	getLearnphaseStatus: function () {
		if (this.learningActive) {
			return TAPi18n.__('set-list.activeLearnphase');
		} else {
			return TAPi18n.__('set-list.inactiveLearnphase');
		}
	},
	getWorkloadType: function () {
		let leitner = getLeitnerCount(this);
		let wozniak = getWozniakCount(this);
		if (leitner !== 0 && wozniak === 0) {
			return "learnLeitner";
		} else if (leitner === 0 && wozniak !== 0) {
			return "learnWozniak";
		} else if (leitner !== 0 && wozniak !== 0) {
			return "learnSelect";
		} else {
			return "";
		}
	},
	gotWorkloadForBothTypes: function () {
		let leitner = getLeitnerCount(this);
		let wozniak = getWozniakCount(this);
		return leitner !== 0 && wozniak !== 0;
	},
	gotWorkload: function () {
		let count = getLeitnerCount(this) + getWozniakCount(this);
		return count !== 0;
	},
	getWorkload: function () {
		let count = getLeitnerCount(this) + getWozniakCount(this);
		switch (count) {
			case 1:
				return TAPi18n.__('set-list.cardsToLearn');
			default:
				return count + TAPi18n.__('set-list.cardsToLearnPlural');
		}
	},
	gotDescription: function (text) {
		if (text !== "" && text !== undefined) {
			return true;
		}
	},
	getCardTypeName: function () {
		if (this.shuffled) {
			let cardTypes = _.uniq(Cardsets.find({_id: {$in: this.cardGroups}}, {fields: {cardType: 1}}).fetch(), function (item) {
				return item.cardType;
			});
			switch (cardTypes.length) {
				case 1:
					return CardType.getCardTypeName(cardTypes[0].cardType);
				default:
					return TAPi18n.__('cardset.shuffled.short');
			}
		} else {
			return CardType.getCardTypeName(this.cardType);
		}
	},
	getColors: function () {
		switch (this.kind) {
			case "personal":
				return "Personal";
			case "free":
				return "Free";
			case "edu":
				return "Edu";
			case "pro":
				return "Pro";
		}
	},
	getName: function () {
		let shuffled = "";
		if (this.shuffled) {
			shuffled = TAPi18n.__('admin.shuffled') + " ";
		}
		return shuffled;
	},
	firstItem: function (index) {
		return index === 0;
	},
	canSeeNavigationItems: function () {
		return (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor']) || this.owner === Meteor.userId());
	}
});
