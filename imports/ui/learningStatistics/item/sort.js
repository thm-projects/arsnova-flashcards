import "./sort.html";
import {Session} from "meteor/session";


function getSettings(type) {
	let sortSettings;
	switch (type) {
		case 1:
			sortSettings = Session.get('sortBonusUserHistory');
			break;
		case 2:
			sortSettings = Session.get('sortBonusUserTaskHistory');
			break;
		case 3:
			sortSettings = Session.get('sortUserCardStats');
			break;
		default:
			sortSettings = Session.get('sortBonusUsers');
			break;
	}
	return sortSettings;
}

Template.learningBonusStasticsItemSort.helpers({
	isVisible: function () {
		let sortSettings = getSettings(this.type);
		return this.content === sortSettings.content;
	},
	descendingOrder: function () {
		let sortSettings = getSettings(this.type);
		return sortSettings.desc;
	}
});
