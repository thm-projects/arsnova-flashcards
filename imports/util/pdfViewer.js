import {NavigatorCheck} from "../api/navigatorCheck.js";
import {CardType} from "../api/cardTypes.js";
import {Route} from "../api/route.js";
import * as config from "../config/pdfViewer.js";
import {Cards} from "../api/subscriptions/cards";
import {Session} from "meteor/session";
import {Leitner} from "../api/subscriptions/leitner";
import {Wozniak} from "../api/subscriptions/wozniak";
import XRegExp from 'xregexp';

let isAutoPDFTarget = false;

export let PDFViewer = class PDFViewer {
	static setAutoPDFTargetStatus (status) {
		isAutoPDFTarget = status;
	}

	static getDeviceMaxSize () {
		if (NavigatorCheck.isSmartphone()) {
			if (NavigatorCheck.isLandscape()) {
				return config.smartphoneSize.landscape;
			} else {
				return config.smartphoneSize.portrait;
			}
		} else if (NavigatorCheck.isTablet()) {
			if (NavigatorCheck.isLandscape()) {
				return config.tabletSize.landscape;
			} else {
				return config.tabletSize.portrait;
			}
		} else {
			return config.desktopSize;
		}
	}

	static getIframeHeight () {
		return window.innerHeight * this.getDeviceMaxSize().height;
	}

	static getIframeWidth () {
		return window.innerWidth * this.getDeviceMaxSize().width;
	}

	static closeModal () {
		if (isAutoPDFTarget) {
			if (Route.isBox()) {
				Meteor.call('markLeitnerAutoPDF', Router.current().params._id, Session.get('activeCard'));
			} else {
				Meteor.call('markWozniakAutoPDF', Router.current().params._id, Session.get('activeCard'));
			}
		}
		this.setAutoPDFTargetStatus(false);
		$('#pdfViewerModal').modal('hide');
	}

	static openModal () {
		$('#pdfViewerModal').modal('show');
	}

	static resizeIframe () {
		let pdfModal = $("#pdfViewer");
		if (pdfModal.length) {
			pdfModal.height(this.getIframeHeight() + "px");
			pdfModal.width(this.getIframeWidth() + "px");
		}
	}

	static getViewerLink () {
		if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
			return config.viewerLinkLocalhost;
		} else {
			return config.viewerLink;
		}
	}

	static setLearningAutoTarget (card_id, cardType) {
		if (Route.isLearningMode() && CardType.gothLearningModePDFAutoTarget(cardType)) {
			let viewedAutoPDF;
			if (Route.isBox()) {
				viewedAutoPDF = Leitner.findOne({card_id: card_id, cardset_id: Router.current().params._id, user_id: Meteor.userId(), viewedPDF: true});
			} else {
				viewedAutoPDF = Wozniak.findOne({card_id: card_id, cardset_id: Router.current().params._id, user_id: Meteor.userId(), viewedPDF: true});
			}
			if (viewedAutoPDF === undefined) {
				let cubeSides = CardType.getCardTypeCubeSides(cardType);
				for (let i = 0; i < cubeSides.length; i++) {
					if (cubeSides[i].gotPDFAutoTarget !== undefined && cubeSides[i].gotPDFAutoTarget === true) {
						let card = Cards.findOne({_id: card_id}, {
							fields: {
								front: 1,
								back: 1,
								hint: 1,
								lecture: 1,
								bottom: 1,
								top: 1
							}
						});
						if (card !== undefined) {
							let content = card[CardType.getContentIDTranslation(cubeSides[i].contentId)];
							if (content !== undefined && content.length) {
								let regexp = new XRegExp(config.markdeepPDFRegex);
								let result = content.match(regexp);
								if (result !== null && result[1] !== undefined && result[1].length) {
									Session.set('activePDF', result[1]);
									this.setAutoPDFTargetStatus(true);
									this.openModal();
								}
							}
						}
					}
				}
			}
		}
	}
};

