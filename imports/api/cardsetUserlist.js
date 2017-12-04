import {Meteor} from "meteor/meteor";
import {Leitner} from "./learned.js";
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

function getLearningStatus(learningEnd) {
	if (learningEnd.getTime() > new Date().getTime()) {
		return TAPi18n.__('set-list.activeLearnphase');
	} else {
		return TAPi18n.__('set-list.inactiveLearnphase');
	}
}

function getCardsetInfo(cardset) {
	return [
		[TAPi18n.__('set-list.cardsetInfoStatic'), ""],
		[TAPi18n.__('set-list.name'), cardset.name],
		[TAPi18n.__('modal-dialog.kind'), cardset.kind],
		[TAPi18n.__('cardset.info.rating'), cardset.relevance],
		[TAPi18n.__('cardset.info.quantity'), cardset.quantity],
		[TAPi18n.__('cardset.info.module'), cardset.module],
		[TAPi18n.__('cardset.info.moduleShort'), cardset.moduleToken],
		[TAPi18n.__('cardset.info.moduleNum'), cardset.moduleNum],
		[TAPi18n.__('modal-dialog.skillLevel'), cardset.skillLevel],
		[TAPi18n.__('cardset.info.college'), cardset.college],
		[TAPi18n.__('cardset.info.course'), cardset.course],
		[TAPi18n.__('cardset.info.author'), getAuthorName(cardset.owner)],
		[TAPi18n.__('cardset.info.release'),  moment(cardset.date).locale("de").format('LL')],
		[TAPi18n.__('cardset.info.dateUpdated'),  moment(cardset.dateUpdated).locale("de").format('LL')]
	];
}

function getLearningPhaseInfo(cardset) {
	return [
		["", ""],
		[TAPi18n.__('set-list.learnphaseInfo'), ""],
		[TAPi18n.__('set-list.learnphase'), getLearningStatus(cardset.learningEnd)],
		[TAPi18n.__('pool.activeLearners'), cardset.learners],
		[TAPi18n.__('confirmLearn-form.maxCards'), cardset.maxCards],
		[TAPi18n.__('confirmLearn-form.daysBeforeReset'), cardset.daysBeforeReset],
		[TAPi18n.__('confirmLearn-form.learningStart'), moment(cardset.learningStart).locale("de").format('LL')],
		[TAPi18n.__('confirmLearn-form.learningEnd'), moment(cardset.learningEnd).locale("de").format('LL')]
	];
}

function sortByBirthname(data) {
	data.sort(function (a, b) {
		let nameA = a.birthname.toUpperCase(); // ignore upper and lowercase
		let nameB = b.birthname.toUpperCase(); // ignore upper and lowercase
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}

		// names must be equal
		return 0;
	});
	return data;
}

function getLearners(data, cardset_id) {
	let learningDataArray = [];
	let distinctData = _.uniq(data, false, function (d) {
		return d.user_id;
	});
	for (let i = 0; i < distinctData.length; i++) {
		if (distinctData[i].user_id === Meteor.userId()) {
			continue;
		}
		let user = Meteor.users.find({_id: distinctData[i].user_id}).fetch();

		let filter = [];
		for (let l = 1; l < 6; l++) {
			filter.push({
				cardset_id: cardset_id,
				user_id: distinctData[i].user_id,
				box: l
			});
		}

		learningDataArray.push({
			birthname: user[0].profile.birthname,
			givenname: user[0].profile.givenname,
			email: user[0].email,
			box1: Leitner.find(filter[0]).count(),
			box2: Leitner.find(filter[1]).count(),
			box3: Leitner.find(filter[2]).count(),
			box4: Leitner.find(filter[3]).count(),
			box5: Leitner.find(filter[4]).count(),
			box6: Leitner.find(filter[5]).count()
		});
	}
	return sortByBirthname(learningDataArray);
}

