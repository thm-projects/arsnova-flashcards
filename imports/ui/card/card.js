//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Cards} from "../../api/cards.js";
import {Leitner} from "../../api/learned.js";
import "./card.html";
import '/client/hammer.js';
import {skipAnswer} from "../learn/learn.js";
import {CardVisuals} from "../../api/cardVisuals.js";
import ResizeSensor from "../../../client/resize_sensor/ResizeSensor.js";
import {CardType} from "../../api/cardTypes";
import {MarkdeepEditor} from "../../api/markdeepEditor.js";
import {CardIndex} from "../../api/cardIndex.js";
import {Route} from "../../api/route.js";
import {CardEditor} from "../../api/cardEditor.js";

/*
 * ############################################################################
 * cardHint
 * ############################################################################
 */

Template.cardHint.helpers({
	gotAlternativeHintStyle: function (cardType) {
		return CardType.gotAlternativeHintStyle(cardType);
	},
	getHintTitle: function () {
		return CardType.getHintTitle();
	},
	isHintPreview: function () {
		return (Session.get('activeEditMode') === 2 && Route.isEditModeOrPresentation());
	}
});

/*
 * ############################################################################
 * cardHintContent
 * ############################################################################
 */

Template.cardHintContent.helpers({
	getHint: function () {
		if (Route.isEditMode()) {
			return Session.get('hintText');
		} else if (Route.isPresentation()) {
			return this.hint;
		} else if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).hint;
		}
	},
	getPlaceholder: function () {
		return CardType.getPlaceholderText(2);
	},
	gotHint: function () {
		let hint;
		if (Route.isEditMode()) {
			return Session.get('hintText');
		} else if (Route.isPresentation()) {
			hint = this.hint;
		} else if (Session.get('selectedHint')) {
			hint = Cards.findOne({_id: Session.get('selectedHint')}).hint;
		}
		return hint !== '' && hint !== undefined;
	},
	isCentered: function () {
		if (Route.isEditMode()) {
			return Session.get('centerTextElement')[2];
		} else if (Route.isPresentation()) {
			return this.centerTextElement[2];
		} else if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).centerTextElement[2];
		}
	},
	isEditMode: function () {
		return Route.isEditMode();
	}
});

/*
 * ############################################################################
 * cardSubject
 * ############################################################################
 */
Template.cardSubject.helpers({
	getSubject: function () {
		if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).subject;
		} else {
			if (this.subject) {
				return this.subject;
			} else {
				return CardType.getSubjectPlaceholderText(Session.get('cardType'));
			}
		}
	},
	gotLearningUnit: function () {
		if (Session.get('selectedHint')) {
			let card = Cards.findOne({_id: Session.get('selectedHint')});
			return (CardType.gotLearningUnit(card.cardType) && card.learningUnit !== "0");
		} else {
			return (CardType.gotLearningUnit(this.cardType) && this.learningUnit !== "0");
		}
	},
	getLearningIndex: function () {
		if (Route.isEditMode()) {
			return Session.get('learningIndex');
		} else if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).learningIndex;
		} else {
			return this.learningIndex;
		}
	},
	getLearningUnit: function () {
		if (Route.isEditMode()) {
			return Session.get('learningUnit');
		} else if (Session.get('selectedHint')) {
			return Cards.findOne({_id: Session.get('selectedHint')}).learningUnit;
		} else {
			return this.learningUnit;
		}
	}
});

/*
 * ############################################################################
 * cardFrontContent
 * ############################################################################
 */
Template.cardFrontContent.helpers({
	isCentered: function () {
		if (CardType.gotSidesSwapped(this.cardType)) {
			return CardVisuals.isCentered(1, this.centerTextElement);
		} else {
			return CardVisuals.isCentered(0, this.centerTextElement);
		}
	},
	gotFront: function () {
		if (Route.isEditMode()) {
			return true;
		} else {
			return this.front !== '' && this.front !== undefined;
		}
	},
	getPlaceholder: function (mode) {
		return CardType.getPlaceholderText(mode, this.cardType, this.learningGoalLevel);
	}
});

/*
 * ############################################################################
 * cardBackContent
 * ############################################################################
 */
