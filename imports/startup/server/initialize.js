import {Meteor} from 'meteor/meteor';
import {Categories} from '../../api/categories.js';
import {Badges} from '../../api/badges.js';
import {AdminSettings} from '../../api/adminSettings';
import {MailNotifier} from '../../../server/sendmail.js';

var initCategories = function () {
	var categoryNames = [
		"Agricultural and Forestry Sciences",//1
		"Information and Telecommunications Technology",//2
		"Engineering Sciences",//3
		"Cultural and Social Sciences",//4
		"Art and Music",//5
		"Mathematics and Natural Sciences",//6
		"Media",//7
		"Medicine and Health",//8
		"Education and Teaching",//9
		"Jurisprudence",//10
		"Foreign Languages and Literatures",//11
		"Social and Behavioral Sciences",//12
		"Economics and Management"//13
	];

	var categoryI18n = [
		{//1
			"de": {
				"name": "Agrar- und Forstwissenschaften"
			}
		},
		{//2
			"de": {
				"name": "Informations- und Telekommunikationstechnik"
			}
		},
		{//3
			"de": {
				"name": "Ingeniuerswissenschaften"
			}
		},
		{//4
			"de": {
				"name": "Kultur- und Gesellschaftswissenschften"
			}
		},
		{//5
			"de": {
				"name": "Kunst und Musik"
			}
		},
		{//6
			"de": {
				"name": "Mathematik und Naturwissenschaften"
			}
		},
		{//7
			"de": {
				"name": "Medien"
			}
		},
		{//8
			"de": {
				"name": "Medizin und Gesundheit"
			}
		},
		{//9
			"de": {
				"name": "Pädagogik und Lehre"
			}
		},
		{//10
			"de": {
				"name": "Rechtswissenschaften"
			}
		},
		{//11
			"de": {
				"name": "Sprach- und Literaturwissenschaften"
			}
		},
		{//12
			"de": {
				"name": "Sozial- und Verhaltenswissenschaften"
			}
		},
		{//13
			"de": {
				"name": "Wirtschaft und Management"
			}
		}
	];

	var categories = [];
	for (var i = 0; i < categoryNames.length; ++i) {
		categories.push(
			{
				"_id": (i < 9 ? "0" : "") + (i + 1),
				"name": categoryNames[i],
				"i18n": categoryI18n[i]
			}
		);
	}

	return categories;
};

var initBadges = function () {
	return [
		{
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
		},
		{
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
		},
		{
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
		},
		{
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
		},
		{
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
		},
		{
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
		}
	];
};

Meteor.startup(function () {
	var badges = initBadges();
	var cat = initCategories();

	if (!AdminSettings.findOne({name: "seqSettings"})) {
		AdminSettings.insert({
			name: "seqSettings",
			seqOne: 7,
			seqTwo: 30,
			seqThree: 90
		});
	}
	if (Categories.find().count() === 0) {
		for (var category in cat.categories) {
			if (cat.categories.hasOwnProperty(category)) {
				Categories.insert(cat.categories[category]);
			}
		}
	}
	if (Badges.find().count() === 0) {
		for (var badge in badges) {
			if (badges.hasOwnProperty(badge)) {
				Badges.insert(badges[badge]);
			}
		}
	}
	const mailAgent = new MailNotifier()
	let mails = "";
	Meteor.users.find({}, {email:1}).fetch().forEach(function (item) {
		mails += item.email + ",";
	});
	mailAgent.addTask({
		details : {
			from: '',
			to: mails,
			subject: "Die Lernrunde läuft!",
			html: "<p>Sehr geehrte Teilnehmer der aktuellen THMCards-Lernphase, <br><br>ein neuer Tag hat begonnen, Ihre Leitners-Box erwartet Sie!<br> Bitte denken Sie daran Ihren täglichen Aufgaben nachzukommen.<br><br>Ihr THMCards-Team</p>",
		}
	});
	mailAgent.startCron();
});
