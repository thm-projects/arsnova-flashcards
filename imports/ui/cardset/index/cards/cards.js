//------------------------ IMPORTS
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Cards} from "../../../../api/subscriptions/cards";
import {CardVisuals} from "../../../../util/cardVisuals";
import {CardType} from "../../../../util/cardTypes";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {Route} from "../../../../util/route";
import {CardNavigation} from "../../../../util/cardNavigation";
import "./cards.html";
import {ErrorReporting} from "../../../../util/errorReporting";

/*
 * ############################################################################
 * cardsetList
 * ############################################################################
 */

Template.cardsetList.onCreated(function () {
	let presentationContainer = $('#main');
	presentationContainer.css('overflow', 'unset');
	presentationContainer.css('height', 'unset');
});

Template.cardsetList.helpers({
	isShuffledCardset: function () {
		if (FlowRouter.getRouteName() === "demolist") {
			return Cardsets.findOne({kind: 'demo', name: "DemoCardset", shuffled: true}).shuffled;
		} else if (FlowRouter.getRouteName() === "makinglist") {
			return Cardsets.findOne({kind: 'demo', name: "MakingOfCardset", shuffled: true}).shuffled;
		} else {
			return Cardsets.findOne({_id: FlowRouter.getParam('_id')}).shuffled;
		}
	},
	cardsetList: function () {
		let isDemo = (FlowRouter.getRouteName() === "demolist" || FlowRouter.getRouteName() === "makinglist");
		if (FlowRouter.getRouteName() === "presentationlist" || isDemo) {
			let cardsetId = FlowRouter.getParam('_id');
			if (isDemo) {
				if (Route.isDemo()) {
					cardsetId = Cardsets.findOne({kind: 'demo', name: "DemoCardset", shuffled: true})._id;
				} else {
					cardsetId = Cardsets.findOne({kind: 'demo', name: "MakingOfCardset", shuffled: true})._id;
				}
			}
			if (this.shuffled) {
				let cardsetFilter = [];
				let sortCardsets = Cardsets.find({_id: {$in: this.cardGroups}}, {
					sort: {name: 1}, fields: {_id: 1, name: 1, kind: 1, owner: 1, quantity: 1, difficulty: 1, cardType: 1}
				}).fetch();
				sortCardsets.forEach(function (cardset) {
					if (cardset._id !== cardsetId) {
						cardsetFilter.push(cardset);
					}
				});
				return cardsetFilter;
			} else {
				return Cardsets.find({_id: this._id}).fetch();
			}
		}
	},
	getPriority: function (index) {
		return index + 1;
	},
	cleanContent: function (text) {
		return CardVisuals.removeMarkdeepTags(text);
	},
	gotCards: function () {
		if (FlowRouter.getRouteName() === "presentationlist" || FlowRouter.getRouteName() === "demolist" || FlowRouter.getRouteName() === "makinglist") {
			if (this.shuffled) {
				return Cards.find({cardset_id: {$in: this.cardGroups}}).count();
			} else {
				return Cards.find({cardset_id: this._id}).count();
			}
		}
	},
	cardSubject: function () {
		if (FlowRouter.getRouteName() === "presentationlist" || FlowRouter.getRouteName() === "demolist" || FlowRouter.getRouteName() === "makinglist") {
			return _.uniq(Cards.find({
				cardset_id: this._id
			}, {
				cardset_id: 1,
				subject: 1,
				sort: {subject: 1}
			}).fetch(), function (card) {
				return card.subject;
			});
		} else {
			return _.uniq(Cards.find({
				cardset_id: this._id
			}, {
				cardset_id: 1,
				subject: 1,
				sort: {subject: 1}
			}).fetch(), function (card) {
				return card.subject;
			});
		}
	},
	cardList: function (countCards) {
		let sortQuery;
		let cardset = Cardsets.findOne({_id: this.cardset_id}, {fields: {cardType: 1, sortType: 1}});
		sortQuery = CardType.getSortQuery(cardset.cardType, cardset.sortType);
		if (countCards) {
			return Cards.find({
				cardset_id: this.cardset_id,
				subject: this.subject
			}, {
				fields: {
					_id: 1,
					front: 1,
					back: 1,
					hint: 1,
					lecture: 1,
					top: 1,
					bottom: 1,
					cardset_id: 1,
					answers: 1
				},
				sort: sortQuery
			}).count();
		}
		let cards = Cards.find({
			cardset_id: this.cardset_id,
			subject: this.subject
		}, {
			fields: {
				_id: 1,
				front: 1,
				back: 1,
				hint: 1,
				lecture: 1,
				top: 1,
				bottom: 1,
				cardset_id: 1,
				answers: 1
			},
			sort: sortQuery
		}).fetch();
		return CardVisuals.setTypeAndDifficulty(cards);
	},
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
	gotReferences: function () {
		return Cardsets.findOne({_id: FlowRouter.getParam('_id')}).cardGroups !== [""];
	},
	getQuestion: function () {
		if (this.answers !== undefined && this.answers.question !== undefined) {
			return this.answers.question;
		} else {
			return "";
		}
	},
	getText: function () {
		let cubeSides = CardType.getCardTypeCubeSides(this.cardType);
		switch (cubeSides[0].contentId) {
			case 1:
				return this.front;
			case 2:
				return this.back;
			case 3:
				return this.hint;
			case 4:
				return this.lecture;
			case 5:
				return this.top;
			case 6:
				return this.bottom;
		}
	},
	hasCardUnresolvedErrors: function (card_id) {
		return ErrorReporting.hasCardUnresolvedErrors(card_id);
	},
	getErrorCountFromCard: function (card_id) {
		return ErrorReporting.getErrorCountFromCard(card_id);
	},
	isErrorReportingCardView: function (card_id) {
		return !Session.get('showOnlyErrorReports') || (Session.get('showOnlyErrorReports') && ErrorReporting.hasCardUnresolvedErrors(card_id));
	}
});

Template.cardsetList.events({
	'click .cardListRow': function (evt) {
		let cubeSides = CardType.getCardTypeCubeSides($(evt.target).data('card-type'));
		Session.set('cardType', $(evt.target).data('card-type'));
		Session.set('activeCardContentId', cubeSides[0].contentId);
		if (FlowRouter.getRouteName() === "presentationlist" || FlowRouter.getRouteName() === "demolist" || FlowRouter.getRouteName() === "makinglist") {
			Session.set('activeCardSide', undefined);
			CardNavigation.setActiveCardData($(evt.target).data('id'));
			if (FlowRouter.getRouteName() === "presentationlist") {
				FlowRouter.go('presentation', {
					_id: FlowRouter.getParam('_id')
				});
			} else if (FlowRouter.getRouteName() === "demolist") {
				FlowRouter.go('demo');
			} else if (FlowRouter.getRouteName() === "makinglist") {
				FlowRouter.go('making');
			} else {
				FlowRouter.go('cardsetcard', {
					_id: FlowRouter.getParam('_id'),
					card_id: $(evt.target).data('id')
				});
			}
		} else {
			$('#showSelectLearningUnitModal').modal('hide');
		}
	}
});
