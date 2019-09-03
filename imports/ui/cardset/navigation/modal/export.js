//------------------------ Export
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {BertAlertVisuals} from "../../../../api/bertAlertVisuals";
import {MarkdeepContent} from "../../../../api/markdeep";
import {Cards} from "../../../../api/cards";
import {CardType} from "../../../../api/cardTypes";
import "./export.html";

Session.setDefault('exportType', 1);
Session.set('exportedCardSides', []);
/*
 * ############################################################################
 * cardsetExportForm
 * ############################################################################
 */

Template.cardsetExportForm.onRendered(function () {
	$('#exportModal').on('hidden.bs.modal', function () {
		$('#uploadError').html('');
		Session.set('exportType', 1);
	});
});

Template.cardsetExportForm.helpers({
	uploading: function () {
		return Template.instance().uploading.get();
	},
	exportType: function (exportType) {
		return Session.get('exportType') === exportType;
	},
	gotCardSidesSelected: function () {
		if (Session.get('exportType') === 2) {
			let settings = Session.get('exportedCardSides');
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
		Meteor.call('exportCards', this._id, function (error, result) {
			if (error) {
				BertAlertVisuals.displayBertAlert(TAPi18n.__('export.cards.failure'), 'danger', 'growl-top-left');
			} else {
				if (Session.get('exportType') === 1) {
					let exportData = new Blob([result], {
						type: "application/json"
					});
					saveAs(exportData, TAPi18n.__('export.filename.export') + "_" + TAPi18n.__('export.filename.cards') + "_" + name + moment().format('_YYYY_MM_DD') + ".json");
				} else {
					let settings = Session.get('exportedCardSides');
					let whitelist = [];
					for (let i = 0; i < settings.length; i++) {
						whitelist.push(settings[i].contentId);
					}
					let exportData = new Blob([MarkdeepContent.exportContent(JSON.parse(result), Session.get('activeCardset'), whitelist)], {
						type: "text/html"
					});
					saveAs(exportData, TAPi18n.__('export.filename.export') + "_" + TAPi18n.__('export.filename.cards') + "_" + name + moment().format('_YYYY_MM_DD') + ".md.html");
				}
			}
		});
	}
});

/*
 * ############################################################################
 * cardsetExportForm
 * ############################################################################
 */

Template.cardsetExportFormSideTable.onCreated(function () {
	let cards = Cards.find({cardset_id: Router.current().params._id}, {fields: {front: 1, back: 1, hint: 1, lecture: 1, top: 1, bottom: 1}}).fetch();
	let cardSides = CardType.getCardTypeCubeSides(Session.get('activeCardset').cardType);
	let settings = [];
	for (let i = 0; i < cardSides.length; i++) {
		let count = 0;
		for (let c = 0; c < cards.length; c++) {
			if (cards[c][CardType.getContentIDTranslation(cardSides[i].contentId)] !== undefined && cards[c][CardType.getContentIDTranslation(cardSides[i].contentId)].trim().length > 0) {
				count++;
			}
		}
		let active = true;
		if (count === 0) {
			active = false;
		}
		let newSetting = {
			active: active,
			contentId: cardSides[i].contentId,
			count: count
		};
		settings.push(newSetting);
	}
	Session.set('exportedCardSides', settings);
});

Template.cardsetExportFormSideTable.helpers({
	getCardSides: function () {
		return CardType.getCardTypeCubeSides(Session.get('activeCardset').cardType);
	},
	getCardSideName: function (cardSide) {
		return TAPi18n.__('card.cardType' + Session.get('activeCardset').cardType + '.content' + cardSide.contentId);
	},
	getCount: function (contentId) {
		let settings = Session.get('exportedCardSides');
		for (let i = 0; i < settings.length; i++) {
			if (settings[i].contentId === contentId) {
				return settings[i].count;
			}
		}
	},
	canBeSelected: function (contentId) {
		let settings = Session.get('exportedCardSides');
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
		let settings = Session.get('exportedCardSides');
		for (let i = 0; i < settings.length; i++) {
			if (settings[i].contentId === contentId) {
				settings[i].active = !settings[i].active;
				break;
			}
		}
		Session.set('exportedCardSides', settings);
	}
});
