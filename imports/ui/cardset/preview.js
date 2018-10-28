//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cards} from "../../api/cards";
import {Cardsets} from "../../api/cardsets";
import "./preview.html";

/*
 * ############################################################################
 * cardsetPreview
 * ############################################################################
 */


Template.cardsetPreview.events({
	"click #buyProBtn": function () {
		Router.go('profileMembership', {
			_id: Meteor.userId()
		});
	},
	"click #showPreviewHelp": function () {
		event.stopPropagation();
		Session.set('helpFilter', "previewCardset");
		Router.go('help');
	}
});

Template.cardsetPreview.onCreated(function () {
	if (Router.current().params._id) {
		let cardset = Cardsets.findOne({_id: Router.current().params._id}, {fields: {_id: 1, cardGroups: 1}});
		if (cardset !== undefined) {
			let filterQuery = {
				$or: [
					{cardset_id: cardset._id},
					{cardset_id: {$in: cardset.cardGroups}}
				]
			};
			Cards._collection.remove(filterQuery);
			Meteor.subscribe("previewCards", cardset._id);
		}
	}
});

Template.cardsetPreview.onDestroyed(function () {
	if (Router.current().params._id) {
		Meteor.subscribe('cardsetCards', Router.current().params._id);
		Session.set('activeCard', undefined);
	}
});
