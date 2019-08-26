//------------------------ Export
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import "./export.html";
import {Meteor} from "meteor/meteor";
import {BertAlertVisuals} from "../../../../api/bertAlertVisuals";

Session.setDefault('exportType', 1);
/*
 * ############################################################################
 * cardsetExportForm
 * ############################################################################
 */

Template.cardsetExportForm.onRendered(function () {
	$('#exportModal').on('hidden.bs.modal', function () {
		$('#uploadError').html('');
	});
});

Template.cardsetExportForm.helpers({
	uploading: function () {
		return Template.instance().uploading.get();
	},
	exportType: function (exportType) {
		return Session.get('exportType') === exportType;
	}
});

Template.cardsetExportForm.events({
	"click #exportType1": function () {
		Session.set('exportType', 1);
	},
	"click #exportType2": function () {
		Session.set('exportType', 2);
	},
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
