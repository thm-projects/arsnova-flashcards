import {Chart} from "chart.js";
import {CardType} from "./cardTypes";
import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {Session} from "meteor/session";
import * as config from "../config/learningStatus.js";
import {NavigatorCheck} from "./navigatorCheck";
import {BonusForm} from "./bonusForm";

Session.set('workloadProgressUserID', undefined);
Session.set('workloadProgressCardsetID', undefined);
Session.set('workloadProgressType', undefined);

let chart;
let simulatorChart;
let difficultyGotCards;
let WorkloadCardsetCollection = new Mongo.Collection(null);
let WorkloadLeitnerCollection = new Mongo.Collection(null);

export let LearningStatus = class LearningStatus {
	static clearTempData () {
		WorkloadCardsetCollection = new Mongo.Collection(null);
		WorkloadLeitnerCollection = new Mongo.Collection(null);
		Session.set('workloadProgressUserID', undefined);
		Session.set('workloadProgressCardsetID', undefined);
		Session.set('workloadProgressType', undefined);
	}

	static setupTempData (cardset_id, user_id, type) {
		WorkloadCardsetCollection = new Mongo.Collection(null);
		WorkloadLeitnerCollection = new Mongo.Collection(null);
		Session.set('workloadProgressType', type);
		if (type === 'simulator') {
			Session.set('workloadProgressCardsetID', cardset_id);
			Session.set('workloadProgressUserID', Meteor.userId());
		} else {
			Meteor.call('getTempCardsetData', cardset_id, type, function (err, res) {
				if (!err) {
					for (let i = 0; i < res.length; i++) {
						WorkloadCardsetCollection.insert(res[i]);
					}
					Session.set('workloadProgressCardsetID', cardset_id);
				}
			});
			Meteor.call('getTempLeitnerData', cardset_id, user_id, type, function (err, res) {
				if (!err) {
					for (let i = 0; i < res.length; i++) {
						WorkloadLeitnerCollection.insert(res[i]);
					}
					Session.set('workloadProgressUserID', user_id);
				}
			});
		}
	}

	static getCardsetCollection () {
		return WorkloadCardsetCollection;
	}
	static getLeitnerCollection () {
		return WorkloadLeitnerCollection;
	}

	static initializeGraph (type) {
		if (type === 'simulator') {
			simulatorChart = this.createGraph('boxChartSimulator');
		} else {
			chart = this.createGraph('boxChart');
		}
	}

	static createGraph (targetID) {
		let ctx = document.getElementById(targetID).getContext("2d");
		return new Chart(ctx, {
			type: 'bar',
			data: {
				datasets: this.getGraphData()
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
	}

	static updateGraph (filterCardset = '-1') {
		let datasets;
		if (filterCardset === "-1") {
			datasets = this.getGraphData();
		} else {
			datasets = this.getGraphData(filterCardset);
		}
		if (Session.get('workloadProgressType') === 'simulator') {
			simulatorChart.data.datasets = datasets;
			simulatorChart.update();
		} else {
			chart.data.datasets = datasets;
			chart.update();
		}
	}

	static getGraphData (filterCardset = undefined) {
		if (Session.get('workloadProgressType') === 'simulator') {
			return [{
				backgroundColor: config.chartColors.simulatorBackground,
				borderColor: config.chartColors.simulator,
				borderWidth: config.borderWidth,
				data: BonusForm.getActiveSnapshot(),
				label: TAPi18n.__('bonus.form.simulator.graphLabel')
			}];
		} else {
			let graphData = [];

			let cardDifficultyCount = this.getCardCount(0, filterCardset);
			if (difficultyGotCards) {
				graphData.push({
					backgroundColor: config.chartColors.difficulty0Background,
					borderColor: config.chartColors.difficulty0,
					borderWidth: config.borderWidth,
					data: cardDifficultyCount,
					label: TAPi18n.__('difficulty0')
				});
			}

			cardDifficultyCount = this.getCardCount(1, filterCardset);
			if (difficultyGotCards) {
				graphData.push({
					backgroundColor: config.chartColors.difficulty1Background,
					borderColor: config.chartColors.difficulty1,
					borderWidth: config.borderWidth,
					data: cardDifficultyCount,
					label: TAPi18n.__('difficulty1')
				});
			}

			cardDifficultyCount = this.getCardCount(2, filterCardset);
			if (difficultyGotCards) {
				graphData.push({
					backgroundColor: config.chartColors.difficulty2Background,
					borderColor: config.chartColors.difficulty2,
					borderWidth: config.borderWidth,
					data: cardDifficultyCount,
					label: TAPi18n.__('difficulty2')
				});
			}

			cardDifficultyCount = this.getCardCount(3, filterCardset);
			if (difficultyGotCards) {
				graphData.push({
					backgroundColor: config.chartColors.difficulty3Background,
					borderColor: config.chartColors.difficulty3,
					borderWidth: config.borderWidth,
					data: cardDifficultyCount,
					label: TAPi18n.__('difficulty3')
				});
			}
			return graphData;
		}
	}

	static updateGraphLabels (returnData = false) {
		let learningInterval;
		let boxInterval1 = "";
		let boxInterval2 = "";
		let boxInterval3 = "";
		let boxInterval4 = "";
		let boxInterval5 = "";
		if (Session.get('workloadProgressType') === 'cardset') {
			learningInterval = WorkloadCardsetCollection.findOne({_id: Session.get('workloadProgressCardsetID')}).learningInterval;
			if (learningInterval[0] <= 1) {
				boxInterval1 = TAPi18n.__('learningStatistics.boxIntervalDaily', {}, Session.get('activeLanguage'));
			} else {
				boxInterval1 = TAPi18n.__('learningStatistics.boxInterval', {days: learningInterval[0]}, Session.get('activeLanguage'));
			}
			boxInterval2 = TAPi18n.__('learningStatistics.boxInterval', {days: learningInterval[1]}, Session.get('activeLanguage'));
			boxInterval3 = TAPi18n.__('learningStatistics.boxInterval', {days: learningInterval[2]}, Session.get('activeLanguage'));
			boxInterval4 = TAPi18n.__('learningStatistics.boxInterval', {days: learningInterval[3]}, Session.get('activeLanguage'));
			boxInterval5 = TAPi18n.__('learningStatistics.boxInterval', {days: learningInterval[4]}, Session.get('activeLanguage'));
		}
		let firstBoxDescription = TAPi18n.__('learningStatistics.boxNotLearned', {}, Session.get('activeLanguage'));
		let box1Label = [], box2Label = [], box3Label = [], box4Label = [], box5Label = [], box6Label;
		if (!NavigatorCheck.isSmartphone()) {
			if ($(window).width() < 993) {
				firstBoxDescription = TAPi18n.__('learningStatistics.boxNotLearnedShort', {}, Session.get('activeLanguage'));
			}
			box1Label = [TAPi18n.__('learningStatistics.box', {number: 1}, Session.get('activeLanguage')), boxInterval1, firstBoxDescription];
			box2Label = [TAPi18n.__('learningStatistics.box', {number: 2}, Session.get('activeLanguage')), boxInterval2];
			box3Label = [TAPi18n.__('learningStatistics.box', {number: 3}, Session.get('activeLanguage')), boxInterval3];
			box4Label = [TAPi18n.__('learningStatistics.box', {number: 4}, Session.get('activeLanguage')), boxInterval4];
			box5Label = [TAPi18n.__('learningStatistics.box', {number: 5}, Session.get('activeLanguage')), boxInterval5];
		} else {
			box1Label = [TAPi18n.__('learningStatistics.box', {number: 1}, Session.get('activeLanguage'))];
			box2Label = [TAPi18n.__('learningStatistics.box', {number: 2}, Session.get('activeLanguage'))];
			box3Label = [TAPi18n.__('learningStatistics.box', {number: 3}, Session.get('activeLanguage'))];
			box4Label = [TAPi18n.__('learningStatistics.box', {number: 4}, Session.get('activeLanguage'))];
			box5Label = [TAPi18n.__('learningStatistics.box', {number: 5}, Session.get('activeLanguage'))];
		}
		box6Label = [TAPi18n.__('learningStatistics.learned', {}, Session.get('activeLanguage'))];
		if (returnData) {
			return [box1Label, box2Label, box3Label, box4Label, box5Label, box6Label];
		} else {
			if (Session.get('workloadProgressType') === 'simulator' && simulatorChart !== undefined) {
				simulatorChart.config.data.labels = [box1Label, box2Label, box3Label, box4Label, box5Label, box6Label];
				simulatorChart.update();
			} else if (chart !== undefined) {
				chart.config.data.labels = [box1Label, box2Label, box3Label, box4Label, box5Label, box6Label];
				chart.update();
			}
		}
	}

	static prepareDifficultyFilter (difficulty, cardset) {
		let cardsetFilter = {};
		if (cardset.shuffled) {
			cardsetFilter._id = {$in: cardset.cardGroups};
		} else {
			cardsetFilter._id = cardset._id;
		}

		if (difficulty === 0) {
			cardsetFilter.cardType = {$nin: CardType.getCardTypesWithDifficultyLevel()};
		} else {
			cardsetFilter.cardType = {$in: CardType.getCardTypesWithDifficultyLevel()};
			cardsetFilter.difficulty = difficulty;
		}

		return WorkloadCardsetCollection.find(cardsetFilter, {_id: 1}).map(function (cardset) {
			return cardset._id;
		});
	}

	static getCardCount (difficulty, filterCardset = undefined) {
		let user_id;
		let boxCount = 0;
		let cardset;
		let uniqueLeitnerObjects;
		let cardCount = [0, 0, 0, 0, 0, 0];
		let originalCardsetsIds = [];
		let cardsetsIds = [];
		let difficultyFilterResult;
		difficultyGotCards = false;
		if (Session.get('workloadProgressType') === 'cardset' || filterCardset !== undefined) {
			let cardset_id;
			if (filterCardset !== undefined) {
				cardset_id = filterCardset;
			} else {
				cardset_id = Session.get('workloadProgressCardsetID');
			}
			cardset = WorkloadCardsetCollection.findOne({_id: cardset_id}, {fields: {_id: 1, shuffled: 1, cardGroups: 1}});
			if (cardset !== undefined) {
				difficultyFilterResult = this.prepareDifficultyFilter(difficulty, cardset);
				if (cardset.shuffled) {
					originalCardsetsIds = originalCardsetsIds.concat(difficultyFilterResult);
				} else {
					if (filterCardset !== undefined) {
						originalCardsetsIds = originalCardsetsIds.concat(difficultyFilterResult);
					} else {
						cardsetsIds = cardsetsIds.concat(difficultyFilterResult);
					}
				}
			}
			user_id = Session.get('workloadProgressUserID');
		} else {
			let userFilter = {};
			if (Session.get('workloadProgressType') === 'user') {
				userFilter.user_id = Meteor.userId();
			}
			uniqueLeitnerObjects = _.uniq(WorkloadLeitnerCollection.find(userFilter, {
				fields: {cardset_id: 1}
			}).fetch(), function (cardsets) {
				return cardsets.cardset_id;
			});
			for (let i = 0; i < uniqueLeitnerObjects.length; i++) {
				cardset = WorkloadCardsetCollection.findOne({_id: uniqueLeitnerObjects[i].cardset_id}, {fields: {_id: 1, shuffled: 1, cardGroups: 1}});
				if (cardset !== undefined) {
					difficultyFilterResult = this.prepareDifficultyFilter(difficulty, cardset);
					if (cardset.shuffled) {
						originalCardsetsIds = originalCardsetsIds.concat(difficultyFilterResult);
					} else {
						cardsetsIds = cardsetsIds.concat(difficultyFilterResult);
					}
				}
			}
		}
		let filterQuery = {
			$or: [
				{cardset_id: {$in: cardsetsIds}},
				{original_cardset_id: {$in: originalCardsetsIds}}
			]
		};
		if (user_id !== undefined) {
			filterQuery.user_id = user_id;
		}
		for (let i = 0; i < 6; i++) {
			filterQuery.box = (i + 1);
			boxCount = WorkloadLeitnerCollection.find(filterQuery).count();
			if (boxCount !== 0) {
				difficultyGotCards = true;
			}
			cardCount[i] = boxCount;
		}
		return cardCount;
	}

	static getCardsetCardCount (countLeitnerCards = false) {
		let cardset = WorkloadCardsetCollection.findOne({_id: Session.get('workloadProgressCardsetID')});
		if (cardset.shuffled) {
			let cardsetList = [];
			let cardsetLeitnerCount = 0;
			let cardsets = WorkloadCardsetCollection.find({_id: {$in: cardset.cardGroups}},
				{sort: {name: 1}}).fetch();
			for (let i = 0; i < cardsets.length; i++) {
				if (CardType.gotLearningModes(cardsets[i].cardType)) {
					if (countLeitnerCards) {
						cardsetLeitnerCount += cardsets[i].quantity;
					} else {
						cardsetList.push(cardsets[i]);
					}
				}
			}
			if (countLeitnerCards) {
				return cardsetLeitnerCount;
			} else {
				return cardsetList;
			}
		} else {
			return cardset.quantity;
		}
	}

	static getTotalLeitnerCardCount () {
		return WorkloadLeitnerCollection.find().count();
	}

	static getTotalLeitnerCardCountUser () {
		return WorkloadLeitnerCollection.find({user_id: Meteor.userId()}).count();
	}

	static gotData () {
		return Session.get('workloadProgressUserID') !== undefined && Session.get('workloadProgressCardsetID') !== undefined;
	}
};
