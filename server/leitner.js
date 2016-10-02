import {Meteor} from "meteor/meteor";
import {Cards} from "../imports/api/cards.js";
import {Cardsets} from "../imports/api/cardsets.js";
import {Learned} from "../imports/api/learned.js";
import {MailNotifier} from "./sendmail.js";


Meteor.methods({
	addToLeitner: function (cardset) {
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
			throw new Meteor.Error("not-authorized");
		} else if (!Learned.findOne({cardset_id: cardset._id, user_id: Meteor.userId()})) {
			var cards = Cards.find({
				cardset_id: cardset._id
			});
			cards.forEach(function (card) {
				Meteor.call("addLearned", card.cardset_id, card._id);
			});
			Meteor.call("setCards", cardset, Meteor.userId());
		}
	},
	getActiveCard: function (cardset_id, user) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			return Learned.findOne({
				cardset_id: cardset_id,
				user_id: user,
				active: true
			});
		}
	},
	getCardCount: function (cardset_id, user_id, box) {
		if (!Meteor.isServer && (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked'))) {
			throw new Meteor.Error("not-authorized");
		} else {
			return Learned.find({
				cardset_id: cardset_id,
				user_id: user_id,
				box: box,
				nextDate: {$lte: new Date()}
			}).count();
		}
	},
	getCardsets: function () {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			return Cardsets.find({learningActive: true}).fetch();
		}
	},
	getLearners: function (cardset_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var data = Learned.find({cardset_id: cardset_id}).fetch();
			return _.uniq(data, false, function (d) {
				return d.user_id;
			});
		}
	},
	noCardsLeft: function (cardCount) {
		if (!Meteor.isServer && (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked'))) {
			throw new Meteor.Error("not-authorized");
		} else {
			return cardCount.reduce(function (prev, cur) {
				return prev + cur;
			});
		}
	},
	// i-loop: Get all cards that the user can learn right now
	// k-loop: Check the card counter of each Box in reverse and if empty, summate its percentage to the next box with cards
	// j-loop: Scale all percentage values of boxes with cards to fill 100%
	// l-loop: Mark the cards that the user has to learn next
	setCards: function (cardset, user_id) {
		if (!Meteor.isServer && (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked'))) {
			throw new Meteor.Error("not-authorized");
		} else {
			var algorithm = [0.5, 0.2, 0.15, 0.1, 0.05];
			var cardCount = [];
			for (var i = 0; i < algorithm.length; i++) {
				cardCount[i] = Meteor.call("getCardCount", cardset._id, user_id, i + 1);
			}

			if (Meteor.call("noCardsLeft", cardCount) === 0) {
				return;
			}

			for (var k = algorithm.length; k > 0; k--) {
				if (cardCount[k] === 0 && k - 1 >= 0) {
					algorithm[k - 1] += algorithm[k];
					algorithm[k] = 0;
				}
			}

			if (cardCount[0] === 0) {
				for (var j = 0; j < algorithm.length; j++) {
					if (cardCount[j] !== 0) {
						algorithm[j] = algorithm[j] * (1 / (1 - algorithm[0]));
					}
				}
				algorithm[0] = 0;
			}

			for (var l = 0; l < algorithm.length; l++) {
				Learned.update({
					cardset_id: cardset._id,
					user_id: user_id,
					box: (l + 1),
					nextDate: {$lte: new Date()}
				}, {
					$set: {
						active: true,
						currentDate: new Date()
					}
				}, {multi: true, limit: cardset.maxCards * algorithm[l]});
			}

			if (Meteor.isServer && cardset.mailNotification) {
				var mail = new MailNotifier();
				mail.prepareMail();
			}
		}
	},
	resetCards: function (cardset, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			Learned.update({cardset_id: cardset._id, user_id: user_id}, {
				$set: {
					box: 1,
					active: false,
					nextDate: new Date(),
					currentDate: new Date()
				}
			}, {multi: true});
			Meteor.call("setCards", cardset, user_id);
		}
	},
	updateLeitnerCards: function () {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var cardsets = Meteor.call("getCardsets");
			for (var i = 0; i < cardsets.length; i++) {
				var learners = Meteor.call("getLearners", cardsets[i]._id);
				if (cardsets[i].learningEnd.getTime() > new Date().getTime()) {
					for (var k = 0; k < learners.length; k++) {
						var activeCard = Meteor.call("getActiveCard", cardsets[i]._id, learners[k].user_id);
						if (!activeCard) {
							Meteor.call("setCards", cardsets[i], learners[k].user_id);
						} else if ((activeCard.currentDate.getTime() + cardsets[i].daysBeforeReset * 86400000) < new Date().getTime()) {
							Meteor.call("resetCards", cardsets[i], learners[k].user_id);
						}
					}
				} else {
					Meteor.call("disableLearning", cardsets[i]);
				}
			}
		}
	},
	disableLearning: function (cardset) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			if (Learned.find({cardset_id: cardset._id, active: true}).count()) {
				Learned.update({cardset_id: cardset._id}, {
					$set: {
						active: false
					}
				}, {multi: true});
			}
			if (cardset.mailNotification) {
				var mail = new MailNotifier();
				mail.prepareMailFinished();
				Cardsets.update({_id: cardset._id}, {
					$set: {
						mailNotification: false
					}
				});
			}
		}
	}
});
