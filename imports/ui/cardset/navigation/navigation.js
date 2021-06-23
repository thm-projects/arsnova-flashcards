//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {LeitnerUserCardStats} from "../../../api/subscriptions/leitner/leitnerUserCardStats";
import {Wozniak} from "../../../api/subscriptions/wozniak";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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
import "./item/index.js";
import "./navigation.html";

/*
 * ############################################################################
 * cardsetNavigation
 * ############################################################################
 */

Template.cardsetNavigation.helpers({
	learning: function () {
		return (LeitnerUserCardStats.findOne({
			cardset_id: FlowRouter.getParam('_id'),
			user_id: Meteor.userId()
		}) || Wozniak.findOne({
			cardset_id: FlowRouter.getParam('_id'),
			user_id: Meteor.userId(),
			interval: {$ne: 0}
		}));
	}
});
