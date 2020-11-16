import {Meteor} from "meteor/meteor";
import {Cards} from "../../../api/subscriptions/cards.js";
import {Cardsets} from "../../../api/subscriptions/cardsets.js";
import {Leitner} from "../../../api/subscriptions/leitner";
import {LeitnerHistory} from "../../../api/subscriptions/leitnerHistory";
import {LeitnerTasks} from "../../../api/subscriptions/leitnerTasks";
import {Workload} from "../../../api/subscriptions/workload";
import {Wozniak} from "../../../api/subscriptions/wozniak";
import {CronScheduler} from "../../../../server/cronjob.js";
import {Ratings} from "../../../api/subscriptions/ratings";
import {CardType} from "../../../util/cardTypes";
import {TranscriptBonus} from "../../../api/subscriptions/transcriptBonus";
import {LeitnerUtilities} from "../../../util/leitner";
import {Utilities} from "../../../util/utilities";
import * as bonusFormConfig from "../../../config/bonusForm.js";
import * as leitnerConfig from "../../../config/leitner.js";
import {ServerStyle} from "../../../util/styles";
import {cleanupStep} from "./steps/cleanupStep";
import {defaultDataStep} from "./steps/defaultDataStep";
import {adminSettingsStep} from "./steps/adminSettingsStep";

