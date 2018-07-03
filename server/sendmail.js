import {Meteor} from "meteor/meteor";
import {Email} from "meteor/email";
import {Leitner} from "../imports/api/learned.js";
import {Notifications} from "./notifications.js";
import {AdminSettings} from "../imports/api/adminSettings.js";
import {Cardsets} from "../imports/api/cardsets.js";

/**
 * Class used for sending the newsletter mail
 */
export class MailNotifier {
	/**
	 * Gets the mail address of a user
	 * @param {string} user_id - id of user
	 * @return  mail address of user
	 */
	getMail (user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var user = Meteor.users.find({_id: user_id}).fetch();
			return user[0].email;
		}
	}

	/**
	 * Returns the deadline text for the mail of a cardset
	 * @param {Cardset} cardset -  The cardset
	 * @param {string} user_id - id of user
	 * @returns {string} deadline text
	 */
	getDeadline (cardset, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var active = Leitner.findOne({cardset_id: cardset._id, user_id: user_id, active: true});
			var deadline = new Date(active.currentDate.getTime() + cardset.daysBeforeReset * 86400000);
			if (deadline.getTime() > cardset.learningEnd.getTime()) {
				return (TAPi18n.__('deadlinePrologue', null, Meteor.settings.mail.language) + moment(cardset.learningEnd).format("DD.MM.YYYY") + TAPi18n.__('deadlineEpilogue1', null, Meteor.settings.mail.language));
			} else {
				return (TAPi18n.__('mailNotification.textDate1', null, Meteor.settings.mail.language) + moment(deadline).format("DD.MM.YYYY") + TAPi18n.__('mailNotification.textDate2', null, Meteor.settings.mail.language));
			}
		}
	}

	/**
	 * Prepares the notification mail for a cardset
	 * @param {cardset} cardset - The cardset
	 * @param {string} user_id - id of user
	 */
	prepareMail (cardset, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var notifier = new Notifications();
			var cards = notifier.getActiveCardsCount(cardset._id, user_id);
			var subject = TAPi18n.__('mailNotification.subjectTitle', {lastAppTitle: Meteor.settings.public.welcome.title.last}, Meteor.settings.mail.language);
			var name = TAPi18n.__('mailNotification.textIntro', null, Meteor.settings.mail.language) + notifier.getName(user_id) + ",";
			var text = TAPi18n.__('mailNotification.textIntro1', null, Meteor.settings.mail.language) + TAPi18n.__('mailNotification.newCards1', null, Meteor.settings.mail.language);
			var bold;
			var textEnd;
			if (cards === 1) {
				subject += TAPi18n.__('mailNotification.subjectSingular1', null, Meteor.settings.mail.language) + cards + TAPi18n.__('mailNotification.subjectSingular2', null, Meteor.settings.mail.language);
				bold = cards + TAPi18n.__('mailNotification.newCards2Singular', null, Meteor.settings.mail.language) + '"' + cardset.name + '"';
			} else {
				subject += TAPi18n.__('mailNotification.subjectPlural1', null, Meteor.settings.mail.language) + cards + TAPi18n.__('mailNotification.subjectPlural2', null, Meteor.settings.mail.language);
				bold = cards + TAPi18n.__('mailNotification.newCards2Plural', null, Meteor.settings.mail.language) + '"' + cardset.name + '"';
			}
			subject += TAPi18n.__('mailNotification.subjectCardset', null, Meteor.settings.mail.language) + '"' + cardset.name + '"' + TAPi18n.__('mailNotification.subjectEnd', null, Meteor.settings.mail.language);
			textEnd = TAPi18n.__('mailNotification.textEnd', null, Meteor.settings.mail.language) + this.getDeadline(cardset, user_id);
			this.sendMail(name, this.getMail(user_id), subject, text, bold, textEnd, cardset._id, "#3d9c19", "#328114");
		}
	}

	/**
	 * Prepares the reset mail for a cardset
	 * @param {Cardset} cardset - The cardset
	 * @param {string} user_id - id of user
	 */
	prepareMailReset (cardset, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var notifier = new Notifications();
			var subject = TAPi18n.__('mailNotification.subjectReset', null, Meteor.settings.mail.language) + '"' + cardset.name + '"';
			var text = TAPi18n.__('mailNotification.mailCard', null, Meteor.settings.mail.language) + cardset.name + TAPi18n.__('mailNotification.mailCard1', null, Meteor.settings.mail.language) + "\n\n";
			var name = TAPi18n.__('mailNotification.textIntro', null, Meteor.settings.mail.language) + notifier.getName(user_id) + ",";
			text += this.getDeadline(cardset, user_id);
			this.sendMail(name, this.getMail(user_id), subject, text, "", "", cardset._id, "#d70000", "#a40000");
		}
	}

	/**
	 * Sends the newsletter to a user
	 * @param {string} mail - Mail address of user
	 * @param {string} subject - The mail subject
	 * @param {string} text - The Mail content
	 * @param {string} cardsetId - The id of the cardset for the link
	 * @param {string} titleColor - The rgb color of the title background
	 * @param {string} buttonColor - The rgb color of the button background
	 */
	sendMail (name, mail, subject, text, bold, textEnd, cardsetId, titleColor, buttonColor) {
		var datenschutz = TAPi18n.__('contact.datenschutz', null, Meteor.settings.mail.language);
		var agb = TAPi18n.__('contact.agb', null, Meteor.settings.mail.language);
		var impressum = TAPi18n.__('contact.impressum', null, Meteor.settings.mail.language);
		var service = TAPi18n.__('mailNotification.service',  {lastAppTitle: Meteor.settings.public.welcome.title.last}, Meteor.settings.mail.language);
		var unsubscribe = TAPi18n.__('mailNotification.unsubscribe', null, Meteor.settings.mail.language);
		var copyright = TAPi18n.__('mailNotification.copyright',  {lastAppTitle: Meteor.settings.public.welcome.title.last}, Meteor.settings.mail.language);
		var myCardset = TAPi18n.__('mailNotification.my-cardset', null, Meteor.settings.mail.language);
		var autoGenerated = TAPi18n.__('mailNotification.auto-generated', null, Meteor.settings.mail.language);
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			if (mail) {
				var html = SSR.render("newsletter", {
					name: name,
					message: text,
					title: subject,
					bold: bold,
					textEnd: textEnd,
					id: cardsetId,
					url: Meteor.settings.public.rooturl,
					titlecolor: titleColor,
					btncol: buttonColor,
					datenschutz: datenschutz,
					impressum: impressum,
					agb: agb,
					service: service,
					unsubscribe: unsubscribe,
					copyright: copyright,
					cardset: myCardset,
					autoGenerated: autoGenerated
				});
				Email.send({
					from: Meteor.settings.mail.senderAddress,
					to: mail,
					subject: subject,
					html: html
				});
			}
		}
	}
}

Meteor.methods({
	sendTestMail: function () {
		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}
		let settings = AdminSettings.findOne({name: "testNotifications"});
		let target = Meteor.users.findOne({_id: settings.target});
		Meteor.users.update({
				"_id": settings.testUserID
			},
			{
				$set: {
					"email": target.email,
					"profile.givenname": target.profile.givenname,
					"profile.birthname": target.profile.birthname
				}
			}
		);
		let mail = new MailNotifier();
		let cardset = Cardsets.findOne({_id: settings.testCardsetID});
		mail.prepareMail(cardset, settings.testUserID);
	}
});
