import {Meteor} from 'meteor/meteor';
import {Match} from 'meteor/check';
import {Learned} from './learned.js';
import {Cardsets} from './cardsets.js';

var content;
var colSep = ";"; // Separates columns
var newLine = "\r\n"; //Adds a new line

Meteor.methods({
	getCSVExport: function (cardset_id, id, header) {
		if ((Roles.userIsInRole(id, 'lecturer')) && (Match.test(header, [String]))) {
			content = header[6] + colSep + header[7] + colSep + header[8] + colSep;
			var cardset = Cardsets.findOne({"_id": cardset_id});
			for (var i = 0; i <= 4; i++) {
				content += header[i] + " [" + cardset.learningInterval[i] + "]" + colSep;
			}
			content += header[5] + colSep + newLine;
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
