import {Meteor} from 'meteor/meteor';

import {Learned} from './learned.js';
import {Cardsets} from './cardsets.js';

var content;
var boxArray = [];
var colSep = ";"; // Separates columns
var newLine = "\r\n"; //Adds a new line
var birthName = TAPi18n.__('box_export_birth_name');
var givenName = TAPi18n.__('box_export_given_name');
var eMail = TAPi18n.__('box_export_mail');
boxArray[0] = TAPi18n.__('subject1');
boxArray[1] = TAPi18n.__('subject2');
boxArray[2] = TAPi18n.__('subject3');
boxArray[3] = TAPi18n.__('subject4');
boxArray[4] = TAPi18n.__('subject5');
boxArray[5] = TAPi18n.__('subject6');

Meteor.methods({
	getCSVExport: function (cardset_id, id) {
		if (Roles.userIsInRole(id, 'lecturer')) {
			content = givenName + colSep + birthName + colSep + eMail + colSep;
			var cardset = Cardsets.findOne({"_id": cardset_id});
			for (var i = 0; i <= 4; i++) {
				content += boxArray[i] + " [" + cardset.learningInterval[i] + "]" + colSep;
			}
			content += boxArray[5] + colSep + newLine;
			var data = Learned.find({"cardset_id": cardset_id}).fetch();
			var distinctData = _.uniq(data, false, function (d) {
				return d.user_id;
			});
			for (var k = 0; k < distinctData.length; k++) {
				var user = Meteor.users.find({"_id": distinctData[k].user_id}).fetch();
				content += user[0].profile.givenname + colSep + user[0].profile.birthname + colSep + user[0].email + colSep;
				data = Learned.find({"cardset_id": cardset_id, "user_id": distinctData[k].user_id}).fetch();
				for (var l = 1; l <= 6; l++) {
					content += Learned.find({
							"cardset_id": cardset_id,
							"user_id": distinctData[k].user_id,
							"box": l
						}).count() + colSep;
				}
				content += newLine;
			}
			return content;
		}
	}
});