Template.cardBackContent.helpers({
	isCentered: function () {
		if (CardType.gotSidesSwapped(this.cardType)) {
			return CardVisuals.isCentered(0, this.centerTextElement);
		} else {
			return CardVisuals.isCentered(1, this.centerTextElement);
		}
	},
	gotBack: function () {
		if (Route.isEditMode()) {
			return true;
		} else {
			return this.back !== '' && this.back !== undefined;
		}
	},
	getPlaceholder: function (mode) {
		return CardType.getPlaceholderText(mode, this.cardType);
	}
});

/*
 * ############################################################################
 * cardLectureContent
 * ############################################################################
 */
Template.cardLectureContent.helpers({
	isCentered: function () {
		return CardVisuals.isCentered(3, this.centerTextElement, this.cardType);
	},
	gotLecture: function () {
		if (Route.isEditMode()) {
			return true;
		} else {
			return this.lecture !== '' && this.lecture !== undefined;
		}
	},
	getPlaceholder: function (mode) {
		return CardType.getPlaceholderText(mode, this.cardType);
	},
	gotDictionary: function () {
		return CardType.gotDictionary(this.cardType);
	}
});

/*
 * ############################################################################
 * cardHintContentPreview
 * ############################################################################
 */

Template.cardHintContentPreview.helpers({
	getPlaceholder: function (mode) {
		if (Route.isPresentation()) {
			return CardType.getPlaceholderText(mode, this.cardType);
		}
	},
	gotHint: function () {
		return this.hint !== '' && this.hint !== undefined;
	},
	isCentered: function () {
		return CardVisuals.isCentered(2, this.centerTextElement, this.cardType);
	}
});

/*
 * ############################################################################
 * flashcards
 * ############################################################################
 */


Template.flashcards.onCreated(function () {
	Session.set('activeCardset', Cardsets.findOne({"_id": Router.current().params._id}));
	Session.set('reverseViewOrder', false);
	Session.set('selectedHint', undefined);
	Session.set('isQuestionSide', true);
});

let resizeInterval;
Template.flashcards.onRendered(function () {
	if (!Route.isEditMode()) {
		Session.set('activeEditMode', 0);
	}
	if (window.innerWidth <= 1400) {
		if (Router.current().route.getName() === "cardsetdetailsid") {
			let mc = new Hammer.Manager(document.getElementById('set-details-region'));
			mc.add(new Hammer.Swipe({direction: Hammer.DIRECTION_HORIZONTAL, threshold: 50}));
			mc.on("swipe", function (ev) {
				if (ev.deltaX < 0) {
					document.getElementById('rightCarouselControl').click();
				} else {
					document.getElementById('leftCarouselControl').click();
				}
			});
		}
	}
	$(".box").on('transitionend webkitTransitionEnd oTransitionEnd', function () {
		$(".box").removeClass("disableCardTransition");
	});
	if (Session.get("workloadFullscreenMode")) {
		CardVisuals.toggleFullscreen();
	}
	$('#showHintModal').on('hidden.bs.modal', function () {
		$('#showHint').children().removeClass("pressed");
		Session.set('selectedHint', undefined);
	});
	$('#showCopyCardModal').on('hidden.bs.modal', function () {
		$('#copyCard').children().removeClass("pressed");
	});
	new ResizeSensor($('#cardCarousel'), function () {
		CardVisuals.resizeFlashcard();
	});
	CardVisuals.resizeFlashcard();
});

Template.flashcards.onDestroyed(function () {
	if (resizeInterval !== undefined) {
		clearInterval(resizeInterval);
		resizeInterval = undefined;
	}
});

