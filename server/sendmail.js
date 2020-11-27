import {Meteor} from "meteor/meteor";
import {Email} from "meteor/email";
import {Notifications} from "./notifications.js";
import {AdminSettings} from "../imports/api/subscriptions/adminSettings.js";
import {Cardsets} from "../imports/api/subscriptions/cardsets.js";
import {getAuthorName} from "../imports/util/userData";
import {ServerStyle} from "../imports/util/styles";
import * as config from "../imports/config/notifications.js";

/**
 * Class used for sending the newsletter mail
 */
export class MailNotifier {
	/**
	 * Gets the mail address of a user
	 * @param {string} user_id - id of user
	 * @return  mail address of user
	 */
	static getMail (user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var user = Meteor.users.find({_id: user_id}).fetch();
			return user[0].email;
		}
	}

	/**
	 * Prepares the notification mail for a cardset
	 * @param {cardset} cardset - The cardset
	 * @param {string} user_id - id of user
	 * @param {number} messageType 0 = new, 1 = reminder, 2 = reset
	 */
	static prepareMail (cardset, user_id, messageType= 0) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			let firstName = getAuthorName(user_id, false, true);
			let cards = Notifications.getActiveCardsCount(cardset._id, user_id);
			let deadline = Notifications.getDeadline(cardset, user_id);

			let subject;
			let headerTitle;
			let headerButton;
			let bodyTitle;
			let bodyGreetings;
			let bodyMessage;
			let headerColors;

			switch (messageType) {
				case 1:
					subject = TAPi18n.__('notifications.mail.leitner.reminder.subject', {cardset: cardset.name, cards: cards}, ServerStyle.getServerLanguage());
					headerTitle = TAPi18n.__('notifications.mail.leitner.reminder.header.title', {cardset: cardset.name, cards: cards}, ServerStyle.getServerLanguage());
					headerButton = TAPi18n.__('notifications.mail.leitner.reminder.header.button', {cards: cards}, ServerStyle.getServerLanguage());
					bodyTitle = TAPi18n.__('notifications.mail.leitner.reminder.body.title', null, ServerStyle.getServerLanguage());
					bodyGreetings = TAPi18n.__('notifications.mail.leitner.reminder.body.greetings', {user: firstName[0]}, ServerStyle.getServerLanguage());
					bodyMessage = TAPi18n.__('notifications.mail.leitner.reminder.body.message', {cardset: cardset.name, cards: cards, deadline: deadline}, ServerStyle.getServerLanguage());
					headerColors = config.mailColors.header.leitner.reminder;
					break;
				case 2:
					subject = TAPi18n.__('notifications.mail.leitner.reset.subject', {cardset: cardset.name, cards: cards}, ServerStyle.getServerLanguage());
					headerTitle = TAPi18n.__('notifications.mail.leitner.reset.header.title', {cardset: cardset.name, cards: cards}, ServerStyle.getServerLanguage());
					headerButton = TAPi18n.__('notifications.mail.leitner.reset.header.button', {cards: cards}, ServerStyle.getServerLanguage());
					bodyTitle = TAPi18n.__('notifications.mail.leitner.reset.body.title', null, ServerStyle.getServerLanguage());
					bodyGreetings = TAPi18n.__('notifications.mail.leitner.reset.body.greetings', {user: firstName[0]}, ServerStyle.getServerLanguage());
					bodyMessage = TAPi18n.__('notifications.mail.leitner.reset.body.message', {cardset: cardset.name, cards: cards, deadline: deadline}, ServerStyle.getServerLanguage());
					headerColors = config.mailColors.header.leitner.reset;
					break;
				default:
					subject = TAPi18n.__('notifications.mail.leitner.new.subject', {cardset: cardset.name, cards: cards}, ServerStyle.getServerLanguage());
					headerTitle = TAPi18n.__('notifications.mail.leitner.new.header.title', {cardset: cardset.name, cards: cards}, ServerStyle.getServerLanguage());
					headerButton = TAPi18n.__('notifications.mail.leitner.new.header.button', {cards: cards}, ServerStyle.getServerLanguage());
					bodyTitle = TAPi18n.__('notifications.mail.leitner.new.body.title', null, ServerStyle.getServerLanguage());
					bodyGreetings = TAPi18n.__('notifications.mail.leitner.new.body.greetings', {user: firstName[0]}, ServerStyle.getServerLanguage());
					bodyMessage = TAPi18n.__('notifications.mail.leitner.new.body.message', {cardset: cardset.name, cards: cards, deadline: deadline}, ServerStyle.getServerLanguage());
					headerColors = config.mailColors.header.leitner.new;
			}
			this.sendMail(this.getMail(user_id), subject, headerTitle, headerButton, bodyTitle, bodyGreetings, bodyMessage, cardset._id, headerColors);
		}
	}

	static sendMail (mail, subject, headerTitle, headerButton, bodyTitle, bodyGreetings, bodyMessage, cardsetId, headerColors) {
		let faq = TAPi18n.__('contact.faq', null, ServerStyle.getServerLanguage());
		let datenschutz = TAPi18n.__('contact.datenschutz', null, ServerStyle.getServerLanguage());
		let agb = TAPi18n.__('contact.agb', null, ServerStyle.getServerLanguage());
		let impressum = TAPi18n.__('contact.impressum', null, ServerStyle.getServerLanguage());
		let service = TAPi18n.__('notifications.mail.footer.service',  {lastAppTitle: ServerStyle.getLastAppTitle()}, ServerStyle.getServerLanguage());
		let unsubscribe = TAPi18n.__('notifications.mail.footer.unsubscribe', null, ServerStyle.getServerLanguage());
		let copyright = TAPi18n.__('notifications.mail.footer.copyright',  {lastAppTitle: ServerStyle.getLastAppTitle()}, ServerStyle.getServerLanguage());
		let autoGenerated = TAPi18n.__('notifications.mail.footer.auto-generated', null, ServerStyle.getServerLanguage());
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			if (mail) {
				var html = SSR.render("newsletter", {
					headerTitle: headerTitle,
					headerButton: headerButton,
					bodyTitle: bodyTitle,
					bodyGreetings: bodyGreetings,
					bodyMessage: bodyMessage,
					id: cardsetId,
					url: Meteor.settings.public.rooturl,
					headerBannerBackgroundColor: headerColors.banner.background,
					headerBannerTextColor: headerColors.banner.text,
					headerButtonBackgroundColor: headerColors.button.background,
					headerButtonTextColor: headerColors.button.text,
					faq: faq,
					datenschutz: datenschutz,
					impressum: impressum,
					agb: agb,
					service: service,
					unsubscribe: unsubscribe,
					copyright: copyright,
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
	sendTestMail: function (messageType = 0) {
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
		let cardset = Cardsets.findOne({_id: settings.testCardsetID});
		MailNotifier.prepareMail(cardset, settings.testUserID, messageType);
	}
});
