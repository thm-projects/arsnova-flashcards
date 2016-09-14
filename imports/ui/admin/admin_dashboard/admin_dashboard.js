//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../../api/cardsets.js";
import {Cards} from "../../../api/cards.js";
import {Learned} from "../../../api/learned.js";
import "./admin_dashboard.html";

Meteor.subscribe('learned', function () {
	Session.set('data_loaded', true);
});

/**
 * ############################################################################
 * admin_dashboard
 * ############################################################################
 */

export function drawGraph() {
	if (Session.get('data_loaded')) {
		var box1 = Learned.find({box: 1}).fetch().length;
		var box2 = Learned.find({box: 2}).fetch().length;
		var box3 = Learned.find({box: 3}).fetch().length;
		var box4 = Learned.find({box: 4}).fetch().length;
		var box5 = Learned.find({box: 5}).fetch().length;
		var box6 = Learned.find({box: 6}).fetch().length;
		$('#container').highcharts({
			chart: {
				type: 'column'
			},
			title: {
				text: 'Lernfortschritt'
			},
			xAxis: {
				categories: ['Fach 1', 'Fach 2', 'Fach 3', 'Fach 4', 'Fach 5', 'Gelernt']
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Karten pro Satz'
				}
			},
			legend: {
				reversed: true
			},
			plotOptions: {
				series: {
					name: "Lernstand aller Kartensätze	",
					stacking: 'normal'
				}
			},
			series: [{
				data: [Number(box1), Number(box2), Number(box3), Number(box4), Number(box5), Number(box6)]
			}]
		});
	}
}

Template.admin_dashboard.helpers({
	totalCardsets: function () {
		return Cardsets.find().count();
	},
	totalCards: function () {
		return Cards.find().count();
	},
	totalUser: function () {
		return Meteor.users.find().count();
	},
	getOnlineStatusTotal: function () {
		return Meteor.users.find({'status.online': {$ne: false}}).count();
	}
});

AppController = RouteController.extend({
	layoutTemplate: 'adminLayout'
});


Template.admin_dashboard.onRendered(function () {
	var self = this;
	self.subscribe("learned", function () {
		self.autorun(function () {
			drawGraph();
		});
	});
});

