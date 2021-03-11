import "./backgroundOverlay.html";
import {backgrounds} from "../../../config/lockScreen";
import {LockScreen} from "../../../util/lockScreen";

Template.learnAlgorithmsBackgroundOverlay.helpers({
	getBackgrounds: function () {
		return LockScreen.filterByFeatures(backgrounds);
	}
});

Template.learnAlgorithmsBackgroundOverlay.onRendered(function () {
	LockScreen.initOwlCarousel('#divBackgroundOverlay');
});

const idSubLength = "background".length;

Template.learnAlgorithmsBackgroundOverlay.events({
	"click #divBackgroundOverlay .item": function (evt) {
		const id = parseInt(evt.currentTarget.id.substring(idSubLength));
		const index = backgrounds.findIndex((elem) => elem.id === id);
		if (index >= 0) {
			LockScreen.openBackground(id, backgrounds[index]);
		}
	}
});
