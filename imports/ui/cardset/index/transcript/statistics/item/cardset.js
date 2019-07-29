import "./cardset.html";
import {Cardsets} from "../../../../../../api/cardsets";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";

/*
 * ############################################################################
 * cardsetIndexTranscriptStatisticsItemCardset
 * ############################################################################
 */

Template.cardsetIndexTranscriptStatisticsItemCardset.events({
	'click #exportCSV': function () {
		var cardset = Cardsets.findOne({_id: Router.current().params._id});
		var hiddenElement = document.createElement('a');
		var header = [];
		header[0] = TAPi18n.__('box_export_birth_name');
		header[1] = TAPi18n.__('box_export_given_name');
		header[2] = TAPi18n.__('box_export_mail');
		header[3] = TAPi18n.__('transcriptForm.info.submissions');
		header[4] = TAPi18n.__('transcriptForm.bonus.statistics.pending');
		header[5] = TAPi18n.__('transcriptForm.bonus.statistics.accepted');
		header[6] = TAPi18n.__('transcriptForm.bonus.statistics.denied');
		header[7] = TAPi18n.__('transcriptForm.bonus.statistics.starsTotal');
		header[8] = TAPi18n.__('transcriptForm.bonus.statistics.starsMedian');
		header[9] = TAPi18n.__('transcriptForm.bonus.statistics.bonus');
		Meteor.call("getTranscriptCSVExport", cardset._id, header, function (error, result) {
			if (error) {
				throw new Meteor.Error(error.statusCode, 'Error could not receive content for .csv');
			}
			if (result) {
				let statistics = TAPi18n.__('transcriptForm.bonus.statistics.exportName');
				hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(result);
				hiddenElement.target = '_blank';
				let str = (cardset.name + "_" + statistics + "_" + moment(new Date()).locale(Session.get('activeLanguage')).format("D_MMMM_YYYY") + ".csv");
				hiddenElement.download = str.replace(/ /g, "_").replace(/:/g, "_");
				document.body.appendChild(hiddenElement);
				hiddenElement.click();
			}
		});
	}
});
