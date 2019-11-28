//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import "./license.html";

/*
 * ############################################################################
 * selectLicenseForm
 * ############################################################################
 */

Template.selectLicenseForm.onRendered(function () {
	$('#selectLicenseModal').on('hidden.bs.modal', function () {
		var cardset = Cardsets.findOne(Router.current().params._id);
		var license = cardset.license;

		$('#cc-modules > label').removeClass('active');
		$('#modulesLabel').css('color', '');
		$('#helpCC-modules').html('');

		if (license.includes('by')) {
			$('#cc-option0').addClass('active');
		}
		if (license.includes('nc')) {
			$('#cc-option1').addClass('active');
		}
		if (license.includes('nd')) {
			$('#cc-option2').addClass('active');
		}
		if (license.includes('sa')) {
			$('#cc-option3').addClass('active');
		}
	});
});

Template.selectLicenseForm.events({
	'click #licenseSave': function () {
		if ($("#cc-option2").hasClass('active') && $("#cc-option3").hasClass('active') || $("#cc-modules").children().hasClass('active') && !($("#cc-option0").hasClass('active'))) {
			$('#modulesLabel').css('color', '#b94a48');
			$('#helpCC-modules').html(TAPi18n.__('modal-dialog.wrongCombination'));
			$('#helpCC-modules').css('color', '#b94a48');
		} else {
			var license = [];

			if ($("#cc-option0").hasClass('active')) {
				license.push("by");
			}
			if ($("#cc-option1").hasClass('active')) {
				license.push("nc");
			}
			if ($("#cc-option2").hasClass('active')) {
				license.push("nd");
			}
			if ($("#cc-option3").hasClass('active')) {
				license.push("sa");
			}

			Meteor.call('updateLicense', this._id, license);
			$('#selectLicenseModal').modal('hide');
		}
	},
	'change #cc-modules': function () {
		$('#modulesLabel').css('color', '');
		$('#helpCC-modules').html('');
	}
});

Template.selectLicenseForm.helpers({
	licenseIsActive: function (license) {
		var cardset = Cardsets.findOne(Router.current().params._id);
		if (cardset !== undefined) {
			var licenses = cardset.license;

			if (licenses.includes(license)) {
				return true;
			}
		} else {
			return null;
		}
	}
});
