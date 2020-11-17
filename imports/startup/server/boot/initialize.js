import {Meteor} from "meteor/meteor";
import {Wozniak} from "../../../api/subscriptions/wozniak";
import {CronScheduler} from "../../../../server/cronjob.js";
import {TranscriptBonus} from "../../../api/subscriptions/transcriptBonus";
import {cleanupStep} from "./steps/cleanupStep";
import {defaultDataStep} from "./steps/defaultDataStep";
import {adminSettingsStep} from "./steps/adminSettingsStep";
import {userMigrationStep} from "./steps/migration/userMigration";
import {cardMigrationStep} from "./steps/migration/cardMigration";
import {cardsetMigrationStep} from "./steps/migration/cardsetMigration";
import {leitnerMigrationStep} from "./steps/migration/leitnerMigration";
import {leitnerHistoryMigrationStep} from "./steps/migration/leitnerHistoryMigration";
import {leitnerTaskMigrationStep} from "./steps/migration/leitnerTaskMigration";
import {workloadMigrationStep} from "./steps/migration/workloadMigration";

Meteor.startup(function () {
	const cronScheduler = new CronScheduler();

	cleanupStep();
	defaultDataStep();
	adminSettingsStep();

	// Migration Steps
	userMigrationStep();
	cardMigrationStep();
	cardsetMigrationStep();
	leitnerMigrationStep();
	leitnerHistoryMigrationStep();
	leitnerTaskMigrationStep();
	workloadMigrationStep();

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

	cronScheduler.startCron();
});
