import {Session} from "meteor/session";
import {Profile} from "../../../../api/profile";
import {SweetAlertMessages} from "../../../../api/sweetAlert";
import {BertAlertVisuals} from "../../../../api/bertAlertVisuals";
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import "./importCardsetButton.html";

/*
 * ############################################################################
 * filterItemImportCardsetButton
 * ############################################################################
 */

Template.filterItemImportCardsetButton.helpers({
	isProfileComplete: function () {
		return Profile.isCompleted();
	}
});

Template.filterItemImportCardsetButton.events({
	'click #importCardsetCompleteProfile': function () {
		SweetAlertMessages.completeProfile();
	},
	'change #importCardset': function (evt) {
		if (Session.get('importCards') === undefined) {
			if (evt.target.files[0].name.match(/\.(json)$/)) {
				let reader = new FileReader();
				reader.onload = function () {
					let res;
					if (this.result.charAt(0) === '[' && this.result.charAt(this.result.length - 1) === ']') {
						res = $.parseJSON(this.result);
					} else {
						res = $.parseJSON('[' + this.result + ']');
					}
					let isCardset = true;
					if (res[0] === undefined) {
						BertAlertVisuals.displayBertAlert(TAPi18n.__('import.failure'), 'danger', 'growl-top-left');
					}
					if (!res[0].name) {
						Session.set('importCards', res);
						$("#newCardSet").click();
						isCardset = false;
					}
					if (isCardset) {
						Meteor.call('importCardset', res, function (error, result) {
							if (error) {
								BertAlertVisuals.displayBertAlert(TAPi18n.__('import.failure'), 'danger', 'growl-top-left');
							}
							if (result) {
								BertAlertVisuals.displayBertAlert(TAPi18n.__('import.success.cardset'), 'success', 'growl-top-left');
								Router.go('cardsetdetailsid', {
									_id: result
								});
							}
						});
					}
				};
				reader.readAsText(evt.target.files[0]);
			} else {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('import.wrongFormat.cardset'), 'danger', 'growl-top-left');
			}
		}
	}
});
