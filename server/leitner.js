import {Meteor} from "meteor/meteor";
import {Cards} from "../imports/api/cards.js";
import {Cardsets} from "../imports/api/cardsets.js";
import {Learned} from "../imports/api/learned.js";
import {AdminSettings} from "../imports/api/adminSettings.js";
import {MailNotifier} from "./sendmail.js";
import {WebNotifier} from "./sendwebpush.js";

Meteor.methods({
	/** Function adds a new user to an active learning-phase
	 *  @param {Object} cardset - The cardset from the active learning-phase
	 * */
	addToLeitner: function (cardset) {
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
			throw new Meteor.Error("not-authorized");
		} else if (!Learned.findOne({
				cardset_id: cardset._id,
				user_id: Meteor.userId()
			}) && cardset.learningEnd.getTime() > new Date().getTime()) {
			var cards = Cards.find({
				cardset_id: cardset._id
			});
			cards.forEach(function (card) {
				Meteor.call("addLearned", card.cardset_id, card._id);
			});
			Meteor.call("setCards", cardset, Meteor.user(), false);
		}
	},
	/** Function returns the cards marked as active from an user in an active learning-phase
	 *  @param {string} cardset_id - The id of the cardset from the active learning-phase
	 *  @param {Object} user - The user from the cardset of the active learning-phase
	 *  @returns {Object} - The cards from an user that are currently marked as active in a learning-phase
	 * */
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
	/** Function returns the amount of cards inside a box that are valid to learn
	 *  @param {string} cardset_id - The id of the cardset from the active learning-phase
	 *  @param {string} user_id - The id of the user
	 *  @returns {number} - The amount of valid cards inside the selected box
	 * */
	getCardCount: function (cardset_id, user_id, box) {
		if (!Meteor.isServer && (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked'))) {
			throw new Meteor.Error("not-authorized");
		} else {
			return Learned.find({
				cardset_id: cardset_id,
				user_id: user_id,
				box: box,
				active: false,
				nextDate: {$lte: new Date()}
			}).count();
		}
	},
	/** Function returns all cardsets with an active learning-phase
	 *  @returns {Object} - The cardsets with an active learning-phase
	 * */
	getCardsets: function () {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			if (Meteor.settings.public.university.singleUniversity) {
				return Cardsets.find({
					learningActive: true,
					college: Meteor.settings.public.university.default
				}).fetch();
			} else {
				return Cardsets.find({learningActive: true}).fetch();
			}
		}
	},
	/** Function returns all users who are currently registered in a learning-phase
	 *  @param {string} cardset_id - The id of the cardset from the active learning-phase
	 *  @returns {Object} - A list of users who are currently in a learning-phase
	 * */
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
	/** Function checks if there are any cards left to learn for a user
	 *  @returns {number} - The total amount of valid cards to learn
	 * */
	noCardsLeft: function (cardCount) {
		if (!Meteor.isServer && (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked'))) {
			throw new Meteor.Error("not-authorized");
		} else {
			return cardCount.reduce(function (prev, cur) {
				return prev + cur;
			});
		}
	},

	/** Function selects the next valid cards to learn and notifies the user
	 *  @param {Object} cardset - The cardset from the active learning-phase
	 *  @param {Object} user - The user from the cardset of the active learning-phase
	 *  @param {boolean} isReset - Sends a special notification if the card selection got called by missing the deadline
	 * */
	setCards: function (cardset, user, isReset) {
		if (!Meteor.isServer && (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked'))) {
			throw new Meteor.Error("not-authorized");
		} else {
			var algorithm = [0.5, 0.2, 0.15, 0.1, 0.05];
			var cardCount = [];
			// i-loop: Get all cards that the user can learn right now
			for (var i = 0; i < algorithm.length; i++) {
				cardCount[i] = Meteor.call("getCardCount", cardset._id, user._id, i + 1);
			}

			if (Meteor.call("noCardsLeft", cardCount) === 0) {
				return;
			}
			// k-loop: Check the card counter of each Box in reverse and if empty, summate its percentage to the next box with cards
			for (var k = algorithm.length; k > 0; k--) {
				if (cardCount[k] === 0 && k - 1 >= 0) {
					algorithm[k - 1] += algorithm[k];
					algorithm[k] = 0;
				}
			}

			// j-loop: Scale all percentage values of boxes with cards to fill 100%
			if (cardCount[0] === 0) {
				for (var j = 0; j < algorithm.length; j++) {
					if (cardCount[j] !== 0) {
						algorithm[j] = algorithm[j] * (1 / (1 - algorithm[0]));
					}
				}
				algorithm[0] = 0;
			}

			// l-loop: Get all cards from a box that match the leitner criteria
			for (var l = 0; l < algorithm.length; l++) {
				var cards = Learned.find({
					cardset_id: cardset._id,
					user_id: user._id,
					box: (l + 1),
					active: false,
					nextDate: {$lte: new Date()}
				}).fetch();
				// c-loop: update one random card out of the l loop
				for (var c = 0; c < (cardset.maxCards * algorithm[l]); c++) {
					if (cards.length !== 0) {
						var nextCardIndex = Math.floor(Math.random() * (cards.length));
						var nextCard = cards[nextCardIndex];
						cards.splice(nextCardIndex, 1);
						Learned.update({
							cardset_id: cardset._id,
							user_id: user._id,
							card_id: nextCard.card_id
						}, {
							$set: {
								active: true,
								currentDate: new Date()
							}
						});
					}
				}
			}

			//always make sure that at least mailNotifications are checked for the user
			if (!user.mailNotification && !user.webNotification) {
				Meteor.users.update(user._id, {
					$set: {
						mailNotification: true
					}
				});
			}

			if (user.mailNotification && Meteor.call("mailsEnabled")) {
				var mail = new MailNotifier();
				if (isReset) {
					mail.prepareMailReset(cardset, user._id);
				} else {
					mail.prepareMail(cardset, user._id);
				}
			}

			if (user.webNotification) {
				var web = new WebNotifier();
				web.prepareWeb(cardset, user._id);
			}
		}
	},
	/** Function resets all cards to the first box if the user missed the deadline and selects new ones by calling setCards
	 *  @param {Object} cardset - The cardset from the active learning-phase
	 *  @param {Object} user - The user from the cardset of the active learning-phase
	 * */
	resetCards: function (cardset, user) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			Learned.update({cardset_id: cardset._id, user_id: user._id}, {
				$set: {
					box: 1,
					active: false,
					nextDate: new Date(),
					currentDate: new Date()
				}
			}, {multi: true});
			Meteor.call("setCards", cardset, user, true);
		}
	},
	/** Function gets called by the leitner Cronjob and checks which users are valid for receiving new cards / getting reset for missing the deadline / in which cardset the learning-phase ended*/
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
						var user = Meteor.users.findOne(learners[k].user_id);
						if (!activeCard) {
							Meteor.call("setCards", cardsets[i], user, false);
						} else if ((activeCard.currentDate.getTime() + (cardsets[i].daysBeforeReset + 1) * 86400000) < new Date().getTime()) {
							Meteor.call("resetCards", cardsets[i], user);
						}
					}
				} else {
					Meteor.call("disableLearning", cardsets[i]);
				}
			}
		}
	},
	/** Function gets called when the learning-phase ended and excludes the cardset from the leitner algorithm
	 *  @param {Object} cardset - The cardset from the active learning-phase
	 * */
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
		}
	},
	/** Function checks if mail notifications are globally disabled by the admin
	 *  @returns {boolean} - Mail notifications are globally enabled / disabled
	 * */
	mailsEnabled: function () {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			return AdminSettings.findOne({name: "mailSettings"}).enabled;
		}
	}
});
