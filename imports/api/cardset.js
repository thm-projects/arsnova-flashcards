import {Meteor} from 'meteor/meteor';

import {Learned} from './learned.js';

Meteor.methods({
	getCSVContent: function (cardset_id, id) {
		if (Roles.userIsInRole(id, 'lecturer')) {
			var colSep = ";"; // Separates columns
			var newLine = "\r\n"; //Adds a new line
			var birthName = TAPi18n.__('box_export_birth_name');
			var givenName = TAPi18n.__('box_export_given_name');
			var eMail = TAPi18n.__('box_export_mail');
			var boxOne = TAPi18n.__('subject1');
			var boxTwo = TAPi18n.__('subject2');
			var boxThree = TAPi18n.__('subject3');
			var boxFour = TAPi18n.__('subject4');
			var boxFive = TAPi18n.__('subject5');
			var boxSix = TAPi18n.__('subject6');
			var content = givenName + colSep + birthName + colSep + eMail + colSep + boxOne + colSep + boxTwo +
				colSep + boxThree + colSep + boxFour + colSep + boxFive + colSep + boxSix + newLine;
			var data = Learned.find({"cardset_id": cardset_id}).fetch();
			var distinctData = _.uniq(data, false, function (d) {
				return d.user_id;
			});
			for (var i = 0; i < distinctData.length; i++) {
				var user = Meteor.users.find({"_id": distinctData[i].user_id}).fetch();
				content += user[0].givenname + colSep + user[0].birthname + colSep + user[0].email + colSep;
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
	}
});
