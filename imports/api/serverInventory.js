import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets";
import {Cards} from "./cards";

if (Meteor.isServer) {
	Meteor.publish('serverInventory', function () {
		Counts.publish(this, 'cardsetsCounter', Cardsets.find({kind: {$nin: ['server', 'demo']}}), {fastCount: true});
		Counts.publish(this, 'cardsCounter', Cards.find({
			cardset_id: {
				$in: Cardsets.find({kind: {$nin: ['server', 'demo']}}).map(function (cardset) {
					return cardset._id;
				})
			}
		}), {fastCount: true});
		Counts.publish(this, 'usersCounter', Meteor.users.find({_id: {$nin: ['NotificationsTestUser']}}), {fastCount: true});
		Counts.publish(this, 'usersOnlineCounter', Meteor.users.find({'status.online': true}), {fastCount: true});
	});
}
