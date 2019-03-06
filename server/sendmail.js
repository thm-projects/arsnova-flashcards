import {Meteor} from "meteor/meteor";
import {Email} from "meteor/email";
import {Bonus} from "../imports/api/bonus.js";
import {Leitner} from "../imports/api/learned.js";
import {Notifications} from "./notifications.js";
import {AdminSettings} from "../imports/api/adminSettings.js";
import {Cardsets} from "../imports/api/cardsets.js";
import {getAuthorName} from "../imports/api/userdata";
import {ServerStyle} from "../imports/api/styles";

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
			if (deadline.getTime() > cardset.learningEnd.getTime() && Bonus.isInBonus(cardset._id, user_id)) {
				return (TAPi18n.__('deadlinePrologue', null, ServerStyle.getServerLanguage()) + moment(cardset.learningEnd).locale("de").format("dddd, Do MMMM") + TAPi18n.__('deadlineEpilogue1', null, ServerStyle.getServerLanguage()));
			} else {
				return (TAPi18n.__('mailNotification.textDate1', null, ServerStyle.getServerLanguage()) + moment(deadline).locale("de").format("dddd, Do MMMM") + TAPi18n.__('mailNotification.textDate2', null, ServerStyle.getServerLanguage()));
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
			var firstName = getAuthorName(user_id, false, true);
			var cards = notifier.getActiveCardsCount(cardset._id, user_id);
			var subject = TAPi18n.__('mailNotification.subjectTitle', {lastAppTitle: ServerStyle.getLastAppTitle()}, ServerStyle.getServerLanguage());
			var name = TAPi18n.__('mailNotification.textIntro', {firstName: firstName[0]}, ServerStyle.getServerLanguage());
			var text = TAPi18n.__('mailNotification.textIntro1', null, ServerStyle.getServerLanguage()) + TAPi18n.__('mailNotification.newCards1', null, ServerStyle.getServerLanguage());
			var bold;
			var textEnd;
			if (cards === 1) {
				subject += TAPi18n.__('mailNotification.subjectSingular1', null, ServerStyle.getServerLanguage()) + cards + TAPi18n.__('mailNotification.subjectSingular2', null, ServerStyle.getServerLanguage());
				bold = cards + TAPi18n.__('mailNotification.newCards2Singular', null, ServerStyle.getServerLanguage()) + '»' + cardset.name + '«';
			} else {
				subject += TAPi18n.__('mailNotification.subjectPlural1', null, ServerStyle.getServerLanguage()) + cards + TAPi18n.__('mailNotification.subjectPlural2', null, ServerStyle.getServerLanguage());
				bold = cards + TAPi18n.__('mailNotification.newCards2Plural', null, ServerStyle.getServerLanguage()) + '»' + cardset.name + '«';
			}
			subject += TAPi18n.__('mailNotification.subjectCardset', null, ServerStyle.getServerLanguage()) + '»' + cardset.name + '«' + TAPi18n.__('mailNotification.subjectEnd', null, ServerStyle.getServerLanguage());
			textEnd = TAPi18n.__('mailNotification.textEnd', null, ServerStyle.getServerLanguage()) + this.getDeadline(cardset, user_id);
			this.sendMail(name, this.getMail(user_id), subject, text, bold, textEnd, cardset._id, "#33D275", "#FE5E3E");
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
			var firstName = getAuthorName(user_id, false, true);
			var subject = TAPi18n.__('mailNotification.subjectReset', null, ServerStyle.getServerLanguage()) + '»' + cardset.name + '«';
			var text = TAPi18n.__('mailNotification.mailCard', null, ServerStyle.getServerLanguage()) + cardset.name + TAPi18n.__('mailNotification.mailCard1', null, ServerStyle.getServerLanguage()) + "\n\n";
			var name = TAPi18n.__('mailNotification.textIntro', {firstName: firstName[0]}, ServerStyle.getServerLanguage());
			text += this.getDeadline(cardset, user_id);
			this.sendMail(name, this.getMail(user_id), subject, text, "", "", cardset._id, "#FE5E3E", "#33D275");
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
		var faq = TAPi18n.__('contact.faq', null, ServerStyle.getServerLanguage());
		var datenschutz = TAPi18n.__('contact.datenschutz', null, ServerStyle.getServerLanguage());
		var agb = TAPi18n.__('contact.agb', null, ServerStyle.getServerLanguage());
		var impressum = TAPi18n.__('contact.impressum', null, ServerStyle.getServerLanguage());
		var service = TAPi18n.__('mailNotification.service',  {lastAppTitle: ServerStyle.getLastAppTitle()}, ServerStyle.getServerLanguage());
		var unsubscribe = TAPi18n.__('mailNotification.unsubscribe', null, ServerStyle.getServerLanguage());
		var copyright = TAPi18n.__('mailNotification.copyright',  {lastAppTitle: ServerStyle.getLastAppTitle()}, ServerStyle.getServerLanguage());
		var myCardset = TAPi18n.__('mailNotification.my-cardset', null, ServerStyle.getServerLanguage());
		var autoGenerated = TAPi18n.__('mailNotification.auto-generated', null, ServerStyle.getServerLanguage());
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
					faq: faq,
					datenschutz: datenschutz,
					impressum: impressum,
					agb: agb,
					service: service,
					unsubscribe: unsubscribe,
					copyright: copyright,
					cardset: myCardset,
					autoGenerated: autoGenerated,
					firstAppTitle: ServerStyle.getFirstAppTitle(),
					lastAppTitle: ServerStyle.getLastAppTitle()
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
