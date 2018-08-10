import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets.js";
import {Cards} from "./cards.js";
import {Leitner, Wozniak} from "./learned.js";
import {Ratings} from "./ratings.js";
import {check} from "meteor/check";
import {Session} from "meteor/session";

/**
 * Returns the degree, the givenname and the birthname from the author of a cardset
 * @param owner - The database ID of the author
 * @param lastNameFirst - Display the last name first
 * @returns {*} - Degree + givenname + birthname
 */
export function getAuthorName(owner, lastNameFirst = true) {
	let author;
	if (Meteor.isServer) {
		author = Meteor.users.findOne({"_id": owner});
	} else {
		if (Router.current().route.getName() === "home") {
			Meteor.call('getWordcloudUserName', owner, function (error, result) {
				if (result) {
					Session.set('wordcloudAuthor', result);
				}
			});
			author = Session.get('wordcloudAuthor');
		} else {
			author = Meteor.users.findOne({"_id": owner});
		}
	}
	if (author) {
		let name = "";
		if (lastNameFirst) {
			if (author.profile.birthname) {
				name += author.profile.birthname;
			} else {
				return author.profile.name + " (" + TAPi18n.__('complete-profile.title') + ")";
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
	Meteor.publish("userData", function () {
		if (this.userId && !Roles.userIsInRole(this.userId, 'blocked')) {
			return Meteor.users.find(
				{$or: [{visible: true}, {_id: this.userId}]},
				{
					fields: {
						'profile.name': 1,
						'profile.birthname': 1,
						'profile.givenname': 1,
						'profile.title': 1,
						'profile.locale': 1,
						'email': 1,
						'services': 1,
						'lvl': 1,
						'visible': 1,
						'lastOnAt': 1,
						'daysInRow': 1,
						'customerId': 1,
						'blockedtext': 1,
						"selectedColorTheme": "default",
						"selectedLanguage": 1,
						"mailNotification": 1,
						"webNotification": 1
					}
				});
		} else if (Roles.userIsInRole(this.userId, 'blocked')) {
			return Meteor.users.find({_id: this.userId}, {fields: {'blockedtext': 1}});
		} else {
			this.ready();
		}
	});
	Meteor.publish("privateUserData", function () {
		if (this.userId && !Roles.userIsInRole(this.userId, 'blocked')) {
			return Meteor.users.find(
				{_id: this.userId},
				{
					fields: {
						'profile.name': 1,
						'profile.birthname': 1,
						'profile.givenname': 1,
						'profile.title': 1,
						'profile.locale': 1,
						'email': 1,
						'services': 1,
						'lvl': 1,
						'visible': 1,
						'lastOnAt': 1,
						'daysInRow': 1,
						'balance': 1,
						"mailNotification": 1,
						"webNotification": 1,
						"selectedLanguage": 1
					}
				});
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

		Meteor.users.update(Meteor.user()._id, {
			$set: {
				visible: visible
			}
		});
	},
	updateUsersEmail: function (email) {
		check(email, String);

		Meteor.users.update(Meteor.user()._id, {
			$set: {
				email: email
			}
		});
	},
	updateUsersName: function (name, id) {
		check(name, String);
		check(id, String);

		Meteor.users.update(id, {
			$set: {
				"profile.name": name
			}
		});
	},
	updateUsersTitle: function (title, id) {
		check(title, String);
		check(id, String);

		Meteor.users.update(id, {
			$set: {
				"profile.title": title
			}
		});
	},
	updateUsersBirthName: function (birthname, id) {
		check(birthname, String);
		check(id, String);

		Meteor.users.update(id, {
			$set: {
				"profile.birthname": birthname
			}
		});
	},
	updateUsersGivenName: function (givenname, id) {
		check(givenname, String);
		check(id, String);

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

		if (!Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
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
	deleteUserProfile: function () {
		if (!this.userId || Roles.userIsInRole(this.userId, "blocked")) {
			throw new Meteor.Error("not-authorized");
		}

		let cardsets = Cardsets.find({
			owner: this.userId,
			kind: 'personal'
		});

		cardsets.forEach(function (cardset) {
			Cards.remove({
				cardset_id: cardset._id
			});
		});

		Cardsets.update({owner: this.userId}, {
			$set: {
				userDeleted: true
			}
		}, {multi: true});

		let allPrivateUserCardsets = Cardsets.find({
			owner: this.userId,
			kind: 'personal'
		}).fetch();

		Cardsets.remove({
			owner: this.userId,
			kind: 'personal'
		});

		for (let i = 0; i < allPrivateUserCardsets.length; i++) {
			Meteor.call('updateShuffledCardsetQuantity', allPrivateUserCardsets[i]._id);
		}

		Cardsets.update({editors: {$in: [this.userId]}}, {
			$pull: {editors: this.userId}
		});

		Meteor.users.update(this.userId, {
			$set: {
				"services.resume.loginTokens": []
			}
		});

		Leitner.remove({
			user_id: this.userId
		});

		Wozniak.remove({
			user_id: this.userId
		});

		Ratings.remove({
			user: this.userId
		});

		Meteor.users.remove(this.userId);
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
