import "./setTitle.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {BertAlertVisuals} from "../../../../../../api/bertAlertVisuals";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

/*
 * ############################################################################
 * cardsetIndexTranscriptSettingsModalSetTitle
 * ############################################################################
 */

Template.cardsetIndexTranscriptSettingsModalSetTitle.helpers({
	getTranscriptLectures: function () {
		return Session.get('transcriptBonusTempLectures');
	}
});

Template.cardsetIndexTranscriptSettingsModalSetTitle.events({
	'input .transcript-lecture-title': function (event) {
		let lectures = Session.get('transcriptBonusTempLectures');
		lectures[$(event.currentTarget).data('id')].title = event.currentTarget.value;
		Session.set('transcriptBonusTempLectures', lectures);
	},
	'click #reset': function () {
		Session.set('transcriptBonusTempLectures', Session.get('transcriptBonusLectures').map(a => Object.assign({}, a)));
	},
	'click #save': function () {
		Session.set('transcriptBonusLectures', Session.get('transcriptBonusTempLectures').map(a => Object.assign({}, a)));
		Meteor.call('updateCardsetTranscriptBonusLectures', FlowRouter.getParam('_id'), Session.get('transcriptBonusLectures'), function (error, result) {
			if (result) {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('transcriptForm.bonus.form.alert.save'), "success", 'growl-top-left');
				$('#cardsetIndexTranscriptSettingsModalSetTitle').modal('hide');
			}
		});
	}
});
