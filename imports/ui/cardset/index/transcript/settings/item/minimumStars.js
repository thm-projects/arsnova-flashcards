import "./minimumStars.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";

Template.cardsetIndexTranscriptSettingsItemMinimumStars.helpers({
	getBonusTranscriptStars: function () {
		let stars = Session.get('minimumBonusStars');
		let starData = [];
		for (let i = 0; i < 5; i++) {
			let star = {};
			if (i < stars) {
				star.status = "rated";
			} else {
				star.status = "";
			}
			starData.push(star);
		}
		return starData;
	},
	getBonusTranscriptStarsTooltip: function (stars) {
		return TAPi18n.__('cardset.transcriptBonusRating.starsLabel.stars' + (stars + 1));
	}
});
