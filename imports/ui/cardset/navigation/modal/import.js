//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {BertAlertVisuals} from "../../../../api/bertAlertVisuals";
import {ReactiveVar} from "meteor/reactive-var";
import "./import.html";

Session.setDefault('importType', 1);
/*
 * ############################################################################
 * cardsetImportForm
 * ############################################################################
 */

Template.cardsetImportForm.onCreated(function () {
	Template.instance().uploading = new ReactiveVar(false);
});

Template.cardsetImportForm.onRendered(function () {
	$('#importModal').on('hidden.bs.modal', function () {
		$('#uploadError').html('');
	});
});

Template.cardsetImportForm.helpers({
	uploading: function () {
		return Template.instance().uploading.get();
	},
	importType: function (importType) {
		return Session.get('importType') === importType;
	}
});

Template.cardsetImportForm.events({
	"click #importType1": function () {
		Session.set('importType', 1);
	},
	"click #importType2": function () {
		Session.set('importType', 2);
	},
	'change [name="uploadFile"]': function (evt, tmpl) {
		tmpl.uploading.set(true);
		let cardset_id = Template.parentData(1)._id;
		let importType = Session.get('importType');
		if (importType === 1) {
			if (evt.target.files[0].name.match(/\.(json)$/)) {
				var reader = new FileReader();
				reader.onload = function () {
					try {
						let res;
						if (this.result.charAt(0) === '[' && this.result.charAt(this.result.length - 1) === ']') {
							res = $.parseJSON(this.result);
						} else {
							res = $.parseJSON('[' + this.result + ']');
						}
						Meteor.call('importCards', res, cardset_id, Number(importType), function (error) {
							if (error) {
								tmpl.uploading.set(false);
								BertAlertVisuals.displayBertAlert(TAPi18n.__('import.failure'), 'danger', 'growl-top-left');
							} else {
								tmpl.uploading.set(false);
								Session.set('activeCard', undefined);
								BertAlertVisuals.displayBertAlert(TAPi18n.__('import.success.cards'), 'success', 'growl-top-left');
								$('#importModal').modal('toggle');
							}
						});
					} catch (e) {
						tmpl.uploading.set(false);
						BertAlertVisuals.displayBertAlert(TAPi18n.__('import.failure'), 'danger', 'growl-top-left');
					}
				};
				reader.readAsText(evt.target.files[0]);
			} else if (evt.target.files[0].name.match(/\.(csv)$/)) {
				Papa.parse(evt.target.files[0], {
					header: true,
					complete: function (results) {
						Meteor.call('importCards', results.data, cardset_id, Number(importType), function (error) {
							if (error) {
								tmpl.uploading.set(false);
								BertAlertVisuals.displayBertAlert(TAPi18n.__('import.failure'), 'danger', 'growl-top-left');
							} else {
								tmpl.uploading.set(false);
								BertAlertVisuals.displayBertAlert(TAPi18n.__('import.success.cards'), 'success', 'growl-top-left');
								$('#importModal').modal('toggle');
							}
						});
					}
				});
			} else {
				tmpl.uploading.set(false);
				$('#uploadError').html('<br><div class="alert alert-danger" role="alert">' + TAPi18n.__('upload-form.wrong-file') + '</div>');
			}
		} else {
			tmpl.uploading.set(false);
			$('#importModal').modal('toggle');
		}
	}
});
