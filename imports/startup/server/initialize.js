import {Meteor} from "meteor/meteor";
import {Badges} from "../../api/badges.js";
import {AdminSettings} from "../../api/adminSettings";
import {CronScheduler} from "../../../server/cronjob.js";

var initBadges = function () {
	return [{
		"_id": "1",
		"name": "Reviewer",
		"desc": "Criticism is the highest form of affection. Users will be rewarded with this badge if they deal with cardsets of others and give constructive feedback.",
		"rank1": 50,
		"rank2": 25,
		"rank3": 10,
		"unit": "ratings",
		"badge": "kritiker",
		"i18n": {
			"de": {
				"name": "Kritiker",
				"desc": "Kritik ist die höchste Form der Zuneigung. Benutzer, welche sich sachlich mit den Kartensätzen anderer auseinandersetzen und konstruktives Feedback oder Lob aussprechen, werden mit diesem Badge belohnt",
				"unit": "Bewertungen"
			}
		}
	}, {
		"_id": "2",
		"name": "Reviewer's favourite",
		"desc": "You will obtain this badge by earning good feedback of other users. It contains all your public cardsets with at least 5 reviews with an average rating of 4.5 stars.",
		"rank1": 30,
		"rank2": 15,
		"rank3": 5,
		"unit": "carddecks",
		"badge": "krone",
		"i18n": {
			"de": {
				"name": "Liebling der Kritiker",
				"desc": "Du erhältst diesen Badge, wenn deine Kartensätze von anderen Lernenden gut bewertet werden. Als Kartensatz zählen alle deine öffentlichen Kartensätze mit mindestens 5 Bewertungen bei einer durchschnittlichen Bewertung von 4,5 Sternen.",
				"unit": "Kartensätze"
			}
		}
	}, {
		"_id": "3",
		"name": "Patron",
		"desc": "Visit THMcards for several days to obtain this badge!",
		"rank1": 50,
		"rank2": 25,
		"rank3": 10,
		"unit": "days",
		"badge": "stammgast",
		"i18n": {
			"de": {
				"name": "Stammgast",
				"desc": "Besuche THMcards mehrere Tage und erhalte den Stammgast Badge!",
				"unit": "Tage"
			}
		}
	}, {
		"_id": "4",
		"name": "Nerd",
		"desc": "Ambitiousness is rewarded. Learn different cardsets to obtain this badge. It doesn't matter which learning method you use.",
		"rank1": 30,
		"rank2": 15,
		"rank3": 5,
		"unit": "cardsets",
		"badge": "streber",
		"i18n": {
			"de": {
				"name": "Streber",
				"desc": "Strebsamkeit wird belohnt. Lerne unterschiedliche Kartensätze um diesen Badge zu erhalten. Es steht dir frei, welche Lernmethode du wählst.",
				"unit": "Kartensätze"
			}
		}
	}, {
		"_id": "5",
		"name": "Benefactor",
		"desc": "Create a certain number of public cardsets that contain at least 5 cards.",
		"rank1": 15,
		"rank2": 10,
		"rank3": 5,
		"unit": "cardsets",
		"badge": "autor",
		"i18n": {
			"de": {
				"name": "Wohltäter",
				"desc": "Erstelle eine bestimmte Anzahl an öffentlichen Kartensätzen, die mindestens 5 Karten beinhalten.",
				"unit": "Kartensätze"
			}
		}
	}, {
		"_id": "6",
		"name": "Bestselling author",
		"desc": "Reach many learners with popular cardsets.",
		"rank1": 40,
		"rank2": 20,
		"rank3": 10,
		"unit": "learner",
		"badge": "bestseller",
		"i18n": {
			"de": {
				"name": "Bestseller-Autor",
				"desc": "Erreiche viele Lernende mithilfe beliebter Kartensätze.",
				"unit": "Lernende"
			}
		}
	}];
};

Meteor.startup(function () {
	const cronScheduler = new CronScheduler();
	var badges = initBadges();
	process.env.MAIL_URL = Meteor.settings.MAIL_URL;
	SSR.compileTemplate("newsletter", Assets.getText("newsletter/newsletter.html"));
	Template.newsletter.helpers({
		getDocType: function () {
			return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
		}
	});

	if (!AdminSettings.findOne({name: "seqSettings"})) {
		AdminSettings.insert({
			name: "seqSettings",
			seqOne: 7,
			seqTwo: 30,
			seqThree: 90
		});
	}

	if (Badges.find().count() === 0) {
		for (var badge in badges) {
			if (badges.hasOwnProperty(badge)) {
				Badges.insert(badges[badge]);
			}
		}
	}
	cronScheduler.startCron();
});
