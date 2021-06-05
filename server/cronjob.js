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
				return parser.recur().on(Meteor.settings.public.dailyCronjob.executeAtHour).hour();
				//Use this line on a local server to trigger the cronjob every 30 seconds
				//return parser.text('every 30 seconds');
			},
			job: function () {
				Meteor.call("updateLeitnerCards");
			}
		});
		SyncedCron.add({
			name: "errorCron",
			schedule: (parser) => {
				return parser.recur().on(Meteor.settings.public.dailyCronjob.executeAtHour).hour();
				//Use this line on a local server to trigger the cronjob every 30 seconds
				// return parser.text('every 30 seconds');
			},
			job: () => {
				Meteor.call("prepareErrorMail");
			}
		});
		SyncedCron.start();
	}
}
