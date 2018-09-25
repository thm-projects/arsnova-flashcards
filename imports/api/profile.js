import {Meteor} from "meteor/meteor";

export let Profile = class Profile {
	static isCompleted () {
		let birtname = Meteor.user().profile.birthname !== "" && Meteor.user().profile.birthname !== undefined;
		let givenname = Meteor.user().profile.givenname !== "" && Meteor.user().profile.givenname !== undefined;
		let email = Meteor.user().email !== "" && Meteor.user().email !== undefined;
		return (birtname && givenname && email);
	}
};
