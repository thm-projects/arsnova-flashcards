import {NavigatorCheck} from "./navigatorCheck";
import DOMPurify from "dompurify";
import {DOMPurifyConfig} from "../config/dompurify";

export let CardsetVisuals = class CardsetVisuals {
	static resizeCardsetInfo () {
		if (NavigatorCheck.isSmartphone()) {
			$('.markdeepCardsetContent').css('max-height', 350);
		} else {
			$('.markdeepCardsetContent').css('max-height', 'unset');
			$('.markdeepCardsetContent').css('height', 'auto');
		}
	}

	static changeCollapseElement (elementId) {
		let iconId = elementId + "Icon";
		if ($(iconId).hasClass("fa-caret-square-down")) {
			$(iconId).removeClass("fa-caret-square-down");
			$(iconId).addClass("fa-caret-square-up");
			$(elementId).slideDown();
		} else {
			$(iconId).removeClass("fa-caret-square-up");
			$(iconId).addClass("fa-caret-square-down");
			$(elementId).slideUp();
		}
	}

	static getKindText (kind, displayType = 0) {
		if (displayType === 0) {
			switch (DOMPurify.sanitize(kind, DOMPurifyConfig)) {
				case "free":
					return TAPi18n.__('access-level.free.short');
				case "edu":
					return TAPi18n.__('access-level.edu.short');
				case "pro":
					return TAPi18n.__('access-level.pro.short');
				case "personal":
					return TAPi18n.__('access-level.private.short');
				case "demo":
					return TAPi18n.__('access-level.demo.short');
				default:
					return 'Undefined!';
			}
		} else {
			switch (DOMPurify.sanitize(kind, DOMPurifyConfig)) {
				case "free":
					return TAPi18n.__('access-level.free.long');
				case "edu":
					return TAPi18n.__('access-level.edu.long');
				case "pro":
					return TAPi18n.__('access-level.pro.long');
				case "personal":
					return TAPi18n.__('access-level.private.long');
				case "demo":
					return TAPi18n.__('access-level.demo.long');
				default:
					return 'Undefined!';
			}
		}
	}

	static getLicense (_id, license, isTextOnly = false) {
		let licenseString = "";

		if (license !== undefined && license !== null && license.length > 0) {
			let seperator = ", ";
			let itemCounter = 0;
			if (license.includes('by')) {
				if (isTextOnly) {
					licenseString = licenseString.concat(TAPi18n.__('cardset.info.license.by'));
				} else {
					licenseString = licenseString.concat('<img src="/img/by.large.png" alt="' + TAPi18n.__('cardset.info.license.by') + '" data-id="' + _id + '" />');
				}
				itemCounter++;
			}
			if (license.includes('nc')) {
				if (isTextOnly) {
					if (itemCounter > 0) {
						licenseString += seperator;
					}
					licenseString += TAPi18n.__('cardset.info.license.nc');
				} else {
					licenseString = licenseString.concat('<img src="/img/nc-eu.large.png" alt="' + TAPi18n.__('cardset.info.license.nc') + '" data-id="' + _id + '" />');
				}
				itemCounter++;
			}
			if (license.includes('nd')) {
				if (isTextOnly) {
					if (itemCounter > 0) {
						licenseString += seperator;
					}
					licenseString += TAPi18n.__('cardset.info.license.nd');
				} else {
					licenseString = licenseString.concat('<img src="/img/nd.large.png" alt="' + TAPi18n.__('cardset.info.license.nd') + '" data-id="' + _id + '" />');
				}
				itemCounter++;
			}
			if (license.includes('sa')) {
				if (isTextOnly) {
					if (itemCounter > 0) {
						licenseString += seperator;
					}
					licenseString += TAPi18n.__('cardset.info.license.sa');
				} else {
					licenseString = licenseString.concat('<img src="/img/sa.large.png" alt="' + TAPi18n.__('cardset.info.license.sa') + '" data-id="' + _id + '" />');
				}
			}
			return new Spacebars.SafeString(licenseString);
		} else {
			if (isTextOnly) {
				return TAPi18n.__('cardset.info.license.noCopyright');
			} else {
				return new Spacebars.SafeString('<img src="/img/zero.large.png" alt="' + TAPi18n.__('cardset.info.license.noCopyright') + '" data-id="' + _id + '" />');
			}
		}
	}
};
