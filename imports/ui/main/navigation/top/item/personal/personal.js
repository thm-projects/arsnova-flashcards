import {Template} from "meteor/templating";
import {NavigatorCheck} from "../../../../../../api/navigatorCheck";
import {Meteor} from "meteor/meteor";
import "./item/cardsets.js";
import "./item/repetitorien.js";
import "./item/transcripts.js";
import "./personal.html";

/*
* ############################################################################
* mainNavigationTopItemPersonal
* ############################################################################
*/

Template.mainNavigationTopItemPersonal.helpers({
	isSmartPhoneAndOwnsNoCards: function () {
		if (NavigatorCheck.isSmartphone()) {
			if (Meteor.user() && Meteor.user().count !== undefined) {
				return Meteor.user().count.cardsets === 0 && Meteor.user().count.shuffled === 0 && Meteor.user().count.transcripts === 0;
			}
		}
	}
});
