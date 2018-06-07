import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Cards} from "../../api/cards";
import {CardEditor} from "../../api/cardEditor";
import {Route} from "../../api/route";
import {Leitner} from "../../api/learned";
import {CardVisuals} from "../../api/cardVisuals";
import {CardIndex} from "../../api/cardIndex";
import {Cardsets} from "../../api/cardsets";
import {CardType} from "../../api/cardTypes";
import "./header.html";
import {MarkdeepEditor} from "../../api/markdeepEditor";

/*
 * ############################################################################
 * flashcardHeader
 * ############################################################################
 */

Template.flashcardHeader.helpers({
	isEditModeOrPresentation: function () {
		return Route.isEditModeOrPresentation();
	}
});

/*
 * ############################################################################
 * flashcardHeaderDefault
 * ############################################################################
 */

Template.flashcardHeaderDefault.events({
	"click .cardHeader": function (evt) {
		if (!CardType.gotOneColumn($(evt.target).data('cardtype')) && ($(evt.target).data('type') !== "cardNavigation")  && !$(evt.target).is('a, a *')) {
			CardVisuals.turnCard();
		}
	}
});

/*
* ############################################################################
* flashcardHeaderPresentation
* ############################################################################
*/

Template.flashcardHeaderPresentation.helpers({
	gotAlternativeHintStyle: function () {
		return CardType.gotAlternativeHintStyle(this.cardType);
	},
	isHintPreview: function () {
		return Session.get('activeEditMode') === 2;
	},
	isLecturePreview: function () {
		if (CardType.gotLecture(this.cardType)) {
			return Session.get('activeEditMode') === 3;
		}
	},
	isPresentation: function () {
		return Route.isPresentation();
	}
});

/*
 * ############################################################################
 * flashcardHeaderContentCenter
 * ############################################################################
 */

Template.flashcardHeaderContentCenter.helpers({
	isCardset: function () {
		return Route.isCardset();
	},
	isMemo: function () {
		return Route.isMemo();
	},
	isEditModeOrPresentation: function () {
		return Route.isEditModeOrPresentation();
	},
	box: function () {
		return Session.get("selectedBox");
	},
	isQuestionSide: function () {
		return Session.get('isQuestionSide');
	},
	displaysLearningGoalInformation: function () {
		return CardType.displaysLearningGoalInformation(this.cardType);
	},
	displaysSideInformation: function () {
		return CardType.displaysSideInformation(this.cardType);
	},
	gotSidesSwapped: function () {
		return CardType.gotSidesSwapped(this.cardType);
	},
	getCardsetName: function () {
		return Cardsets.findOne({_id: this.cardset_id}).name;
	},
	getLearningGoalName: function () {
		return TAPi18n.__('learning-goal.level' + (this.learningGoalLevel + 1));
	},
	gotDictionary: function () {
		return CardType.gotDictionary(this.cardType);
	},
	getFrontTitle: function () {
		return CardType.getFrontTitle(this.cardType);
	},
	getBackTitle: function () {
		return CardType.getBackTitle(this.cardType);
	},
	reversedViewOrder: function () {
		return Session.get('reverseViewOrder');
	},
	getPlaceholder: function (mode) {
		CardEditor.getPlaceholder(mode);
	}
});

/*
 * ############################################################################
 * flashcardHeaderPresentationLeft
 * ############################################################################
 */

Template.flashcardHeaderPresentationLeft.helpers({
	isMemo: function () {
		return Route.isMemo();
	},
	isEditMode: function () {
		return (Route.isEditMode() && !Session.get('fullscreen'));
	},
	box: function () {
		return Session.get("selectedBox");
	},
	isQuestionSide: function () {
		return Session.get('isQuestionSide');
	},
	gotSidesSwapped: function () {
		return CardType.gotSidesSwapped(this.cardType);
	},
	gotDictionary: function () {
		return CardType.gotDictionary(this.cardType);
	},
	getPlaceholder: function (mode) {
		CardEditor.getPlaceholder(mode);
	},
	isDictionary: function () {
		if (CardType.gotDictionary(this.cardType)) {
			return Session.get('dictionaryPreview');
		}
	}
});

