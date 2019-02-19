import {Meteor} from "meteor/meteor";
import {Leitner, Wozniak} from "./learned.js";
import {Filter} from "./filter.js";
import * as config from "../config/login.js";

export let LoginTasks = class LoginTasks {

	static gotWorkload () {
		let actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		actualDate.setHours(0, 0, 0, 0);
		return Leitner.find({
			user_id: Meteor.userId(),
			active: true
		}).count() + Wozniak.find({
			user_id: Meteor.userId(), nextDate: {
				$lte: actualDate
			}
		}).count();
	}

	static gotOwnCardsets () {
		if (Meteor.user().count !== undefined) {
			return Meteor.user().count.cardsets;
		}
	}

	static setLoginRedirect () {
		Filter.resetFilters();
		Meteor.subscribe("userLeitner", {
			onReady: function () {
				Meteor.subscribe("userWozniak", {
					onReady: function () {
						let redirected = false;
						for (let i = 0; i < config.loginRedirectPriority.length; i++) {
							switch (config.loginRedirectPriority[i]) {
								case 0:
									if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor']) && !redirected) {
										redirected = true;
										Router.go('alldecks');
									}
									break;
								case 1:
									if (LoginTasks.gotWorkload() > 0 && !redirected) {
										redirected = true;
										Router.go('learn');
									}
									break;
								case 2:
									if (LoginTasks.gotOwnCardsets() > 0 && !redirected) {
										redirected = true;
										Router.go('create');
									}
									break;
							}
							if (redirected) {
								break;
							}
						}
						if (!redirected) {
							Router.go('pool');
						}
					}
				});
			}
		});
	}
};