Meteor.startup(function () {
	const cronScheduler = new CronScheduler();

	cleanupStep();
	defaultDataStep();
	adminSettingsStep();

	let cards = Cards.find({lecture: {$exists: false}}).fetch();
	for (let i = 0; i < cards.length; i++) {
		Cards.update({
				_id: cards[i]._id
			},
			{
				$set: {
					lecture: ""
				}
			}
		);
	}

	cards = Cards.find({centerTextElement: {$exists: false}}).fetch();
	for (let i = 0; i < cards.length; i++) {
		let cardset = Cardsets.findOne({_id: cards[i].cardset_id}, {fields: {_id: 1, cardType: 1}});
		if (cardset !== undefined) {
			Cards.update({
					_id: cards[i]._id
				},
				{
					$set: {
						centerTextElement: CardType.setDefaultCenteredText(cardset.cardType, 1)
					},
					$unset: {
						centerText: 1
					}
				}
			);
		}
	}

	cards = Cards.find({alignType: {$exists: false}}).fetch();
	for (let i = 0; i < cards.length; i++) {
		let cardset = Cardsets.findOne({_id: cards[i].cardset_id}, {fields: {_id: 1, cardType: 1}});
		if (cardset !== undefined) {
			Cards.update({
					_id: cards[i]._id
				},
				{
					$set: {
						alignType: CardType.setDefaultCenteredText(cardset.cardType, 2)
					}
				}
			);
		}
	}

	cards = Cards.find({date: {$exists: false}}).fetch();
	for (let i = 0; i < cards.length; i++) {
		Cards.update({
				_id: cards[i]._id
			},
			{
				$set: {
					date: new Date()
				}
			}
		);
	}

	cards = Cards.find({learningGoalLevel: {$exists: false}}).fetch();
	for (let i = 0; i < cards.length; i++) {
		Cards.update({
				_id: cards[i]._id
			},
			{
				$set: {
					learningGoalLevel: 0
				}
			}
		);
	}

	cards = Cards.find({backgroundStyle: {$exists: false}}).fetch();
	for (let i = 0; i < cards.length; i++) {
		Cards.update({
				_id: cards[i]._id
			},
			{
				$set: {
					backgroundStyle: 0
				}
			}
		);
	}

	cards = Cards.find({originalAuthorName: {$exists: false}}).fetch();
	for (let i = 0; i < cards.length; i++) {
		Cards.update({
				_id: cards[i]._id
			},
			{
				$set: {
					originalAuthorName: {
						legacyName: cards[i].originalAuthor
					}
				},
				$unset: {
					originalAuthor: ""
				}
			}
		);
	}

	let cardsets = Cardsets.find({wordcloud: {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					wordcloud: false
				}
			}
		);
	}

	cardsets = Cardsets.find({raterCount: {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					raterCount: Number(Ratings.find({cardset_id: cardsets[i]._id}).count())
				}
			}
		);
	}

	cardsets = Cardsets.find({editors: {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					editors: []
				}
			}
		);
	}

	cardsets = Cardsets.find({cardType: {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					cardType: 0
				}
			}
		);
	}

	cardsets = Cardsets.find({difficulty: {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					difficulty: 1
				}
			}
		);
	}

	cardsets = Cardsets.find({shuffled: {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					shuffled: false,
					cardGroups: [""]
				}
			}
		);
	}

	cardsets = Cardsets.find({useCase: {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					useCase: {
						enabled: false,
						priority: 0
					}
				}
			}
		);
	}

	cardsets = Cardsets.find({shuffled: true}).fetch();
	let totalQuantity;
	let cardGroupsCardset;
	for (let i = 0; i < cardsets.length; i++) {
		totalQuantity = 0;
		for (let k = 0; k < cardsets[i].cardGroups.length; k++) {
			cardGroupsCardset = Cardsets.find(cardsets[i].cardGroups[k]).fetch();
			if (cardGroupsCardset.length > 0) {
				totalQuantity += cardGroupsCardset[0].quantity;
			}
		}
		Cardsets.update(cardsets[i]._id, {
			$set: {
				quantity: totalQuantity
			}
		});
	}

	cardsets = Cardsets.find({originalAuthorName: {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					originalAuthorName: {
						legacyName: cardsets[i].originalAuthor
					}
				},
				$unset: {
					originalAuthor: ""
				}
			}
		);
	}

	cardsets = Cardsets.find({}, {fields: {_id: 1, cardType: 1}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					noDifficulty: !CardType.gotDifficultyLevel(cardsets[i].cardType)
				}
			}
		);
	}

	cardsets = Cardsets.find({learningActive: true}, {fields: {_id: 1, name: 1, learningActive: 1}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		if (Workload.find({cardset_id: cardsets[i]._id}).count() === 0) {
			let learnerData = [];
			let userData = {};
			let usersLeitner = Leitner.find({cardset_id: cardsets[i]._id}, {
				fields: {
					user_id: 1,
					cardset_id: 1
				}
			}).fetch();
			let users = _.uniq(usersLeitner, false, function (d) {
				return d.user_id;
			});
			for (let k = 0; k < users.length; k++) {
				userData = {
					cardset_id: cardsets[i]._id,
					user_id: users[k].user_id,
					leitner: {
						bonus: true,
						dateJoinedBonus: new Date()
					}
				};
				learnerData.push(userData);
			}
			if (learnerData.length > 0) {
				Workload.batchInsert(learnerData);
			}
		}
		Meteor.call("updateLearnerCount", cardsets[i]._id);
	}

	cardsets = Cardsets.find({shuffled: true}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Meteor.call('updateLeitnerCardIndex', cardsets[i]._id);
	}

	let leitner = Leitner.find({skipped: {$exists: true}}).fetch();
	for (let i = 0; i < leitner.length; i++) {
		Leitner.update({
				_id: leitner[i]._id
			},
			{
				$unset: {
					skipped: ""
				}
			}
		);
	}

	cardsets = Cardsets.find({shuffled: true}, {fields: {_id: 1}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		leitner = Leitner.find({cardset_id: cardsets[i]._id, original_cardset_id: {$exists: false}}, {
			fields: {
				_id: 1,
				card_id: 1
			}
		}).fetch();
		for (let k = 0; k < leitner.length; k++) {
			let originalCardsetId = Cards.findOne({_id: leitner[k].card_id}).cardset_id;
			if (originalCardsetId !== undefined) {
				Leitner.update({
						_id: leitner[k]._id
					},
					{
						$set: {
							original_cardset_id: originalCardsetId
						}
					}
				);
			}
		}
	}

	cardsets = Cardsets.find({registrationPeriod: {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					registrationPeriod: cardsets[i].learningEnd
				}
			}
		);
	}

	cardsets = Cardsets.find({pomodoroTimer: {$exists: false}, learningActive: true}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					'pomodoroTimer.quantity': 3,
					'pomodoroTimer.workLength': 25,
					'pomodoroTimer.breakLength': 5,
					'pomodoroTimer.soundConfig': [true, true, true]
				}
			}
		);
	}

	cardsets = Cardsets.find({'workload.bonus.count': {$exists: false}}, {fields: {_id: 1}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Meteor.call('updateLearnerCount', cardsets[i]._id);
	}

	cardsets = Cardsets.find({'workload.bonus.minLearned': {$exists: false}}, {fields: {_id: 1}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					"workload.bonus.minLearned": bonusFormConfig.defaultMinLearned
				}
			}
		);
	}

	cardsets = Cardsets.find({learners: {$exists: true}}, {fields: {_id: 1}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$unset: {
					learners: ""
				}
			}
		);
	}

	cardsets = Cardsets.find({relevance: {$exists: true}}, {fields: {_id: 1}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$unset: {
					relevance: ""
				}
			}
		);
	}

	cardsets = Cardsets.find({}, {fields: {_id: 1}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Meteor.call('updateCardsetRating', cardsets[i]._id);
	}

	cardsets = Cardsets.find({sortType: {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					sortType: 0
				}
			}
		);
	}

	cardsets = Cardsets.find({lecturerAuthorized: {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					lecturerAuthorized: false
				}
			}
		);
	}

	cardsets = Cardsets.find({transcriptBonus: {$exists: true}}, {fields: {_id: 1, transcriptBonus: 1}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		if (cardsets[i].transcriptBonus.deadlineEditing === undefined) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						"transcriptBonus.deadlineEditing": cardsets[i].transcriptBonus.deadline
					}
				}
			);
		}
		if (cardsets[i].transcriptBonus.minimumSubmissions === undefined) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						"transcriptBonus.minimumSubmissions": cardsets[i].transcriptBonus.dates.length
					}
				}
			);
		}
		if (cardsets[i].transcriptBonus.minimumStars === undefined || cardsets[i].transcriptBonus.minimumStars > 5) {
			Cardsets.update({
					_id: cardsets[i]._id
				},
				{
					$set: {
						"transcriptBonus.minimumStars": 3
					}
				}
			);
		}
		if (cardsets[i].transcriptBonus.stats === undefined) {
			Meteor.call('updateTranscriptBonusStats', cardsets[i]._id);
		}
	}

	let transcriptBonus = TranscriptBonus.find({deadlineEditing: {$exists: false}}, {fields: {_id: 1, deadline: 1}}).fetch();
	for (let i = 0; i < transcriptBonus.length; i++) {
		TranscriptBonus.update({
				_id: transcriptBonus[i]._id
			},
			{
				$set: {
					deadlineEditing: transcriptBonus[i].deadline
				}
			}
		);
	}

	transcriptBonus = TranscriptBonus.find({stars: {$exists: false}}, {fields: {_id: 1}}).fetch();
	for (let i = 0; i < transcriptBonus.length; i++) {
		TranscriptBonus.update({
				_id: transcriptBonus[i]._id
			},
			{
				$set: {
					stars: 1,
					reasons: []
				}
			}
		);
	}

	cardsets = Cardsets.find().fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cards.update({
				cardset_id: cardsets[i]._id,
				owner: {$exists: false}
			},
			{
				$set: {
					owner: cardsets[i].owner,
					cardType: cardsets[i].cardType
				}
			}
		);
	}

	cardsets = Cardsets.find({}, {fields: {_id: 1, cardGroups: 1, shuffled: 1, cardType: 1}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		let gotWorkload = false;
		if (cardsets[i].shuffled) {
			if (Utilities.checkIfRepGotWorkloadCardset(cardsets[i])) {
				gotWorkload = true;
			}
		} else {
			gotWorkload = CardType.getCardTypesWithLearningModes().includes(cardsets[i].cardType);
		}

		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					"gotWorkload": gotWorkload
				}
			}
		);
	}

	cardsets = Cardsets.find({'workload.simulator.errorCount': {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					'workload.simulator.errorCount': [bonusFormConfig.defaultErrorCount]
				}
			}
		);
	}

	cardsets = Cardsets.find({'transcriptBonus.dates': {$exists: true}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		let lectures = [];
		for (let d = 0; d < cardsets[i].transcriptBonus.dates.length; d++) {
			let lecture = {
				date: cardsets[i].transcriptBonus.dates[d]
			};
			lectures.push(lecture);
		}
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					'transcriptBonus.lectures': lectures
				},
				$unset: {
					'transcriptBonus.dates': ""
				}
			}
		);
	}

	let wozniak;
	wozniak = Wozniak.find({skipped: {$exists: true}}).fetch();
	for (let i = 0; i < wozniak.length; i++) {
		Wozniak.update({
				_id: wozniak[i]._id
			},
			{
				$unset: {
					skipped: ""
				}
			}
		);
	}

	let users = Meteor.users.find({selectedLanguage: {$exists: true}}).fetch();
	for (let i = 0; i < users.length; i++) {
		Meteor.users.update({
				_id: users[i]._id
			},
			{
				$set: {
					"profile.locale": users[i].selectedLanguage
				},
				$unset: {
					selectedLanguage: ""
				}
			}
		);
	}

	users = Meteor.users.find({}, {fields: {_id: 1}}).fetch();
	for (let i = 0; i < users.length; i++) {
		Meteor.call('updateCardsetCount', users[i]._id);
		Meteor.call('updateTranscriptCount', users[i]._id);
		Meteor.call('updateWorkloadCount', users[i]._id);
	}

	cards = Cards.find({cardType: 2}).fetch();
	for (let i = 0; i < cards.length; i++) {
		Cards.update({
				_id: cards[i]._id
			},
			{
				$set: {
					cardset_id: "-1"
				}
			}
		);
	}

	let workload = Workload.find({"leitner.active": {$exists: false}}).fetch();
	for (let i = 0; i < workload.length; i++) {
		LeitnerUtilities.updateLeitnerWorkload(workload[i].cardset_id, workload[i].user_id);
	}

	workload = Workload.find({"leitner.nextLowestPriority": {$exists: false}}).fetch();
	for (let i = 0; i < workload.length; i++) {
		Workload.update({
				user_id: workload[i].user_id,
				cardset_id: workload[i].cardset_id
			},
			{
				$set: {
					"leitner.nextLowestPriority": [-1, -1, -1, -1, -1]
				}
			}
		);
		Leitner.update({
				user_id: workload[i].user_id,
				cardset_id: workload[i].cardset_id
			},
			{
				$set: {
					"priority": 0
				}
			}, {multi: true});
	}

	transcriptBonus = TranscriptBonus.find({"rating": {$exists: false}}).fetch();
	for (let i = 0; i < transcriptBonus.length; i++) {
		TranscriptBonus.update({
				_id: transcriptBonus[i]._id
			},
			{
				$set: {
					rating: 0
				}
			}
		);
	}

	leitner = Leitner.find({"viewedPDF": {$exists: false}}).fetch();
	for (let i = 0; i < leitner.length; i++) {
		Leitner.update({
				_id: leitner[i]._id
			},
			{
				$set: {
					viewedPDF: false
				}
			}
		);
	}

	wozniak = Wozniak.find({"viewedPDF": {$exists: false}}).fetch();
	for (let i = 0; i < wozniak.length; i++) {
		Wozniak.update({
				_id: wozniak[i]._id
			},
			{
				$set: {
					viewedPDF: false
				}
			}
		);
	}

	let leitnerHistory = LeitnerHistory.find({"missedDeadline": {$exists: false}}).fetch();
	for (let i = 0; i < leitnerHistory.length; i++) {
		if (leitnerHistory[i].answer === 2) {
			LeitnerHistory.update({
					_id: leitnerHistory[i]._id
				},
				{
					$set: {
						missedDeadline: true
					},
					$unset: {
						answer: ""
					}
				}
			);
		} else {
			LeitnerHistory.update({
					_id: leitnerHistory[i]._id
				},
				{
					$set: {
						missedDeadline: false
					}
				}
			);
		}
	}

	// Move old leitner history to new session system
	workload = Workload.find({"leitner.tasks": {$exists: true}}).fetch();
	for (let i = 0; i < workload.length; i++) {
		let user = Meteor.users.findOne(workload[i].user_id);

		let tasks = workload[i].leitner.tasks;
		for (let t = 0; t < tasks.length; t++) {
			let missedDeadline = false;
			let foundReset = LeitnerHistory.findOne({user_id: user._id, cardset_id: workload[i].cardset_id, task_id: t, missedDeadline: true});
			if (foundReset !== undefined) {
				missedDeadline = true;
			}
			let leitnerTask = LeitnerTasks.insert({
				cardset_id: workload[i].cardset_id,
				user_id: workload[i].user_id,
				session: 0,
				isBonus: workload[i].leitner.bonus,
				missedDeadline: missedDeadline,
				resetDeadlineMode: leitnerConfig.resetDeadlineMode,
				wrongAnswerMode: leitnerConfig.wrongAnswerMode,
				notifications: {
					mail: {
						active: user.mailNotification,
						sent: user.mailNotification,
						address: user.email
					},
					web: {
						active: user.webNotification,
						sent: user.webNotification
					}
				},
				createdAt: tasks[t]
			});

			LeitnerHistory.update({
					user_id: workload[i].user_id,
					cardset_id: workload[i].cardset_id,
					task_id: t
				},
				{
					$set: {
						task_id: leitnerTask
					},
					$unset: {
						missedDeadline: ""
					}
				}, {multi: true}
			);
		}

		Workload.update({
				_id: workload[i]._id
			},
			{
				$unset: {
					"leitner.tasks": ""
				}
			});
	}

	cardsets = Cardsets.find({"fragJetzt": {$exists: false}}).fetch();
	let fragJetzt = {
		session: "",
		overrideOnlyEmptySessions: true
	};
	let arsnovaClick = {
		session: "",
		overrideOnlyEmptySessions: true
	};
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					fragJetzt: fragJetzt,
					arsnovaClick: arsnovaClick
				}
			}
		);
	}

	cards = Cards.find({"learningTime": {$exists: false}}).fetch();
	let learningTime = {
		initial: -1,
		repeated: -1
	};
	for (let i = 0; i < cards.length; i++) {
		Cards.update({
				_id: cards[i]._id
			},
			{
				$set: {
					learningTime: learningTime
				}
			}
		);
	}

	cardsets = Cardsets.find({"strictWorkloadTimer": {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					strictWorkloadTimer: leitnerConfig.strictWorkloadTimer
				}
			}
		);
	}

	cardsets = Cardsets.find({"forceNotifications": {$exists: false}}).fetch();
	for (let i = 0; i < cardsets.length; i++) {
		Cardsets.update({
				_id: cardsets[i]._id
			},
			{
				$set: {
					forceNotifications: bonusFormConfig.defaultForceNotifications
				}
			}
		);
	}

	let leitnerTasks = LeitnerTasks.find({"strictWorkloadTimer": {$exists: false}}).fetch();
	for (let i = 0; i < leitnerTasks.length; i++) {
		let cardset = Cardsets.findOne({_id: leitnerTasks[i].cardset_id});
		let pomodoroTimer = {
			quantity: 4,
			workLength: 30,
			break: 5
		};
		if (cardset !== undefined && cardset.pomodoroTimer !== undefined) {
			pomodoroTimer = cardset.pomodoroTimer;
		}
		LeitnerTasks.update({
				_id: leitnerTasks[i]._id
			},
			{
				$set: {
					pomodoroTimer: pomodoroTimer,
					strictWorkloadTimer: false,
					timer: {
						workload: {
							current: 0,
							completed: 0
						},
						break: {
							current: 0,
							completed: 0
						},
						status: 0,
						lastCallback: new Date()
					}
				}
			}
		);
	}

	users = Meteor.users.find({"fullscreen.settings": {$exists: false}}).fetch();
	for (let i = 0; i < users.length; i++) {
		let defaultFullscreenSettings = {
			presentation: ServerStyle.getDefaultFullscreenMode(1, users[i]._id),
			demo: ServerStyle.getDefaultFullscreenMode(2, users[i]._id),
			leitner: ServerStyle.getDefaultFullscreenMode(3, users[i]._id),
			wozniak: ServerStyle.getDefaultFullscreenMode(4, users[i]._id)
		};
		Meteor.users.update({
			_id: users[i]._id
		}, {
			$set: {
				"fullscreen.settings": defaultFullscreenSettings
			}
		});
	}

	cronScheduler.startCron();
});
