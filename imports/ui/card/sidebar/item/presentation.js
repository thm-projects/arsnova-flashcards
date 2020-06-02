import {Session} from "meteor/session";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {AspectRatio} from "../../../../api/aspectRatio.js";
import "./presentation.html";

/*
 * ############################################################################
 * cardSidebarItemPresentation
 * ############################################################################
 */

Template.cardSidebarItemPresentation.events({
	"click .startPresentation": function () {
		Session.set('aspectRatioMode', AspectRatio.getDefault());
		FlowRouter.go('presentation', {_id: FlowRouter.getParam('_id')});
	}
});
