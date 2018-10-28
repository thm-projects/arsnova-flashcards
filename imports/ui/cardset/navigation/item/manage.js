//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Bonus} from "../../../../api/bonus";
import "../modal/editors.js";
import "../modal/leaveCardset.js";
import "../modal/report.js";
import "./manage.html";

/*
 * ############################################################################
 * cardsetNavigationManage
 * ############################################################################
 */

Template.cardsetNavigationManage.helpers({
	enableIfPublished: function () {
		return this.kind !== 'personal';
	},
	isInBonus: function () {
		return Bonus.isInBonus(Session.get('activeCardset')._id, Meteor.userId());
	}
});

Template.cardsetNavigationManage.events({
	"click #manageEditors": function () {
		Router.go('cardseteditors', {_id: Router.current().params._id});
	},
	"click #leaveCardsetButton": function () {
		Router.go('pool');
	}
});
