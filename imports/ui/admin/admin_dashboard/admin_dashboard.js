//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./admin_dashboard.html";

Template.admin_dashboard.helpers({
	totalCardsets: function () {
		return Counts.get('cardsetsCounter');
	},
	totalCards: function () {
		return Counts.get('cardsCounter');
	},
	totalUser: function () {
		return Counts.get('usersCounter');
	},
	getOnlineStatusTotal: function () {
		return Counts.get('usersOnlineCounter');
	}
});
