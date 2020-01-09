import "./pdfViewer.html";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";

Session.setDefault('activePDF', "");
/*
 * ############################################################################
 * mainPdfViewerModal
 * ############################################################################
 */

Template.mainPdfViewerModal.onRendered(function () {
	$('#pdfViewerModal').on('hidden.bs.modal', function () {
		Session.set('activePDF', "");
	});
	$('#pdfViewerModal').on('shown.bs.modal', function () {
		if (Session.get('activePDF')) {
			$('#pdfViewerModal .modal-dialog').html('<iframe id="pdfViewer" width="' + window.innerWidth * 0.95 + 'px" height="' + window.innerHeight * 0.95 + 'px" frameborder="0" src="/pdf/web/viewer.html?file=https://cors-anywhere.herokuapp.com/' + Session.get('activePDF') + '"></iframe>');
		}
	});
});

Template.mainPdfViewerModal.events({
	'click #pdfViewerModal': function () {
		$('#pdfViewerModal').modal('hide');
	}
});


