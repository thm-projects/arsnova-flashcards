import {Meteor} from "meteor/meteor";
import {SyncedCron} from "meteor/percolate:synced-cron";
import {Cards} from "../imports/api/cards.js";
import {Cardsets} from "../imports/api/cardsets.js";
import {Learned} from "../imports/api/learned.js";


Meteor.methods({
	startLeitnerCron: function (id) {
		SyncedCron.add({
			name: id,
			schedule: function (parser) {
				return parser.recur().on('01:00:00').time();
			},
			job: function () {
				Meteor.call("updateLeitnerCards", id);
			}
		});
	},
	stopLeitnerCron: function (id) {
		SyncedCron.remove(id);
	},
	addToLeitner: function (cardset_id) {
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
			throw new Meteor.Error("not-authorized");
		} else if (!Learned.findOne({"cardset_id": cardset_id, "user_id": Meteor.userId()})) {
			var cards = Cards.find({
				cardset_id: cardset_id
			});
			cards.forEach(function (card) {
				Meteor.call("addLearned", card.cardset_id, card._id);
			});
			Meteor.call("setCards", cardset_id, Meteor.userId());
		}
	},
	getActiveCard: function (cardset_id, user) {
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
			throw new Meteor.Error("not-authorized");
		} else {
			return Learned.findOne({
				"cardset_id": cardset_id,
				"user_id": user,
				"active": true
			});
		}
	},
	getCardCount: function (cardset_id, user, box) {
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
			throw new Meteor.Error("not-authorized");
		} else {
			return Learned.find({
				"cardset_id": cardset_id,
				"user_id": user,
				"box": box,
				"nextDate": {$lte: new Date()}
			}).count();
		}
	},
	getCardset: function (cardset_id) {
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
			throw new Meteor.Error("not-authorized");
		} else {
			return Cardsets.findOne({"_id": cardset_id});
		}
	},
	getLearners: function (cardset_id) {
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
			throw new Meteor.Error("not-authorized");
		} else {
			var data = Learned.find({"cardset_id": cardset_id}).fetch();
			return _.uniq(data, false, function (d) {
				return d.user_id;
			});
		}
	},
	noCardsLeft: function (cardCount) {
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
			throw new Meteor.Error("not-authorized");
		} else {
			return cardCount.reduce(function (prev, cur) {
				return prev + cur;
			});
		}
	},
	// i-loop: Get all cards that the user can learn right now
	// k-loop: Check the card counter of each Box in reverse and if empty, summate its percentage to the next box with cards
	// j-loop: Summate all percentages of boxes with cards to reach 100%
	// l-loop: Mark the cards that the user has to learn next
	setCards: function (cardset, user) {
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
			throw new Meteor.Error("not-authorized");
		} else {
			var algorithm = [0.5, 0.2, 0.15, 0.1, 0.05];
			var cardCount = [];
			for (var i = 0; i < algorithm.length; i++) {
				cardCount[i] = Meteor.call("getCardCount", cardset._id, user.user_id, i + 1);
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
					"cardset_id": cardset._id,
					"user_id": user.user_id,
					"box": (l + 1),
					"nextDate": {$lte: new Date()}
				}, {
					$set: {
						"active": true,
						"currentDate": new Date()
					}
				}, {multi: true, limit: cardset.maxCards * algorithm[l]});
			}
		}
	},
	resetCards: function (cardset, user) {
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
			throw new Meteor.Error("not-authorized");
		} else {
			Learned.update({"cardset_id": cardset._id, "user_id": user.user_id}, {
				$set: {
					"box": 1,
					"active": false,
					"nextDate": new Date(),
					"currentDate": new Date()
				}
			}, {multi: true});
			Meteor.call("setCards", cardset, user);
		}
	},
	updateLeitnerCards: function (cardset_id) {
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
			throw new Meteor.Error("not-authorized");
		} else {
			var cardset = Meteor.call("getCardset", cardset_id);
			var learners = Meteor.call("getLearners", cardset._id);
			for (var i = 0; i < learners.length; i++) {
				var activeCard = Meteor.call("getActiveCard", cardset._id, learners[i].user_id);
				if (!activeCard) {
					Meteor.call("setCards", cardset, learners[i]);
				} else if ((activeCard.currentDate.getTime() + cardset.daysBeforeReset * 86400000) < new Date().getTime()) {
					Meteor.call("resetCards", cardset, learners[i]);
				}
			}
		}
	}
});
