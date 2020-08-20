import {AccountUtils} from "../../util/accounts";

if (Meteor.isServer) {
	Meteor.methods({
		"accountExists": function (username) {
			return AccountUtils.exists(username);
		},

		"mailExists": function (mail) {
			return AccountUtils.mailExists(mail);
		}
	});
}
