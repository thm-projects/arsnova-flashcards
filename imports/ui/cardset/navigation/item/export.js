//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {BertAlertVisuals} from "../../../../api/bertAlertVisuals";
import "./export.html";

/*
 * ############################################################################
 * cardsetNavigationExport
 * ############################################################################
 */

Template.cardsetNavigationExport.events({
	'click #exportCardsBtn': function () {
		let name = this.name;
		Meteor.call('exportCards', this._id, function (error, result) {
			if (error) {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('export.cards.failure'), 'danger', 'growl-top-left');
			} else {
				let exportData = new Blob([result], {
					type: "application/json"
				});
				saveAs(exportData, TAPi18n.__('export.filename.export') + "_" + TAPi18n.__('export.filename.cards') + "_" + name + moment().format('_YYYY_MM_DD') + ".json");
			}
		});
	}
});
