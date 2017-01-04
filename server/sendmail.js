import {Email} from "meteor/email";
import {Learned} from "../imports/api/learned.js";

export class MailNotifier {

	getMail (user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var user = Meteor.users.find({_id: user_id}).fetch();
			return user[0].email;
		}
	}

	getName (user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var user = Meteor.users.find({_id: user_id}).fetch();
			return user[0].profile.name;
		}
	}

	getDeadline (cardset, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var active = Learned.findOne({cardset_id: cardset._id, user_id: user_id, active: true});
			var deadline = new Date(active.currentDate.getTime() + cardset.daysBeforeReset * 86400000);
			if (deadline.getTime() > cardset.learningEnd.getTime()) {
				return (TAPi18n.__('deadlinePrologue') + cardset.learningEnd.toLocaleDateString() + TAPi18n.__('deadlineEpilogue1'));
			} else {
				return (TAPi18n.__('mailNotification.textDate1') + deadline.toLocaleDateString() + TAPi18n.__('mailNotification.textDate2'));
			}
		}
	}

	getActiveCardsCount (cardset_id, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			return Learned.find({
				cardset_id: cardset_id,
				user_id: user_id,
				active: true
			}).count();
		}
	}

	prepareMail (cardset, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var cards = this.getActiveCardsCount(cardset._id, user_id);
			var subject = TAPi18n.__('mailNotification.subjectTitle');
			var text = TAPi18n.__('mailNotification.textIntro') + this.getName(user_id) + TAPi18n.__('mailNotification.textIntro1') + TAPi18n.__('mailNotification.newCards1');

			if (cards === 1) {
				subject += TAPi18n.__('mailNotification.subjectSingular1') + cards + TAPi18n.__('mailNotification.subjectSingular2');
				text += cards + TAPi18n.__('mailNotification.newCards2Singular');
			} else {
				subject += TAPi18n.__('mailNotification.subjectPlural1') + cards + TAPi18n.__('mailNotification.subjectPlural2');
				text += cards + TAPi18n.__('mailNotification.newCards2Plural');
			}
			subject += TAPi18n.__('mailNotification.subjectCardset') + cardset.name + TAPi18n.__('mailNotification.subjectEnd');
			text += cardset.name + TAPi18n.__('mailNotification.subjectEnd');
			this.sendMail(this.getMail(user_id), subject, text, cardset._id, "#3d9c19", "#328114");
		}
	}

	prepareMailReset (cardset, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var subject = TAPi18n.__('mailNotification.subjectReset') + cardset.name;
			var text = TAPi18n.__('mailNotification.textIntro') + this.getName(user_id) + "\n\n" + TAPi18n.__('mailNotification.mailCard') + cardset.name + TAPi18n.__('mailNotification.mailCard1') + "\n\n";
			text += this.getDeadline(cardset, user_id);
			this.sendMail(this.getMail(user_id), subject, text, cardset._id, "#d70000", "#a40000");
		}
	}

	sendMail (mail, subject, text, cardsetId, titleColor, buttonColor) {
		var datenschutz = TAPi18n.__('footer.datenschutz');
		var agb = TAPi18n.__('footer.agb');
		var impressum = TAPi18n.__('footer.impressum');
		var service = TAPi18n.__('mailNotification.service');
		var unsubscribe = TAPi18n.__('mailNotification.unsubscribe');
		var copyright = TAPi18n.__('mailNotification.copyright');
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			if (mail) {
				var html = SSR.render("newsletter", {message: text, title: subject, id: cardsetId, url: Meteor.settings.public.rooturl, titlecolor: titleColor, btncol: buttonColor, datenschutz: datenschutz, impressum: impressum, agb: agb, service: service, unsubscribe: unsubscribe, copyright: copyright});
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