Template.flashcardHeaderPresentationLeft.events({
	"click #showLecture": function () {
		MarkdeepEditor.displayDictionary();
	}
});

/*
 * ############################################################################
 * flashcardHeaderPresentationRight
 * ############################################################################
 */

Template.flashcardHeaderPresentationRight.helpers({
	cardsIndex: function (card_id) {
		let cardIndex = CardIndex.getCardIndex();
		return cardIndex.findIndex(item => item === card_id) + 1;
	},
	isDemo: function () {
		return Route.isDemo();
	},
	isMemo: function () {
		return Route.isMemo();
	},
	box: function () {
		return Session.get("selectedBox");
	},
	isQuestionSide: function () {
		return Session.get('isQuestionSide');
	},
	gotSidesSwapped: function () {
		return CardType.gotSidesSwapped(this.cardType);
	},
	getCardsetCount: function (getQuantityValue) {
		if (getQuantityValue) {
			let cardset;
			if (Route.isDemo()) {
				cardset = Cardsets.findOne({kind: 'demo', shuffled: true});
			} else {
				cardset = Cardsets.findOne(Router.current().params._id);
			}
			if (cardset.shuffled) {
				let quantity = 0;
				cardset.cardGroups.forEach(function (cardset_id) {
					if (cardset_id !== Router.current().params._id) {
						quantity += Cardsets.findOne(cardset_id).quantity;
					}
				});
				return quantity;
			} else {
				return cardset.quantity;
			}
		} else {
			if (Route.isDemo()) {
				return Cardsets.findOne({kind: 'demo', shuffled: true}).count();
			} else {
				return Cards.find({cardset_id: Router.current().params._id}).count();
			}
		}
	},
	getPlaceholder: function (mode) {
		CardEditor.getPlaceholder(mode);
	},
	isWorkloadFullscreen: function () {
		return Session.get("workloadFullscreenMode");
	}
});

Template.flashcardHeaderPresentationRight.events({
	"click .endPresentation": function () {
		Router.go('cardsetdetailsid', {
			_id: Router.current().params._id
		});
	},
	"click .selectCard": function (evt) {
		Session.set('activeCard', $(evt.target).data('id'));
		if (Route.isDemo()) {
			Router.go('demolist');
		} else {
			Router.go('presentationlist', {
				_id: Router.current().params._id
			});
		}
	},
	"click #toggleFullscreen": function () {
		CardVisuals.toggleFullscreen();
	}
});

/*
 * ############################################################################
 * flashcardHeaderContentDefaultLeft
 * ############################################################################
 */

Template.flashcardHeaderContentDefaultLeft.helpers({
	isCardset: function () {
		return Route.isCardset();
	},
	isMemo: function () {
		return Route.isMemo();
	},
	box: function () {
		return Session.get("selectedBox");
	},
	gotSidesSwapped: function () {
		return CardType.gotSidesSwapped(this.cardType);
	},
	gotHint: function () {
		return (CardType.gotHint(this.cardType) && this.hint !== "" && this.hint !== undefined);
	},
	gotDictionary: function () {
		return CardType.gotDictionary(this.cardType);
	},
	gotLecture: function () {
		return CardType.gotLecture(this.cardType) && this.lecture !== "" && this.lecture !== undefined;
	},
	getPlaceholder: function (mode) {
		CardEditor.getPlaceholder(mode);
	},
	isShuffledCardset: function () {
		if (Route.isDemo()) {
			return Cardsets.findOne({kind: 'demo', shuffled: true}).shuffled;
		} else {
			return Cardsets.findOne({_id: Router.current().params._id}).shuffled;
		}
	}
});

