import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets.js";
import {Cards} from "./cards.js";
import {Leitner, Workload, Wozniak} from "./learned.js";
import {Ratings} from "./ratings.js";
import {check} from "meteor/check";
import {UserPermissions} from "./permissions";
import {WebPushSubscriptions} from "./webPushSubscriptions";
import {Paid} from "./paid";
import {ServerStyle} from "./styles";
import {TranscriptBonus} from "./transcriptBonus";
import {Utilities} from "./utilities";
import {CardType} from "./cardTypes";

/**
 * Returns the degree, the givenname and the birthname from the author of a cardset
 * @param owner - The database ID of the author
 * @param lastNameFirst - Display the last name first
 * @param onlyFirstName - Return only the first name, used for E-Mail Notifications
 * @returns {*} - Degree + givenname + birthname
 */
export function getAuthorName(owner, lastNameFirst = true, onlyFirstName = false) {
	let author;
	author = Meteor.users.findOne({"_id": owner});
	if (author) {
		let name = "";
		if (onlyFirstName) {
			if (author.profile.givenname) {
				return author.profile.givenname.split(" ", 1);
			} else {
				return name;
			}
		}
		if (lastNameFirst) {
			if (author.profile.birthname) {
				name += author.profile.birthname;
			} else {
				return author.profile.name;
			}
			if (author.profile.givenname) {
				name += (", " + author.profile.givenname);
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
			}
			if (author.profile.birthname) {
				name += author.profile.birthname;
			}
		}
		return name;
	} else {
		return TAPi18n.__('admin.deletedUser');
	}
}

export function exportAuthorName(owner) {
	let author = Meteor.users.findOne({"_id": owner});
	return {
		title: author.profile.title,
		birthname: author.profile.birthname,
		givenname: author.profile.givenname
	};
}

if (Meteor.isServer) {
	Meteor.publish("userDataLecturers", function () {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			return Meteor.users.find({roles: {$in: ["lecturer"]}},
				{
					fields: {
						'profile.name': 1,
						'profile.birthname': 1,
						'profile.givenname': 1,
						'profile.title': 1
					}
				});
		} else {
			this.ready();
		}
	});
	Meteor.publish("userDataLandingPage", function () {
		let cardsets = Cardsets.find({wordcloud: true}, {fields: {owner: 1}}).fetch();
		let owners = [];
		for (let i = 0; i < cardsets.length; i++) {
			owners.push(cardsets[i].owner);
		}
		return Meteor.users.find({_id: {$in: owners}},
			{
				fields: {
					'profile.name': 1,
					'profile.birthname': 1,
					'profile.givenname': 1,
					'profile.title': 1
				}
			});
	});
	Meteor.publish("userDataTranscriptBonus", function (cardset_id) {
		if (this.userId) {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, owner: 1}});
			if (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner)) {
				let bonusTranscripts = TranscriptBonus.find({cardset_id: cardset._id}).fetch();
				let userFilter = [];
				for (let i = 0; i < bonusTranscripts.length; i++) {
					userFilter.push(bonusTranscripts[i].user_id);
				}
				return Meteor.users.find({_id: {$in: userFilter}},
					{
						fields: {
							'profile.name': 1,
							'profile.birthname': 1,
							'profile.givenname': 1,
							'profile.title': 1
						}
					});
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("userDataBonus", function (cardset_id, user_id) {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, owner: 1}});
			let workload = Workload.findOne({cardset_id: cardset_id, user_id: user_id}, {fields: {_id: 1, leitner: 1}});
			if (UserPermissions.isAdmin()) {
				return Meteor.users.find({_id: user_id});
			} else if (cardset.owner === this.userId && workload.leitner.bonus) {
				return Meteor.users.find({_id: user_id, visible: true},
					{
						fields: {
							'profile.name': 1,
							'profile.birthname': 1,
							'profile.givenname': 1,
							'profile.title': 1
						}
					});
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("userData", function () {
		if ((this.userId || ServerStyle.isLoginEnabled("guest")) && UserPermissions.isNotBlockedOrFirstLogin()) {
			if (UserPermissions.isAdmin()) {
				let hiddenUsers = [this.userId, "NotificationsTestCardset", ".cards"];
				return Meteor.users.find({_id: {$nin: hiddenUsers}});
			} else {
				return Meteor.users.find({_id: {$ne: this.userId}, visible: true},
					{
						fields: {
							'profile.name': 1,
							'profile.birthname': 1,
							'profile.givenname': 1,
							'profile.title': 1
						}
					});
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("personalUserData", function () {
		if (this.userId) {
			return Meteor.users.find({_id: this.userId});
		} else {
			this.ready();
		}
	});
}

Meteor.users.allow({
	insert: function () {
		return false;
	},
	update: function () {
		return false;
	},
	remove: function () {
		return false;
	}
});

Meteor.users.deny({
	insert: function () {
		return true;
	},
	update: function () {
		return true;
	},
	remove: function () {
		return true;
	}
});

Meteor.methods({
	updateUsersVisibility: function (visible) {
		check(visible, Boolean);

		Meteor.users.update(Meteor.userId(), {
			$set: {
				visible: visible
			}
		});
	},
	updateUsersEmail: function (email) {
		check(email, String);


		Meteor.users.update(Meteor.userId(), {
			$set: {
				email: email
			}
		});
	},
	updateUsersName: function (name, id) {
		check(name, String);
		check(id, String);

		if (UserPermissions.gotBackendAccess()) {
			Meteor.users.update(id, {
				$set: {
					"profile.name": name
				}
			});
		}
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
	checkUsersName: function (name, id) {
		check(name, String);
		check(id, String);

		name = name.trim();
		var userExists = Meteor.users.findOne({"profile.name": name});
		if (userExists && userExists._id !== id) {
			throw new Meteor.Error("username already exists");
		}
		return name;
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

		for (let i = 0; i < workload.length; i++) {
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
						"count.transcripts": Cards.find({owner: user_id, cardType: 2}).count()
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
