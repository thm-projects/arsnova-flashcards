//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Leitner} from "../../../api/subscriptions/leitner";
import {Wozniak} from "../../../api/subscriptions/wozniak";
import "./item/bonus.js";
import "./item/deleteAllCards.js";
import "./item/editCardset.js";
import "./item/editLicense.js";
import "./item/editRepetitorium.js";
import "./item/export.js";
import "./item/import.js";
import "./item/learning.js";
import "./item/manage.js";
import "./item/newCard.js";
import "./item/presentation.js";
import "./item/publishCardset.js";
import "./item/transcripts.js";
import "./item/workload.js";
import "./navigation.html";

/*
 * ############################################################################
 * cardsetNavigation
 * ############################################################################
 */

Template.cardsetNavigation.helpers({
	learning: function () {
		return (Leitner.findOne({
			cardset_id: Router.current().params._id,
			user_id: Meteor.userId()
		}) || Wozniak.findOne({
			cardset_id: Router.current().params._id,
			user_id: Meteor.userId(),
			interval: {$ne: 0}
		}));
	}
});
