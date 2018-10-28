//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "../modal/publish.js";
import "./publishCardset.html";

/*
 * ############################################################################
 * cardsetNavigationPublishCardset
 * ############################################################################
 */

Template.cardsetNavigationPublishCardset.helpers({
	canPublish: function () {
		let cardCount;
		if (this.shuffled) {
			cardCount = 2;
		} else {
			cardCount = 1;
		}
		return (this.quantity >= cardCount || this.reviewed || this.request);
	},
	getStatus: function () {
		if (this.visible) {
			switch (this.kind) {
				case "free":
					return TAPi18n.__('access-level.free.short');
				case "edu":
					return TAPi18n.__('access-level.edu.short');
				case "pro":
					return TAPi18n.__('access-level.pro.short');
				case "personal":
					return TAPi18n.__('access-level.private.short');
			}
		} else {
			if (this.kind === 'pro' && this.request === true) {
				return TAPi18n.__('sidebar-nav.review');
			} else {
				return TAPi18n.__('access-level.private.short');
			}
		}
	}
});
