import {WordcloudCanvas} from "../../api/wordcloudCanvas";
import ResizeSensor from "../../../client/thirdParty/resizeSensor/ResizeSensor";
import {Cardsets} from "../../api/cardsets.js";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import "./help/help.js";
import "./wordcloud.html";
import {NavigatorCheck} from "../../api/navigatorCheck";
import {Route} from "../../api/route";

/*
 * ############################################################################
 * wordcloud
 * ############################################################################
 */

Template.wordcloud.helpers({
	displayHelpModal: function () {
		if (!NavigatorCheck.isSmartphone()) {
			return !(Route.isHome() && Session.get('isLandingPagePomodoroActive'));
		}
		return false;
	}
});

Template.wordcloud.onRendered(function () {
	WordcloudCanvas.draw();
	new ResizeSensor($('#wordcloud-container'), function () {
		WordcloudCanvas.draw();
	});
	new ResizeSensor($('#pomodoroTimerWordcloudContainer'), function () {
		WordcloudCanvas.draw();
	});
});



/*
 * ############################################################################
 * wordcloudModal
 * ############################################################################
 */

Template.wordcloudModal.helpers({
	getContent: function () {
		let result = [];
		let cardset = Cardsets.findOne({_id: Session.get('wordcloudItem')});
		if (cardset !== undefined) {
			result.push(cardset);
		}
		return result;
	},
	isRepetitorium: function () {
		return Cardsets.findOne({_id: Session.get('wordcloudItem')}).shuffled;
	},
	getColors: function () {
		switch (this.kind) {
			case "personal":
				return "btn-warning";
			case "free":
				return "btn-info";
			case "edu":
				return "btn-success";
			case "pro":
				return "btn-danger";
			case "demo":
				return "btn-demo";
		}
	}
});

Template.wordcloudModal.events({
	'click #cardsetLink': function () {
		$('body').removeClass('modal-open');
		$('#wordcloudModal').hide();
		$('.modal-backdrop').css('display', 'none');
	}
});

Template.wordcloudModal.onRendered(function () {
	$('#wordcloudModal').on('hidden.bs.modal', function () {
		$('#wordcloud-hover-box').css('display', 'none');
	});
});
