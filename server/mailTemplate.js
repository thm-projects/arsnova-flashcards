import {ServerStyle} from "../imports/util/styles";
import {Meteor} from "meteor/meteor";

Accounts.emailTemplates.siteName = Meteor.settings.public.rooturl;
Accounts.emailTemplates.from = Meteor.settings.mail.senderAddress;

let faq = TAPi18n.__('contact.faq', null, ServerStyle.getServerLanguage());
let datenschutz = TAPi18n.__('contact.datenschutz', null, ServerStyle.getServerLanguage());
let agb = TAPi18n.__('contact.agb', null, ServerStyle.getServerLanguage());
let impressum = TAPi18n.__('contact.impressum', null, ServerStyle.getServerLanguage());
let copyright = TAPi18n.__('notifications.mail.footer.copyright',  {lastAppTitle: ServerStyle.getLastAppTitle()}, ServerStyle.getServerLanguage());
let autoGenerated = TAPi18n.__('notifications.mail.footer.auto-generated', null, ServerStyle.getServerLanguage());


Accounts.emailTemplates.resetPassword = {
	subject() {
		if (Meteor.settings.mail.url.length) {
			return TAPi18n.__('loginModal.mails.passwordReset.subject', null, ServerStyle.getServerLanguage());
		}
	},
	html(user, url) {
		if (Meteor.settings.mail.url.length) {
			let title = TAPi18n.__('loginModal.mails.passwordReset.title', null, ServerStyle.getServerLanguage());
			let intro = TAPi18n.__('loginModal.mails.passwordReset.intro', {name: user.profile.givenname}, ServerStyle.getServerLanguage());
			let message = TAPi18n.__('loginModal.mails.passwordReset.message', {url: url}, ServerStyle.getServerLanguage());
			return Handlebars.templates['user-mail']({
				title: title,
				intro: intro,
				message: message,
				url: Meteor.settings.public.rooturl,
				faq: faq,
				datenschutz: datenschutz,
				impressum: impressum,
				agb: agb,
				copyright: copyright,
				autoGenerated: autoGenerated
			});
		}
	}
};

Accounts.emailTemplates.verifyEmail = {
	subject() {
		if (Meteor.settings.mail.url.length) {
			return TAPi18n.__('loginModal.mails.verify.subject', null, ServerStyle.getServerLanguage());
		}
	},
	html(user, url) {
		if (Meteor.settings.mail.url.length) {
			let title = TAPi18n.__('loginModal.mails.verify.title', null, ServerStyle.getServerLanguage());
			let intro = TAPi18n.__('loginModal.mails.verify.intro', {name: user.profile.givenname}, ServerStyle.getServerLanguage());
			let message = TAPi18n.__('loginModal.mails.verify.message', {url: url}, ServerStyle.getServerLanguage());
			return Handlebars.templates['user-mail']({
				title: title,
				intro: intro,
				message: message,
				url: Meteor.settings.public.rooturl,
				faq: faq,
				datenschutz: datenschutz,
				impressum: impressum,
				agb: agb,
				copyright: copyright,
				autoGenerated: autoGenerated
			});
		}
	}
};
