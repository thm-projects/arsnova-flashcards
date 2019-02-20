import {Meteor} from "meteor/meteor";
import "./item/cards.js";
import "./item/cardsets.js";
import "./item/repetitorium.js";
import "./item/user.js";
import "./item/wordcloud.js";
import "./statistics.html";
import {Session} from "meteor/session";

Meteor.subscribe("serverInventory");

Template.impressumModalStatistics.onRendered(function () {
	$('#impressumStatisticsModal').on('hidden.bs.modal', function () {
		Session.set('serverStatisticsModalActive', false);
	});
	$('#impressumStatisticsModal').on('shown.bs.modal', function () {
		$('.showArsnovaClick').addClass('pressed');
		if (!Session.get('serverStatisticsModalActive')) {
			Session.set('serverStatisticsModalActive', true);
		}
	});
});
