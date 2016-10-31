import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets.js";
import {Cards} from "./cards.js";

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
						'email': 1,
						'services': 1,
						'lvl': 1,
						'visible': 1,
						'lastOnAt': 1,
						'daysInRow': 1,
						'customerId': 1,
						'blockedtext': 1
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
						'email': 1,
						'services': 1,
						'lvl': 1,
						'visible': 1,
						'lastOnAt': 1,
						'daysInRow': 1,
						'balance': 1
					}
				});
		} else {
			this.ready();
		}
	});
}

Meteor.users.allow({
	insert() {
		return false;
	},
	update() {
		return false;
	},
	remove() {
		return false;
	}
});

Meteor.users.deny({
	insert() {
		return true;
	},
	update() {
		return true;
	},
	remove() {
		return true;
	}
});

Meteor.methods({
	updateUsersVisibility: function (visible) {
		Meteor.users.update(Meteor.user()._id, {
			$set: {
				visible: visible
			}
		});
	},
	updateUsersEmail: function (email) {
		Meteor.users.update(Meteor.user()._id, {
			$set: {
				email: email
			}
		});
	},
	updateUsersName: function (name, id) {
		Meteor.users.update(id, {
			$set: {
				"profile.name": name
			}
		});
	},
	updateUsersTitle: function (title, id) {
		Meteor.users.update(id, {
			$set: {
				"profile.title": title
			}
		});
	},
	updateUsersBirthName: function (birthname, id) {
		Meteor.users.update(id, {
			$set: {
				"profile.birthname": birthname
			}
		});
	},
	updateUsersGivenName: function (givenname, id) {
		Meteor.users.update(id, {
			$set: {
				"profile.givenname": givenname
			}
		});
	},
	updateUsersProfileState: function (completed, id) {
		Meteor.users.update(id, {
			$set: {
				"profile.completed": completed
			}
		});
	},
	checkUsersName: function (name, id) {
		name = name.trim();
		var userExists = Meteor.users.findOne({"profile.name": name});
		if (userExists && userExists._id !== id) {
			throw new Meteor.Error("username already exists");
		}
		return name;
	},
	initUser: function () {
		Meteor.users.update(Meteor.user()._id, {
			$set: {
				visible: true,
				email: "",
				birthname: "",
				givenname: "",
				lvl: 1,
				lastOnAt: new Date(),
				daysInRow: 0
			}
		});
	},
	setUserAsLecturer: function (id) {
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
		Meteor.users.update(id, {
			$set: {
				lastOnAt: new Date()
			}
		});
	},
	updateUsersDaysInRow: function (id, row) {
		Meteor.users.update(id, {
			$set: {
				daysInRow: row
			}
		});
	},
	increaseUsersBalance: function (user_id, lecturer_id, amount) {
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

		var cardsets = Cardsets.find({
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

		Cardsets.remove({
			owner: this.userId,
			kind: 'personal'
		});

		Meteor.users.update(this.userId, {
			$set: {
				"services.resume.loginTokens": []
			}
		});

		Meteor.users.remove(this.userId);
	},
	removeFirstLogin: function () {
		if (!this.userId || Roles.userIsInRole(this.userId, "blocked")) {
			throw new Meteor.Error("not-authorized");
		}

		Roles.removeUsersFromRoles(Meteor.user()._id, 'firstLogin');
	}
});
