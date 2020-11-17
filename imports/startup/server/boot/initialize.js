import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../../api/subscriptions/cardsets.js";
import {Leitner} from "../../../api/subscriptions/leitner";
import {LeitnerHistory} from "../../../api/subscriptions/leitnerHistory";
import {LeitnerTasks} from "../../../api/subscriptions/leitnerTasks";
import {Workload} from "../../../api/subscriptions/workload";
import {Wozniak} from "../../../api/subscriptions/wozniak";
import {CronScheduler} from "../../../../server/cronjob.js";
import {TranscriptBonus} from "../../../api/subscriptions/transcriptBonus";
import {LeitnerUtilities} from "../../../util/leitner";
import * as leitnerConfig from "../../../config/leitner.js";
import {cleanupStep} from "./steps/cleanupStep";
import {defaultDataStep} from "./steps/defaultDataStep";
import {adminSettingsStep} from "./steps/adminSettingsStep";
import {userMigrationStep} from "./steps/migration/userMigration";
import {cardMigrationStep} from "./steps/migration/cardMigration";
import {cardsetMigrationStep} from "./steps/migration/cardsetMigration";

Meteor.startup(function () {
	const cronScheduler = new CronScheduler();

	cleanupStep();
	defaultDataStep();
	adminSettingsStep();

	// Migration Steps
	userMigrationStep();
	cardMigrationStep();
	cardsetMigrationStep();

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

	cronScheduler.startCron();
});
