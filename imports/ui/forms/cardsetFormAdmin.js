import "./cardsetFormAdmin.html";
import "./item/admin/lecturerAuthorized.js";
import "./item/admin/owner.js";
import "./item/admin/useCases.js";
import "./item/admin/wordcloud.js";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * cardsetFormAdmin
 * ############################################################################
 */
Template.cardsetFormAdmin.onRendered(function () {
	$('#setCardsetFormAdminModal').on('hidden.bs.modal', function () {
		Session.get('activeCardset', undefined);
	});
});

Template.cardsetFormAdmin.helpers({
	getCardsetName: function () {
		if (Session.get('activeCardset') !== undefined) {
			return Session.get('activeCardset').name;
		}
	}
});
