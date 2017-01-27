//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cards} from "../../api/cards.js";
import {Learned} from "../../api/learned.js";
import "./box.html";
import * as lib from '/client/lib.js';

Meteor.subscribe("cardsets");
Meteor.subscribe("cards");


Session.set('selectedBox', null);
Session.set('isFront', true);
Session.set('maxIndex', 1);
Session.set('isFinish', false);

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
	var cardset_id = Router.current().params._id;
	var cards = Cards.find({
		cardset_id: cardset_id
	});
	cards.forEach(function (card) {
		Meteor.call("addLearned", card.cardset_id, card._id);
	});
});

Template.box.helpers({
	boxSelected: function () {
		var selectedBox = Session.get('selectedBox');
		if (this.learningActive) {
			return true;
		}
		return selectedBox !== null;
	},
	isNotEmpty: function () {
		var notEmpty;
		if (this.learningActive) {
			notEmpty = Learned.find({
				cardset_id: this._id,
				user_id: Meteor.userId(),
				active: true
			}).count();
		} else {
			notEmpty = Learned.find({
				cardset_id: this._id,
				user_id: Meteor.userId(),
				box: parseInt(Session.get('selectedBox'))
			}).count();
		}
		return notEmpty;
	},
	isFinish: function () {
		if (this.learningActive && Learned.find({
				cardset_id: this._id,
				user_id: Meteor.userId(),
				active: true
			}).count()) {
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
	isLearningActive: function () {
		return this.learningActive;
	},
	isFront: function () {
		var isFront = Session.get('isFront');
		return isFront === true;
	},
	box: function () {
		return Session.get("selectedBox");
	},
	getCardsByBox: function () {
		var selectedBox = parseInt(Session.get('selectedBox'));

		var learnedCards = Learned.find({
			cardset_id: this._id,
			user_id: Meteor.userId(),
			box: selectedBox
		}, {
			sort: {
				currentDate: 1
			}
		});

		var cards = [];
		learnedCards.forEach(function (learnedCard) {
			var card = Cards.findOne({
				_id: learnedCard.card_id
			});
			cards.push(card);
		});

		return cards;
	},
	getCardsByLeitner: function () {
		var learnedCards = Learned.find({
			cardset_id: this._id,
			user_id: Meteor.userId(),
			active: true
		}, {
			sort: {
				currentDate: 1
			}
		});

		var cards = [];
		learnedCards.forEach(function (learnedCard) {
			var card = Cards.findOne({
				_id: learnedCard.card_id
			});
			cards.push(card);
		});

		return cards;
	},
	cardActiveByBox: function (index) {
		return 1 === index + 1;
	},
	countBox: function () {
		var maxIndex = Learned.find({
			cardset_id: this._id,
			user_id: Meteor.userId(),
			box: parseInt(Session.get('selectedBox'))
		}).count();
		Session.set('maxIndex', maxIndex);
		return maxIndex;
	},
	countLeitner: function () {
		var maxIndex = Learned.find({
			cardset_id: this._id,
			user_id: Meteor.userId(),
			active: true
		}).count();
		Session.set('maxIndex', maxIndex);
		return maxIndex;
	},
	splitTextOnNewLine: function (text) {
		const result = text.split("\n");
		lib.parseGithubFlavoredMarkdown(result);
		return result;
	},
	boxMarkdownFront: function (front, index) {
		Meteor.promise("convertMarkdown", front)
			.then(function (html) {
				$(".front" + index).html(html);
				$('table').addClass('table');
			});
	},
	boxMarkdownBack: function (back, index) {
		Meteor.promise("convertMarkdown", back)
			.then(function (html) {
				$(".back" + index).html(html);
				$('table').addClass('table');
			});
	}
});

Template.boxMain.events({
	"click .box": function () {
		var isFront = Session.get('isFront');
		if (isFront === true) {
			Session.set('isFront', false);
		} else {
			Session.set('isFront', true);
		}
	},
	"click #known": function () {
		Meteor.call('updateLearned', this._id, $('.carousel-inner > .active').attr('data'), false);

		if (1 === parseInt(Session.get('maxIndex'))) {
			Session.set('isFinish', true);
		}
		Session.set('isFront', true);
	},
	"click #notknown": function () {
		Meteor.call('updateLearned', this._id, $('.carousel-inner > .active').attr('data'), true);

		if (1 === parseInt(Session.get('maxIndex'))) {
			Session.set('isFinish', true);
		}
		Session.set('isFront', true);
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
			cardset_id: this._id,
			user_id: Meteor.userId(),
			box: boxId
		}).count();
	},
	isDisabled: function () {
		return this.learningActive ? 'disabled' : '';
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
		return this.learningActive;
	}
});

Template.boxEnd.events({
	"click #endscreenBack": function () {
		Session.set('selectedBox', null);
		Session.set('isFinish', false);
		Router.go('cardsetdetailsid', {
			_id: this._id
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
