import {Meteor} from "meteor/meteor";
import {CronScheduler} from "../../../../server/cronjob.js";
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
import {transcriptBonusMigrationStep} from "./steps/migration/transcriptBonusMigration";

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
	transcriptBonusMigrationStep();

	//cronjob
	cronScheduler.startCron();
});
