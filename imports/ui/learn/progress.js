import "./progress.html";
import {Leitner} from "../../api/learned";
import {Cards} from "../../api/cards";
import {Cardsets} from "../../api/cardsets";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Chart} from "chart.js";
import {getAuthorName} from "../../api/userdata";

let chart;

let chartColors = {
	difficulty1: 'rgba(92, 184, 92, 1)',
	difficulty1Background: 'rgba(92, 184, 92, 0.2)',
	difficulty2: 'rgba(91, 192, 222, 1)',
	difficulty2Background: 'rgba(91, 192, 222, 0.2)',
	difficulty3: 'rgba(217, 83, 79, 1)',
	difficulty3Background: 'rgba(217, 83, 79, 0.2)'
};

/*
 * ############################################################################
 * Graph
 * ############################################################################
 */

function drawGraph() {
	let ctx = document.getElementById("boxChart").getContext("2d");
	chart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: [TAPi18n.__('subject1') + " (" + TAPi18n.__('subjectNotLearned') + ")", TAPi18n.__('subject2'), TAPi18n.__('subject3'), TAPi18n.__('subject4'), TAPi18n.__('subject5'), TAPi18n.__('subject6')],
			datasets: [
				{
					backgroundColor: chartColors.difficulty1Background,
					borderColor: chartColors.difficulty1,
					borderWidth: 2,
					data: [0, 0, 0, 0, 0, 0],
					label: TAPi18n.__('difficulty1')
				},
				{
					backgroundColor: chartColors.difficulty2Background,
					borderColor: chartColors.difficulty2,
					borderWidth: 2,
					data: [0, 0, 0, 0, 0, 0],
					label: TAPi18n.__('difficulty2')
				},
				{
					backgroundColor: chartColors.difficulty3Background,
					borderColor: chartColors.difficulty3,
					borderWidth: 2,
					data: [0, 0, 0, 0, 0, 0],
					label: TAPi18n.__('difficulty3')
				}
			]
		},
		options: {
			tooltips: {
				mode: 'index',
				intersect: false
			},
			responsive: true,
			scales: {
				xAxes: [{
					stacked: true
				}],
				yAxes: [{
					stacked: true,
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
	let filterCards;
	let prepareFilter;
	if (Router.current().route.getName() === "profileOverview") {
		prepareFilter = Leitner.find({user_id: Meteor.userId()}, {_id: 1}).map(function (leitner) {
			return leitner.card_id;
		});
	}
	for (let k = 0; k < 3; k++) {
		if (Router.current().route.getName() === "progress") {
			let cardset = Cardsets.findOne({_id: Router.current().params._id}, {Fields: {shuffled: 1, cardGroups: 1}});
			if (cardset.shuffled) {
				filterCards = Cards.find({
					cardset_id: {$in: cardset.cardGroups},
					difficulty: k + 1
				}, {_id: 1}).map(function (card) {
					return card._id;
				});
			} else {
				filterCards = Cards.find({
					cardset_id: Router.current().params._id,
					difficulty: k + 1
				}, {_id: 1}).map(function (card) {
					return card._id;
				});
			}
		} else if (Router.current().route.getName() === "profileOverview") {
			filterCards = Cards.find({_id: {$in: prepareFilter}, difficulty: k}, {_id: 1}).map(function (card) {
				return card._id;
			});
		} else {
			filterCards = Cards.find({difficulty: k}, {_id: 1}).map(function (card) {
				return card._id;
			});
		}
		for (let i = 0; i < 6; i++) {
			if (Router.current().route.getName() === "progress") {
				chart.data.datasets[k].data[i] = Leitner.find({
					cardset_id: Router.current().params._id,
					user_id: Router.current().params.user_id,
					box: i + 1,
					card_id: {$in: filterCards}
				}).count();
			} else if (Router.current().route.getName() === "profileOverview") {
				chart.data.datasets[k].data[i] = Leitner.find({
					user_id: Meteor.userId(),
					card_id: {$in: filterCards},
					box: i + 1
				}).count();
			} else {
				chart.data.datasets[k].data[i] = Leitner.find({card_id: {$in: filterCards}, box: i + 1}).count();
			}
		}
	}
	chart.update();
}

Template.graph.helpers({
	countBox: function (boxId) {
		if (Router.current().route.getName() === "progress") {
			return Leitner.find({
				cardset_id: Router.current().params._id,
				user_id: Router.current().params.user_id,
				box: boxId
			}).count();
		} else {
			return Leitner.find({
				user_id: Meteor.userId(),
				box: boxId
			}).count();
		}
	},
	getChartTitle: function () {
		if (Router.current().route.getName() === "progress") {
			let title = this.name + ": ";
			if (Meteor.userId() === Router.current().params.user_id) {
				return title + TAPi18n.__('admin.myProgress');
			} else {
				return title + TAPi18n.__('admin.userProgress') + ' "' + getAuthorName(Router.current().params.user_id) + '"';
			}
		} else {
			return TAPi18n.__('admin.allLearnedCardsets');
		}
	}
});

Template.graph.onRendered(function () {
	drawGraph();
	var self = this;
	self.subscribe("leitner", function () {
		self.autorun(function () {
			updateGraph();
		});
	});
});

/*
 * ############################################################################
 * progress
 * ############################################################################
 */

Template.progress.helpers({
	gotCards: function () {
		return Leitner.find({
			cardset_id: Router.current().params._id,
			user_id: Router.current().params.user_id
		}).count();
	},
	isStatsOwner: function () {
		return Meteor.userId() === Router.current().params.user_id;
	}
});
Template.progress.events({
	"click #backButton": function () {
		if (Meteor.userId() === Router.current().params.user_id) {
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		} else {
			Router.go('cardsetstats', {
				_id: Router.current().params._id
			});
		}
	}
});
