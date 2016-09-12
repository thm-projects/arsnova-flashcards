//------------------------ IMPORTS

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Learned} from '../../api/learned.js';
import {Cardsets} from '../../api/cardsets.js';

import './statistics.html';

Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
Meteor.subscribe("learned");

var cardset_id;
Template.statistics.onCreated(function () {
	cardset_id = Router.current().params._id;
});

function getFileName() {
	var fileName = "";
	var cardset = Cardsets.find({"_id": cardset_id}).fetch();
	fileName += encodeURIComponent(cardset[0].name) + " Statistics " +
		(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)) + ".csv";
	return fileName;
}

function getContent() {
	var content = "Name;" + "Vorname;" + "E-Mail;" + "Fach 1;" + "Fach 2;" + "Fach 3;" + "Fach4 ;" + "Fach 5;\r\n";
	var data = Learned.find({"cardset_id": cardset_id}).fetch();
	var distinctData = _.uniq(data, false, function (d) {
		return d.user_id
	});
	for (var i = 0; i < distinctData.length; i++) {
		var user = Meteor.users.find({"_id": distinctData[i].user_id}).fetch();
		content += user[0].birthname + ";" + user[0].givenname + ";" + user[0].email + ";";
		data = Learned.find({"cardset_id": cardset_id, "user_id": distinctData[i].user_id}).fetch();
		for (var k = 1; k < 6; k++) {
			content += Learned.find({
					"cardset_id": cardset_id,
					"user_id": distinctData[i].user_id,
					"box": k
				}).count() + ";";
		}
		content += "\r\n";
	}
	return content;
}

Template.statistics.events({
	'click #exportCSV': function () {
		var data = "";
		var hiddenElement = document.createElement('a');
		hiddenElement.href = 'data:attachment/text,' + decodeURIComponent(escape(getContent()));
		hiddenElement.target = '_blank';
		hiddenElement.download = decodeURIComponent(escape(getFileName()));
		document.body.appendChild(hiddenElement);
		hiddenElement.click();
	}
});
