//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cards} from "../../api/cards.js";
import {Learned} from "../../api/learned.js";
//import { ReactiveVar } from 'meteor/reactive-var';
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

export function drawGraph() {
	var card_id = Router.current().params._id;
	var user_id =  Meteor.userId();

	if (Session.get('data_loaded')) {
		var box1 = Learned.find({user_id, cardset_id: card_id, box: 1}).fetch().length;
		var box2 = Learned.find({user_id, cardset_id: card_id, box: 2}).fetch().length;
		var box3 = Learned.find({user_id, cardset_id: card_id, box: 3}).fetch().length;
		var box4 = Learned.find({user_id, cardset_id: card_id, box: 4}).fetch().length;
		var box5 = Learned.find({user_id, cardset_id: card_id, box: 5}).fetch().length;
		var box6 = Learned.find({user_id, cardset_id: card_id, box: 6}).fetch().length;
		//[Number(box1), Number(box2), Number(box3), Number(box4), Number(box5), Number(box6)];


		var userData = [Number(box1), Number(box2), Number(box3), Number(box4), Number(box5), Number(box6)];

		var data = {
			labels: [TAPi18n.__('subject1'),TAPi18n.__('subject2'), TAPi18n.__('subject3'), TAPi18n.__('subject4'), TAPi18n.__('subject5'), TAPi18n.__('subject6')],
			datasets: [
					{
						fillColor: "rgba(242,169,0,0.5)",
						strokeColor: "rgba(74,92,102,0.2)",
						pointColor: "rgba(220,220,220,1)",
						pointStrokeColor: "#fff",
						data: userData
					}
				]
		};
		var ctx = document.getElementById("boxChart").getContext("2d");
		new Chart(ctx).Bar(data,

		{
			responsive: true
		});
	}
}



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
		if (selectedBox < 6) {
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


Template.boxSide.onRendered(function () {
	var self = this;
	self.subscribe("learned", function () {
		self.autorun(function () {
			drawGraph();
		});
	});
});

