import {MeteorMathJax} from 'meteor/mrt:mathjax';
import "/client/thirdParty/markdeep/markdeep.min.js";
import * as config from "../config/markdeep.js";
import * as exportConfig from "../config/markdeepExport.js";
import {CardType} from "./cardTypes";
import {getAuthorName, getOriginalAuthorName} from "./userData";
import {Utilities} from "./utilities";
import {CardsetVisuals} from "./cardsetVisuals";
import {ServerStyle} from "./styles";
import {MarkdeepContent} from "./markdeep";

let linebreak = "\n";
let newline = " \n\n";
let tableColumn = "|";
let cardCounter = 0;

MeteorMathJax.sourceUrl = config.MathJaxSourceUrl;
MeteorMathJax.defaultConfig = config.defaultMathJaxConfig;

export let MarkdeepExport = class MarkdeepExport {
	static createCardContent (cards, cardset, whitelist) {
		let sideOrder = CardType.getCardTypeCubeSides(cardset.cardType);
		let filteredSides = [];
		for (let i = 0; i < sideOrder.length; i++) {
			if (whitelist.includes(sideOrder[i].contentId)) {
				filteredSides.push(sideOrder[i]);
			}
		}
		let totalCardsideCount = CardType.getCardTypeCubeSides(cardset.cardType).length;
		let lastCardSubject = '';
		let duplicateSubjectNumber = 2;
		let content = '';
		for (let i = 0; i < cards.length; i++) {
			let availableSides = [];
			for (let s = 0; s < filteredSides.length; s++) {
				let sideContent = cards[i][CardType.getContentIDTranslation(filteredSides[s].contentId)];
				if (sideContent !== undefined && sideContent.trim().length > 0) {
					let sideContentData = {
						content: sideContent,
						contentId: filteredSides[s].contentId
					};
					availableSides.push(sideContentData);
				}
			}
			if (availableSides.length) {
				let duplicateSubjectMarker;
				if (lastCardSubject === cards[i].subject) {
					duplicateSubjectMarker = ` (${duplicateSubjectNumber++})`;
				} else {
					duplicateSubjectMarker = '';
					duplicateSubjectNumber = 2;
				}
				lastCardSubject = cards[i].subject;
				content += `# ${cards[i].subject}${duplicateSubjectMarker} [${availableSides.length} / ${totalCardsideCount}]` + newline;
				cardCounter++;
				for (let s = 0; s < availableSides.length; s++) {
					content += `## ${TAPi18n.__('card.cardType' + cardset.cardType + '.content' + availableSides[s].contentId)}` + newline;
					content += MarkdeepContent.convertUML(MarkdeepContent.expandHeader(availableSides[s].content), true) + newline;
				}
			}
		}
		return content;
	}

	static createInfoTable (cards, cardset) {
		let info = '<meta charset=\"utf-8\" lang="de" emacsmode=\"-*- markdown -*-\">' + newline;
		if (exportConfig.exportHeaderStyle.trim().length) {
			info += `<link rel="stylesheet" href="${exportConfig.exportHeaderStyle.trim()}">` + newline;
		}
		let difficulty = "difficulty";
		if (CardType.gotNotesForDifficultyLevel(cardset.cardType)) {
			difficulty = "difficultyNotes";
		}
		if (cardset.description.trim().length > 0) {
			info += "(#) " + cardset.name + newline;
			info += cardset.description + newline ;
		}
		info += "(#) " + TAPi18n.__('set-list.cardsetInfoStatic') + newline;
		info += " | " + linebreak;
		info += "---|---" + linebreak;
		info += TAPi18n.__('cardset.info.author') + tableColumn + getAuthorName(cardset.owner, false) + linebreak;
		if (cardset.originalAuthorName !== undefined &&  (cardset.originalAuthorName.birthname !== undefined || cardset.originalAuthorName.legacyName !== undefined)) {
			info += TAPi18n.__('cardset.info.originalAuthor') + tableColumn + getOriginalAuthorName(cardset.originalAuthorName, false) + linebreak;
		}
		info += TAPi18n.__('set-list.category') + tableColumn + CardsetVisuals.getKindText(cardset.kind, 1) + linebreak;
		info += TAPi18n.__('set-list.app.title') + tableColumn + ServerStyle.getAppTitle() + linebreak;
		info += TAPi18n.__('set-list.app.url') + tableColumn + `[${Meteor.absoluteUrl()}](${Meteor.absoluteUrl()})` + linebreak;
		info += TAPi18n.__('set-list.app.version') + tableColumn + ServerStyle.getServerVersion() + linebreak;
		info += TAPi18n.__('cardType') + tableColumn + CardType.getCardTypeName(cardset.cardType) + linebreak;
		info += TAPi18n.__('difficulty') + tableColumn + TAPi18n.__(difficulty + cardset.difficulty) + linebreak;
		info += TAPi18n.__('cardset.info.quantity') + tableColumn + cardCounter + linebreak;
		if (cardset.shuffled) {
			info += TAPi18n.__('cardset.info.license.title.cardset') + tableColumn + CardsetVisuals.getLicense(cardset._id, cardset.license, true) + linebreak;
		} else {
			info += TAPi18n.__('cardset.info.license.title.repetitorium') + tableColumn + CardsetVisuals.getLicense(cardset._id, cardset.license, true) + linebreak;
			info += TAPi18n.__('cardset.info.license.title.rep-cardset') + tableColumn + TAPi18n.__('cardset.info.shuffleLicense') + linebreak;
		}
		info += TAPi18n.__('cardset.info.release') + tableColumn + Utilities.getMomentsDate(cardset.date, false, 0, false) + linebreak;
		info += TAPi18n.__('cardset.info.dateUpdated') + tableColumn + Utilities.getMomentsDate(cardset.dateUpdated, false, 0, false) + linebreak;
		return info;
	}

	static convert (cards, cardset, whitelist) {
		let content = '';
		content += this.createCardContent(cards, cardset, whitelist);
		content = this.createInfoTable(cards, cardset) + content;
		return content + exportConfig.markdeepCommands.replace(/\n/g, '');
	}
};
