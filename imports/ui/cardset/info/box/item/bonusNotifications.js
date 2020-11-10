import "./bonusNotifications.html";
import {Template} from "meteor/templating";

Template.cardsetInfoBoxItemBonusNotifications.helpers({
	getStatus: function (type) {
		switch (type) {
			case 0:
				if (this.forceNotifications.mail) {
					return TAPi18n.__('set-list.notifications.forced');
				} else {
					return TAPi18n.__('set-list.notifications.optional');
				}
				break;
			case 1:
				if (this.forceNotifications.push) {
					return TAPi18n.__('set-list.notifications.forced');
				} else {
					return TAPi18n.__('set-list.notifications.optional');
				}
		}
	}
});
