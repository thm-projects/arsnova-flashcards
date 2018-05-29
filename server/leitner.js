import {Meteor} from "meteor/meteor";
import {Cards} from "../imports/api/cards.js";
import {Cardsets} from "../imports/api/cardsets.js";
import {Leitner, Wozniak} from "../imports/api/learned.js";
import {AdminSettings} from "../imports/api/adminSettings.js";
import {MailNotifier} from "./sendmail.js";
import {WebNotifier} from "./sendwebpush.js";
import {check} from "meteor/check";
import CardType from "../imports/api/cardTypes";

Meteor.methods({
	/** Function adds a new user as learning
	 *  @param {string} cardset_id - The ID of the cardset in which the user is learning
	 *  @param {boolean} true - Process of adding the user to leitner ended successfully
	 * */
	addToLeitner: function (cardset_id) {
		check(cardset_id, String);
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked') || !Meteor.call("isProfileComplete", Meteor.userId())) {
			throw new Meteor.Error("not-authorized");
		} else {
			let cardset = Cardsets.findOne({_id: cardset_id});
			if (cardset.shuffled) {
				let counter = 0;
				for (let i = 0; i < cardset.cardGroups.length; i++) {
					if (CardType.gotLearningModes(Cardsets.findOne(cardset.cardGroups[i]).cardType)) {
						counter++;
					}
				}
				if (counter === 0) {
					throw new Meteor.Error("not-authorized");
				}
			} else {
				if (!CardType.gotLearningModes(cardset.cardType)) {
					throw new Meteor.Error("not-authorized");
				}
			}
			if (!cardset.learningActive) {
				Meteor.call("defaultCardsetLeitnerData", cardset, function (error, result) {
					if (error) {
						throw new Meteor.Error(error.statusCode, 'Error could not update default leitner data for inactive learning-phase.');
					}
					if (result) {
						if (!Leitner.findOne({
							cardset_id: cardset._id,
							user_id: Meteor.userId()
						})) {
							Meteor.call("addLeitnerCards", cardset, Meteor.userId(), function (error, result) {
								if (error) {
									throw new Meteor.Error(error.statusCode, 'Error could not add cards for leitner in inactive learning-phase.');
								}
								if (result) {
									Meteor.call("setCards", cardset, Meteor.user(), false);
								}
							});
						} else {
							Meteor.call("addLeitnerCards", cardset, Meteor.userId());
						}
					}
				});
			} else {
				if (!Leitner.findOne({
					cardset_id: cardset._id,
					user_id: Meteor.userId()
				}) && cardset.learningEnd.getTime() > new Date().getTime()) {
					Meteor.call("addLeitnerCards", cardset, Meteor.userId(), function (error, result) {
						if (error) {
							throw new Meteor.Error(error.statusCode, 'Error could not add cards for leitner in active learning-phase.');
						}
						if (result) {
							Meteor.call("setCards", cardset, Meteor.user(), false);
						}
					});
				}
			}
		}
	},
	/** Adds new cards to the learners list for leitner box mode
	 *  @param {string} cardset - The cardset in which the user is learning
	 *  @param {string} user_id - The id of the user who is currently learning in the specific cardset
	 *  @returns {Boolean} - Return true once the task is completed
	 * */
	addLeitnerCards: function (cardset, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			let cards;
			let cardsetFilter = [cardset._id];
			if (cardset.shuffled) {
				cardsetFilter = cardset.cardGroups;
			}
			cards = Cards.find({
				cardset_id: {$in: cardsetFilter},
				cardType: {$in: CardType.getCardTypesWithLearningModes()}
			});

			cards.forEach(function (card) {
				Meteor.call("addLeitner", cardset._id, card._id, user_id, false);
			});
			Meteor.call("updateLearnerCount", cardset._id);
			return true;
		}
	},
	/** Adds new cards to the learners list for super memo mode
	 *  @param {string} cardset_id - The ID of the cardset in which the user is learning
	 *  @returns {Boolean} - Return true once the task is completed
	 * */
	addWozniakCards: function (cardset_id) {
		check(cardset_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked') || cardset.learningActive) {
			throw new Meteor.Error("not-authorized");
		} else {
			if (cardset.shuffled) {
				let counter = 0;
				for (let i = 0; i < cardset.cardGroups.length; i++) {
					if (CardType.gotLearningModes(Cardsets.findOne(cardset.cardGroups[i]).cardType)) {
						counter++;
					}
				}
				if (counter === 0) {
					throw new Meteor.Error("not-authorized");
				}
			}
			let cards;
			let cardsetFilter = [cardset._id];
			if (cardset.shuffled) {
				cardsetFilter = cardset.cardGroups;
			}
			cards = Cards.find({
				cardset_id: {$in: cardsetFilter},
				cardType: {$in: CardType.getCardTypesWithLearningModes()}
			});
			cards.forEach(function (card) {
				Meteor.call("addWozniak", cardset._id, card._id, Meteor.userId(), true);
			});
			Meteor.call("updateLearnerCount", cardset._id);
			return true;
		}
	},
	/** Resets the Leitner data to default values (For an inactive learning-phase).
	 *  @param {Object} cardset - The cardset for which we reset the leitner data
	 *  @returns {Object} - cardset with updated values
	 * */
	defaultCardsetLeitnerData: function (cardset) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			Cardsets.update(cardset._id, {
				$set: {
					maxCards: Math.ceil(cardset.quantity / 3),
					daysBeforeReset: 7,
					learningStart: cardset.date,
					learningEnd: (new Date().setFullYear(2038, 0, 19)),
					learningInterval: [1, 3, 7, 28, 84]
				}
			});
			return Cardsets.findOne({_id: cardset._id});
		}
	},
	/** Function returns the cards marked as active from an user who is learning
	 *  @param {string} cardset_id - The id of the cardset with active learners
	 *  @param {Object} user - The user from the cardset who is currently learning
	 *  @returns {Object} - The cards from an user that are currently marked as active
	 * */
	getActiveCard: function (cardset_id, user) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			return Leitner.findOne({
				cardset_id: cardset_id,
				user_id: user,
				active: true
			});
		}
	},
	/** Function returns the amount of cards inside a box that are valid to learn
	 *  @param {string} cardset_id - The id of the cardset with active learners
	 *  @param {string} user_id - The id of the user
	 *  @returns {number} - The amount of valid cards inside the selected box
	 * */
	getCardCount: function (cardset_id, user_id, box) {
		if (!Meteor.isServer && (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked'))) {
			throw new Meteor.Error("not-authorized");
		} else {
			return Leitner.find({
				cardset_id: cardset_id,
				user_id: user_id,
				box: box,
				active: false,
				nextDate: {$lte: new Date()}
			}).count();
		}
	},
	/** Function returns all cardsets with learners
	 *  @returns {Object} - The cardsets with active learners
	 * */
	getCardsets: function () {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			if (Meteor.settings.public.university.singleUniversity) {
				return Cardsets.find({
					college: Meteor.settings.public.university.default
				}).fetch();
			} else {
				return Cardsets.find({}).fetch();
			}
		}
	},
	/** Function returns all users who are currently registered as learning
	 *  @param {string} cardset_id - The id of the cardset that got learners
	 *  @returns {Object} - A list of users who are currently learning
	 * */
	getLearners: function (cardset_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var data = Leitner.find({cardset_id: cardset_id}).fetch();
			return _.uniq(data, false, function (d) {
				return d.user_id;
			});
		}
	},
	/** Checks if the user has completed his profile
	 *  @param {string} user - The id of the user who needs to be checked
	 *  @returns {Boolean} - True if the profile is complete, false if not
	 * */
	isProfileComplete: function (user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			let user = Meteor.users.findOne({_id: user_id});
			if ((user.profile.birthname !== "" && user.profile.birthname !== undefined) && (user.profile.givenname !== "" && user.profile.givenname !== undefined) && (user.email !== "" && user.email !== undefined)) {
				return true;
			} else {
				return false;
			}
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
	/** Function resets all cards to the first box if the user missed the deadline and selects new ones by calling setCards
	 *  @param {Object} cardset - The cardset with learners
	 *  @param {Object} user - The user from the cardset who is currently learning
	 * */
	resetCards: function (cardset, user) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			Leitner.update({cardset_id: cardset._id, user_id: user._id}, {
				$set: {
					box: 1,
					active: false,
					nextDate: new Date(),
					currentDate: new Date(),
					skipped: 0
				}
			}, {multi: true});
			Meteor.call("setCards", cardset, user, true);
		}
	},
	/** Resets the learning progress for learning by leitner
	 *  @param {string} cardset_id - The ID of the cardset in which the user is learning
	 *  @returns {Boolean} - Return true once the task is completed
	 * */
	resetLeitner: function (cardset_id) {
		check(cardset_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked') || cardset.learningActive) {
			throw new Meteor.Error("not-authorized");
		} else {
			Leitner.remove({
				cardset_id: cardset._id,
				user_id: Meteor.userId()
			});
			Meteor.call("updateLearnerCount", cardset._id);
		}
	},
	/** Resets the learning progress for learning by wozniak
	 *  @param {string} cardset_id - The ID of the cardset in which the user is learning
	 *  @returns {Boolean} - Return true once the task is completed
	 * */
	resetWozniak: function (cardset_id) {
		check(cardset_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked') || cardset.learningActive) {
			throw new Meteor.Error("not-authorized");
		} else {
			Wozniak.remove({
				cardset_id: cardset._id,
				user_id: Meteor.userId()
			});
			Meteor.call("updateLearnerCount", cardset._id);
		}
	},
	/** Function selects the next valid cards to learn and notifies the user
	 *  @param {Object} cardset - The cardset with active learners
	 *  @param {Object} user - The user from the cardset who is currently learning
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
				var cards = Leitner.find({
					cardset_id: cardset._id,
					user_id: user._id,
					box: (l + 1),
					active: false,
					nextDate: {$lte: new Date()},
					cardType: {$ne: 2}
				}).fetch();
				// c-loop: update one random card out of the l loop
				for (var c = 0; c < (cardset.maxCards * algorithm[l]); c++) {
					if (cards.length !== 0) {
						var nextCardIndex = Math.floor(Math.random() * (cards.length));
						var nextCard = cards[nextCardIndex];
						cards.splice(nextCardIndex, 1);
						Leitner.update({
							cardset_id: cardset._id,
							user_id: user._id,
							card_id: nextCard.card_id
						}, {
							$set: {
								active: true,
								currentDate: new Date(),
								skipped: 0
							}
						});
					}
				}
			}

			if (user.mailNotification && Meteor.call("mailsEnabled")) {
				try {
					var mail = new MailNotifier();
					if (isReset) {
						mail.prepareMailReset(cardset, user._id);
					} else {
						mail.prepareMail(cardset, user._id);
					}
				} catch (error) {
					console.log("[" + TAPi18n.__('admin-settings.test-notifications.sendMail') + "] " + error);
				}
			}
			if (user.webNotification) {
				try {
					var web = new WebNotifier();
					web.prepareWeb(cardset, user._id);
				} catch (error) {
					console.log("[" + TAPi18n.__('admin-settings.test-notifications.sendWeb') + "] " + error);
				}
			}
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
						if (Meteor.call("isProfileComplete", learners[k].user_id)) {
							var activeCard = Meteor.call("getActiveCard", cardsets[i]._id, learners[k].user_id);
							var user = Meteor.users.findOne(learners[k].user_id);
							if (!activeCard) {
								Meteor.call("setCards", cardsets[i], user, false);
							} else if ((activeCard.currentDate.getTime() + (cardsets[i].daysBeforeReset + 1) * 86400000) < new Date().getTime()) {
								Meteor.call("resetCards", cardsets[i], user);
							}
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
			if (Leitner.find({cardset_id: cardset._id, active: true}).count()) {
				Leitner.update({cardset_id: cardset._id}, {
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
})
;
