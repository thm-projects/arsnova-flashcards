import {Template} from "meteor/templating";
import {CardType} from "../../../../api/cardTypes";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {Route} from "../../../../api/route";
import {Session} from "meteor/session";
import {CardNavigation} from "../../../../api/cardNavigation";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./swapQuestionAnswer.html";

Session.setDefault('swapAnswerQuestion', 0);

/*
 * ############################################################################
 * cardSidebarItemSwapQuestionAnswer
 * ############################################################################
 */

Template.cardSidebarItemSwapQuestionAnswer.onCreated(function () {
	Session.set('swapAnswerQuestion', 0);
	CardNavigation.resetNavigation();
});

Template.cardSidebarItemSwapQuestionAnswer.onDestroyed(function () {
	Session.set('swapAnswerQuestion', 0);
});

Template.cardSidebarItemSwapQuestionAnswer.onRendered(function () {
	if (!Route.isDemo() && CardType.gotCardTypesWithSwapAnswerQuestionButton(FlowRouter.getParam('_id'))) {
		$('#cardSettingsModal').modal('show');
		$('.carousel-inner .item .cardContent').addClass('blurHideAnswerQuestion');
		$('#cardSettingsModal').on('hidden.bs.modal', function () {
			$('.carousel-inner .item .cardContent').removeClass('blurHideAnswerQuestion');
		});
	}
});

Template.cardSidebarItemSwapQuestionAnswer.helpers({
	gotCardTypesWithSwapAnswerQuestionButton: function () {
		if (Route.isDemo()) {
			return CardType.gotCardTypesWithSwapAnswerQuestionButton(Cardsets.findOne({
				name: "DemoCardset",
				kind: "demo",
				shuffled: true
			})._id);
		} else {
			return CardType.gotCardTypesWithSwapAnswerQuestionButton(FlowRouter.getParam('_id'));
		}
	},
	questionAnswerSwapped: function () {
		return Session.get('swapAnswerQuestion');
	},
	getTooltip: function () {
		if (Route.isDemo() || Cardsets.findOne({_id: FlowRouter.getParam('_id')}).shuffled) {
			return TAPi18n.__('card.tooltip.swapQuestionAnswer.shuffled', {cardTypes: CardType.getCardTypesWithSwapAnswerQuestionTooltip()});
		} else {
			return TAPi18n.__('card.tooltip.swapQuestionAnswer.normal');
		}
	}
});

Template.cardSidebarItemSwapQuestionAnswer.events({
	"click .swapQuestionAnswer": function () {
		if (Session.get('swapAnswerQuestion')) {
			Session.set('swapAnswerQuestion', 0);
		} else {
			Session.set('swapAnswerQuestion', 1);
		}
		CardNavigation.resetNavigation();
	}
});