Template.flashcards.helpers({
	cardActive: function () {
		if (Route.isNewCard()) {
			return true;
		}
		if (Session.get('activeCard')) {
			return Session.get('activeCard') === this._id;
		} else {
			let cardIndex = CardIndex.getCardIndex();
			if (this._id === cardIndex[0]) {
				return true;
			}
		}
	},
	cardsIndex: function (card_id) {
		let cardIndex = CardIndex.getCardIndex();
		return cardIndex.findIndex(item => item === card_id) + 1;
	},
	isLearningActive: function () {
		return Session.get('activeCardset').learningActive;
	},
	isBox: function () {
		return Route.isBox();
	},
	isCardset: function () {
		return Route.isCardset();
	},
	isCardsetOrPresentation: function () {
		return Route.isCardset() || Route.isPresentation();
	},
	isPresentation: function () {
		return Route.isPresentation();
	},
	isDemo: function () {
		return Route.isDemo();
	},
	isMemo: function () {
		return Route.isMemo();
	},
	isEditMode: function () {
		return (Route.isEditMode() && !Session.get('fullscreen'));
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
	cardCountOne: function () {
		var cardset = Session.get('activeCardset');
		var count = Cards.find({
			cardset_id: cardset._id
		}).count();
		return count === 1;
	},
	displaysLearningGoalInformation: function () {
		return CardType.displaysLearningGoalInformation(this.cardType);
	},
	displaysSideInformation: function () {
		return CardType.displaysSideInformation(this.cardType);
	},
	getCards: function () {
		if (Route.isBox()) {
			return CardIndex.getLeitnerCards();
		}
		if (Route.isCardset() || Route.isPresentation() || Route.isDemo()) {
			return CardIndex.getCardsetCards();
		}
		if (Route.isMemo()) {
			return CardIndex.getMemoCards();
		}
		if (Route.isEditMode()) {
			return CardIndex.getEditModeCard();
		}
	},
	gotAlternativeHintStyle: function () {
		return CardType.gotAlternativeHintStyle(this.cardType);
	},
	gotSidesSwapped: function () {
		return CardType.gotSidesSwapped(this.cardType);
	},
	countBox: function () {
		var maxIndex = Leitner.find({
			cardset_id: Session.get('activeCardset')._id,
			user_id: Meteor.userId(),
			box: parseInt(Session.get('selectedBox'))
		}).count();
		Session.set('maxIndex', maxIndex);
		return maxIndex;
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
				cardset = Cardsets.findOne("DemoCardset0");
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
				return Cardsets.findOne("DemoCardset0").count();
			} else {
				return Cards.find({cardset_id: Router.current().params._id}).count();
			}
		}
	},
	getCardsetName: function () {
		return Cardsets.findOne({_id: this.cardset_id}).name;
	},
	getCardTypeName: function () {
		return TAPi18n.__('card.cardType' + this.cardType + '.name');
	},
	getLearningGoalName: function () {
		return TAPi18n.__('learning-goal.level' + (this.learningGoalLevel + 1));
	},
	gotHint: function () {
		return (CardType.gotHint(this.cardType) && this.hint !== "" && this.hint !== undefined);
	},
	gotDictionary: function () {
		return CardType.gotDictionary(this.cardType);
	},
	gotLecture: function () {
		return CardType.gotLecture(this.cardType);
	},
	getFrontTitle: function () {
		return CardType.getFrontTitle(this.cardType);
	},
	getBackTitle: function () {
		return CardType.getBackTitle(this.cardType);
	},
	gotDifficultyLevel: function () {
		return CardType.gotDifficultyLevel(this.cardType);
	},
	gotLearningGoal: function () {
		return CardType.gotLearningGoal(this.cardType);
	},
	gotNotesForDifficultyLevel: function () {
		return CardType.gotNotesForDifficultyLevel(this.cardType);
	},
	reversedViewOrder: function () {
		return Session.get('reverseViewOrder');
	},
	isFrontPreview: function () {
		return (Session.get('activeEditMode') === 0 && Route.isEditModeOrPresentation() && !Session.get('dictionaryPreview'));
	},
	isLecturePreview: function () {
		if (CardType.gotLecture(this.cardType)) {
			return (Session.get('activeEditMode') === 3 && Route.isEditModeOrPresentation());
		}
	},
	isDictionaryPreview: function () {
		if (CardType.gotDictionary(this.cardType)) {
			return Session.get('dictionaryPreview') && Route.isEditMode();
		}
	},
	isHintPreview: function () {
		return (Session.get('activeEditMode') === 2 && Route.isEditModeOrPresentation());
	},
	isCentered: function (type) {
		return CardVisuals.isCentered(type);
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
	gotFront: function () {
		return this.front !== '' && this.front !== undefined;
	},
	getPlaceholder: function (mode) {
		CardEditor.getPlaceholder(mode);
	},
	isShuffledCardset: function () {
		if (Route.isDemo()) {
			return Cardsets.findOne({_id: "DemoCardset0"}).shuffled;
		} else {
			return Cardsets.findOne({_id: Router.current().params._id}).shuffled;
		}
	},
	isWorkloadFullscreen: function () {
		return Session.get("workloadFullscreenMode");
	}
});

