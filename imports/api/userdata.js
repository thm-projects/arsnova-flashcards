import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets.js";
import {Cards} from "./cards.js";
import {check} from "meteor/check";

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
						'earnedBadges': 1,
						'customerId': 1,
						'blockedtext': 1,
						"selectedColorTheme": 1
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
						'earnedBadges': 1,
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
		Meteor.users.update(Meteor.user()._id, {
			$set: {
				visible: true,
				email: "",
				birthname: "",
				givenname: "",
				lvl: 1,
				lastOnAt: new Date(),
				daysInRow: 0,
				earnedBadges: [],
				selectedColorTheme: "1",
			}
		});
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
	},
	updateEarnedBadges: function (index, rank) {
        check(index, Number);
        check(rank, Number);
        Meteor.users.update(Meteor.user()._id,
            {$addToSet: {"earnedBadges": {"index": index.toString(), "rank": rank.toString()}}});
    },
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
