import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {NavigatorCheck} from "../../../../../../../api/navigatorCheck";
import "./bonus.html";

/*
* ############################################################################
* mainNavigationTopItemTranscriptsItemBonus
* ############################################################################
*/

Template.mainNavigationTopItemTranscriptsItemBonus.helpers({
	isSmartPhoneAndOwnsNoCards: function () {
		if (NavigatorCheck.isSmartphone()) {
			if (Meteor.user() && Meteor.user().count !== undefined) {
				return Meteor.user().count.transcripts === 0;
			}
		}
	}
});
