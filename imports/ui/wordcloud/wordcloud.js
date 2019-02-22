import {WordcloudCanvas} from "../../api/wordcloudCanvas";
import "./wordcloud.html";
import ResizeSensor from "../../../client/thirdParty/resizeSensor/ResizeSensor";
import {Cardsets} from "../../api/cardsets.js";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";

/*
 * ############################################################################
 * wordcloud
 * ############################################################################
 */

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
