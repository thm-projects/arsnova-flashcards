//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Leitner, Wozniak} from "../../api/learned.js";
import "../cardset/cardset.js";
import {cleanModal} from "../forms/cardsetCourseIterationForm.js";
import "./cardsets.html";
import {getCardTypeName} from "../../api/cardTypes";

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
 * create
 * ############################################################################
 */

Template.create.helpers({
	cardsetList: function () {
		return Cardsets.find({
			owner: Meteor.userId()
		}, {
			sort: {name: 1}
		});
	}
});

Template.create.onCreated(function () {
	Session.set('moduleActive', true);
});

Template.create.onRendered(function () {
	cleanModal();
});
/*
 * ############################################################################
 * learn
 * ############################################################################
 */

Template.learn.helpers({
	learnList: function () {
		var leitnerCards = Leitner.find({
			user_id: Meteor.userId()
		});

		let wozniakCards = Wozniak.find({
			user_id: Meteor.userId()
		});
		var learnCardsets = [];
		leitnerCards.forEach(function (leitnerCard) {
			if ($.inArray(leitnerCard.cardset_id, learnCardsets) === -1) {
				learnCardsets.push(leitnerCard.cardset_id);
			}
		});

		wozniakCards.forEach(function (wozniakCard) {
			if ($.inArray(wozniakCard.cardset_id, learnCardsets) === -1) {
				learnCardsets.push(wozniakCard.cardset_id);
			}
		});
		return Cardsets.find({
			_id: {
				$in: learnCardsets
			}
		}, {
			sort: {name: 1}
		});
	}
});

Template.learn.events({
	'click .deleteLearned': function (event) {
		Session.set('cardsetId', $(event.target).data('id'));
	},
	'click #browseCardset': function () {
		Session.set("selectingCardsetToLearn", true);
		Router.go('pool');
	}
});

/*
 * ############################################################################
 * cardsetRow
 * ############################################################################
 */

Template.cardsetRow.events({
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
		Session.set("workloadFullscreenMode", true);
		Router.go('box', {
			_id: $(event.target).data('id')
		});
	},
	"click .learnWozniak": function (event) {
		Session.set("workloadFullscreenMode", true);
		Router.go('box', {
			_id: $(event.target).data('id')
		});
	},
	"click .learnSelect": function (event) {
		Session.set("activeCardset", $(event.target).data('id'));
	}
});

Template.cardsetRow.helpers({
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
	getWorkload: function () {
		let count = getLeitnerCount(this) + getWozniakCount(this);
		switch (count) {
			case 0:
				return TAPi18n.__('set-list.noCardsToLearn');
			case 1:
				return TAPi18n.__('set-list.cardsToLearn');
			default:
				return count + TAPi18n.__('set-list.cardsToLearnPlural');
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
	},
	gotDescription: function (text) {
		if (text !== "" && text !== undefined) {
			return true;
		}
	},
	getCardTypeName: function () {
		return getCardTypeName(this.cardType);
	}
});

/*
 * ############################################################################
 * shuffle
 * ############################################################################
 */

Template.shuffle.events({
	'click #createShuffledCardset': function () {
		Session.set("ShuffleTemplate", Cardsets.findOne({_id: Session.get("ShuffledCardsets")[0]}));
		cleanModal();
	},
	'click #updateShuffledCardset': function () {
		let removedCardsets = $(Cardsets.findOne({_id: Router.current().params._id}).cardGroups).not(Session.get("ShuffledCardsets")).get();
		Meteor.call("updateShuffleGroups", Router.current().params._id, Session.get("ShuffledCardsets"), removedCardsets, function (error, result) {
			if (error) {
				Bert.alert(TAPi18n.__('set-list.shuffleUpdateFailure'), 'danger', 'growl-top-left');
			}
			if (result) {
				Bert.alert(TAPi18n.__('set-list.shuffleUpdateSuccess'), 'success', 'growl-top-left');
				Router.go('cardsetdetailsid', {_id: Router.current().params._id});
			}
		});
	},
	'click #cancelUpdateShuffle': function () {
		Router.go('cardsetdetailsid', {_id: Router.current().params._id});
	},
	'click #removeShuffledCards': function () {
		Session.set("ShuffledCardsets", []);
	}
});

Template.shuffle.helpers({
	shuffleInfoText: function () {
		return TAPi18n.__('set-list.shuffleInfoText');
	},
	shuffleList: function () {
		if (Router.current().route.getName() === "editshuffle") {
			Session.set("ShuffledCardsets", Cardsets.findOne({_id: Router.current().params._id}).cardGroups);
		}
		return Cardsets.find({
			$or: [
				{owner: Meteor.userId()},
				{kind: {$in: ["free", "edu"]}}
			]
		}, {
			fields: {
				name: 1,
				description: 1,
				quantity: 1,
				cardType: 1
			},
			sort: {name: 1}
		});
	},
	gotShuffledCards: function () {
		if (ActiveRoute.name('shuffle')) {
			return Session.get("ShuffledCardsets").length > 0;
		} else {
			return true;
		}
	},
	displayRemoveButton: function () {
		return Session.get("ShuffledCardsets").length > 0;
	},
	isActiveCardset: function () {
		return this._id === Router.current().params._id;
	}
});

Template.shuffle.created = function () {
	Session.set("ShuffledCardsets", []);
	Session.set("ShuffledCardsetsExclude", []);
};

/*
 * ############################################################################
 * cardsets
 * ############################################################################
 */

Template.cardsets.onCreated(function () {
	Session.set("selectingCardsetToLearn", false);
});

/*
 * ############################################################################
 * cardsetsConfirmLearnForm
 * ############################################################################
 */

Template.cardsetsConfirmLearnForm.events({
	'click #learnDelete': function () {
		$('#confirmLearnModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteLeitner", Session.get('cardsetId'));
			Meteor.call("deleteWozniak", Session.get('cardsetId'));
		}).modal('hide');
	}
});

/*
 * ############################################################################
 * selectModeForm
 * ############################################################################
 */

Template.selectModeForm.events({
	'click #learnBox': function () {
		$('#selectModeToLearnModal').on('hidden.bs.modal', function () {
			Session.set("workloadFullscreenMode", true);
			Router.go('box', {
				_id: Session.get("activeCardset")
			});
		}).modal('hide');
	},
	'click #learnMemo': function () {
		$('#selectModeToLearnModal').on('hidden.bs.modal', function () {
			Session.set("workloadFullscreenMode", true);
			Router.go('memo', {
				_id: Session.get("activeCardset")
			});
		}).modal('hide');
	}
});
