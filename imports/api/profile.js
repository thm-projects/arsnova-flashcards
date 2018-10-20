import {Meteor} from "meteor/meteor";

export let Profile = class Profile {
	static isCompleted (user = undefined) {
		let birthname, givenname, email;
		if (user === undefined) {
			birthname = Meteor.user().profile.birthname !== "" && Meteor.user().profile.birthname !== undefined;
			givenname = Meteor.user().profile.givenname !== "" && Meteor.user().profile.givenname !== undefined;
			email = Meteor.user().email !== "" && Meteor.user().email !== undefined;
		} else {
			birthname = user.profile.birthname !== "" && user.profile.birthname !== undefined;
			givenname = user.profile.givenname !== "" && user.profile.givenname !== undefined;
			email = user.email !== "" && user.email !== undefined;
		}
		return (birthname && givenname && email);
	}
};
