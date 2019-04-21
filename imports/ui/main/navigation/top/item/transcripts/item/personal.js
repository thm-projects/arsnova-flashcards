import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {NavigatorCheck} from "../../../../../../../api/navigatorCheck";
import "./personal.html";

/*
* ############################################################################
* mainNavigationTopItemTranscriptsItemPersonal
* ############################################################################
*/

Template.mainNavigationTopItemTranscriptsItemPersonal.helpers({
	isSmartPhoneAndOwnsNoCards: function () {
		if (NavigatorCheck.isSmartphone()) {
			if (Meteor.user() && Meteor.user().count !== undefined) {
				return Meteor.user().count.transcripts === 0;
			}
		}
	}
});
