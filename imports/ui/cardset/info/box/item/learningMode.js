//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {LeitnerUserCardStats} from "../../../../../api/subscriptions/leitner/leitnerUserCardStats";
import {Wozniak} from "../../../../../api/subscriptions/wozniak";
import "./learningMode.html";

/*
* ############################################################################
* cardsetInfoBoxItemLearningMode
* ############################################################################
*/

Template.cardsetInfoBoxItemLearningMode.helpers({
	getLearningMode: function () {
		let actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		actualDate.setHours(0, 0, 0, 0);
		let count = 0;
		if (LeitnerUserCardStats.find({cardset_id: this._id, user_id: Meteor.userId(), active: true}).count()) {
			count += 1;
		}
		if (Wozniak.find({
			cardset_id: this._id, user_id: Meteor.userId(), nextDate: {
				$lte: actualDate
			}
		}).count()) {
			count += 2;
		}
		switch (count) {
			case 0:
				return TAPi18n.__('set-list.none');
			case 1:
				return TAPi18n.__('set-list.leitner');
			case 2:
				return TAPi18n.__('set-list.wozniak');
			case 3:
				return TAPi18n.__('set-list.both');
		}
	}
});
