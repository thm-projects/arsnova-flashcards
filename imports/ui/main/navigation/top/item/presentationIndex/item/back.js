import "./back.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";



Template.mainNavigationTopPresentationIndexItemBack.helpers({
	isCardsetIndexSelectMode: function () {
		return Session.get('isDirectCardsetIndexView');
	}
});

Template.mainNavigationTopPresentationIndexItemBack.events({
	"click #backToPresentation, click #backToPresentationFullscreen": function () {
		if (Router.current().route.getName() === "demolist") {
			Router.go('demo');
		} else if (Router.current().route.getName() === "makinglist") {
			Router.go('making');
		} else {
			Router.go('presentation', {
				_id: Router.current().params._id
			});
		}
	},
	"click #backToCardset": function () {
		Router.go('cardsetdetailsid', {
			_id: Router.current().params._id
		});
	}
});
