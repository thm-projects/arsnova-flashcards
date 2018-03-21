import {Meteor} from "meteor/meteor";
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
				return parser.recur().on(Meteor.settings.public.leitner.dayIntervalHour).hour();
			},
			job: function () {
				Meteor.call("updateLeitnerCards");
			}
		});
		SyncedCron.start();
	}
}
