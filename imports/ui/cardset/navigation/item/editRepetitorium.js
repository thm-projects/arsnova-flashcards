//------------------------ IMPORTS
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Template} from "meteor/templating";
import "./editRepetitorium.html";

/*
 * ############################################################################
 * cardsetNavigationEditRepetitorium
 * ############################################################################
 */

Template.cardsetNavigationEditRepetitorium.events({
	'click #editShuffle': function () {
		FlowRouter.go('editshuffle', {_id: FlowRouter.getParam('_id')});
	}
});
