import {Chart} from "chart.js";
import {Cardsets} from "./cardsets";
import {CardType} from "./cardTypes";
import {Leitner} from "./learned";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Route} from "./route";
import * as config from "../config/leitnerProgressChart.js";
import {NavigatorCheck} from "./navigatorCheck";
import {BonusForm} from "./bonusForm";

let chart;
let difficultyGotCards;

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

	static updateGraph (filterCardset) {
		let datasets;
		if (filterCardset === "-1") {
			datasets = this.getGraphData();
		} else {
			datasets = this.getGraphData(filterCardset);
		}
		chart.data.datasets = datasets;
		chart.update();
	}

	static getGraphData (filterCardset = undefined) {
		if (Route.isCardset()) {
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
		if (Route.isLeitnerProgress()) {
			learningInterval = Cardsets.findOne({_id: Router.current().params._id}).learningInterval;
			if (learningInterval[0] <= 1) {
				boxInterval1 = TAPi18n.__('leitnerProgress.boxIntervalDaily', {}, Session.get('activeLanguage'));
			} else {
				boxInterval1 = TAPi18n.__('leitnerProgress.boxInterval', {days: learningInterval[0]}, Session.get('activeLanguage'));
			}
			boxInterval2 = TAPi18n.__('leitnerProgress.boxInterval', {days: learningInterval[1]}, Session.get('activeLanguage'));
			boxInterval3 = TAPi18n.__('leitnerProgress.boxInterval', {days: learningInterval[2]}, Session.get('activeLanguage'));
			boxInterval4 = TAPi18n.__('leitnerProgress.boxInterval', {days: learningInterval[3]}, Session.get('activeLanguage'));
			boxInterval5 = TAPi18n.__('leitnerProgress.boxInterval', {days: learningInterval[4]}, Session.get('activeLanguage'));
		}
		let firstBoxDescription = TAPi18n.__('leitnerProgress.boxNotLearned', {}, Session.get('activeLanguage'));
		let box1Label = [], box2Label = [], box3Label = [], box4Label = [], box5Label = [], box6Label;
		if (!NavigatorCheck.isSmartphone()) {
			if ($(window).width() < 993) {
				firstBoxDescription = TAPi18n.__('leitnerProgress.boxNotLearnedShort', {}, Session.get('activeLanguage'));
			}
			box1Label = [TAPi18n.__('leitnerProgress.box', {number: 1}, Session.get('activeLanguage')), boxInterval1, firstBoxDescription];
			box2Label = [TAPi18n.__('leitnerProgress.box', {number: 2}, Session.get('activeLanguage')), boxInterval2];
			box3Label = [TAPi18n.__('leitnerProgress.box', {number: 3}, Session.get('activeLanguage')), boxInterval3];
			box4Label = [TAPi18n.__('leitnerProgress.box', {number: 4}, Session.get('activeLanguage')), boxInterval4];
			box5Label = [TAPi18n.__('leitnerProgress.box', {number: 5}, Session.get('activeLanguage')), boxInterval5];
		} else {
			box1Label = [TAPi18n.__('leitnerProgress.box', {number: 1}, Session.get('activeLanguage'))];
			box2Label = [TAPi18n.__('leitnerProgress.box', {number: 2}, Session.get('activeLanguage'))];
			box3Label = [TAPi18n.__('leitnerProgress.box', {number: 3}, Session.get('activeLanguage'))];
			box4Label = [TAPi18n.__('leitnerProgress.box', {number: 4}, Session.get('activeLanguage'))];
			box5Label = [TAPi18n.__('leitnerProgress.box', {number: 5}, Session.get('activeLanguage'))];
		}
		box6Label = [TAPi18n.__('leitnerProgress.learned', {}, Session.get('activeLanguage'))];
		if (returnData) {
			return [box1Label, box2Label, box3Label, box4Label, box5Label, box6Label];
		} else {
			chart.config.data.labels = [box1Label, box2Label, box3Label, box4Label, box5Label, box6Label];
			chart.update();
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

		return Cardsets.find(cardsetFilter, {_id: 1}).map(function (cardset) {
			return cardset._id;
		});
	}

	static getCardCount (difficulty, filterCardset = undefined) {
		let user_id;
		let boxCount = 0;
		let cardset;
		let cardsets;
		let cardCount = [0, 0, 0, 0, 0, 0];
		let originalCardsetsIds = [];
		let cardsetsIds = [];
		let difficultyFilterResult;
		difficultyGotCards = false;
		if (Route.isCardset()) {
			return 0;
		}
		if (Route.isLeitnerProgress() || filterCardset !== undefined) {
			let cardset_id;
			if (filterCardset !== undefined) {
				cardset_id = filterCardset;
			} else {
				cardset_id = Router.current().params._id;
			}
			cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, shuffled: 1, cardGroups: 1}});
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
			user_id = Router.current().params.user_id;
		} else {
			let userFilter = {};
			if (Route.isLeitnerProgressProfileOverview()) {
				userFilter.user_id = Meteor.userId();
			}
			cardsets = _.uniq(Leitner.find(userFilter, {
				fields: {cardset_id: 1}
			}).fetch(), function (cardsets) {
				return cardsets.cardset_id;
			});
			console.log(cardsets.length);
			for (let i = 0; i < cardsets.length; i++) {
				cardset = Cardsets.findOne({_id: cardsets[i].cardset_id}, {fields: {_id: 1, shuffled: 1, cardGroups: 1}});
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
			boxCount = Leitner.find(filterQuery).count();
			if (boxCount !== 0) {
				difficultyGotCards = true;
			}
			cardCount[i] = boxCount;
		}
		return cardCount;
	}

	static getCardsetCardCount (countLeitnerCards = false) {
		let cardset = Cardsets.findOne({_id: Router.current().params._id});
		if (cardset.shuffled) {
			let cardsetList = [];
			let cardsetLeitnerCount = 0;
			let cardsets = Cardsets.find({_id: {$in: cardset.cardGroups}}, {
				fields: {_id: 1, name: 1, cardType: 1, difficulty: 1, quantity: 1, kind: 1},
				sort: {name: 1}
			}).fetch();
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
		return Leitner.find().count();
	}

	static getTotalLeitnerCardCountUser () {
		return Leitner.find({user_id: Meteor.userId()}).count();
	}
};
