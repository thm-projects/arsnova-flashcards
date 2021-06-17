import {Meteor} from "meteor/meteor";
import {CronScheduler} from "../../../../server/cronjob.js";
import {cleanupStep} from "./steps/cleanupStep";
import {defaultDataStep} from "./steps/defaultDataStep";
import {adminSettingsStep} from "./steps/adminSettingsStep";
import {userMigrationStep} from "./steps/migration/userMigration";
import {cardMigrationStep} from "./steps/migration/cardMigration";
import {cardsetMigrationStep} from "./steps/migration/cardsetMigration";
import {wozniakMigrationStep} from "./steps/migration/wozniakMigration";
import {transcriptBonusMigrationStep} from "./steps/migration/transcriptBonusMigration";
import {leitnerLearningWorkload} from "./steps/migration/learningStatistics/leitner/leitnerLearningWorkload";
import {leitnerCardStats} from "./steps/migration/learningStatistics/leitner/leitnerCardStats";
import {leitnerActivationDay} from "./steps/migration/learningStatistics/leitner/leitnerActivationDay";
import {leitnerLearningPhase} from "./steps/migration/learningStatistics/leitner/leitnerLearningPhase";

Meteor.startup(function () {
	const cronScheduler = new CronScheduler();

	cleanupStep();
	adminSettingsStep();
	defaultDataStep();

	// Migration Steps
	userMigrationStep();
	cardMigrationStep();
	cardsetMigrationStep();
	wozniakMigrationStep();
	transcriptBonusMigrationStep();

	// Leitner 2.0 Migration Steps
	leitnerLearningPhase();
	leitnerLearningWorkload();
	leitnerActivationDay();
	leitnerCardStats();

	//cronjob
	cronScheduler.startCron();
});