Template.flashcards.events({
	"click #leftCarouselControl, click #rightCarouselControl": function () {
		if (Session.get('reverseViewOrder')) {
			if (Route.isPresentation) {
				CardEditor.editBack();
			} else {
				CardVisuals.turnBack();
			}
		} else {
			if (Route.isPresentation) {
				CardEditor.editFront();
			} else {
				CardVisuals.turnFront();
			}
		}
		$('#cardCarousel').on('slide.bs.carousel', function () {
			CardVisuals.resizeFlashcard();
		});
		$('#cardCarousel').on('slid.bs.carousel', function () {
			Session.set('activeCard', $(".item.active").data('id'));
			if (Route.isPresentation()) {
				CardEditor.updateNavigation();
			}
		});
	},
	"click .cardHeader": function (evt) {
		if (!Route.isPresentation() && !CardType.gotOneColumn($(evt.target).data('cardtype')) && Session.get('activeEditMode') !== 2 && Session.get('activeEditMode') !== 3 && ($(evt.target).data('type') !== "cardNavigation") && ($(evt.target).data('type') !== "cardImage") && !$(evt.target).is('a, a *')) {
			if (Route.isEditMode() && !Session.get('fullscreen')) {
				CardVisuals.turnCard(true);
			} else {
				CardVisuals.turnCard();
			}
		}
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
	},
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
					CardEditor.turnBack();
				}
			}
		}
	},
	"click #editCard": function (evt) {
		Session.set('activeCard', $(evt.target).data('id'));
	},
	"click #copyCard": function (evt) {
		Session.set('activeCard', $(evt.target).data('id'));
		$('#copyCard').children().addClass("pressed");
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
	},
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
	}
});

/*
 * ############################################################################
 * cardDictionaryContent
 * ############################################################################
 */

Template.cardDictionaryContent.helpers({
	getDictionarySearchText: function () {
		let searchText;
		if (Session.get('isQuestionSide')) {
			searchText = this.front.trim();
		} else {
			searchText = this.back.trim();
		}
		let wordCount = searchText.split(/\s+/);
		if (wordCount.length === 1) {
			return "&query=" + searchText;
		}
	}
});

/*
 * ############################################################################
 * flashcardsEmpty
 * ############################################################################
 */

Template.flashcardsEmpty.onCreated(function () {
	if (Session.get('fullscreen')) {
		CardVisuals.toggleFullscreen();
	}
	Session.set('reverseViewOrder', false);
});

Template.flashcardsEmpty.helpers({
	isBox: function () {
		return Route.isBox();
	},
	isCardset: function () {
		return Route.isCardset();
	}
});

Template.flashcardsEmpty.onRendered(function () {
	$('.carousel-inner').css('min-height', 0);
});

/*
 * ############################################################################
 * flashcardsEnd
 * ############################################################################
 */

Template.flashcardsEnd.onCreated(function () {
	if (Session.get('fullscreen')) {
		CardVisuals.toggleFullscreen();
	}
});

Template.flashcardsEnd.onRendered(function () {
	$('.carousel-inner').css('min-height', 0);
});

/*
 * ############################################################################
 * copyCard
 * ############################################################################
 */

Template.copyCard.helpers({
	cardsetList: function () {
		return Cardsets.find({
			owner: Meteor.userId(),
			shuffled: false,
			_id: {$nin: [Router.current().params._id]}
		}, {
			fields: {name: 1},
			sort: {name: 1}
		});
	}
});

