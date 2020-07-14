//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import "./license.html";
import {Session} from "meteor/session";

function cleanUp() {
	let cardset = Session.get('activeCardset');
	let license = cardset.license;

	$('#cc-modules > label').removeClass('active');
	$('#modulesLabel').css('color', '');
	$('#helpCC-modules').html('');

	if (license.includes('by')) {
		$('#cc-option0').addClass('active');
	} else {
		$('#cc-option0').removeClass('active');
	}
	if (license.includes('nc')) {
		$('#cc-option1').addClass('active');
	} else {
		$('#cc-option1').removeClass('active');
	}
	if (license.includes('nd')) {
		$('#cc-option2').addClass('active');
	} else {
		$('#cc-option2').removeClass('active');
	}
	if (license.includes('sa')) {
		$('#cc-option3').addClass('active');
	} else {
		$('#cc-option3').removeClass('active');
	}
}

/*
 * ############################################################################
 * selectLicenseForm
 * ############################################################################
 */

Template.selectLicenseForm.onRendered(function () {
	$('#selectLicenseModal').on('hidden.bs.modal', function () {
		cleanUp();
	});
	$('#selectLicenseModal').on('show.bs.modal', function () {
		cleanUp();
	});
});

Template.selectLicenseForm.helpers({
	getCardsetTitle: function () {
		if (Session.get('activeCardset') !== undefined) {
			return Session.get('activeCardset').name;
		}
	}
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

			Meteor.call('updateLicense', Session.get('activeCardset')._id, license);
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
		var cardset = Session.get('activeCardset');
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
