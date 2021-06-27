import {Meteor} from "meteor/meteor";
import {Cardsets} from "../subscriptions/cardsets.js";
import {Cards} from "../subscriptions/cards.js";
import {LeitnerUserCardStats} from "../subscriptions/leitner/leitnerUserCardStats";
import {LeitnerPerformanceHistory} from "../subscriptions/leitner/leitnerPerformanceHistory";
import {LeitnerLearningWorkload} from "../subscriptions/leitner/leitnerLearningWorkload";
import {Wozniak} from "../subscriptions/wozniak";
import {Ratings} from "../subscriptions/ratings";
import {check} from "meteor/check";
import {UserPermissions} from "../../util/permissions";
import {WebPushSubscriptions} from "../subscriptions/webPushNotifications";
import {Paid} from "../subscriptions/paid";
import {TranscriptBonus} from "../subscriptions/transcriptBonus";
import {Utilities} from "../../util/utilities";
import {CardType} from "../../util/cardTypes";
import {LeitnerActivationDay} from "../subscriptions/leitner/leitnerActivationDay";
import {LeitnerLearningPhase} from "../subscriptions/leitner/leitnerLearningPhase";
import {DELETED_USER_ID} from "../../config/userData.js";
import {ServerStyle} from "../../util/styles";

Meteor.methods({
	updateUsersVisibility: function (visible, id) {
		check(visible, Boolean);
		check(id, String);

		if (!UserPermissions.gotBackendAccess()) {
			id = Meteor.userId();
		}
		Meteor.users.update(id, {
			$set: {
				visible: visible
			}
		});
	},
	updateUsersEmail: function (email, id) {
		check(email, String);
		check(id, String);

		if (!UserPermissions.gotBackendAccess() && UserPermissions.isCardsLogin()) {
			throw new Meteor.Error("not-authorized");
		}

		if (!UserPermissions.gotBackendAccess()) {
			id = Meteor.userId();
		}
		Meteor.users.update(id, {
			$set: {
				email: email
			}
		});
	},
	updateUsersTitle: function (title, id) {
		check(title, String);
		check(id, String);

		if (!UserPermissions.gotBackendAccess()) {
			id = Meteor.userId();
		}
		Meteor.users.update(id, {
			$set: {
				"profile.title": title
			}
		});
	},
	updateUsersBirthName: function (birthname, id) {
		check(birthname, String);
		check(id, String);

		if (!UserPermissions.gotBackendAccess()) {
			id = Meteor.userId();
		}
		Meteor.users.update(id, {
			$set: {
				"profile.birthname": birthname
			}
		});
	},
	updateUserFullscreenSettings: function (presentationMode, demoMode, leitnerMode, wozniakMode) {
		check(presentationMode, Number);
		check(demoMode, Number);
		check(leitnerMode, Number);
		check(wozniakMode, Number);

		Meteor.users.update(Meteor.userId(), {
			$set: {
				"fullscreen.settings": {
					presentation: presentationMode,
					demo: demoMode,
					leitner: leitnerMode,
					wozniak: wozniakMode
				}
			}
		});
	},
	updateUsersGivenName: function (givenname, id) {
		check(givenname, String);
		check(id, String);

		if (!UserPermissions.gotBackendAccess()) {
			id = Meteor.userId();
		}
		Meteor.users.update(id, {
			$set: {
				"profile.givenname": givenname
			}
		});
	},
	updateUsersNotification: function (mail, web, id) {
		check(mail, Boolean);
		check(web, Boolean);
		check(id, String);

		if (!UserPermissions.gotBackendAccess()) {
			id = Meteor.userId();
		}
		Meteor.users.update(id, {
			$set: {
				mailNotification: mail,
				webNotification: web
			}
		});
	},
	updateUserTheme: function (theme) {
		if (ServerStyle.getAppThemes().length > 1) {
			check(theme, String);
			Meteor.users.update(Meteor.userId(), {
				$set: {
					savedTheme: theme
				}
			});
		}
	},
	updateUsersProfileState: function (completed, id) {
		check(completed, Boolean);
		check(id, String);

		if (!UserPermissions.gotBackendAccess()) {
			id = Meteor.userId();
		}
		Meteor.users.update(id, {
			$set: {
				"profile.completed": completed
			}
		});
	},
	initUser: function () {
		if (this.userId && !Roles.userIsInRole(this.userId, 'blocked')) {
			var user = Meteor.users.findOne({
				_id: Meteor.userId(),
				lvl: {
					$exists: true
				}
			});

			if (user === undefined && Meteor.user() !== undefined) {
				Meteor.users.update(Meteor.user()._id, {
					$set: {
						visible: false,
						email: "",
						birthname: "",
						givenname: "",
						lvl: 1,
						lastOnAt: new Date(),
						daysInRow: 0,
						mailNotification: false,
						webNotification: false,
						"profile.locale": "de",
						motd: []
					}
				});
			}
		}
	},
	setUserAsLecturer: function (id) {
		check(id, String);

		if (!UserPermissions.gotBackendAccess()) {
			throw new Meteor.Error("not-authorized");
		}
		Meteor.users.update(id, {
			$set: {
				visible: true,
				request: false
			}
		});

		Roles.addUsersToRoles(id, 'lecturer');
	},
	setLecturerRequest: function (user_id, request) {
		check(user_id, String);
		check(request, Boolean);

		if (!this.userId || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			throw new Meteor.Error("not-authorized");
		}

		Meteor.users.update(user_id, {
			$set: {
				request: request
			}
		});
	},
	updateUsersLast: function (id) {
		check(id, String);

		Meteor.users.update(id, {
			$set: {
				lastOnAt: new Date()
			}
		});
	},
	updateUsersDaysInRow: function (id, row) {
		check(id, String);
		check(row, Number);

		Meteor.users.update(id, {
			$set: {
				daysInRow: row
			}
		});
	},
	increaseUsersBalance: function (user_id, lecturer_id, amount) {
		check(user_id, String);
		check(lecturer_id, String);
		check(amount, Number);

		if (amount < 10) {
			var user_amount = Math.round((amount * 0.7) * 100) / 100;
			var lecturer_amount = Math.round((amount * 0.05) * 100) / 100;

			Meteor.users.update(user_id, {$inc: {balance: user_amount}});
			Meteor.users.update(lecturer_id, {$inc: {balance: lecturer_amount}});
		} else {
			throw new Meteor.Error("Amount of money is too high");
		}
	},
	resetUsersBalance: function (user_id) {
		check(user_id, String);

		if (user_id) {
			Meteor.users.update(user_id, {
				$set: {
					balance: 0
				}
			});
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	deleteUserProfile: function (targetUser = undefined) {
		if (!Meteor.userId() || !UserPermissions.isNotBlocked()) {
			throw new Meteor.Error("not-authorized");
		}

		let user_id;
		if (UserPermissions.gotBackendAccess() && targetUser !== undefined) {
			user_id = targetUser;
		} else {
			user_id = Meteor.userId();
		}

		//Remove user from editors array (Currently unused inside the app)
		Cardsets.update({editors: {$in: [user_id]}}, {
			$pull: {editors: user_id}
		});

		// Delete all cardsets and cards that aren't available to the public
		let cardsetFilter = Cardsets.find({
			owner: user_id,
			kind: 'personal'
		}).fetch().map(cardset => {
			return cardset._id;
		});
		cardsetFilter.forEach(function (cardset_id) {
			if (Cardsets.findOne({
				cardGroups: {$in: [cardset_id]},
				kind: {$nin: ['personal']}
			}) === undefined) {
				Cardsets.remove({_id: cardset_id});
				Cards.remove({cardset_id_id: cardset_id});
				LeitnerLearningWorkload.remove({cardset_id: cardset_id});
				LeitnerLearningPhase.remove({cardset_id: cardset_id});
				LeitnerUserCardStats.remove({cardset_id: cardset_id});
				LeitnerPerformanceHistory.remove({cardset_id: cardset_id});
				LeitnerActivationDay.remove({cardset_id: cardset_id});
				Ratings.remove({cardset_id: cardset_id});
				Paid.remove({cardset_id: cardset_id});
				WebPushSubscriptions.remove({cardset_id: cardset_id});
				TranscriptBonus.remove({cardset_id: cardset_id});
			}
		});

		// Delete remaining user data
		Wozniak.remove({
			user_id: user_id
		});

		let learningWorkloads = LeitnerLearningWorkload.find({user_id: user_id}, {fields: {cardset_id: 1}}).fetch();

		learningWorkloads.forEach(workload => {
			if (workload.isBonus === false) {
				LeitnerLearningPhase.remove({
					_id: workload.learning_phase_id
				});
			}
			LeitnerLearningWorkload.remove({
				_id: workload._id
			});
			LeitnerUserCardStats.remove({
				learning_phase_id: workload.learning_phase_id,
				workload_id: workload._id
			});
			LeitnerActivationDay.remove({
				learning_phase_id: workload.learning_phase_id,
				workload_id: workload._id
			});
			LeitnerPerformanceHistory.remove({
				learning_phase_id: workload.learning_phase_id,
				workload_id: workload._id
			});
			Meteor.call("updateLearnerCount", workload.cardset_id);
		});

		Ratings.remove({
			user_id: user_id
		});

		WebPushSubscriptions.remove({
			user_id: user_id
		});

		Paid.remove({
			user_id: user_id
		});

		//Delete users transcript bonus
		Cards.remove({
			user_id: user_id,
			cardType: {$in: CardType.getCardTypesWithTranscriptBonus()}
		});
		let transcriptBonus = TranscriptBonus.find({user_id: user_id}, {fields: {cardset_id: 1}}).fetch();
		if (transcriptBonus !== undefined) {
			TranscriptBonus.remove({
				user_id: user_id
			});
			let cardsetsValues = Utilities.getUniqData(transcriptBonus, 'cardset_id');
			for (let i = 0; cardsetsValues.length; i++) {
				if (cardsetsValues[i] !== undefined) {
					Meteor.call('updateTranscriptBonusStats', cardsetsValues[i]);
				}
			}
		}

		//Mark all public cardsets
		Cardsets.update({
			owner: user_id
		}, {
			$set: {
				owner: DELETED_USER_ID
			}

		});
		Cards.update({
			owner: user_id
		}, {
			$set: {
				owner: DELETED_USER_ID
			}

		});
		Meteor.users.remove(user_id);
	},
	removeFirstLogin: function () {
		if (!this.userId || Roles.userIsInRole(this.userId, "blocked")) {
			throw new Meteor.Error("not-authorized");
		}

		Roles.removeUsersFromRoles(Meteor.user()._id, 'firstLogin');
	},
	/** Function saves the given language to the given user
	 *  @param {string} selectedLanguage - The id of the selected language
	 *  @param {string} id - The id of the user
	 * */
	updateLanguage: function (selectedLanguage, id) {
		check(selectedLanguage, String);
		check(id, String);

		Meteor.users.update(id, {
			$set: {
				"profile.locale": selectedLanguage
			}
		});
	},
	updateCardsetCount: function (user_id) {
		check(user_id, String);
		if (Meteor.isServer) {
			Meteor.users.update({
					_id: user_id
				},
				{
					$set: {
						"count.cardsets": Cardsets.find({owner: user_id, shuffled: false}).count(),
						"count.shuffled": Cardsets.find({owner: user_id, shuffled: true}).count()
					}
				}
			);
		}
	},
	updateTranscriptCount: function (user_id) {
		check(user_id, String);
		if (Meteor.isServer) {
			Meteor.users.update({
					_id: user_id
				},
				{
					$set: {
						"count.transcripts": Cards.find({owner: user_id, cardType: 2}).count(),
						"count.bonusTranscripts": TranscriptBonus.find({user_id: user_id}).count()
					}
				}
			);
		}
	},
	updateWorkloadCount: function (user_id) {
		check(user_id, String);
		if (Meteor.isServer) {
			let activeWorkloadArray = LeitnerLearningWorkload.find({user_id: user_id, isActive: true}).fetch().map(function (workload) {
				return workload._id;
			});
			Meteor.users.update({
					_id: user_id
				},
				{
					$set: {
						"count.workload": LeitnerUserCardStats.find(
							{workload_id: {$in: activeWorkloadArray},
								user_id: user_id}).count() + Wozniak.find({user_id: user_id}).count()
					}
				}
			);
		}
	},
	/** Function saves the given read message of the day ids to the given user
	 *  @param {string} motds - new Array of motd ids
	 *  @param {string} id - The id of the user
	 * */
	updateMotd: function (motds, id) {
		Meteor.users.update(id, {
			$set: {
				"motds": motds
			}
		});
	}
});
