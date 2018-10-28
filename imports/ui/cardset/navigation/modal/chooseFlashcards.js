//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cards} from "../../../../api/cards";
import {CardType} from "../../../../api/cardTypes";
import "./chooseFlashcards.html";

/*
* ############################################################################
* chooseFlashcards
* ############################################################################
*/


Template.chooseFlashcards.created = function () {
	let chooseFlashcardsFilter = [];
	chooseFlashcardsFilter[0] = [];
	chooseFlashcardsFilter[1] = [0, 1, 2, 3, 4, 5];
	Session.set('chooseFlashcardsFilter', chooseFlashcardsFilter);
};

Template.chooseFlashcards.helpers({
	getCardCount: function (category, item) {
		let cardsetFilter = Router.current().params._id;
		if (this.shuffled) {
			cardsetFilter = {$in: this.cardGroups};
		}
		if (category === 0) {
			return 0;
		} else if (category === 1) {
			return Cards.find({
				cardset_id: cardsetFilter,
				learningGoalLevel: item
			}).count();
		} else {
			let chooseFlashcardsFilter = Session.get('chooseFlashcardsFilter');
			if ((chooseFlashcardsFilter[1].length) === 0) {
				return 0;
			}
			let learningGoalLevelFilter = {$ne: null};
			if (chooseFlashcardsFilter[1].length) {
				learningGoalLevelFilter = {$in: chooseFlashcardsFilter[1]};
			}
			return Cards.find({
				cardset_id: cardsetFilter,
				learningGoalLevel: learningGoalLevelFilter
			}).count();
		}
	},
	gotLearningGoal: function () {
		return CardType.gotLearningGoal(this.cardType);
	},
	getSortMode: function () {
		let chooseFlashcardsFilter = Session.get('chooseFlashcardsFilter');
		if (chooseFlashcardsFilter[0] === 0) {
			return TAPi18n.__('filter-cards.sortMode0');
		} else {
			return TAPi18n.__('filter-cards.sortMode1');
		}
	},
	isPresentationMode: function () {
		return Session.get('chooseFlashcardsMode');
	}
});

Template.chooseFlashcards.events({
	"click #createCardFilter": function () {
		$('#chooseFlashcardsModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	},
	"click .sortFilter": function () {
		let chooseFlashcardsFilter = Session.get('chooseFlashcardsFilter');
		if (chooseFlashcardsFilter[0] === 0) {
			chooseFlashcardsFilter[0] = 1;
		} else {
			chooseFlashcardsFilter[0] = 0;
		}
		Session.set('chooseFlashcardsFilter', chooseFlashcardsFilter);
	}
});

Template.chooseFlashcards.onRendered(function () {
	$('#chooseFlashcardsModal').on('hidden.bs.modal', function () {
		let chooseFlashcardsFilter = [""];
		chooseFlashcardsFilter[0] = [];
		chooseFlashcardsFilter[1] = [0, 1, 2, 3, 4, 5];
		Session.set('chooseFlashcardsFilter', chooseFlashcardsFilter);
	});
});

/*
* ############################################################################
* chooseFlashcardsButton
* ############################################################################
*/

Template.chooseFlashcardsButton.helpers({
	inFlashcardFilterSelection: function (category, item) {
		return Session.get('chooseFlashcardsFilter')[category].includes(item);
	}
});

Template.chooseFlashcardsButton.events({
	"click .addCardFilter": function (event) {
		let category = $(event.target).data('category');
		let chooseFlashcardsFilter = Session.get('chooseFlashcardsFilter');
		let item = $(event.target).data('item');
		chooseFlashcardsFilter[category].push(item);
		Session.set('chooseFlashcardsFilter', chooseFlashcardsFilter);
	},
	"click .removeCardFilter": function (event) {
		let category = $(event.target).data('category');
		let chooseFlashcardsFilter = Session.get('chooseFlashcardsFilter');
		let item = $(event.target).data('item');
		let pos = chooseFlashcardsFilter[category].indexOf(item);
		chooseFlashcardsFilter[category].splice(pos, 1);
		Session.set('chooseFlashcardsFilter', chooseFlashcardsFilter);
	}
});
