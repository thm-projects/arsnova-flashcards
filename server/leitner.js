import {Meteor} from "meteor/meteor";
import {Cards} from "../imports/api/cards.js";
import {Cardsets} from "../imports/api/cardsets.js";
import {Leitner, Wozniak} from "../imports/api/learned.js";
import {AdminSettings} from "../imports/api/adminSettings.js";
import {MailNotifier} from "./sendmail.js";
import {WebNotifier} from "./sendwebpush.js";
import {check} from "meteor/check";
import {CardType} from "../imports/api/cardTypes";


/** Function returns the amount of cards inside a box that are valid to learn
 *  @param {string} cardset_id - The id of the cardset with active learners
 *  @param {string} user_id - The id of the user
 *  @param {number} box - The box that contains the card
 *  @returns {number} - The amount of valid cards inside the selected box
 * */
function getCardCount(cardset_id, user_id, box) {
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
}

/** Function checks if there are any cards left to learn for a user
 *  @returns {number} - The total amount of valid cards to learn
 * */
function noCardsLeft(cardCount) {
	if (!Meteor.isServer && (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked'))) {
		throw new Meteor.Error("not-authorized");
	} else {
		return cardCount.reduce(function (prev, cur) {
			return prev + cur;
		});
	}
}

/** Function checks if mail notifications are globally disabled by the admin
 *  @returns {boolean} - Mail notifications are globally enabled / disabled
 * */
function mailsEnabled() {
	if (!Meteor.isServer) {
		throw new Meteor.Error("not-authorized");
	} else {
		return AdminSettings.findOne({name: "mailSettings"}).enabled;
	}
}

/** Adds new cards to the learners list for leitner box mode
 *  @param {string} cardset - The cardset in which the user is learning
 *  @param {string} user_id - The id of the user who is currently learning in the specific cardset
 *  @returns {Boolean} - Return true once the task is completed
 * */
function addLeitnerCards(cardset, user_id) {
	if (!Meteor.isServer) {
		throw new Meteor.Error("not-authorized");
	} else {
		let cards;
		let cardsetFilter = [cardset._id];
		if (cardset.shuffled) {
			cardsetFilter = cardset.cardGroups;
		}
		let cardsetsWithLearningMode = [];
		let result;
		for (let i = 0; i < cardsetFilter.length; i++) {
			result = Cardsets.findOne({
				_id: cardsetFilter[i],
				cardType: {$in: CardType.getCardTypesWithLearningModes()}
			});
			if (result !== undefined) {
				cardsetsWithLearningMode.push(cardsetFilter[i]);
			}
		}
		let existingItems = Leitner.find({
			cardset_id: cardset._id,
			user_id: user_id
		}, {fields: {card_id: 1}}).fetch();
		let excludedCards = [];
		existingItems.forEach(function (existingItem) {
			excludedCards.push(existingItem.card_id);
		});

		let newItems = [];
		let newItemObject;
		let nextDate = new Date();
		cards = Cards.find({
			_id: {$nin: excludedCards},
			cardset_id: {$in: cardsetsWithLearningMode}
		}, {fields: {_id: 1, cardset_id: 1}}).fetch();
		cards.forEach(function (card) {
			newItemObject = {
				card_id: card._id,
				cardset_id: cardset._id,
				user_id: user_id,
				box: 1,
				active: false,
				nextDate: nextDate,
				currentDate: nextDate,
				skipped: 0
			};
			if (cardset.shuffled) {
				newItemObject.original_cardset_id = card.cardset_id;
			}
			newItems.push(newItemObject);
		});
		if (newItems.length > 0) {
			Leitner.batchInsert(newItems);
		}
		Meteor.call("updateLearnerCount", cardset._id);
		return true;
	}
}

/** Function selects the next valid cards to learn and notifies the user
 *  @param {Object} cardset - The cardset with active learners
 *  @param {Object} user - The user from the cardset who is currently learning
 *  @param {boolean} isReset - Sends a special notification if the card selection got called by missing the deadline
 * */
function setCards(cardset, user, isReset) {
	if (!Meteor.isServer && (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked'))) {
		throw new Meteor.Error("not-authorized");
	} else {
		if (Meteor.settings.debugServer) {
			console.log("===> Set new active cards for " + user._id);
		}
		let algorithm = [0.5, 0.2, 0.15, 0.1, 0.05];
		let cardCount = [];
		// i-loop: Get all cards that the user can learn right now
		for (let i = 0; i < algorithm.length; i++) {
			cardCount[i] = getCardCount(cardset._id, user._id, i + 1);
		}

		if (Meteor.settings.debugServer) {
			console.log("===> Box Card Count: [" + cardCount + "]");
			console.log("===> Maximum active cards: " + cardset.maxCards);
		}

		if (noCardsLeft(cardCount) === 0) {
			return;
		}

		// k-loop: Check the card counter of each Box in reverse and if empty, summate its percentage to the next box with cards
		for (let k = algorithm.length; k > 0; k--) {
			if (cardCount[k] === 0 && k - 1 >= 0) {
				algorithm[k - 1] += algorithm[k];
				algorithm[k] = 0;
			}
		}

		// j-loop: Scale all percentage values of boxes with cards to fill 100%
		if (cardCount[0] === 0) {
			for (let j = 0; j < algorithm.length; j++) {
				if (cardCount[j] !== 0) {
					algorithm[j] = algorithm[j] * (1 / (1 - algorithm[0]));
				}
			}
			algorithm[0] = 0;
		}
		let randomSelectedCards = [];
		let boxActiveCardCap = [];
		// l-loop: Get all cards from a box that match the leitner criteria
		for (let l = 0; l < algorithm.length; l++) {
			let cards = Leitner.find({
				cardset_id: cardset._id,
				user_id: user._id,
				box: (l + 1),
				active: false,
				nextDate: {$lte: new Date()}
			}, {fields: {card_id: 1}}).fetch();
			if (Meteor.settings.debugServer) {
				boxActiveCardCap.push(cardset.maxCards * algorithm[l]);
			}
			// c-loop: update one random card out of the l loop
			for (let c = 0; c < (cardset.maxCards * algorithm[l]); c++) {
				if (cards.length !== 0) {
					let nextCardIndex = Math.floor(Math.random() * (cards.length));
					randomSelectedCards.push(cards[nextCardIndex].card_id);
					cards.splice(nextCardIndex, 1);
				}
			}
		}
		if (Meteor.settings.debugServer) {
			console.log("===> Active Card cap for each box: [" + boxActiveCardCap + "]");
			console.log("===> " + randomSelectedCards.length + " new active Cards: [" + randomSelectedCards + "]");
		}
		Leitner.update({
			cardset_id: cardset._id,
			user_id: user._id,
			card_id: {$in: randomSelectedCards}
		}, {
			$set: {
				active: true,
				currentDate: new Date()
			}
		}, {multi: true});
		if (user.mailNotification && mailsEnabled()) {
			try {
				let mail = new MailNotifier();
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
				let web = new WebNotifier();
				web.prepareWeb(cardset, user._id);
			} catch (error) {
				console.log("[" + TAPi18n.__('admin-settings.test-notifications.sendWeb') + "] " + error);
			}
		}
	}
}

/** Function resets all cards to the first box if the user missed the deadline and selects new ones by calling setCards
 *  @param {Object} cardset - The cardset with learners
 *  @param {Object} user - The user from the cardset who is currently learning
 * */
function resetCards(cardset, user) {
	if (!Meteor.isServer) {
		throw new Meteor.Error("not-authorized");
	} else {
		if (Meteor.settings.debugServer) {
			console.log("===> Reset cards");
		}
		Leitner.update({cardset_id: cardset._id, user_id: user._id}, {
			$set: {
				box: 1,
				active: false,
				nextDate: new Date(),
				currentDate: new Date(),
				skipped: 0
			}
		}, {multi: true});
		setCards(cardset, user, true);
	}
}

/** Function gets called when the learning-phase ended and excludes the cardset from the leitner algorithm
 *  @param {Object} cardset - The cardset from the active learning-phase
 * */
function disableLearning(cardset) {
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
}

/** Function returns all users who are currently registered as learning
 *  @param {string} cardset_id - The id of the cardset that got learners
 *  @returns {Object} - A list of users who are currently learning
 * */
function getLearners(cardset_id) {
	if (!Meteor.isServer) {
		throw new Meteor.Error("not-authorized");
	} else {
		var data = Leitner.find({cardset_id: cardset_id}).fetch();
		return _.uniq(data, false, function (d) {
			return d.user_id;
		});
	}
}

/** Function returns all cardsets with learners
 *  @returns {Object} - The cardsets with active learners
 * */
function getCardsets() {
	if (!Meteor.isServer) {
		throw new Meteor.Error("not-authorized");
	} else {
		return Cardsets.find({kind: {$nin: ['server']}}).fetch();
	}
}

/** Resets the Leitner data to default values (For an inactive learning-phase).
 *  @param {Object} cardset - The cardset for which we reset the leitner data
 *  @returns {Object} - cardset with updated values
 * */
function defaultCardsetLeitnerData(cardset) {
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
}

/** Function returns the cards marked as active from an user who is learning
 *  @param {string} cardset_id - The id of the cardset with active learners
 *  @param {Object} user - The user from the cardset who is currently learning
 *  @returns {Object} - The cards from an user that are currently marked as active
 * */
function getActiveCard(cardset_id, user) {
	if (!Meteor.isServer) {
		throw new Meteor.Error("not-authorized");
	} else {
		return Leitner.findOne({
			cardset_id: cardset_id,
			user_id: user,
			active: true
		});
	}
}

Meteor.methods({
	/** Function adds a new user as learning
	 *  @param {string} cardset_id - The ID of the cardset in which the user is learning
	 *  @param {boolean} true - Process of adding the user to leitner ended successfully
	 * */
	addToLeitner: function (cardset_id) {
		check(cardset_id, String);
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
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
				cardset = defaultCardsetLeitnerData(cardset);
				if (cardset.maxCards !== 0) {
					if (!Leitner.findOne({
						cardset_id: cardset._id,
						user_id: Meteor.userId()
					})) {
						if (addLeitnerCards(cardset, Meteor.userId())) {
							setCards(cardset, Meteor.user(), false);
						}
					} else {
						addLeitnerCards(cardset, Meteor.userId());
					}
				}
			} else {
				if (!Leitner.findOne({
					cardset_id: cardset._id,
					user_id: Meteor.userId()
				}) && cardset.learningEnd.getTime() > new Date().getTime()) {
					if (addLeitnerCards(cardset, Meteor.userId())) {
						setCards(cardset, Meteor.user(), false);
					}
				}
			}
		}
	},
	/** Adds new cards to the learners list for super memo mode
	 *  @param {string} cardset_id - The ID of the cardset in which the user is learning
	 *  @returns {Boolean} - Return true once the task is completed
	 * */
	addWozniakCards: function (cardset_id) {
		check(cardset_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		let user_id = this.userId;
		if (!Meteor.userId() || Roles.userIsInRole(user_id, 'blocked') || cardset.learningActive) {
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

			let existingItems = Wozniak.find({
				cardset_id: cardset._id,
				user_id: user_id
			}, {fields: {card_id: 1}}).fetch();
			let excludedCards = [];
			existingItems.forEach(function (existingItem) {
				excludedCards.push(existingItem.card_id);
			});

			let newItems = [];
			let nextDate = new Date();
			cards = Cards.find({
				_id: {$nin: excludedCards},
				cardset_id: {$in: cardsetFilter},
				cardType: {$in: CardType.getCardTypesWithLearningModes()}
			}, {fields: {_id: 1}}).fetch();
			cards.forEach(function (card) {
				newItems.push({
					card_id: card._id,
					cardset_id: cardset._id,
					user_id: user_id,
					ef: 2.5,
					interval: 0,
					reps: 0,
					nextDate: nextDate,
					skipped: 0
				});
			});
			if (newItems.length > 0) {
				Wozniak.batchInsert(newItems);
			}
			Meteor.call("updateLearnerCount", cardset._id);
			return true;
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
	updateLeitnerCardIndex: function (cardset_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, cardGroups: 1, shuffled: 1}});
			let activeLearners = Leitner.find({cardset_id: cardset._id}, {fields: {user_id: 1}}).fetch();
			activeLearners = _.uniq(activeLearners, false, function (d) {
				return d.user_id;
			});
			for (let i = 0; i < activeLearners.length; i++) {
				addLeitnerCards(cardset, activeLearners[i].user_id);
			}
		}
	},
	/** Function gets called by the leitner Cronjob and checks which users are valid for receiving new cards / getting reset for missing the deadline / in which cardset the learning-phase ended*/
	updateLeitnerCards: function () {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			let cardsets = getCardsets();
			let cardsetCount = 0;
			let currentCardsetWithLearners = 1;
			if (Meteor.settings.debugServer) {
				for (let i = 0; i < cardsets.length; i++) {
					if (Leitner.findOne({cardset_id: cardsets[i]._id})) {
						cardsetCount++;
					}
				}
			}
			for (let i = 0; i < cardsets.length; i++) {
				let learners = getLearners(cardsets[i]._id);
				let learnerCount = learners.length;
				if (cardsets[i].learningEnd.getTime() > new Date().getTime()) {
					if (Meteor.settings.debugServer && learnerCount > 0) {
						console.log("\nCardset " + currentCardsetWithLearners++ + " of " + cardsetCount + ": [" + cardsets[i].name + ", " + cardsets[i]._id + "]");
					}
					for (let k = 0; k < learners.length; k++) {
						if (Meteor.settings.debugServer) {
							console.log("=>User " + (k + 1) + " of " + learnerCount + ": " + learners[k].user_id);
						}
						let activeCard = getActiveCard(cardsets[i]._id, learners[k].user_id);
						let user = Meteor.users.findOne(learners[k].user_id);
						if (!activeCard) {
							setCards(cardsets[i], user, false);
						} else if ((activeCard.currentDate.getTime() + (cardsets[i].daysBeforeReset + 1) * 86400000) < new Date().getTime()) {
							resetCards(cardsets[i], user);
						} else if (Meteor.settings.debugServer) {
							console.log("===> Nothing to do");
						}
					}
				} else {
					disableLearning(cardsets[i]);
				}
			}
		}
	}
});
