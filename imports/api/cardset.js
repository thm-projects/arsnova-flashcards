import {Meteor} from "meteor/meteor";
import {Match} from "meteor/check";
import {Learned} from "./learned.js";
import {Cardsets} from "./cardsets.js";
import {check} from "meteor/check";

/**
 * Returns the degree, the givenname and the birthname from the author of a cardset
 * @param owner - The database ID of the author
 * @returns {*} - Degree + givenname + birthname
 */
export function getAuthorName(owner) {
	var author = Meteor.users.findOne({"_id": owner});
	if (author) {
		var degree = "";
		if (author.profile.title) {
			degree = author.profile.title;
		}
		if (author.profile.givenname === undefined && author.profile.birthname === undefined) {
			author.profile.givenname = TAPi18n.__('cardset.info.undefinedAuthor');
			return author.profile.givenname;
		}
		return degree + " " + author.profile.givenname + " " + author.profile.birthname;
	}
}

Meteor.methods({
	getCSVExport: function (cardset_id, header) {
		check(cardset_id, String);
		check(header, [String]);

		var cardset = Cardsets.findOne({_id: cardset_id});
		if ((Roles.userIsInRole(Meteor.userId(), 'lecturer')) && Meteor.userId() === cardset.owner && (Match.test(header, [String]))) {
			var content;
			var colSep = ";"; // Separates columns
			var newLine = "\r\n"; //Adds a new line
			content = header[6] + colSep + header[7] + colSep + header[8] + colSep;
			for (var i = 0; i <= 4; i++) {
				content += header[i] + " [" + cardset.learningInterval[i] + "]" + colSep;
			}
			content += header[5] + colSep + newLine;
			var data = Learned.find({cardset_id: cardset_id}).fetch();
			var distinctData = _.uniq(data, false, function (d) {
				return d.user_id;
			});
			for (var k = 0; k < distinctData.length; k++) {
				if (distinctData[k].user_id === Meteor.userId()) {
					continue;
				}
				var user = Meteor.users.find({_id: distinctData[k].user_id}).fetch();
				content += user[0].profile.givenname + colSep + user[0].profile.birthname + colSep + user[0].email + colSep;
				data = Learned.find({cardset_id: cardset_id, user_id: distinctData[k].user_id}).fetch();
				for (var l = 1; l <= 6; l++) {
					content += Learned.find({
							cardset_id: cardset_id,
							user_id: distinctData[k].user_id,
							box: l
						}).count() + colSep;
				}
				content += newLine;
			}
			return content;
		}
	},
	getLearningData: function (cardset_id) {
		check(cardset_id, String);

		var cardset = Cardsets.findOne({_id: cardset_id});
		if ((Roles.userIsInRole(Meteor.userId(), 'lecturer')) && Meteor.userId() === cardset.owner) {
			var learningDataArray = [];
			var data = Learned.find({cardset_id: cardset_id}).fetch();
			var distinctData = _.uniq(data, false, function (d) {
				return d.user_id;
			});
			for (var i = 0; i < distinctData.length; i++) {
				if (distinctData[i].user_id === Meteor.userId()) {
					continue;
				}
				var user = Meteor.users.find({_id: distinctData[i].user_id}).fetch();

				var filter = [];
				for (var l = 1; l < 6; l++) {
					filter.push({
						cardset_id: cardset_id,
						user_id: distinctData[i].user_id,
						box: l
					});
				}

				learningDataArray.push({
					givenname: user[0].profile.givenname,
					birthname: user[0].profile.birthname,
					email: user[0].email,
					box1: Learned.find(filter[0]).count(),
					box2: Learned.find(filter[1]).count(),
					box3: Learned.find(filter[2]).count(),
					box4: Learned.find(filter[3]).count(),
					box5: Learned.find(filter[4]).count(),
					box6: Learned.find(filter[5]).count()
				});
			}
			return learningDataArray;
		}
	}
});
