import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets";
import {Cards} from "./cards";

if (Meteor.isServer) {
	Meteor.publish('serverInventory', function () {
		Counts.publish(this, 'cardsetsCounter', Cardsets.find(), {fastCount: true});
		Counts.publish(this, 'cardsCounter', Cards.find(), {fastCount: true});
		Counts.publish(this, 'usersCounter', Meteor.users.find(), {fastCount: true});
		Counts.publish(this, 'usersOnlineCounter', Meteor.users.find({'status.online': true}), {fastCount: true});
	});
}