Meteor.methods({
	getCSVExport: function (cardset_id, header) {
		check(cardset_id, String);
		check(header, [String]);

		let cardset = Cardsets.findOne({_id: cardset_id});
		let cardsetInfo = getCardsetInfo(cardset);
		let learningPhaseInfo = getLearningPhaseInfo(cardset);
		if ((Roles.userIsInRole(Meteor.userId(), ["admin", "editor", "lecturer"])) && (Meteor.userId() === cardset.owner || cardset.editors.includes(Meteor.userId()))) {
			let content;
			let colSep = ";"; // Separates columns
			let infoCol = ";;;;;;;;;;"; // Separates columns
			let newLine = "\r\n"; //Adds a new line
			let infoCardsetCounter = 0;
			let infoCardsetLength = 11;
			let infoLearningPhaseCounter = 0;
			let infoLearningPhaseLength = 7;
			content = header[6] + colSep + header[7] + colSep + header[8] + colSep;
			for (let i = 0; i <= 4; i++) {
				content += header[i] + " [" + cardset.learningInterval[i] + "]" + colSep;
			}
			content += header[5] + colSep + colSep + cardsetInfo[infoCardsetCounter++][0] + newLine;
			let learners = getLearners(Leitner.find({cardset_id: cardset_id}).fetch(), cardset_id);
			for (let k = 0; k < learners.length; k++) {
				content += learners[k].birthname + colSep + learners[k].givenname + colSep + learners[k].email + colSep;
				content += learners[k].box1 + colSep + learners[k].box2 + colSep + learners[k].box3 + colSep + learners[k].box4 + colSep + learners[k].box5 + colSep + learners[k].box6 + colSep;
				if (infoCardsetCounter <= infoCardsetLength) {
					content += colSep + cardsetInfo[infoCardsetCounter][0] + colSep + cardsetInfo[infoCardsetCounter++][1];
				} else if (infoLearningPhaseCounter <= infoLearningPhaseLength) {
					content += colSep + learningPhaseInfo[infoLearningPhaseCounter][0] + colSep + learningPhaseInfo[infoLearningPhaseCounter++][1];
				}
				content += newLine;
			}
			while (infoCardsetCounter <= infoCardsetLength) {
				content += infoCol + cardsetInfo[infoCardsetCounter][0] + colSep + cardsetInfo[infoCardsetCounter++][1] + newLine;
			}
			while (infoLearningPhaseCounter <= infoLearningPhaseLength) {
				content += infoCol + learningPhaseInfo[infoLearningPhaseCounter][0] + colSep + learningPhaseInfo[infoLearningPhaseCounter++][1] + newLine;
			}
			return content;
		}
	},
	getLearningData: function (cardset_id) {
		check(cardset_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if ((Roles.userIsInRole(Meteor.userId(), ["admin", "editor", "lecturer"])) && (Meteor.userId() === cardset.owner || cardset.editors.includes(Meteor.userId()))) {
			return getLearners(Leitner.find({cardset_id: cardset_id}).fetch(), cardset_id);
		}
	},
	getEditors: function (cardset_id) {
		check(cardset_id, String);

		let cardset = Cardsets.findOne({_id: cardset_id});
		let editorsDataArray = [];
		if (Meteor.userId() === cardset.owner) {
			let editors = Meteor.users.find({
				_id: {$ne: cardset.owner},
				roles: {$in: ['admin', 'editor', 'lecturer']}
			}).fetch();
			for (let i = 0; i < editors.length; i++) {
				editorsDataArray.push({
					givenname: editors[i].profile.givenname,
					birthname: editors[i].profile.birthname,
					roles: editors[i].roles,
					id: editors[i]._id
				});
			}
		}
		return editorsDataArray;
	},
	addEditor: function (cardset_id, user_id) {
		check(cardset_id, String);
		check(user_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (Meteor.userId() === cardset.owner && user_id !== cardset.owner) {
			Cardsets.update(
				{_id: cardset._id},
				{
					$push: {editors: user_id}
				});
		}
		Leitner.remove({
			cardset_id: cardset._id,
			user_id: user_id
		});
		Meteor.call("updateLearnerCount", cardset._id);
	},
	removeEditor: function (cardset_id, user_id) {
		check(cardset_id, String);
		check(user_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (Meteor.userId() === cardset.owner && user_id !== cardset.owner) {
			Cardsets.update(
				{_id: cardset._id},
				{
					$pull: {editors: user_id}
				});
		}
	},
	leaveEditors: function (cardset_id) {
		check(cardset_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (cardset.editors.includes(Meteor.userId())) {
			Cardsets.update(
				{_id: cardset._id},
				{
					$pull: {editors: Meteor.userId()}
				});
		}
	}
});
