import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {NavigatorCheck} from "../../../../../../../api/navigatorCheck";
import "./transcripts.html";

/*
* ############################################################################
* mainNavigationTopItemPersonalItemTranscripts
* ############################################################################
*/

Template.mainNavigationTopItemPersonalItemTranscripts.helpers({
	isSmartPhoneAndOwnsNoCards: function () {
		if (NavigatorCheck.isSmartphone()) {
			if (Meteor.user() && Meteor.user().count !== undefined) {
				return Meteor.user().count.transcripts === 0;
			}
		}
	}
});
