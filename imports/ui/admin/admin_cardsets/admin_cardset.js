//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../../api/cardsets.js";
import {Cards} from "../../../api/cards.js";
import "./admin_cardset.html";
import {saveCardset} from "../../forms/cardsetForm.js";

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
		if (saveCardset() || ($("#kindoption0Admin").hasClass('active') ||
				($("#kindoption1Admin").hasClass('active') ||
					$("#kindoption2Admin").hasClass('active') ||
					$("#kindoption3Admin").hasClass('active')) &&
				this.quantity >= 5)) {
			let kind = tmpl.find('#publishKindAdmin > .active > input').value;
			let price = 0;
			let visible = true;
			let license = [];
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

		if (event.target.className === "deleteCardAdmin btn btn-xs btn-default" || event.target.className === "glyphicon glyphicon-ban-circle") {
			Session.set('cardId', card._id);
		}
	},
	'click #linkToAdminCardsetCard': function (event) {
		var cardid = $(event.currentTarget).data("cardid");
		Router.go('adminCard', {_id: cardid});
	},
	'click #publishKindAdmin': function () {
		$('#editCardsetKindLabelAdmin').css('color', '');
		$('#helpEditCardsetKindAdmin').html('');
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
	Session.set('moduleActive', cardset.moduleActive);
	if (cardset.learningActive) {
		let start = moment(cardset.learningStart).format("YYYY-MM-DD");
		let nextDay = moment(cardset.learningStart).add(1, 'day').format("YYYY-MM-DD");
		let end = moment(cardset.learningEnd).format("YYYY-MM-DD");
		document.getElementById('inputLearningStart').setAttribute("min", start);
		document.getElementById('inputLearningStart').setAttribute("max", end);
		$('#inputLearningStart').val(start);
		document.getElementById('inputLearningEnd').setAttribute("min", nextDay);
		$('#inputLearningEnd').val(end);
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
