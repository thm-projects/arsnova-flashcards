import "./pdfViewer.html";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {PDFViewer} from "../../../util/pdfViewer";

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
	$('#pdfViewerModal').on('show.bs.modal', function () {
		if (Session.get('activePDF')) {
			$('#pdfViewerModal .modal-dialog').html('<iframe id="pdfViewer" width="' + PDFViewer.getIframeWidth() + 'px" height="' + PDFViewer.getIframeHeight() + 'px" frameborder="0" src="' + PDFViewer.getViewerLink() + Session.get('activePDF') + '"></iframe>');
		}
	});
});

Template.mainPdfViewerModal.events({
	'click #pdfViewerModal': function () {
		PDFViewer.closeModal();
	}
});


