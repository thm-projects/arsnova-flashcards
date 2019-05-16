import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets";
import {Cards} from "./cards";
import {ServerStyle} from "./styles.js";

if (Meteor.isServer) {
	Meteor.publish('serverInventory', function () {
		let kindFilter = ['server', 'demo'];
		if (!ServerStyle.isLoginEnabled("pro")) {
			kindFilter.push("pro");
		}
		Counts.publish(this, 'cardsetsCounter', Cardsets.find({kind: {$nin: kindFilter}, shuffled: false}), {fastCount: true});
		Counts.publish(this, 'repetitoriumCounter', Cardsets.find({kind: {$nin: kindFilter}, shuffled: true}), {fastCount: true});
		Counts.publish(this, 'wordcloudCounter', Cardsets.find({kind: {$nin: kindFilter}, wordcloud: true}), {fastCount: true});
		Counts.publish(this, 'cardsCounter', Cards.find({
			cardset_id: {
				$in: Cardsets.find({kind: {$nin: kindFilter}}).map(function (cardset) {
					return cardset._id;
				})
			}
		}), {fastCount: true});
		Counts.publish(this, 'cardsetsPrivateCounter', Cardsets.find({kind: "personal", shuffled: false}), {fastCount: true});
		Counts.publish(this, 'repetitoriumPrivateCounter', Cardsets.find({kind: "personal", shuffled: true}), {fastCount: true});
		Counts.publish(this, 'wordcloudPrivateCounter', Cardsets.find({kind: "personal", wordcloud: true}), {fastCount: true});
		Counts.publish(this, 'cardsetsFreeCounter', Cardsets.find({kind: "free", shuffled: false}), {fastCount: true});
		Counts.publish(this, 'repetitoriumFreeCounter', Cardsets.find({kind: "free", shuffled: true}), {fastCount: true});
		Counts.publish(this, 'wordcloudFreeCounter', Cardsets.find({kind: "free", wordcloud: true}), {fastCount: true});
		Counts.publish(this, 'cardsetsEduCounter', Cardsets.find({kind: "edu", shuffled: false}), {fastCount: true});
		Counts.publish(this, 'repetitoriumEduCounter', Cardsets.find({kind: "edu", shuffled: true}), {fastCount: true});
		Counts.publish(this, 'wordcloudEduCounter', Cardsets.find({kind: "edu", wordcloud: true}), {fastCount: true});
		if (ServerStyle.isLoginEnabled("pro")) {
			Counts.publish(this, 'cardsetsProCounter', Cardsets.find({kind: "pro", shuffled: false}), {fastCount: true});
			Counts.publish(this, 'repetitoriumProCounter', Cardsets.find({kind: "pro", shuffled: true}), {fastCount: true});
			Counts.publish(this, 'wordcloudProCounter', Cardsets.find({kind: "pro", wordcloud: true}), {fastCount: true});
			Counts.publish(this, 'userProCounter', Meteor.users.find({_id: {$nin: ['NotificationsTestUser', '.cards']}, roles: {$in: ["pro"]}}), {fastCount: true});
		}
		Counts.publish(this, 'userCounter', Meteor.users.find({_id: {$nin: ['NotificationsTestUser', '.cards']}}), {fastCount: true});
		Counts.publish(this, 'userOnlineCounter', Meteor.users.find({'status.online': true}), {fastCount: true});
	});
}
