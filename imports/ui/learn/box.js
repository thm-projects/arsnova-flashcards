//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cards} from "../../api/cards.js";
import {Cardsets} from "../../api/cardsets.js";
import {Learned} from "../../api/learned.js";
import {turnCard} from "../card/card.js";
import "./box.html";

Meteor.subscribe("cardsets");
Meteor.subscribe("cards");


Session.set('selectedBox', null);
Session.set('isFront', true);
Session.set('maxIndex', 1);
Session.set('isFinish', true);

Meteor.subscribe('learned', function () {
	Session.set('data_loaded', true);
});

var chart;

/*
 * ############################################################################
 * box
 * ############################################################################
 */

Template.box.onCreated(function () {
	Session.set('activeCardset', Cardsets.findOne({"_id": Router.current().params._id}));
	if (!Session.get('activeCardset').learningActive) {
		var cards = Cards.find({
			cardset_id: Session.get('activeCardset')._id
		});
		cards.forEach(function (card) {
			Meteor.call("addLearned", Session.get('activeCardset')._id, card._id);
		});
	}
});

Template.box.helpers({
	boxSelected: function () {
		var selectedBox = Session.get('selectedBox');
		if (Session.get('activeCardset').learningActive) {
			return true;
		}
		return selectedBox !== null;
	},
	isNotEmpty: function () {
		var notEmpty;
		if (Session.get('activeCardset').learningActive) {
			notEmpty = Learned.find({
				cardset_id: Session.get('activeCardset')._id,
				user_id: Meteor.userId(),
				active: true
			}).count();
		} else {
			notEmpty = Learned.find({
				cardset_id: Session.get('activeCardset')._id,
				user_id: Meteor.userId(),
				box: parseInt(Session.get('selectedBox'))
			}).count();
		}
		return notEmpty;
	},
	isFinish: function () {
		if (Session.get('activeCardset').learningActive && Learned.find({
				cardset_id: Session.get('activeCardset')._id,
				user_id: Meteor.userId(),
				active: true
			}).count() !== 0) {
			Session.set('isFinish', false);
		} else if (!Session.get('activeCardset').learningActive && Learned.find({
				cardset_id: Session.get('activeCardset')._id,
				user_id: Meteor.userId(),
				box: {$nin: [6]}
			}).count() !== 0) {
			Session.set('isFinish', false);
		}
		return Session.get('isFinish');
	}
});

/*
 * ############################################################################
 * boxMain
 * ############################################################################
 */

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
		}
	},
	"click #known": function () {
		Meteor.call('updateLearned', Session.get('activeCardset')._id, $('.carousel-inner > .active').attr('data'), false);

		if (1 === parseInt(Session.get('maxIndex'))) {
			Session.set('isFinish', true);
		}
		Session.set('isFront', true);
		turnCard();
	},
	"click #notknown": function () {
		Meteor.call('updateLearned', Session.get('activeCardset')._id, $('.carousel-inner > .active').attr('data'), true);

		if (1 === parseInt(Session.get('maxIndex'))) {
			Session.set('isFinish', true);
		}
		Session.set('isFront', true);
		turnCard();
	}
});

/*
 * ############################################################################
 * boxSide
 * ############################################################################
 */

Template.boxSide.events({
	"click .learn-box": function (event) {
		var box = $(event.currentTarget).val();
		Session.set('selectedBox', box);
		Session.set('isFront', true);
		Session.set('isFinish', false);
	},
	'click #cardsetUser': function () {
		Router.go('profileOverview', {
			_id: Meteor.userId()
		});
	},
	"click #back-button": function () {
		window.history.go(-1);
	}
});

Template.boxSide.helpers({
	selectedBox: function (boxId) {
		var selectedBox = Session.get('selectedBox');
		if (boxId === selectedBox) {
			return "active";
		}
	},
	countBox: function (boxId) {
		return Learned.find({
			cardset_id: Session.get('activeCardset')._id,
			user_id: Meteor.userId(),
			box: boxId
		}).count();
	},
	isDisabled: function () {
		return Session.get('activeCardset').learningActive ? 'disabled' : '';
	}
});

Template.boxSide.onDestroyed(function () {
	Session.set('selectedBox', null);
});

/*
 * ############################################################################
 * boxEnd
 * ############################################################################
 */

Template.boxEnd.helpers({
	isLearningActive: function () {
		return Session.get('activeCardset').learningActive;
	}
});

Template.boxEnd.events({
	"click #endscreenBack": function () {
		Session.set('selectedBox', null);
		Session.set('isFinish', false);
		Router.go('cardsetdetailsid', {
			_id: Session.get('activeCardset')._id
		});
	}
});

/*
 * ############################################################################
 * Chart
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

Template.boxSide.onRendered(function () {
	drawGraph();
	if (Session.get('data_loaded') || !navigator.onLine) {
		updateGraph();
	}
});
