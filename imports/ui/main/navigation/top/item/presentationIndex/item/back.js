import "./back.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Route} from "../../../../../../../api/route";

Template.mainNavigationTopPresentationIndexItemBack.helpers({
	isCardsetIndexSelectMode: function () {
		return Session.get('isDirectCardsetIndexView');
	},
	isFilterIndexSelectMode: function () {
		return Session.get('filterIndexSelectMode') !== undefined;
	},
	getIndexDescription: function () {
		return Route.getNavigationName(Session.get('filterIndexSelectMode'));
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
	},
	"click #backToIndex": function () {
		FlowRouter.go(Session.get('filterIndexSelectMode'));
	}
});
