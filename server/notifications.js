import {LeitnerUserCardStats} from "../imports/api/subscriptions/leitner/leitnerUserCardStats.js";
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
	 *  @param {Object} leitnerWorkload - The active learning workload
	 *  @param {string} user_id - The id of the user
	 *  @returns {number} - The amount of cards that the user has to learn from the cardset
	 * */
	static getActiveCardsCount (leitnerWorkload, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			return LeitnerUserCardStats.find({
				learning_phase_id: leitnerWorkload.learning_phase_id,
				workload_id: leitnerWorkload._id,
				cardset_id: leitnerWorkload.cardset_id,
				user_id: user_id,
				isActive: true
			}).count();
		}
	}

	static getDeadline (learningPhase, leitnerWorkload, user_id) {
		let stringFormat = "dddd, Do MMMM HH:mm";
		let adjustedHours = {
			hour: Meteor.settings.public.dailyCronjob.executeAtHour,
			minute: 0
		};
		let activeLeitnerCard = LeitnerUserCardStats.findOne({
			learning_phase_id: leitnerWorkload.learning_phase_id,
			workload_id: leitnerWorkload._id,
			cardset_id: leitnerWorkload.cardset_id,
			user_id: user_id,
			isActive: true
		});
		let deadline = moment(activeLeitnerCard.activatedSinceDate).add(learningPhase.daysBeforeReset, 'days').set(adjustedHours);
		let cardsetLearningEnd = moment(learningPhase.end).set(adjustedHours);
		if (deadline > cardsetLearningEnd && Bonus.isInBonus(leitnerWorkload.cardset_id, user_id)) {
			return cardsetLearningEnd.locale("de").format(stringFormat);
		} else {
			return deadline.locale("de").format(stringFormat);
		}
	}
}
