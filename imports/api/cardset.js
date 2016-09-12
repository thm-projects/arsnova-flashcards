import {Meteor} from 'meteor/meteor';

import {Learned} from './learned.js';

Meteor.methods({
	getCSVContent: function (cardset_id) {
		var colSep =  ";"; // Separates columns
		var newLine = "\r\n"; //Adds a new line
		var content = "Name" + colSep + "Vorname" + colSep + "E-Mail" + colSep + "Fach 1" + colSep + "Fach 2" +
			colSep + "Fach 3" + colSep + "Fach4" + colSep + "Fach 5" + colSep + newLine;
		var data = Learned.find({"cardset_id": cardset_id}).fetch();
		var distinctData = _.uniq(data, false, function (d) {
			return d.user_id;
		});
		for (var i = 0; i < distinctData.length; i++) {
			var user = Meteor.users.find({"_id": distinctData[i].user_id}).fetch();
			content += user[0].firstName + colSep + user[0].lastName + colSep + user[0].email + colSep;
			data = Learned.find({"cardset_id": cardset_id, "user_id": distinctData[i].user_id}).fetch();
			for (var k = 1; k < 6; k++) {
				content += Learned.find({
						"cardset_id": cardset_id,
						"user_id": distinctData[i].user_id,
						"box": k
					}).count() + colSep;
			}
			content += newLine;
		}
		return content;
	}
});
