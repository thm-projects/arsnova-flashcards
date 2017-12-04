import {Leitner} from "../imports/api/learned.js";

/**
 * Class used for generating text of mail and web-push messages
 */
export class Notifications {
	/** Function returns the name of the user for the E-Mail and Web-Push notification text
	 *  @param {string} user_id - The id of the user
	 *  @returns {string} - The name of the user
	 * */
	getName (user_id) {
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
	getActiveCardsCount (cardset_id, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			return Leitner.find({
				cardset_id: cardset_id,
				user_id: user_id,
				active: true
			}).count();
		}
	}
}
