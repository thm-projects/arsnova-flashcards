import {Meteor} from "meteor/meteor";
import {Email} from "meteor/email";
import {Notifications} from "./notifications.js";
import {AdminSettings} from "../imports/api/subscriptions/adminSettings.js";
import {Cardsets} from "../imports/api/subscriptions/cardsets.js";
import {getAuthorName} from "../imports/util/userData";
import {ServerStyle} from "../imports/util/styles";
import * as config from "../imports/config/notifications.js";
import {LeitnerLearningWorkloadUtilities} from "../imports/util/learningWorkload";
import {LeitnerLearningPhase} from "../imports/api/subscriptions/leitner/leitnerLearningPhase";

/**
 * Class used for sending the newsletter mail
 */
export class MailNotifier {
	/**
	 * Gets the mail address of a user
	 * @param {string} user_id - id of user
	 * @return  mail address of user
	 */
	static getMail(user_id) {
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
	 * @param {Object} learningPhase - The active learning phase
	 * 	 * @param {number} messageType 0 = new, 1 = reminder, 2 = reset
	 */
	static prepareMail(cardset, user_id, learningPhase, messageType = 0) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			let firstName = getAuthorName(user_id, false, true);
			let leitnerWorkload = LeitnerLearningWorkloadUtilities.getActiveWorkload(cardset._id, user_id);
			let cards = Notifications.getActiveCardsCount(leitnerWorkload, user_id);
			let deadline = Notifications.getDeadline(learningPhase, leitnerWorkload, user_id);

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

	static prepareErrorReportingsMail(cardsets) {
		function getErrorMessage(error) {
			let errorMessage = "";
			if (error.error.type.includes(0)) {
				errorMessage += `<li>${TAPi18n.__('modal-card.errorReporting.spellingMistake', null, ServerStyle.getServerLanguage())}</li>`;
			}
			if (error.error.type.includes(1)) {
				errorMessage += `<li>${TAPi18n.__('modal-card.errorReporting.missingPicture', null, ServerStyle.getServerLanguage())}</li>`;
			}
			if (error.error.type.includes(2)) {
				errorMessage += `<li>${TAPi18n.__('modal-card.errorReporting.layoutMistake', null, ServerStyle.getServerLanguage())}</li>`;
			}
			if (error.error.type.includes(3)) {
				errorMessage += `<li>${TAPi18n.__('modal-card.errorReporting.brokenLink', null, ServerStyle.getServerLanguage())}</li>`;
			}
			if (error.error.content.length) {
				errorMessage += `<li>${TAPi18n.__('modal-card.errorReporting.otherError', null, ServerStyle.getServerLanguage())}:<br>${error.error.content}</li>`;
			}
			return errorMessage;
		}
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			for (const cardset of cardsets) {
				cardset.reporting.error.content = getErrorMessage(cardset.reporting);
			}
			const user_id = cardsets[0].owner;

			const subject = TAPi18n.__('notifications.mail.error.subject', null, ServerStyle.getServerLanguage());
			const headerTitle = TAPi18n.__('notifications.mail.error.subject', null, ServerStyle.getServerLanguage());
			const bodyTitle = TAPi18n.__('notifications.mail.error.bodyTitle', {count: cardsets.length}, ServerStyle.getServerLanguage());
			const bodyText = TAPi18n.__('notifications.mail.error.bodyText', null, ServerStyle.getServerLanguage());
			const headerColors = config.mailColors.header.leitner.reminder;

			const faq = TAPi18n.__('contact.faq', null, ServerStyle.getServerLanguage());
			const datenschutz = TAPi18n.__('contact.datenschutz', null, ServerStyle.getServerLanguage());
			const agb = TAPi18n.__('contact.agb', null, ServerStyle.getServerLanguage());
			const impressum = TAPi18n.__('contact.impressum', null, ServerStyle.getServerLanguage());
			const service = TAPi18n.__('notifications.mail.footer.service', {lastAppTitle: ServerStyle.getLastAppTitle()}, ServerStyle.getServerLanguage());
			const unsubscribe = TAPi18n.__('notifications.mail.footer.unsubscribe', null, ServerStyle.getServerLanguage());
			const copyright = TAPi18n.__('notifications.mail.footer.copyright', {lastAppTitle: ServerStyle.getLastAppTitle()}, ServerStyle.getServerLanguage());
			const autoGenerated = TAPi18n.__('notifications.mail.footer.auto-generated', null, ServerStyle.getServerLanguage());

			const mail = this.getMail(user_id);

			if (!Meteor.isServer) {
				throw new Meteor.Error("not-authorized");
			} else {
				if (mail) {
					const html = SSR.render("errors", {
						headerTitle,
						bodyTitle,
						bodyText,
						cardsets,
						url: Meteor.settings.public.rooturl,
						headerBannerBackgroundColor: headerColors.banner.background,
						headerBannerTextColor: headerColors.banner.text,
						faq,
						datenschutz,
						impressum,
						agb,
						service,
						unsubscribe,
						copyright,
						autoGenerated,
						firstAppTitle: ServerStyle.getFirstAppTitle(),
						lastAppTitle: ServerStyle.getLastAppTitle()
					});

					Email.send({
						from: Meteor.settings.mail.senderAddress,
						to: mail,
						subject,
						html,
					});
				}
			}
		}
	}

	static sendMail(mail, subject, headerTitle, headerButton, bodyTitle, bodyGreetings, bodyMessage, cardsetId, headerColors) {
		let faq = TAPi18n.__('contact.faq', null, ServerStyle.getServerLanguage());
		let datenschutz = TAPi18n.__('contact.datenschutz', null, ServerStyle.getServerLanguage());
		let agb = TAPi18n.__('contact.agb', null, ServerStyle.getServerLanguage());
		let impressum = TAPi18n.__('contact.impressum', null, ServerStyle.getServerLanguage());
		let service = TAPi18n.__('notifications.mail.footer.service', {lastAppTitle: ServerStyle.getLastAppTitle()}, ServerStyle.getServerLanguage());
		let unsubscribe = TAPi18n.__('notifications.mail.footer.unsubscribe', null, ServerStyle.getServerLanguage());
		let copyright = TAPi18n.__('notifications.mail.footer.copyright', {lastAppTitle: ServerStyle.getLastAppTitle()}, ServerStyle.getServerLanguage());
		let autoGenerated = TAPi18n.__('notifications.mail.footer.auto-generated', null, ServerStyle.getServerLanguage());
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			if (mail) {
				const html = SSR.render("newsletter", {
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
		const cardset = Cardsets.findOne({_id: settings.testCardsetID});
		const learningPhase = LeitnerLearningPhase.findOne({cardset_id: cardset._id});
		MailNotifier.prepareMail(cardset, settings.testUserID, learningPhase, messageType);
	}
});
