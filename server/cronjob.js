import {SyncedCron} from "meteor/percolate:synced-cron";

export class CronScheduler {

	startCron () {
		SyncedCron.add({
			name: "leitnerCron",
			schedule: function (parser) {
				return parser.recur().every(1).hour();
			},
			job: function () {
				Meteor.call("updateLeitnerCards");
			}
		});
		SyncedCron.start();
	}
}
