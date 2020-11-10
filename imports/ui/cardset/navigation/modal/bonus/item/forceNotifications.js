import "./forceNotifications.html";
import {BonusForm} from "../../../../../../util/bonusForm";

Template.bonusFormForceNotifications.helpers({
	gotMailChecked: function () {
		return BonusForm.forceMailSetting();
	},
	gotPushChecked: function () {
		return BonusForm.forcePushSetting();
	}
});

Template.bonusFormForceNotifications.events({
	"click #forceMailNotifications": function () {
		BonusForm.forceMailSetting(true);
	},
	"click #forcePushNotifications": function () {
		BonusForm.forcePushSetting(true);
	}
});
