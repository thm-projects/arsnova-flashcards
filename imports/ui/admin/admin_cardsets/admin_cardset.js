//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../../api/cardsets.js";
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
		return (Session.get('kind') === 'edu' || Session.get('kind') === 'pro');
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
		return (Session.get('kind') === 'free' || Session.get('kind') === 'edu' || Session.get('kind') === 'pro');
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
					tmpl: Template.cardContentFront,
					cellClass: function (value, object) {
						return ('front_' + object._id);
					}
				},
				{
					key: 'back', label: TAPi18n.__('admin.back'), sortable: false,
					tmpl: Template.cardContentBack,
					cellClass: function (value, object) {
						return ('back_' + object._id);
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
	},
	isInWordcloud: function () {
		return this.wordcloud;
	}
});

Template.admin_cardset.events({
	'click #cardsetChangeOwnerAdmin': function (evt, tmpl) {
		let owner = tmpl.find('#editOwnerAdmin').value;
		Meteor.call('changeOwner', this._id, owner, function (error, result) {
			if (error || result === false) {
				$('#cardsetChangeOwnerAdminLabel').css({'visibility': 'visible', 'color': '#b94a48'});
				$('#cardsetChangeOwnerAdminLabel').html(TAPi18n.__('admin.cardset.changeOwnerFailure'));
			} else {
				$('#cardsetChangeOwnerAdminLabel').css({'visibility': 'visible', 'color': '#4ab948'});
				$('#cardsetChangeOwnerAdminLabel').html(TAPi18n.__('admin.cardset.changeOwnerSuccess'));
			}
		});
	},
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
		if (!Meteor.settings.public.university.singleUniversity) {
			if ($('#editCardsetCollegeAdmin').val() === "") {
				$('#editCardsetCollegeLabelAdmin').css('color', '#b94a48');
				$('.editCardsetCollegeDropdownAdmin').css('border-color', '#b94a48');
				$('#helpEditCardsetCollegeAdmin').html(TAPi18n.__('modal-dialog.college_required'));
				$('#helpEditCardsetCollegeAdmin').css('color', '#b94a48');
			}
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
		let name;
		let description;
		let module;
		let moduleShort;
		let moduleNum;
		let college;
		let course;
		let kind;
		let price;
		let visible;
		let license;
		let moduleLink = tmpl.find('#editSetModuleLinkAdmin').value;
		if (moduleLink === undefined) {
			moduleLink = "";
		}
		if (Meteor.settings.public.university.singleUniversity) {
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
				name = tmpl.find('#editCardsetNameAdmin').value;
				description = tmpl.find('#editCardsetDescriptionAdmin').value;
				module = tmpl.find('#editCardsetModuleAdmin').value;
				moduleShort = tmpl.find('#editCardsetModuleShortAdmin').value;
				moduleNum = tmpl.find('#editCardsetModuleNumAdmin').value;
				college = Meteor.settings.public.university.default;
				course = $('#editCardsetCourseAdmin').text();
				kind = tmpl.find('#publishKindAdmin > .active > input').value;
				price = 0;
				visible = true;
				license = [];
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
				Meteor.call("updateCardset", this._id, name, description, module, moduleShort, moduleNum, moduleLink, college, course);
				window.history.go(-1);
			}
		} else {
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
				name = tmpl.find('#editCardsetNameAdmin').value;
				description = tmpl.find('#editCardsetDescriptionAdmin').value;
				module = tmpl.find('#editCardsetModuleAdmin').value;
				moduleShort = tmpl.find('#editCardsetModuleShortAdmin').value;
				moduleNum = tmpl.find('#editCardsetModuleNumAdmin').value;
				college = $('#editCardsetCollegeAdmin').text();
				course = $('#editCardsetCourseAdmin').text();
				kind = tmpl.find('#publishKindAdmin > .active > input').value;
				price = 0;
				visible = true;
				license = [];
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
				Meteor.call("updateCardset", this._id, name, description, module, moduleShort, moduleNum, moduleLink, college, course);
				window.history.go(-1);
			}
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

		if (event.target.className === "deleteCardAdmin btn btn-xs btn-default" || event.target.className === "glyphicon glyphicon-ban-circle") {
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
	},
	'click #cardsetAddToWordcloude': function () {
		Meteor.call('updateWordcloudStatus', this._id, true);
	},
	'click #cardsetRemoveFromWordcloude': function () {
		Meteor.call('updateWordcloudStatus', this._id, false);
	},
	"click #updateLearning": function () {
		let maxCards = $('#inputMaxCards').val();
		let daysBeforeReset = $('#inputDaysBeforeReset').val();
		let learningStart = new Date($('#inputLearningStart').val());
		let learningEnd = new Date($('#inputLearningEnd').val());
		let learningInterval = [];
		for (let i = 0; i < 5; ++i) {
			learningInterval[i] = $('#inputLearningInterval' + (i + 1)).val();
		}
		if (!learningInterval[0]) {
			learningInterval[0] = 1;
		}
		for (let i = 1; i < 5; ++i) {
			if (!learningInterval[i]) {
				learningInterval[i] = (parseInt(learningInterval[i - 1]) + 1);
			}
		}
		Meteor.call("updateLearning", this._id, maxCards, daysBeforeReset, learningStart, learningEnd, learningInterval, function (error, result) {
			if (error) {
				$('#cardsetUpdateLearningLabel').css({'visibility': 'visible', 'color': '#b94a48'});
				$('#cardsetUpdateLearningLabel').html(TAPi18n.__('admin.cardset.updateLearningFailure'));
			}
			if (result) {
				$('#cardsetUpdateLearningLabel').css({'visibility': 'visible', 'color': '#4ab948'});
				$('#cardsetUpdateLearningLabel').html(TAPi18n.__('admin.cardset.updateLearningSuccess'));
			}
		});
	},
	"input #inputMaxCards": function () {
		if (parseInt($('#inputMaxCards').val()) <= 0) {
			$('#inputMaxCards').val(1);
		} else if (parseInt($('#inputMaxCards').val()) > 100) {
			$('#inputMaxCards').val(100);
		}
	},
	"input #inputDaysBeforeReset": function () {
		if (parseInt($('#inputDaysBeforeReset').val()) <= 0) {
			$('#inputDaysBeforeReset').val(1);
		} else if (parseInt($('#inputDaysBeforeReset').val()) > 100) {
			$('#inputDaysBeforeReset').val(100);
		}
	},
	"input #inputLearningInterval1, input #inputLearningInterval2, input #inputLearningInterval3, input #inputLearningInterval4, input #inputLearningInterval5": function () {
		var error = false;
		for (let i = 1; i < 5; ++i) {
			if (parseInt($('#inputLearningInterval' + i).val()) <= 0) {
				$('#inputLearningInterval' + i).val(1);
			} else if (parseInt($('#inputLearningInterval' + i).val()) > 999) {
				$('#inputLearningInterval' + i).val(999);
			}
			if (parseInt($('#inputLearningInterval' + i).val()) > parseInt($('#inputLearningInterval' + (i + 1)).val())) {
				error = true;
			}
		}
		if (error) {
			for (let j = 1; j <= 5; ++j) {
				$('#inputLearningInterval' + j).parent().parent().addClass('has-warning');
				$('#errorInputLearningInterval').html(TAPi18n.__('confirmLearn-form.wrongOrder'));
			}
		} else {
			for (let k = 1; k <= 5; ++k) {
				$('#inputLearningInterval' + k).parent().parent().removeClass('has-warning');
				$('#errorInputLearningInterval').html('');
			}
		}
	}
});

Template.admin_cardset.onRendered(function () {
	Session.set('poolFilterCollege', $('#editCardsetCollegeAdmin').val());
	let cardset = Cardsets.findOne({_id: Router.current().params._id});
	if (cardset.learningActive) {
		let now = cardset.learningStart;
		let end = cardset.learningEnd;
		let today = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
		let tomorrow = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + ((now.getDate() + 1) < 10 ? "0" : "") + (now.getDate() + 1);
		let threeMonths = end.getFullYear() + "-" + ((end.getMonth() + 1) < 10 ? "0" : "") + (end.getMonth() + 1) + "-" + (end.getDate() < 10 ? "0" : "") + end.getDate();
		document.getElementById('inputLearningStart').setAttribute("min", today);
		document.getElementById('inputLearningStart').setAttribute("max", threeMonths);
		$('#inputLearningStart').val(today);
		document.getElementById('inputLearningEnd').setAttribute("min", tomorrow);
		$('#inputLearningEnd').val(threeMonths);
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