Template.flashcardHeaderContentDefaultLeft.events({
	"click #copyCard": function (evt) {
		Session.set('activeCard', $(evt.target).data('id'));
		$('#copyCard').children().addClass("pressed");
	},
	"click #editCard": function (evt) {
		Session.set('activeCard', $(evt.target).data('id'));
	},
	"click #showHint": function (evt) {
		Session.set('selectedHint', $(evt.target).data('id'));
		$('#showHint').children().addClass("pressed");
	},
	"click #showLecture": function (evt) {
		setTimeout(function () {
			$('html, body').animate({
				scrollTop: $($(evt.target).data('target')).offset().top
			}, 1000);
		}, 500);
		if (!$('#showLecture').children().hasClass("pressed")) {
			$('#showLecture').children().addClass("pressed");
		} else {
			$('#showLecture').children().removeClass("pressed");
		}
	}
});

/*
 * ############################################################################
 * flashcardHeaderContentDefaultRight
 * ############################################################################
 */

Template.flashcardHeaderContentDefaultRight.helpers({
	cardsIndex: function (card_id) {
		let cardIndex = CardIndex.getCardIndex();
		return cardIndex.findIndex(item => item === card_id) + 1;
	},
	isBox: function () {
		return Route.isBox();
	},
	isCardset: function () {
		return Route.isCardset();
	},
	isMemo: function () {
		return Route.isMemo();
	},
	box: function () {
		return Session.get("selectedBox");
	},
	isQuestionSide: function () {
		return Session.get('isQuestionSide');
	},
	gotSidesSwapped: function () {
		return CardType.gotSidesSwapped(this.cardType);
	},
	countLeitner: function () {
		var maxIndex = Leitner.find({
			cardset_id: Session.get('activeCardset')._id,
			user_id: Meteor.userId(),
			active: true
		}).count();
		Session.set('maxIndex', maxIndex);
		return maxIndex;
	},
	getCardsetCount: function (getQuantityValue) {
		if (getQuantityValue) {
			let cardset;
			if (Route.isDemo()) {
				cardset = Cardsets.findOne({kind: 'demo', shuffled: true});
			} else {
				cardset = Cardsets.findOne(Router.current().params._id);
			}
			if (cardset.shuffled) {
				let quantity = 0;
				cardset.cardGroups.forEach(function (cardset_id) {
					if (cardset_id !== Router.current().params._id) {
						quantity += Cardsets.findOne(cardset_id).quantity;
					}
				});
				return quantity;
			} else {
				return cardset.quantity;
			}
		} else {
			if (Route.isDemo()) {
				return Cardsets.findOne({kind: 'demo', shuffled: true}).count();
			} else {
				return Cards.find({cardset_id: Router.current().params._id}).count();
			}
		}
	},
	gotDictionary: function () {
		return CardType.gotDictionary(this.cardType);
	},
	reversedViewOrder: function () {
		return Session.get('reverseViewOrder');
	},
	gotOneColumn: function () {
		return CardType.gotOneColumn(this.cardType);
	},
	gotBack: function () {
		if (CardType.gotOneColumn(this.cardType)) {
			return true;
		}
		if (CardType.gotBack(this.cardType)) {
			return this.back !== '' && this.back !== undefined;
		} else {
			return false;
		}
	},
	getPlaceholder: function (mode) {
		CardEditor.getPlaceholder(mode);
	},
	isWorkloadFullscreen: function () {
		return Session.get("workloadFullscreenMode");
	},
	isEditMode: function () {
		return Route.isEditMode();
	}
});

Template.flashcardHeaderContentDefaultRight.events({
	"click #swapOrder": function () {
		if (Session.get('reverseViewOrder')) {
			Session.set('reverseViewOrder', false);
			if (Route.isEditMode()) {
				CardVisuals.turnFront(true);
			} else {
				if (Route.isPresentation()) {
					CardEditor.editFront();
				} else {
					CardVisuals.turnFront();
				}
			}
		} else {
			Session.set('reverseViewOrder', true);
			if (Route.isEditMode()) {
				CardVisuals.turnBack(true);
			} else {
				if (Route.isPresentation()) {
					CardEditor.editBack();
				} else {
					CardVisuals.turnBack();
				}
			}
		}
	},
	"click #toggleFullscreen": function () {
		if (Session.get("workloadFullscreenMode")) {
			Session.set("workloadFullscreenMode", false);
			CardVisuals.toggleFullscreen();
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		} else {
			CardVisuals.toggleFullscreen();
		}
	}
});
