//------------------------ IMPORTS
import "../modal/license.js";
import "./editLicense.html";
import {Session} from "meteor/session";

Template.cardsetNavigationEditLicense.helpers({
	getAllLicenses: function () {
		const cardset = Session.get('activeCardset');
		if (cardset !== undefined) {
			const elem = [];
			for (let i = 0; i < cardset.license.length; i++) {
				if (cardset.license[i] === 'nc') {
					elem.push('nc-eu');
				} else {
					elem.push(cardset.license[i]);
				}
			}
			return elem;
		} else {
			return null;
		}
	},
	isLicenseSet: function () {
		const cardset = Session.get('activeCardset');
		if (cardset !== undefined) {
			return cardset.license.length > 0;
		} else {
			return false;
		}
	}
});
