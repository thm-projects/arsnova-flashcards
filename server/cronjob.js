import {SyncedCron} from "meteor/percolate:synced-cron";

/**
 * Class used for running the leitner Cronjob
 */
export class CronScheduler {
	/** Function starts a Cronjob which executs the leitner algorithm */
	startCron () {
		SyncedCron.add({
			name: "leitnerCron",
			schedule: function (parser) {
				return parser.recur().on('01:00:00').time();
			},
			job: function () {
				Meteor.call("updateLeitnerCards");
			}
		});
		SyncedCron.start();
	}
}
