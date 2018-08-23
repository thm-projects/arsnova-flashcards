import {Chart} from "chart.js";
import {Cardsets} from "./cardsets";
import {CardType} from "./cardTypes";
import {Leitner} from "./learned";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Route} from "./route";

let chart;
let borderWidth = 1;
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
		let learningInterval;
		let boxInterval1 = "";
		let boxInterval2 = "";
		let boxInterval3 = "";
		let boxInterval4 = "";
		let boxInterval5 = "";
		if (Route.isLeitnerProgress()) {
			learningInterval = Cardsets.findOne({_id: Router.current().params._id}).learningInterval;
			if (learningInterval[0] <= 1) {
				boxInterval1 = TAPi18n.__('leitnerProgress.boxIntervalDaily', Session.get('activeLanguage'));
			} else {
				boxInterval1 = TAPi18n.__('leitnerProgress.boxInterval', {days: learningInterval[0]}, Session.get('activeLanguage'));
			}
			boxInterval2 = TAPi18n.__('leitnerProgress.boxInterval', {days: learningInterval[1]}, Session.get('activeLanguage'));
			boxInterval3 = TAPi18n.__('leitnerProgress.boxInterval', {days: learningInterval[2]}, Session.get('activeLanguage'));
			boxInterval4 = TAPi18n.__('leitnerProgress.boxInterval', {days: learningInterval[3]}, Session.get('activeLanguage'));
			boxInterval5 = TAPi18n.__('leitnerProgress.boxInterval', {days: learningInterval[4]}, Session.get('activeLanguage'));
		}
		let firstBoxDescription = TAPi18n.__('leitnerProgress.boxNotLearned');
		let box1Label = [], box2Label = [], box3Label = [], box4Label = [], box5Label = [], box6Label;
		if ($(window).width() >= 768) {
			if ($(window).width() < 993) {
				firstBoxDescription = TAPi18n.__('leitnerProgress.boxNotLearnedShort');
			}
			box1Label = [TAPi18n.__('leitnerProgress.box', {number: 1}, Session.get('activeLanguage')), firstBoxDescription, boxInterval1];
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
		box6Label = [TAPi18n.__('leitnerProgress.learned', Session.get('activeLanguage'))];
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

	static getCardCount (difficulty) {
		let user_id;
		let boxCount = 0;
		let cardset;
		let cardsets;
		let cardCount = [0, 0, 0, 0, 0, 0];
		let originalCardsetsIds = [];
		let cardsetsIds = [];
		let difficultyFilterResult;
		difficultyGotCards = false;

		if (Route.isLeitnerProgress()) {
			cardset = Cardsets.findOne({_id: Router.current().params._id}, {fields: {_id: 1, shuffled: 1, cardGroups: 1}});
			if (cardset !== undefined) {
				difficultyFilterResult = this.prepareDifficultyFilter(difficulty, cardset);
				if (cardset.shuffled) {
					originalCardsetsIds = originalCardsetsIds.concat(difficultyFilterResult);
				} else {
					cardsetsIds = cardsetsIds.concat(difficultyFilterResult);
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
};
