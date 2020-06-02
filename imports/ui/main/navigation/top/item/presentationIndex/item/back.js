import "./back.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


Template.mainNavigationTopPresentationIndexItemBack.helpers({
	isCardsetIndexSelectMode: function () {
		return Session.get('isDirectCardsetIndexView');
	}
});

Template.mainNavigationTopPresentationIndexItemBack.events({
	"click #backToPresentation, click #backToPresentationFullscreen": function () {
		if (FlowRouter.getRouteName() === "demolist") {
			FlowRouter.go('demo');
		} else if (FlowRouter.getRouteName() === "makinglist") {
			FlowRouter.go('making');
		} else {
			FlowRouter.go('presentation', {
				_id: FlowRouter.getParam('_id')
			});
		}
	},
	"click #backToCardset": function () {
		FlowRouter.go('cardsetdetailsid', {
			_id: FlowRouter.getParam('_id')
		});
	}
});
