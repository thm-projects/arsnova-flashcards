import {Learned} from "../imports/api/learned.js";

export class Notifications {
	getName (user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var user = Meteor.users.find({_id: user_id}).fetch();
			return user[0].profile.name;
		}
	}

	getActiveCardsCount (cardset_id, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			return Learned.find({
				cardset_id: cardset_id,
				user_id: user_id,
				active: true
			}).count();
		}
	}
}
