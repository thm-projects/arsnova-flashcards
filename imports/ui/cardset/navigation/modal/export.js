//------------------------ Export
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {ReactiveDict} from 'meteor/reactive-dict';
import {BertAlertVisuals} from "../../../../util/bertAlertVisuals";
import {MarkdeepContent} from "../../../../util/markdeep";
import {CardType} from "../../../../util/cardTypes";
import "./export.html";

Session.setDefault('exportType', 2);
let cardMetaData = new ReactiveDict();

function getMetaDataArray() {
	return Object.values(cardMetaData.all());
}

/*
 * ############################################################################
 * cardsetExportForm
 * ############################################################################
 */

Template.cardsetExportForm.onRendered(function () {
	$('#exportModal').on('show.bs.modal', function () {
		Meteor.call('getCardMetaData', Session.get('activeCardset')._id, function (err, res) {
			if (res) {
				cardMetaData.set(res);
			}
		});
	});
	$('#exportModal').on('hidden.bs.modal', function () {
		$('#uploadError').html('');
		Session.set('exportType', 2);
		cardMetaData.clear();
	});
});

Template.cardsetExportForm.helpers({
	gotMetaData: function () {
		return getMetaDataArray().length;
	},
	getActiveCardsetName: function () {
		if (Session.get('activeCardset') !== undefined) {
			return Session.get('activeCardset').name;
		} else {
			return '';
		}
	},
	uploading: function () {
		return Template.instance().uploading.get();
	},
	exportType: function (exportType) {
		return Session.get('exportType') === exportType;
	},
	gotCardSidesSelected: function () {
		if (Session.get('exportType') === 2) {
			let settings = getMetaDataArray();
			for (let i = 0; i < settings.length; i++) {
				if (settings[i].active === true && settings[i].count > 0) {
					return true;
				}
			}
		} else {
			return true;
		}
	}
});

Template.cardsetExportForm.events({
	"click #exportType1": function () {
		Session.set('exportType', 1);
	},
	"click #exportType2": function () {
		Session.set('exportType', 2);
	},
	'click #exportCardsBtn': function () {
		let name = this.name;
		if (Session.get('exportType') === 1) {
			Meteor.call('exportCardset', Session.get('activeCardset')._id, function (error, result) {
				if (error) {
					BertAlertVisuals.displayBertAlert(TAPi18n.__('export.failure.cardset'), 'danger', 'growl-top-left');
				} else {
					let exportData = new Blob([result], {
						type: "application/json"
					});
					saveAs(exportData, TAPi18n.__('export.filename.export') + "_" + TAPi18n.__('export.filename.cardset') + "_" + name + moment().format('_YYYY_MM_DD') + ".json");
				}
			});
		} else {
			Meteor.call('exportCards', Session.get('activeCardset')._id, function (error, result) {
				if (error) {
					BertAlertVisuals.displayBertAlert(TAPi18n.__('export.cards.failure'), 'danger', 'growl-top-left');
				} else {
					let settings = getMetaDataArray();
					let whitelist = [];
					for (let i = 0; i < settings.length; i++) {
						if (settings[i].active === true && settings[i].count > 0) {
							whitelist.push(settings[i].contentId);
						}
					}
					let exportData = new Blob([MarkdeepContent.exportContent(JSON.parse(result), Session.get('activeCardset'), whitelist)], {
						type: "text/html"
					});
					saveAs(exportData, TAPi18n.__('export.filename.export') + "_" + TAPi18n.__('export.filename.cards') + "_" + name + moment().format('_YYYY_MM_DD') + ".md.html");
				}
			});
		}
	}
});

/*
 * ############################################################################
 * cardsetExportForm
 * ############################################################################
 */

Template.cardsetExportFormSideTable.helpers({
	gotActiveCardset: function () {
		return Session.get('activeCardset') !== undefined;
	},
	getCardSides: function () {
		return CardType.getCardTypeCubeSides(Session.get('activeCardset').cardType);
	},
	getCardSideName: function (cardSide) {
		return TAPi18n.__('card.cardType' + Session.get('activeCardset').cardType + '.content' + cardSide.contentId);
	},
	getCount: function (contentId) {
		let settings = getMetaDataArray();
		for (let i = 0; i < settings.length; i++) {
			if (settings[i].contentId === contentId) {
				return settings[i].count;
			}
		}
	},
	canBeSelected: function (contentId) {
		let settings = getMetaDataArray();
		for (let i = 0; i < settings.length; i++) {
			if (settings[i].contentId === contentId && settings[i].count > 0) {
				return "checked";
			}
		}
		return "disabled";
	},
	getSideType: function (cardSide) {
		let learningModes = CardType.getCardTypesWithLearningModes();
		if (!learningModes.includes(Session.get('activeCardset').cardType)) {
			return TAPi18n.__('download-form.card-sides-table.body.type.misc');
		}
		if (cardSide.isAnswer !== undefined && cardSide.isAnswer === true) {
			if (cardSide.isAnswerFocus) {
				return TAPi18n.__('download-form.card-sides-table.body.type.main-answer');
			} else {
				return TAPi18n.__('download-form.card-sides-table.body.type.answer');
			}
		} else {
			return TAPi18n.__('download-form.card-sides-table.body.type.question');
		}
	}
});

Template.cardsetExportFormSideTable.events({
	"click .exportCardSide": function (event) {
		let contentId = $(event.currentTarget).data('id');
		let settings = getMetaDataArray();
		for (let i = 0; i < settings.length; i++) {
			if (settings[i].contentId === contentId) {
				settings[i].active = !settings[i].active;
				break;
			}
		}
		cardMetaData.set(settings);
	}
});
