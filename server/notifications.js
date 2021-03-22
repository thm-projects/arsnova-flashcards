import {LeitnerCardStats} from "../imports/api/subscriptions/leitner/leitnerCardStats.js";
import {Meteor} from "meteor/meteor";
import {Bonus} from "../imports/util/bonus";

/**
 * Class used for generating text of mail and web-push messages
 */
export class Notifications {
	/** Function returns the name of the user for the E-Mail and Web-Push notification text
	 *  @param {string} user_id - The id of the user
	 *  @returns {string} - The name of the user
	 * */
	static getName (user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var user = Meteor.users.find({_id: user_id}).fetch();
			return user[0].profile.name;
		}
	}

	/** Function returns the amount of cards that the user has to learn from the cardset
	 *  @param {string} cardset_id - The id of the cardset from which to get the card count from
	 *  @param {string} user_id - The id of the user
	 *  @returns {number} - The amount of cards that the user has to learn from the cardset
	 * */
	static getActiveCardsCount (cardset_id, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			return LeitnerCardStats.find({
				cardset_id: cardset_id,
				user_id: user_id,
				active: true
			}).count();
		}
	}

	static getDeadline (cardset, user_id) {
		let stringFormat = "dddd, Do MMMM HH:mm";
		let adjustedHours = {
			hour: Meteor.settings.public.dailyCronjob.executeAtHour,
			minute: 0
		};
		let active = LeitnerCardStats.findOne({cardset_id: cardset._id, user_id: user_id, active: true});
		let deadline = moment(active.currentDate).add(cardset.daysBeforeReset, 'days').set(adjustedHours);
		let cardsetLearningEnd = moment(cardset.learningEnd).set(adjustedHours);
		if (deadline > cardsetLearningEnd && Bonus.isInBonus(cardset._id, user_id)) {
			return cardsetLearningEnd.locale("de").format(stringFormat);
		} else {
			return deadline.locale("de").format(stringFormat);
		}
	}
}
