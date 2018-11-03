//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./dashboard.html";

Template.admin_dashboard.helpers({
	totalCardsets: function () {
		return Counts.get('cardsetsCounter');
	},
	totalReps: function () {
		return Counts.get('repetitoriumCounter');
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