Template.copyCard.events({
	"click .copyCardset": function (evt) {
		Meteor.call("copyCard", Router.current().params._id, $(evt.target).data('id'), Session.get('activeCard'), function (error, result) {
			if (result) {
				$('#showCopyCardModal').modal('hide');
				$('body').removeClass('modal-open');
				$('.modal-backdrop').remove();
				Bert.alert(TAPi18n.__('copycardSuccess'), "success", 'growl-top-left');
			}
		});
	}
});

Meteor.startup(function () {
	$(document).on('keydown', function (event) {
		if (event.keyCode === 27) {
			if (Route.isPresentation()) {
				if (!$("#endPresentationModal").is(':visible')) {
					$('#endPresentationModal').modal('show');
				}
			} else {
				CardVisuals.toggleFullscreen(true);
			}
		}
		if (Session.get('fullscreen') && !isEditorFullscreen) {
			if ([9, 27, 32, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 78, 89, 90, 96, 97, 98, 99, 100, 101].indexOf(event.keyCode) > -1) {
				switch (event.keyCode) {
					case 9:
						if (isPresentation()) {
							MarkdeepEditor.cardSideNavigation();
						}
						break;
					case 32:
						if ($('#rightCarouselControl').click()) {
							$('#showHintModal').modal('hide');
							$('body').removeClass('modal-open');
							$('.modal-backdrop').remove();
						}
						if (Session.get('isQuestionSide')) {
							skipAnswer();
						}
						break;
					case 27:
						if (isPresentation()) {
							$(".endPresentation").click();
						}
						break;
					case 37:
						if ($('#leftCarouselControl').click()) {
							$('#showHintModal').modal('hide');
							$('body').removeClass('modal-open');
							$('.modal-backdrop').remove();
						}
						if (Session.get('isQuestionSide')) {
							skipAnswer(false);
						}
						break;
					case 38:
						if (isEditMode()) {
							turnFront(true);
						} else {
							turnFront();
						}
						break;
					case 39:
						if ($('#rightCarouselControl').click()) {
							$('#showHintModal').modal('hide');
							$('body').removeClass('modal-open');
							$('.modal-backdrop').remove();
						}
						if (Session.get('isQuestionSide')) {
							skipAnswer();
						}
						break;
					case 40:
						if (isEditMode()) {
							turnBack(true);
						} else {
							turnBack();
						}
						break;
					case 48:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate0').click();
						}
						break;
					case 49:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate1').click();
						}
						break;
					case 50:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate2').click();
						}
						break;
					case 51:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate3').click();
						}
						break;
					case 52:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate4').click();
						}
						break;
					case 53:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate5').click();
						}
						break;
					case 78:
						if (!Session.get('isQuestionSide')) {
							$('#notknown').click();
						}
						break;
					case 89:
						if (!Session.get('isQuestionSide')) {
							$('#known').click();
						} else {
							$('#learnShowAnswer').click();
						}
						break;
					case 90:
						if (!Session.get('isQuestionSide')) {
							$('#known').click();
						} else {
							$('#learnShowAnswer').click();
						}
						break;
					case 96:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate0').click();
						}
						break;
					case 97:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate1').click();
						}
						break;
					case 98:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate2').click();
						}
						break;
					case 99:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate3').click();
						}
						break;
					case 100:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate4').click();
						}
						break;
					case 101:
						if (!Session.get('isQuestionSide')) {
							$('#memoRate5').click();
						}
						break;
				}
				event.preventDefault();
			}
		}
	});
});

/*
 * ############################################################################
 * cancelEditForm
 * ############################################################################
 */

Template.cancelEditForm.events({
	'click #cancelEditConfirm': function () {
		$('#cancelEditModal').on('hidden.bs.modal', function () {
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		}).modal('hide');
	}
});

/*
 * ############################################################################
 * deleteCardForm
 * ############################################################################
 */

Template.deleteCardForm.events({
	'click #deleteCardConfirm': function () {
		$('#deleteCardModal').on('hidden.bs.modal', function () {
			Session.set('activeCard', undefined);
			Meteor.call("deleteCard", Router.current().params.card_id);
			Bert.alert(TAPi18n.__('deletecardSuccess'), "success", 'growl-top-left');
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		}).modal('hide');
	}
});
