import {Chart} from "chart.js";
import {Cardsets} from "./cardsets";
import {CardType} from "./cardTypes";
import {Leitner} from "./learned";
import {Cards} from "./cards";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Route} from "./route";

let chart;
let borderWidth = 2;
let difficultyGotCards;

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

export let LeitnerProgress = class LeitnerProgress {
	static drawGraph () {
		let ctx = document.getElementById("boxChart").getContext("2d");
		chart = new Chart(ctx, {
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

	static getGraphData () {
		let graphData = [];

		let cardDifficultyCount = this.getCardCount(0);
		if (difficultyGotCards) {
			graphData.push({
				backgroundColor: chartColors.difficulty0Background,
				borderColor: chartColors.difficulty0,
				borderWidth: borderWidth,
				data: cardDifficultyCount,
				label: TAPi18n.__('difficulty0')
			});
		}

		cardDifficultyCount = this.getCardCount(1);
		if (difficultyGotCards) {
			graphData.push({
				backgroundColor: chartColors.difficulty1Background,
				borderColor: chartColors.difficulty1,
				borderWidth: borderWidth,
				data: cardDifficultyCount,
				label: TAPi18n.__('difficulty1')
			});
		}

		cardDifficultyCount = this.getCardCount(2);
		if (difficultyGotCards) {
			graphData.push({
				backgroundColor: chartColors.difficulty2Background,
				borderColor: chartColors.difficulty2,
				borderWidth: borderWidth,
				data: cardDifficultyCount,
				label: TAPi18n.__('difficulty2')
			});
		}

		cardDifficultyCount = this.getCardCount(3);
		if (difficultyGotCards) {
			graphData.push({
				backgroundColor: chartColors.difficulty3Background,
				borderColor: chartColors.difficulty3,
				borderWidth: borderWidth,
				data: cardDifficultyCount,
				label: TAPi18n.__('difficulty3')
			});
		}
		return graphData;
	}

	static updateGraphLabels (returnData = false) {
		let learningInterval = Cardsets.findOne({_id: Router.current().params._id}).learningInterval;
		let firstInterval = "";
		let firstBoxDescription = TAPi18n.__('leitnerProgress.boxNotLearned');
		let box1Label = [], box2Label = [], box3Label = [], box4Label = [], box5Label = [], box6Label;
		if (learningInterval[0] <= 1) {
			firstInterval = TAPi18n.__('leitnerProgress.boxIntervalDaily', Session.get('activeLanguage'));
		} else {
			firstInterval = TAPi18n.__('leitnerProgress.boxInterval', {days: learningInterval[0]}, Session.get('activeLanguage'));
		}
		if ($(window).width() >= 768) {
			if ($(window).width() < 993) {
				firstBoxDescription = TAPi18n.__('leitnerProgress.boxNotLearnedShort');
			}
			box1Label = [TAPi18n.__('leitnerProgress.box', {number: 1}, Session.get('activeLanguage')), firstBoxDescription, firstInterval];
			box2Label = [TAPi18n.__('leitnerProgress.box', {number: 2}, Session.get('activeLanguage')), TAPi18n.__('leitnerProgress.boxInterval', {days: learningInterval[1]}, Session.get('activeLanguage'))];
			box3Label = [TAPi18n.__('leitnerProgress.box', {number: 3}, Session.get('activeLanguage')), TAPi18n.__('leitnerProgress.boxInterval', {days: learningInterval[2]}, Session.get('activeLanguage'))];
			box4Label = [TAPi18n.__('leitnerProgress.box', {number: 4}, Session.get('activeLanguage')), TAPi18n.__('leitnerProgress.boxInterval', {days: learningInterval[3]}, Session.get('activeLanguage'))];
			box5Label = [TAPi18n.__('leitnerProgress.box', {number: 5}, Session.get('activeLanguage')), TAPi18n.__('leitnerProgress.boxInterval', {days: learningInterval[4]}, Session.get('activeLanguage'))];
		} else {
			box1Label = [TAPi18n.__('leitnerProgress.box', {number: 1}, Session.get('activeLanguage'))];
			box2Label = [TAPi18n.__('leitnerProgress.box', {number: 2}, Session.get('activeLanguage'))];
			box3Label = [TAPi18n.__('leitnerProgress.box', {number: 3}, Session.get('activeLanguage'))];
			box4Label = [TAPi18n.__('leitnerProgress.box', {number: 4}, Session.get('activeLanguage'))];
			box5Label = [TAPi18n.__('leitnerProgress.box', {number: 5}, Session.get('activeLanguage'))];
		}
		box6Label = [TAPi18n.__('leitnerProgress.learned', Session.get('activeLanguage'))];
		if (returnData) {
			return [box1Label, box2Label, box3Label, box4Label, box5Label, box6Label];
		} else {
			chart.config.data.labels = [box1Label, box2Label, box3Label, box4Label, box5Label, box6Label];
			chart.update();
		}
	}

	static prepareCardFilter (difficulty) {
		let prepareFilter;
		let cardsetFilter = {};
		let filterQuery = {};

		if (Route.isLeitnerProgress()) {
			let cardset = Cardsets.findOne({_id: Router.current().params._id}, {
				Fields: {
					_id: 1,
					shuffled: 1,
					cardGroups: 1
				}
			});

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

			filterQuery.cardset_id = {
				$in: Cardsets.find(cardsetFilter, {_id: 1}).map(function (cardset) {
					return cardset._id;
				})
			};
		} else if (Route.isLeitnerProgressProfileOverview()) {
			prepareFilter = Leitner.find({user_id: Meteor.userId()}, {_id: 1}).map(function (leitner) {
				return leitner.card_id;
			});
			filterQuery._id = {$in: prepareFilter};
		}

		return Cards.find(filterQuery, {_id: 1}).map(function (card) {
			return card._id;
		});
	}

	static getCardCount (difficulty) {
		let filterQuery = {};
		let boxCount = 0;
		let cardCount = [0, 0, 0, 0, 0, 0];
		let cardFilter;
		difficultyGotCards = false;

		cardFilter = this.prepareCardFilter(difficulty);
		if (cardFilter.length !== 0) {
			filterQuery.card_id = {$in: cardFilter};
			if (Route.isLeitnerProgress()) {
				filterQuery.cardset_id = Router.current().params._id;
				filterQuery.user_id = Router.current().params.user_id;
			} else if (Route.isLeitnerProgressProfileOverview()) {
				filterQuery.user_id = Meteor.userId();
			}

			for (let i = 0; i < 6; i++) {
				filterQuery.box = (i + 1);
				boxCount = Leitner.find(filterQuery).count();
				if (boxCount !== 0) {
					difficultyGotCards = true;
				}
				cardCount[i] = boxCount;
			}
		}
		return cardCount;
	}
};
