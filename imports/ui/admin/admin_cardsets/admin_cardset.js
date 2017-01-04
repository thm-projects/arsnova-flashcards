//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cards} from "../../../api/cards.js";
import "./admin_cardset.html";

/*
 * ############################################################################
 * admin_cardset
 * ############################################################################
 */

Template.admin_cardset.onDestroyed(function () {
	Session.set('kind', undefined);
});

Template.admin_cardset.helpers({
	kindIsActive: function (kind) {
		var sessionKind = Session.get('kind');

		if (sessionKind === undefined) {
			Session.set('kind', this.kind);
		}
		return kind === this.kind;
	},
	kindWithPrice: function () {
		if (Session.get('kind') === 'edu' || Session.get('kind') === 'pro') {
			return true;
		} else {
			return false;
		}
	},
	priceIsSelected: function (price) {
		return price === this.price ? 'selected' : '';
	},
	licenseIsActive: function (license) {
		if (this.license !== undefined) {
			if (this.license.includes(license)) {
				return true;
			}
		} else {
			return null;
		}
	},
	isPublished: function () {
		if (Session.get('kind') === 'free' || Session.get('kind') === 'edu' || Session.get('kind') === 'pro') {
			return true;
		} else {
			return false;
		}
	},
	cardListCardsetAdmin: function () {
		return Cards.find({cardset_id: this._id});
	},
	tableSettings: function () {
		return {
			rowsPerPage: 5,
			showNavigationRowsPerPage: false,
			fields: [
				{
					key: 'front', label: TAPi18n.__('admin.front'), sortable: false,
					cellClass: function (value, object) {
						var css = 'front_' + object._id;
						return css;
					},
					fn: function (front, object) {
						Meteor.promise("convertMarkdown", front)
							.then(function (html) {
								$(".front_" + object._id).html(html);
							});
					}
				},
				{
					key: 'back', label: TAPi18n.__('admin.back'), sortable: false,
					cellClass: function (value, object) {
						var css = 'back_' + object._id;
						return css;
					},
					fn: function (front, object) {
						Meteor.promise("convertMarkdown", front)
							.then(function (html) {
								$(".back_" + object._id).html(html);
							});
					}
				},
				{
					key: '_id',
					label: TAPi18n.__('admin.edit'),
					sortable: false,
					cellClass: 'edit',
					fn: function (value) {
						return new Spacebars.SafeString("<a id='linkToAdminCardsetCard' class='editCardAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.editcard') + "' data-cardid='" + value + "'><i class='glyphicon glyphicon-pencil'></i></a>");
					}
				},
				{
					key: 'delete', label: TAPi18n.__('admin.delete'), sortable: false, fn: function () {
						return new Spacebars.SafeString("<a class='deleteCardAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deletecard') + "' data-toggle='modal' data-target='#cardConfirmModalCardsetAdmin'><i class='glyphicon glyphicon-ban-circle'></i></a>");
					}
				}
			]
		};
	}
});

Template.admin_cardset.events({
	'change #publishKindAdmin': function (evt, tmpl) {
		var kind = tmpl.find('#publishKindAdmin > .active > input').value;
		Session.set('kind', kind);
	},
	'click #cardsetSaveAdmin ': function (evt, tmpl) {
		if ($('#editCardsetNameAdmin').val() === "") {
			$('#editCardsetNameLabelAdmin').css('color', '#b94a48');
			$('#editCardsetNameAdmin').css('border-color', '#b94a48');
			$('#helpEditCardsetNameAdmin').html(TAPi18n.__('admin.cardset.name_required'));
			$('#helpEditCardsetNameAdmin').css('color', '#b94a48');
		}
		if ($('#editCardsetDescriptionAdmin').val() === "") {
			$('#editCardsetDescriptionLabelAdmin').css('color', '#b94a48');
			$('#editCardsetDescriptionAdmin').css('border-color', '#b94a48');
			$('#helpEditCardsetDescriptionAdmin').html(TAPi18n.__('admin.cardset.description_required'));
			$('#helpEditCardsetDescriptionAdmin').css('color', '#b94a48');
		}
		if ($('#editCardsetModuleAdmin').val() === "") {
			$('#editCardsetModuleLabelAdmin').css('color', '#b94a48');
			$('#editCardsetModuleAdmin').css('border-color', '#b94a48');
			$('#helpEditCardsetModuleAdmin').html(TAPi18n.__('modal-dialog.module_required'));
			$('#helpEditCardsetModuleAdmin').css('color', '#b94a48');
		}
		if ($('#editCardsetModuleShortAdmin').val() === "") {
			$('#editCardsetModuleShortLabelAdmin').css('color', '#b94a48');
			$('#editCardsetModuleShortAdmin').css('border-color', '#b94a48');
			$('#helpEditCardsetModuleShortAdmin').html(TAPi18n.__('modal-dialog.moduleShort_required'));
			$('#helpEditCardsetModuleShortAdmin').css('color', '#b94a48');
		}
		if ($('#editCardsetModuleNumAdmin').val() === "") {
			$('#editCardsetModuleNumLabelAdmin').css('color', '#b94a48');
			$('#editCardsetModuleNumAdmin').css('border-color', '#b94a48');
			$('#helpEditCardsetModuleNumAdmin').html(TAPi18n.__('modal-dialog.moduleNum_required'));
			$('#helpEditCardsetModuleNumAdmin').css('color', '#b94a48');
		}
		if ($('#editCardsetCollegeAdmin').val() === "") {
			$('#editCardsetCollegeLabelAdmin').css('color', '#b94a48');
			$('.editCardsetCollegeDropdownAdmin').css('border-color', '#b94a48');
			$('#helpEditCardsetCollegeAdmin').html(TAPi18n.__('modal-dialog.college_required'));
			$('#helpEditCardsetCollegeAdmin').css('color', '#b94a48');
		}
		if ($('#editCardsetCourseAdmin').val() === "") {
			$('#editCardsetCourseLabelAdmin').css('color', '#b94a48');
			$('.editCardsetCourseDropdownAdmin').css('border-color', '#b94a48');
			$('#helpEditCardsetCourseAdmin').html(TAPi18n.__('modal-dialog.course_required'));
			$('#helpEditCardsetCourseAdmin').css('color', '#b94a48');
		}
		if (($("#kindoption1Admin").hasClass('active') || $("#kindoption2Admin").hasClass('active') || $("#kindoption3Admin").hasClass('active')) && this.quantity < 5) {
			$('#editCardsetKindLabelAdmin').css('color', '#b94a48');
			$('#helpEditCardsetKindAdmin').html(TAPi18n.__('admin.cardset.noCards'));
			$('#helpEditCardsetKindAdmin').css('color', '#b94a48');
		}
		if ($("#cc-modules-admin").length && $("#cc-option2-admin").hasClass('active') && $("#cc-option3-admin").hasClass('active') || //checks if cc-modules-admin is !empty and if cc-option-2 and 3-admin are active
			$("#cc-modules-admin").children().hasClass('active') && !($("#cc-option0-admin").hasClass('active'))) { //or if the children of cc-modules-admin and option-0 are active
			$('#editCardsetLicenseLabelAdmin').css('color', '#b94a48');
			$('#helpCC-modules-admin').html(TAPi18n.__('admin.cardset.wrongCombination'));
			$('#helpCC-modules-admin').css('color', '#b94a48');
		}
		if ($('#editCardsetNameAdmin').val() !== "" &&
			$('#editCardsetDescriptionAdmin').val() !== "" &&
			$('#editCardsetModuleAdmin').val() !== "" &&
			$('#editCardsetModuleShortAdmin').val() !== "" &&
			$('#editCardsetModuleNumAdmin').val() !== "" &&
			$('#editCardsetCollegeAdmin').val() !== "" &&
			$('#editCardsetCourseAdmin').val() !== "" &&
			($("#kindoption0Admin").hasClass('active') ||
			($("#kindoption1Admin").hasClass('active') ||
			$("#kindoption2Admin").hasClass('active') ||
			$("#kindoption3Admin").hasClass('active')) &&
			this.quantity >= 5)) {
			var name = tmpl.find('#editCardsetNameAdmin').value;
			var description = tmpl.find('#editCardsetDescriptionAdmin').value;
			var module = tmpl.find('#editCardsetModuleAdmin').value;
			var moduleShort = tmpl.find('#editCardsetModuleShortAdmin').value;
			var moduleNum = tmpl.find('#editCardsetModuleNumAdmin').value;
			var college = $('#editCardsetCollegeAdmin').text();
			var course = $('#editCardsetCourseAdmin').text();

			var kind = tmpl.find('#publishKindAdmin > .active > input').value;
			var price = 0;
			var visible = true;
			var license = [];

			if (("#cc-modules-admin").length) {
				if ($("#cc-option0-admin").hasClass('active')) {
					license.push("by");
				}
				if ($("#cc-option1-admin").hasClass('active')) {
					license.push("nc");
				}
				if ($("#cc-option2-admin").hasClass('active')) {
					license.push("nd");
				}
				if ($("#cc-option3-admin").hasClass('active')) {
					license.push("sa");
				}
			}

			Meteor.call('updateLicense', this._id, license);

			if (kind === 'edu' || kind === 'pro') {
				if (tmpl.find('#publishPriceAdmin') !== null) {
					price = tmpl.find('#publishPriceAdmin').value;
				} else {
					price = this.price;
				}
			}
			if (kind === 'personal') {
				visible = false;
			}
			Meteor.call("publishCardset", this._id, kind, price, visible);
			Meteor.call("updateCardset", this._id, name, description, module, moduleShort, moduleNum, college, course);
			window.history.go(-1);
		}
	},
	'click #cardsetCancelAdmin': function () {
		window.history.go(-1);
	},
	'click #cardsetDeleteAdmin': function () {
		$("#cardsetDeleteAdmin").css('display', "none");
		$("#cardsetConfirmAdmin").css('display', "");
	},
	'click #cardsetConfirmAdmin': function () {
		var id = this._id;
		Meteor.call("deleteCardset", id);
		window.history.go(-1);
	},
	'click .reactive-table tbody tr': function (event) {
		event.preventDefault();
		var card = this;

		if (event.target.className == "deleteCardAdmin btn btn-xs btn-default" || event.target.className == "glyphicon glyphicon-ban-circle") {
			Session.set('cardId', card._id);
		}
	},
	'click #linkToAdminCardsetCard': function (event) {
		var cardid = $(event.currentTarget).data("cardid");
		Router.go('adminCard', {_id: cardid});
	},
	'keyup #editCardsetNameAdmin': function () {
		$('#editCardsetNameLabelAdmin').css('color', '');
		$('#editCardsetNameAdmin').css('border-color', '');
		$('#helpEditCardsetNameAdmin').html('');
	},
	'keyup #editCardsetDescriptionAdmin': function () {
		$('#editCardsetDescriptionLabelAdmin').css('color', '');
		$('#editCardsetDescriptionAdmin').css('border-color', '');
		$('#helpEditCardsetDescriptionAdmin').html('');
	},
	'change #cc-modules-admin': function () {
		$('#editCardsetLicenseLabelAdmin').css('color', '');
		$('#helpCC-modules-admin').html('');
	},
	'click #publishKindAdmin': function () {
		$('#editCardsetKindLabelAdmin').css('color', '');
		$('#helpEditCardsetKindAdmin').html('');
	},
	'keyup #editCardsetModuleAdmin': function () {
		$('#editCardsetModuleLabelAdmin').css('color', '');
		$('#editCardsetModuleAdmin').css('border-color', '');
		$('#helpEditCardsetModuleAdmin').html('');
	},
	'keyup #editCardsetModuleShortAdmin': function () {
		$('#editCardsetModuleShortLabelAdmin').css('color', '');
		$('#editCardsetModuleShortAdmin').css('border-color', '');
		$('#helpEditCardsetModuleShortAdmin').html('');
	},
	'keyup #editCardsetModuleNumAdmin': function () {
		$('#editCardsetModuleNumLabelAdmin').css('color', '');
		$('#editCardsetModuleNumAdmin').css('border-color', '');
		$('#helpEditCardsetModuleNumAdmin').html('');
	},
	'click .collegeAdmin': function (evt) {
		var collegeName = $(evt.currentTarget).attr("data");
		$('#editCardsetCollegeAdmin').html(collegeName);
		$('#editCardsetCollegeAdmin').val(collegeName);
		Session.set('poolFilterCollege', collegeName);
		$('#editCardsetCollegeLabelAdmin').css('color', '');
		$('.editCardsetCollegeDropdownAdmin').css('border-color', '');
		$('#helpEditCardsetCollegeAdmin').html('');
		$('#editCardsetCourseAdmin').html(TAPi18n.__('modal-dialog.course_required'));
		$('#editCardsetCourseAdmin').val("");
	},
	'click .courseAdmin': function (evt) {
		var courseName = ($(evt.currentTarget).attr("data"));
		$('#editCardsetCourseAdmin').html(courseName);
		$('#editCardsetCourseAdmin').val(courseName);
		$('#editCardsetCourseLabelAdmin').css('color', '');
		$('.editCardsetCourseDropdownAdmin').css('border-color', '');
		$('#helpEditCardsetCourseAdmin').html('');
	}
});

/*
 * ############################################################################
 * cardConfirmFormCardsetAdmin
 * ############################################################################
 */

Template.cardConfirmFormCardsetAdmin.events({
	'click #cardDeleteCardsetAdmin': function () {
		var id = Session.get('cardId');

		$('#cardConfirmModalCardsetAdmin').on('hidden.bs.modal', function () {
			Meteor.call("deleteCardAdmin", id);
		}).modal('hide');
	}
});

/*
 * ############################################################################
 * cardFormOnRendered
 * ############################################################################
 */

Template.admin_cardset.onRendered(function () {
	Session.set('poolFilterCollege', $('#editCardsetCollegeAdmin').val());
});
