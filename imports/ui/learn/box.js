//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Learned} from "../../api/learned.js";
import {turnCard, resizeAnswers} from "../card/card.js";
import "./box.html";

Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
Meteor.subscribe('learned');

Session.set('isFront', true);

var chart;

/*
 * ############################################################################
 * box
 * ############################################################################
 */

Template.box.onCreated(function () {
	Session.set('modifiedCard', undefined);
	Session.set('activeCardset', Cardsets.findOne({"_id": Router.current().params._id}));
});

Template.box.helpers({
	noCards: function () {
		return !Learned.findOne({
			cardset_id: Session.get('activeCardset')._id,
			user_id: Meteor.userId(),
			box: {$ne: 6}
		});
	},
	isFinished: function () {
		return !Learned.findOne({
			cardset_id: Session.get('activeCardset')._id,
			user_id: Meteor.userId(),
			active: true
		});
	}
});


Template.box.events({
	/**
	 * Go back to cardset from leitner box mode
	 * Go back one page in the history, on click of the "Return to cardset" button
	 */
	"click #backButton": function () {
		window.history.go(-1);
	}
});

/*
 * ############################################################################
 * boxMain
 * ############################################################################
 */

Template.boxMain.onRendered(function () {
	resizeAnswers();
	$(window).resize(function () {
		resizeAnswers();
	});
});

Template.boxMain.helpers({
	isFront: function () {
		var isFront = Session.get('isFront');
		return isFront === true;
	}
});

Template.boxMain.events({
	"click .box": function (evt) {
		if (($(evt.target).data('type') !== "showHint")) {
			var isFront = Session.get('isFront');
			if (isFront === true) {
				Session.set('isFront', false);
			} else {
				Session.set('isFront', true);
			}
			$('html, body').animate({scrollTop: '0px'}, 300);
		}
	},
	"click #known": function () {
		Meteor.call('updateLearned', Session.get('activeCardset')._id, $('.carousel-inner > .active').attr('data-id'), false);
		Session.set('isFront', true);
		turnCard();
		$('html, body').animate({scrollTop: '0px'}, 300);
	},
	"click #notknown": function () {
		Meteor.call('updateLearned', Session.get('activeCardset')._id, $('.carousel-inner > .active').attr('data-id'), true);
		Session.set('isFront', true);
		turnCard();
		$('html, body').animate({scrollTop: '0px'}, 300);
	}
});

/*
 * ############################################################################
 * Graph
 * ############################################################################
 */

function drawGraph() {
	var ctx = document.getElementById("boxChart").getContext("2d");
	chart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: [TAPi18n.__('subject1'), TAPi18n.__('subject2'), TAPi18n.__('subject3'), TAPi18n.__('subject4'), TAPi18n.__('subject5'), TAPi18n.__('subject6')],
			datasets: [
				{
					backgroundColor: "rgba(242,169,0,0.5)",
					borderColor: "rgba(74,92,102,0.2)",
					borderWidth: 1,
					data: [0, 0, 0, 0, 0, 0],
					label: 'Anzahl Karten'
				}
			]
		},
		options: {
			responsive: true,
			legend: {
				display: false
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						callback: function (value) {
							if (value % 1 === 0) {
								return value;
							}
						}
					}
				}]
			}
		}
	});
}

function updateGraph() {
	var query = {};
	if (Meteor.userId() !== undefined) {
		query.user_id = Meteor.userId();
	}
	if (Router.current().params._id !== undefined) {
		query.cardset_id = Router.current().params._id;
	}

	var i;
	for (i = 0; i < 6; i++) {
		query.box = (i + 1);
		chart.data.datasets[0].data[i] = Learned.find(query).count();
	}

	chart.update();
}

Template.graph.helpers({
	countBox: function (boxId) {
		return Learned.find({
			cardset_id: Session.get('activeCardset')._id,
			user_id: Meteor.userId(),
			box: boxId
		}).count();
	}
});

Template.graph.onRendered(function () {
	drawGraph();
	var self = this;
	self.subscribe("learned", function () {
		self.autorun(function () {
			updateGraph();
		});
	});
});
