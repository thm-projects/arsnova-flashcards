import "./editTitle.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * cardsetIndexTranscriptSettingsItemEditTitle
 * ############################################################################
 */

Template.cardsetIndexTranscriptSettingsItemEditTitle.events({
	'click #editTitel': function () {
		Session.set('transcriptBonusTempLectures', Session.get('transcriptBonusLectures').map(a => Object.assign({}, a)));
	}
});
