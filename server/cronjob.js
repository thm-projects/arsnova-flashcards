import {SyncedCron} from "meteor/percolate:synced-cron";

export class CronScheduler {

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
