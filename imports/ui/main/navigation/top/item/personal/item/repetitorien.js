import "./repetitorien.html";
import {Template} from "meteor/templating";
import {NavigatorCheck} from "../../../../../../../util/navigatorCheck";
import {Meteor} from "meteor/meteor";

/*
* ############################################################################
* mainNavigationTopItemPersonalItemRepetitorien
* ############################################################################
*/

Template.mainNavigationTopItemPersonalItemRepetitorien.helpers({
	isSmartPhoneAndOwnsNoCards: function () {
		if (NavigatorCheck.isSmartphone()) {
			if (Meteor.user() && Meteor.user().count !== undefined) {
				return Meteor.user().count.shuffled === 0;
			}
		}
	}
});
