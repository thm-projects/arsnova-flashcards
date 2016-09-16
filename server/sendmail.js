import {Email} from "meteor/email";
import {SyncedCron} from "meteor/percolate:synced-cron";


var FutureTasks = new Meteor.Collection('future_tasks');

export class MailNotifier {

	addTask(details) {
		var id = FutureTasks.insert(details);
		SyncedCron.add({
			name: id,
			schedule: function (parser) {
				return parser.recur().on('01:00:00').time();
			},
			job: function () {
				Email.send({
					from: details.details.from,
					to: details.details.to,
					subject: details.details.subject,
					text: details.details.text
				});
				FutureTasks.remove(id);
				SyncedCron.remove(id);
				return id;
			}
		});
	}

	startCron() {
		SyncedCron.start();
	}

	stopCron() {
		SyncedCron.stop();
	}
}
