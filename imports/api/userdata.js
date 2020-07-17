import {Meteor} from "meteor/meteor";
import {Cardsets} from "./subscriptions/cardsets.js";
import {Cards} from "./subscriptions/cards.js";
import {Leitner} from "./subscriptions/leitner";
import {LeitnerHistory} from "./subscriptions/leitnerHistory";
import {Workload} from "./subscriptions/workload";
import {Wozniak} from "./subscriptions/wozniak";
import {Ratings} from "./subscriptions/ratings";
import {check} from "meteor/check";
import {UserPermissions} from "../util/permissions";
import {WebPushSubscriptions} from "./subscriptions/webPushNotifications";
import {Paid} from "./subscriptions/paid";
import {TranscriptBonus} from "./subscriptions/transcriptBonus";
import {Utilities} from "../util/utilities";
import {CardType} from "../util/cardTypes";
import {LeitnerUtilities} from "../util/leitner";
import {LeitnerTasks} from "./subscriptions/leitnerTasks";

/**
 * Returns the degree, the givenname and the birthname from the author of a cardset
 * @param owner - The database ID of the author
 * @param lastNameFirst - Display the last name first
 * @param onlyFirstName - Return only the first name, used for E-Mail Notifications
 * @param backendList - Returns a special string if true
 * @param profile - Provided name data, skips the database search
 * @returns {*} - Degree + givenname + birthname
 */
export function getAuthorName(owner, lastNameFirst = true, onlyFirstName = false, backendList = false, profile = undefined) {
	let author = {};
	let profileIncomplete = false;
	if (profile === undefined) {
		author = Meteor.users.findOne({"_id": owner});
	} else {
		author = profile;
	}
	if (author) {
		if (backendList && (author.profile.birthname === "" || author.profile.birthname === undefined || author.profile.givenname === "" || author.profile.givenname === undefined)) {
			return TAPi18n.__('admin.profileIncompleteBackendList');
		}
		let name = "";
		if (onlyFirstName) {
			if (author.profile.givenname) {
				return author.profile.givenname.split(" ", 1);
			} else {
				profileIncomplete = true;
			}
		}
		if (lastNameFirst) {
			if (author.profile.birthname) {
				name += author.profile.birthname;
			} else {
				profileIncomplete = true;
			}
			if (author.profile.givenname) {
				name += (", " + author.profile.givenname);
			} else {
				profileIncomplete = true;
			}
			if (author.profile.title) {
				name += (", " + author.profile.title);
			}
		} else {
			if (author.profile.title) {
				name += author.profile.title + " ";
			}
			if (author.profile.givenname) {
				name += author.profile.givenname + " ";
			} else {
				profileIncomplete = true;
			}
			if (author.profile.birthname) {
				name += author.profile.birthname;
			} else {
				profileIncomplete = true;
			}
		}
		if (profileIncomplete) {
			return author.profile.name + " (" + TAPi18n.__('leitnerProgress.user.missingName') + ")";
		} else {
			return name;
		}
	} else {
		return TAPi18n.__('admin.deletedUser');
	}
}

export function getOriginalAuthorName(originalAuthorName, lastNameFirst) {
	if (originalAuthorName.birthname === undefined) {
		return originalAuthorName.legacyName;
	}
	let name = "";
	if (lastNameFirst) {
		if (originalAuthorName.birthname) {
			name += originalAuthorName.birthname;
		}
		if (originalAuthorName.givenname) {
			name += (", " + originalAuthorName.givenname);
		}
		if (originalAuthorName.title) {
			name += (", " + originalAuthorName.title);
		}
	} else {
		if (originalAuthorName.title) {
			name += originalAuthorName.title + " ";
		}
		if (originalAuthorName.givenname) {
			name += originalAuthorName.givenname + " ";
		}
		if (originalAuthorName.birthname) {
			name += originalAuthorName.birthname;
		}
	}
	return name;
}
export function exportAuthorName(owner) {
	let author = Meteor.users.findOne({"_id": owner});
	return {
		title: author.profile.title,
		birthname: author.profile.birthname,
		givenname: author.profile.givenname
	};
}

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
						selectedColorTheme: "default",
						mailNotification: false,
						webNotification: false,
						"profile.locale": "de"
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

		let cardsets = Cardsets.find({
			owner: user_id,
			kind: 'personal'
		});

		cardsets.forEach(function (cardset) {
			Cards.remove({
				cardset_id: cardset._id
			});
		});

		Cardsets.update({owner: user_id}, {
			$set: {
				userDeleted: true
			}
		}, {multi: true});

		let allPrivateUserCardsets = Cardsets.find({
			owner: user_id,
			kind: 'personal'
		}).fetch();

		Cardsets.remove({
			owner: user_id,
			kind: 'personal'
		});

		for (let i = 0; i < allPrivateUserCardsets.length; i++) {
			Meteor.call('updateShuffledCardsetQuantity', allPrivateUserCardsets[i]._id);
		}

		Cardsets.update({editors: {$in: [user_id]}}, {
			$pull: {editors: user_id}
		});

		Meteor.users.update(user_id, {
			$set: {
				"services.resume.loginTokens": []
			}
		});

		Leitner.remove({
			user_id: user_id
		});


		Wozniak.remove({
			user_id: user_id
		});

		let workload = Workload.find({user_id: user_id}, {fields: {cardset_id: 1}}).fetch();

		Workload.remove({
			user_id: user_id
		});

		let nextDeletedUserID = LeitnerUtilities.getNextLeitnerDeletedUserID();
		for (let i = 0; i < workload.length; i++) {
			LeitnerTasks.update({
					user_id: user_id,
					cardset_id: workload[i].cardset_id
				},
				{
					$set: {
						user_id_deleted: nextDeletedUserID
					},
					$unset: {
						user_id: "",
						"notifications.mail.address": ""
					}
				}, {multi: true}
			);

			LeitnerHistory.update({
					user_id: user_id,
					cardset_id: workload[i].cardset_id
				},
				{
					$set: {
						user_id_deleted: nextDeletedUserID
					},
					$unset: {
						user_id: ""
					}
				}, {multi: true}
			);
			Meteor.call("updateLearnerCount", workload[i].cardset_id);
		}

		Ratings.remove({
			user_id: user_id
		});

		WebPushSubscriptions.remove({
			user_id: user_id
		});

		Paid.remove({
			user_id: user_id
		});
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
			Meteor.users.update({
					_id: user_id
				},
				{
					$set: {
						"count.workload": Leitner.find({user_id: user_id}).count() + Wozniak.find({user_id: user_id}).count()
					}
				}
			);
		}
	},
	/** Function saves the given colorTheme to the given user
	 *  @param {string} selectedColorTheme - The id of the selected color theme
	 *  @param {string} id - The id of the user
	 * */
	updateColorTheme: function (selectedColorTheme, id) {
		check(selectedColorTheme, String);
		check(id, String);

		Meteor.users.update(id, {
			$set: {
				"selectedColorTheme": selectedColorTheme
			}
		});
	}
});
