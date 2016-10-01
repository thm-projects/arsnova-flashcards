import {Email} from "meteor/email";
//import {Cardsets} from "../imports/api/cardsets.js";
//import {Learned} from "../imports/api/learned.js";

export class MailNotifier {

	prepareMail () {
		//WIP
		/*
		let mails = "";

		const ids = Meteor.users.find().fetch();
		ids.forEach(function (user) {
			if (Learned.find({user_id: user._id}).count() === 0) {
				return;
			}
			mails += user.email + ",";
			const courses = _.uniq(Learned.find({user_id: user._id}).fetch(), function (item) {
				return item.cardset_id;
			});

			let content = "";

			courses.forEach(function (item) {
				const cardset = Cardsets.findOne({_id: item.cardset_id, mailNotification: true});
				if (typeof cardset !== "undefined") {
					content += "- " + cardset.name + "\n";
				}
			});

			if (content === "") {
				return;
			}
			this.sendMail(mails, content);
		});
		*/
	}

	sendMail (mails, content) {
		Email.send({
			from: '',
			to: mails,
			subject: "THMcards: Heute sind nur () Karten aus () Kartensets zu lernen",
			text: "Sehr geehrter Teilnehmer der aktuellen THMCards-Lernphase,\n\nein neuer Tag hat begonnen und folgende Kartensätze erwarten dich:\n\n" + content + "\nBitte denke daran deinen täglichen Aufgaben nachzukommen.\nIhr THMCards-Team"
		});
	}
}
