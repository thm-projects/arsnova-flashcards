import "./endPresentation.html";
import {Route} from "../../../../api/route";
import {Meteor} from "meteor/meteor";
import {MainNavigation} from "../../../../api/mainNavigation";
import {CardVisuals} from "../../../../api/cardVisuals";

/*
 * ############################################################################
 * cardSidebarItemEndPresentation
 * ############################################################################
 */

Template.cardSidebarItemEndPresentation.events({
	"click .endPresentation": function () {
		if (Route.isMakingOf() || Route.isDemo()) {
			CardVisuals.toggleFullscreen(true);
			if (Meteor.user() || MainNavigation.isGuestLoginActive()) {
				Router.go('about');
			} else {
				Router.go('home');
			}
		} else if (Route.isPresentationTranscriptPersonal()) {
			Router.go('transcriptsPersonal');
		} else if (Route.isPresentationTranscriptBonus()) {
			Router.go('transcriptsBonus');
		} else if (Route.isPresentationTranscriptBonusCardset() || Route.isPresentationTranscriptReview()) {
			Router.go('transcriptBonus', {
				_id: Router.current().params._id
			});
		} else {
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		}
	}
});
