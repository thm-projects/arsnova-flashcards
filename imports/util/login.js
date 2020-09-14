import {Meteor} from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Leitner} from "../api/subscriptions/leitner";
import {Wozniak} from "../api/subscriptions/wozniak";
import * as config from "../config/login.js";
import {UserPermissions} from "./permissions";
import {Session} from "meteor/session";
import {ServerStyle} from "./styles";

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
		if (Meteor.user() && Meteor.user().count !== undefined) {
			return Meteor.user().count.cardsets;
		}
	}

	static autoShowUseCasesForUser () {
		if (UserPermissions.isAdmin()) {
			return config.showUseCasesOnLoginForAdmin;
		} else {
			return true;
		}
	}

	static showUseCasesModal () {
		if (Session.get('firedUseCaseModal') === 1) {
			Session.set('firedUseCaseModal', 2);
			if (LoginTasks.autoShowUseCasesForUser()) {
				$('#useCasesModal').modal('show');
			}
		}
	}

	static setLoginRedirect () {
		Meteor.subscribe("userLeitner", {
			onReady: function () {
				Meteor.subscribe("userWozniak", {
					onReady: function () {
						let redirected = false;
						Session.set('firedUseCaseModal', 1);
						for (let i = 0; i < config.loginRedirectPriority.length; i++) {
							switch (config.loginRedirectPriority[i]) {
								case 0:
									if (UserPermissions.gotBackendAccess() && !redirected) {
										redirected = true;
										FlowRouter.go('alldecks');
									}
									break;
								case 1:
									if (LoginTasks.gotWorkload() > 0 && !redirected) {
										redirected = true;
										FlowRouter.go('learn');
									}
									break;
								case 2:
									if (ServerStyle.gotNavigationFeature("personal.cardset.enabled") && LoginTasks.gotOwnCardsets() > 0 && !redirected) {
										redirected = true;
										FlowRouter.go('create');
									}
									break;
							}
							if (redirected) {
								break;
							}
						}
						if (!redirected) {
							if (ServerStyle.gotNavigationFeature("public.cardset.enabled")) {
								FlowRouter.go('pool');
							} else if (ServerStyle.gotNavigationFeature("public.repetitorium.enabled")) {
								FlowRouter.go('repetitorium');
							} else {
								if (Meteor.user() && Roles.userIsInRole(Meteor.userId(), ['firstLogin'])) {
									FlowRouter.go('firstLogin');
								} else {
									FlowRouter.go('help');
								}
							}
						}
					}
				});
			}
		});
	}
};
