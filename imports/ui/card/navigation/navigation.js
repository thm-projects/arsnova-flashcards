import {Session} from "meteor/session";
import {CardVisuals} from "../../../api/cardVisuals";
import {Route} from "../../../api/route";
import {CardType} from "../../../api/cardTypes";
import {CardEditor} from "../../../api/cardEditor";
import "./navigation.html";

/*
 * ############################################################################
 * cardNavigation
 * ############################################################################
 */

Template.cardNavigation.events({
	'click #editFront': function () {
		CardEditor.editFront();
	},
	'click #editBack': function () {
		CardEditor.editBack();
	},
	'click #editLecture': function () {
		CardEditor.editLecture();
	},
	'click #editHint': function () {
		CardEditor.editHint();
	},
	'click #editTop': function () {
		CardEditor.editTop();
	},
	'click #editBottom': function () {
		CardEditor.editBottom();
	},
	'focus #editFront': function () {
		CardEditor.editFront();
	},
	'focus #editBack': function () {
		CardEditor.editBack();
	},
	'focus #editLecture': function () {
		CardEditor.editLecture();
	},
	'focus #editHint': function () {
		CardEditor.editHint();
	},
	'focus #editTop': function () {
		CardEditor.editTop();
	},
	'focus #editBottom': function () {
		CardEditor.editBottom();
	}
});

Template.cardNavigation.helpers({
	gotHint: function () {
		return CardType.gotHint(Session.get('cardType'));
	},
	gotLecture: function () {
		return CardType.gotLecture(Session.get('cardType'));
	},
	gotBack: function () {
		if ((Route.isBox() || Route.isMemo())) {
			return false;
		} else {
			return CardType.gotBack(Session.get('cardType'));
		}
	},
	gotTop: function () {
		return CardType.gotTop(Session.get('cardType'));
	},
	gotBottom: function () {
		return CardType.gotBottom(Session.get('cardType'));
	}
});

Template.cardNavigation.onCreated(function () {
	if (Session.get('fullscreen') && !Route.isPresentationOrDemo()) {
		CardVisuals.toggleFullscreen();
	}
	Session.set('reverseViewOrder', false);
});

Template.cardNavigation.onRendered(function () {
	$(window).resize(function () {
		if ($(window).width() <= 1200) {
			$("#button-row").insertBefore($("#preview"));
		} else {
			$("#button-row").insertAfter($("#preview"));
		}
	});
	$('#editFront').click();
});

/*
 * ############################################################################
 * cardNavigationFront
 * ############################################################################
 */
Template.cardNavigationFront.helpers({
	getFrontTitle: function () {
		if (CardType.gotSidesSwapped(Session.get('cardType'))) {
			return CardType.getBackTitle();
		} else {
			return CardType.getFrontTitle();
		}
	}
});

/*
 * ############################################################################
 * cardNavigationBack
 * ############################################################################
 */
Template.cardNavigationBack.helpers({
	getBackTitle: function () {
		if (CardType.gotSidesSwapped(Session.get('cardType'))) {
			return TAPi18n.__('card.cardType' + Session.get('cardType') + '.front');
		} else {
			return TAPi18n.__('card.cardType' + Session.get('cardType') + '.back');
		}
	}
});

/*
 * ############################################################################
 * cardNavigationHint
 * ############################################################################
 */
Template.cardNavigationHint.helpers({
	getHintTitle: function () {
		return CardType.getHintTitle();
	}
});

/*
 * ############################################################################
 * cardNavigationTop
 * ############################################################################
 */
Template.cardNavigationTop.helpers({
	getTopTitle: function () {
		return CardType.getTopTitle();
	}
});

/*
 * ############################################################################
 * cardNavigationBottom
 * ############################################################################
 */
Template.cardNavigationBottom.helpers({
	getBottomTitle: function () {
		return CardType.getBottomTitle();
	}
});
