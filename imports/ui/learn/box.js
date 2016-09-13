//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cards} from "../../api/cards.js";
import {Learned} from "../../api/learned.js";
import "./box.html";


Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
Meteor.subscribe('learned', function () {
	Session.set('data_loaded', true);
});

Session.set('selectedBox', null);
Session.set('isFront', true);
Session.set('maxIndex', 1);
Session.set('isFinish', false);



/**
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
		return selectedBox !== null;
	},
	isNotEmpty: function () {
		var notEmpty = Learned.find({
			cardset_id: this._id,
			user_id: Meteor.userId(),
			box: parseInt(Session.get('selectedBox'))
		}).count();
		return notEmpty;
	},
	isFinish: function () {
		return Session.get('isFinish');
	}
});

/**
 * ############################################################################
 * boxMain
 * ############################################################################
 */

Template.boxMain.helpers({
	isFront: function () {
		var isFront = Session.get('isFront');
		return isFront === true;
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
		var currentCard = $('.carousel-inner > .active').attr('data');
		var currentLearned = Learned.findOne({
			card_id: currentCard,
			user_id: Meteor.userId()
		});

		var selectedBox = parseInt(Session.get('selectedBox'));
		if (selectedBox < 5) {
			Meteor.call('updateLearned', currentLearned._id, selectedBox + 1);
		}

		if (1 === parseInt(Session.get('maxIndex'))) {
			Session.set('isFinish', true);
		}
		Session.set('isFront', true);
	},
	"click #notknown": function () {
		var currentCard = $('.carousel-inner > .active').attr('data');
		var currentLearned = Learned.findOne({
			card_id: currentCard,
			user_id: Meteor.userId()
		});
		Meteor.call('updateLearned', currentLearned._id, 1);

		if (1 === parseInt(Session.get('maxIndex'))) {
			Session.set('isFinish', true);
		}
		Session.set('isFront', true);
	}
});

/**
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
	}
});

Template.boxSide.onDestroyed(function () {
	Session.set('selectedBox', null);
});

/**
 * ############################################################################
 * boxEnd
 * ############################################################################
 */

Template.boxEnd.events({
	"click #endscreenBack": function () {
		Session.set('selectedBox', null);
		Session.set('isFinish', false);
		Router.go('cardsetdetailsid', {
			_id: this._id
		});
	}
});

/**
 * ############################################################################
 * Chart
 * ############################################################################
 */


AppController = RouteController.extend({
	layoutTemplate: 'appLayout5'
});
Template.boxSide.onRendered(function () {
	$(function () {
		if (Session.get('data_loaded')) {
			var box1 = Learned.find({box: 1}).fetch().length;
			var box2 = Learned.find({box: 2}).fetch().length;
			var box3 = Learned.find({box: 3}).fetch().length;
			var box4 = Learned.find({box: 4}).fetch().length;
			var box5 = Learned.find({box: 5}).fetch().length;
			var box6 = Learned.find({box: 6}).fetch().length;
		}
		$('#container').highcharts({
			chart: {
				type: 'column'
			},
			title: {
				text: 'Lernfortschritt'
			},
			xAxis: {
				categories: ['Fach 1', 'Fach 2', 'Fach 3', 'Fach 4', 'Fach 5','Gelernt']
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
					stacking: 'normal'
				}
			},
			series: [{
				data: [Number(box1), Number(box2), Number(box3), Number(box4), Number(box5), Number(box6)]
			}/*, {
				name: 'Javascript',
				data: [2, 2, 3, 2, 5]
			}, {
				name: 'Git',
				data: [3, 4, 4, 2, 5]
			}, {
				name: 'Websocket',
				data: [2, 2, 3, 2, 5]
			}, {
				name: 'Usability',
				data: [2, 2, 3, 2, 5]
			}*/]
		});
	});
});
