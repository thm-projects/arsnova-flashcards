import "./progress.html";
import {Leitner} from "../../api/learned";
import {Cards} from "../../api/cards";
import {Cardsets} from "../../api/cardsets";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Chart} from "chart.js";
import {getAuthorName} from "../../api/userdata";
import {CardType} from "../../api/cardTypes";
import ResizeSensor from "../../../client/resize_sensor/ResizeSensor";

let chart;

let chartColors = {
	difficulty0: 'rgba(238, 173, 14, 1)',
	difficulty0Background: 'rgba(238, 173, 14, 0.2)',
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

function updateGraphLabels() {
	let learningInterval = Cardsets.findOne({_id: Router.current().params._id}).learningInterval;
	let firstInterval = "";
	let box1Label = [], box2Label = [], box3Label = [], box4Label = [], box5Label = [], box6Label;
	if (learningInterval[0] <= 1) {
		firstInterval = TAPi18n.__('leitnerProgress.subjectIntervalDaily');
	} else {
		firstInterval = TAPi18n.__('leitnerProgress.subjectInterval', {days: learningInterval[0]});
	}
	if ($(window).width() >= 768) {
		box1Label = [TAPi18n.__('leitnerProgress.box', {number: 1}), TAPi18n.__('leitnerProgress.subjectNotLearned'), firstInterval];
		box2Label = [TAPi18n.__('leitnerProgress.box', {number: 2}), TAPi18n.__('leitnerProgress.subjectInterval', {days: learningInterval[1]})];
		box3Label = [TAPi18n.__('leitnerProgress.box', {number: 3}), TAPi18n.__('leitnerProgress.subjectInterval', {days: learningInterval[2]})];
		box4Label = [TAPi18n.__('leitnerProgress.box', {number: 4}), TAPi18n.__('leitnerProgress.subjectInterval', {days: learningInterval[3]})];
		box5Label = [TAPi18n.__('leitnerProgress.box', {number: 5}), TAPi18n.__('leitnerProgress.subjectInterval', {days: learningInterval[4]})];
	} else {
		box1Label = [TAPi18n.__('leitnerProgress.box', {number: 1})];
		box2Label = [TAPi18n.__('leitnerProgress.box', {number: 2})];
		box3Label = [TAPi18n.__('leitnerProgress.box', {number: 3})];
		box4Label = [TAPi18n.__('leitnerProgress.box', {number: 4})];
		box5Label = [TAPi18n.__('leitnerProgress.box', {number: 5})];
	}
	box6Label = [TAPi18n.__('leitnerProgress.learned')];
	chart.config.data.labels = [box1Label, box2Label, box3Label, box4Label, box5Label, box6Label];
	chart.update();
}

function drawGraph() {
	let ctx = document.getElementById("boxChart").getContext("2d");
	chart = new Chart(ctx, {
		type: 'bar',
		data: {
			datasets: [
				{
					backgroundColor: chartColors.difficulty0Background,
					borderColor: chartColors.difficulty0,
					borderWidth: 2,
					data: [0, 0, 0, 0, 0, 0],
					label: TAPi18n.__('difficulty0')
				},
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
			maintainAspectRatio: false,
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
	updateGraphLabels();
}

function updateGraphData() {
	let filterCards;
	let prepareFilter;
	if (Router.current().route.getName() === "profileOverview") {
		prepareFilter = Leitner.find({user_id: Meteor.userId()}, {_id: 1}).map(function (leitner) {
			return leitner.card_id;
		});
	}
	for (let k = 0; k < 4; k++) {
		if (Router.current().route.getName() === "progress") {
			let cardset = Cardsets.findOne({_id: Router.current().params._id}, {Fields: {shuffled: 1, cardGroups: 1}});
			if (cardset.shuffled) {
				if (k === 0) {
					filterCards = Cards.find({
						cardset_id: {$in: cardset.cardGroups},
						cardType: {$nin: CardType.getCardTypesWithDifficultyLevel()}
					}, {_id: 1}).map(function (card) {
						return card._id;
					});
				} else {
					filterCards = Cards.find({
						cardset_id: {$in: cardset.cardGroups},
						difficulty: k,
						cardType: {$in: CardType.getCardTypesWithDifficultyLevel()}
					}, {_id: 1}).map(function (card) {
						return card._id;
					});
				}
			} else {
				if (k === 0) {
					filterCards = Cards.find({
						cardset_id: Router.current().params._id,
						cardType: {$nin: CardType.getCardTypesWithDifficultyLevel()}
					}, {_id: 1}).map(function (card) {
						return card._id;
					});
				} else {
					filterCards = Cards.find({
						cardset_id: Router.current().params._id,
						difficulty: k,
						cardType: {$in: CardType.getCardTypesWithDifficultyLevel()}
					}, {_id: 1}).map(function (card) {
						return card._id;
					});
				}
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
			updateGraphData();
		});
	});
	new ResizeSensor($('#boxChart'), function () {
		updateGraphLabels();
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
