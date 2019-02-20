import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {NavigatorCheck} from "../../../../../api/navigatorCheck";
import "./myCardsets.html";

/*
* ############################################################################
* mainNavigationTopItemMyCardsets
* ############################################################################
*/

Template.mainNavigationTopItemMyCardsets.helpers({
	isSmartPhoneAndOwnsNoCards: function () {
		if (NavigatorCheck.isSmartphone()) {
			if (Meteor.user() && Meteor.user().count !== undefined) {
				return Meteor.user().count.cardsets === 0;
			}
		}
	},
	getMyCardsetName: function () {
		if (Meteor.user() && Meteor.user().count !== undefined) {
			switch (Meteor.user().count.cardsets) {
				case 0:
					return TAPi18n.__('navbar-collapse.noCarddecks');
				case 1:
					return TAPi18n.__('navbar-collapse.oneCarddeck');
				default:
					return TAPi18n.__('navbar-collapse.carddecks');
			}
		}
	}
});
