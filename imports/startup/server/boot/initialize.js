import {Meteor} from "meteor/meteor";
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
import {wozniakMigrationStep} from "./steps/migration/wozniakMigration";

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
	wozniakMigrationStep();

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

	cronScheduler.startCron();
});
