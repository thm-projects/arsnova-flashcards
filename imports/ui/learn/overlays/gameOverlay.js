import "./gameOverlay.html";
import {games} from "../../../config/lockScreen";
import {LockScreen} from "../../../util/lockScreen";

Template.learnAlgorithmsGamesOverlay.helpers({
	getGames: function () {
		return LockScreen.filterByFeatures(games);
	}
});

Template.learnAlgorithmsGamesOverlay.onRendered(function () {
	LockScreen.initOwlCarousel('#divGameOverlay');
});

const idSubLength = "game".length;

Template.learnAlgorithmsGamesOverlay.events({
	"click #divGameOverlay .item": function (evt) {
		const id = parseInt(evt.currentTarget.id.substring(idSubLength));
		const index = games.findIndex((elem) => elem.id === id);
		if (index >= 0) {
			LockScreen.openGame(id, games[index]);
		}
	}
});
