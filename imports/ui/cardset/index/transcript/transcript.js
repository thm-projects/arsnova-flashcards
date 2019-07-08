import "./transcript.html";
import "./item/cancel.js";
import "./item/save.js";
import "./navigation/navigation.js";
import "./settings/settings.js";
import "./statistics/statistics.js";
import "./submissions/submissions.js";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {Bonus} from "../../../../api/bonus";
import {Filter} from "../../../../api/filter";

Session.setDefault('transcriptViewingMode', 1);

/*
 * ############################################################################
 * cardsetTranscript
 * ############################################################################
 */

Template.cardsetIndexTranscript.onCreated(function () {
	if (Session.get('transcriptViewingMode') === 1) {
		Filter.resetActiveFilter();
	}
});

Template.cardsetIndexTranscript.helpers({
	isViewActive: function (id) {
		return Session.get('transcriptViewingMode') === id;
	},
	isInBonus: function () {
		return Bonus.isInBonus(Session.get('activeCardset')._id, Meteor.userId());
	}
});
