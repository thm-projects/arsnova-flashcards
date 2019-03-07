import {Template} from "meteor/templating";
import {WordcloudCanvas} from "../../../api/wordcloudCanvas";
import "./de/content.js";
import "./en/content.js";
import "./help.html";

Template.wordcloudHelpModal.events({
	"click #wordcloudHelpConfirm": function () {
		$('#wordcloudHelpModal').modal('hide');
	}
});

Template.wordcloudHelpModal.onRendered(function () {
	if (WordcloudCanvas.displayHelpModal()) {
		$('#wordcloudHelpModal').modal('show');
	}
});
