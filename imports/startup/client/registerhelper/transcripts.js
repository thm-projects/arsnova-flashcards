import {ServerStyle} from "../../../util/styles";
import {Route} from "../../../util/route";
import {TranscriptBonus} from "../../../api/subscriptions/transcriptBonus";
import {UserPermissions} from "../../../util/permissions";

Template.registerHelper("isTranscriptBonusCard", function (card_id) {
	if (ServerStyle.gotSimplifiedNav() && Route.isMyTranscripts()) {
		return TranscriptBonus.findOne({card_id: card_id});
	} else {
		return Route.isTranscriptBonus() || Route.isMyBonusTranscripts();
	}
});

Template.registerHelper("isTranscriptBonusCardAndDeadlineExpired", function (card_id, isEditingDeadline = false) {
	let transcriptBonus = TranscriptBonus.findOne({card_id: card_id});
	if (transcriptBonus !== undefined) {
		if ((UserPermissions.isAdmin() || UserPermissions.isOwner(transcriptBonus.cardset_id)) && Route.isTranscriptBonus()) {
			return false;
		}
		if (isEditingDeadline) {
			return moment(transcriptBonus.date).add(transcriptBonus.deadlineEditing, 'hours') < moment();
		} else {
			return moment(transcriptBonus.date).add(transcriptBonus.deadline, 'hours') < moment();
		}
	}
});
