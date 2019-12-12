import {Template} from "meteor/templating";
import {NavigatorCheck} from "../../../../../../api/navigatorCheck";
import {Meteor} from "meteor/meteor";
import "./item/cardsets.js";
import "./item/repetitorien.js";
import "./personal.html";
import {ServerStyle} from "../../../../../../api/styles";

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
	},
	gotBothNavigationElements: function () {
		return ServerStyle.gotNavigationFeature("personal.cardset.enabled") && ServerStyle.gotNavigationFeature("personal.repetitorium.enabled");
	}
});
