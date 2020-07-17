import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {BertAlertVisuals} from "../../../../../../util/bertAlertVisuals";
import "./export.html";

/*
 * ############################################################################
 * filterIndexItemBottomExport
 * ############################################################################
 */

Template.filterIndexItemBottomExport.events({
	'click .exportCardset': function (event) {
		let name = $(event.target).data('name');
		Meteor.call('exportCardset', $(event.target).data('id'), function (error, result) {
			if (error) {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('export.failure.cardset'), 'danger', 'growl-top-left');
			} else {
				let exportData = new Blob([result], {
					type: "application/json"
				});
				saveAs(exportData, TAPi18n.__('export.filename.export') + "_" + TAPi18n.__('export.filename.cardset') + "_" + name + moment().format('_YYYY_MM_DD') + ".json");
			}
		});
	}
});
