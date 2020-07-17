import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {NavigatorCheck} from "../../../../../../../util/navigatorCheck";
import "./cardsets.html";

/*
* ############################################################################
* mainNavigationTopItemPersonalItemCardsets
* ############################################################################
*/

Template.mainNavigationTopItemPersonalItemCardsets.helpers({
	isSmartPhoneAndOwnsNoCards: function () {
		if (NavigatorCheck.isSmartphone()) {
			if (Meteor.user() && Meteor.user().count !== undefined) {
				return Meteor.user().count.cardsets === 0;
			}
		}
	}
});
