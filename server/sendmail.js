import {Email} from "meteor/email";
import {Learned} from "../imports/api/learned.js";
import {Notifications} from "./notifications.js";

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
			var active = Learned.findOne({cardset_id: cardset._id, user_id: user_id, active: true});
			var deadline = new Date(active.currentDate.getTime() + cardset.daysBeforeReset * 86400000);
			if (deadline.getTime() > cardset.learningEnd.getTime()) {
				return (TAPi18n.__('deadlinePrologue', null, Meteor.settings.newsletterLanguage) + cardset.learningEnd.toLocaleDateString() + TAPi18n.__('deadlineEpilogue1', null, Meteor.settings.newsletterLanguage));
			} else {
				return (TAPi18n.__('mailNotification.textDate1', null, Meteor.settings.newsletterLanguage) + deadline.toLocaleDateString() + TAPi18n.__('mailNotification.textDate2', null, Meteor.settings.newsletterLanguage));
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
			var subject = TAPi18n.__('mailNotification.subjectTitle', null, Meteor.settings.newsletterLanguage);
			var text = TAPi18n.__('mailNotification.textIntro', null, Meteor.settings.newsletterLanguage) + notifier.getName(user_id) + TAPi18n.__('mailNotification.textIntro1', null, Meteor.settings.newsletterLanguage) + TAPi18n.__('mailNotification.newCards1', null, Meteor.settings.newsletterLanguage);

			if (cards === 1) {
				subject += TAPi18n.__('mailNotification.subjectSingular1', null, Meteor.settings.newsletterLanguage) + cards + TAPi18n.__('mailNotification.subjectSingular2', null, Meteor.settings.newsletterLanguage);
				text += cards + TAPi18n.__('mailNotification.newCards2Singular', null, Meteor.settings.newsletterLanguage);
			} else {
				subject += TAPi18n.__('mailNotification.subjectPlural1', null, Meteor.settings.newsletterLanguage) + cards + TAPi18n.__('mailNotification.subjectPlural2', null, Meteor.settings.newsletterLanguage);
				text += cards + TAPi18n.__('mailNotification.newCards2Plural', null, Meteor.settings.newsletterLanguage);
			}
			subject += TAPi18n.__('mailNotification.subjectCardset', null, Meteor.settings.newsletterLanguage) + cardset.name + TAPi18n.__('mailNotification.subjectEnd', null, Meteor.settings.newsletterLanguage);
			text += cardset.name + TAPi18n.__('mailNotification.textEnd', null, Meteor.settings.newsletterLanguage);
			this.sendMail(this.getMail(user_id), subject, text, cardset._id, "#3d9c19", "#328114");
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
			var subject = TAPi18n.__('mailNotification.subjectReset', null, Meteor.settings.newsletterLanguage) + cardset.name;
			var text = TAPi18n.__('mailNotification.textIntro', null, Meteor.settings.newsletterLanguage) + notifier.getName(user_id) + "\n\n" + TAPi18n.__('mailNotification.mailCard', null, Meteor.settings.newsletterLanguage) + cardset.name + TAPi18n.__('mailNotification.mailCard1', null, Meteor.settings.newsletterLanguage) + "\n\n";
			text += this.getDeadline(cardset, user_id);
			this.sendMail(this.getMail(user_id), subject, text, cardset._id, "#d70000", "#a40000");
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
	sendMail (mail, subject, text, cardsetId, titleColor, buttonColor) {
		var datenschutz = TAPi18n.__('footer.datenschutz', null, Meteor.settings.newsletterLanguage);
		var agb = TAPi18n.__('footer.agb', null, Meteor.settings.newsletterLanguage);
		var impressum = TAPi18n.__('footer.impressum', null, Meteor.settings.newsletterLanguage);
		var service = TAPi18n.__('mailNotification.service', null, Meteor.settings.newsletterLanguage);
		var unsubscribe = TAPi18n.__('mailNotification.unsubscribe', null, Meteor.settings.newsletterLanguage);
		var copyright = TAPi18n.__('mailNotification.copyright', null, Meteor.settings.newsletterLanguage);
		var myCardset = TAPi18n.__('mailNotification.my-cardset', null, Meteor.settings.newsletterLanguage);
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			if (mail) {
				var html = SSR.render("newsletter", {message: text, title: subject, id: cardsetId, url: Meteor.settings.public.rooturl, titlecolor: titleColor, btncol: buttonColor, datenschutz: datenschutz, impressum: impressum, agb: agb, service: service, unsubscribe: unsubscribe, copyright: copyright, cardset: myCardset});
				Email.send({
					from: '',
					to: mail,
					subject: subject,
					html: html
				});
			}
		}
	}
}
