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

	getDeadline (cardset, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var active = Learned.findOne({cardset_id: cardset._id, user_id: user_id, active: true});
			var deadline = new Date(active.currentDate.getTime() + cardset.daysBeforeReset * 86400000);
			if (deadline.getTime() > cardset.learningEnd.getTime()) {
				return (TAPi18n.__('deadlinePrologue') + cardset.learningEnd.toLocaleDateString() + TAPi18n.__('deadlineEpilogue1'));
			} else {
				return (TAPi18n.__('deadlinePrologue') + deadline.toLocaleDateString() + TAPi18n.__('deadlineEpilogue2'));
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
			var text = TAPi18n.__('mailNotification.textIntro') + TAPi18n.__('mailNotification.newCards1');

			if (cards === 1) {
				subject += TAPi18n.__('mailNotification.subjectSingular1') + cards + TAPi18n.__('mailNotification.subjectSingular2');
				text += cards + TAPi18n.__('mailNotification.newCards2Singular');
			} else {
				subject += TAPi18n.__('mailNotification.subjectPlural1') + cards + TAPi18n.__('mailNotification.subjectPlural2');
				text += cards + TAPi18n.__('mailNotification.newCards2Plural');
			}
			subject += TAPi18n.__('mailNotification.subjectCardset') + cardset.name + TAPi18n.__('mailNotification.subjectEnd');
			text += cardset.name + ".\n\n" + this.getDeadline(cardset, user_id) + TAPi18n.__('mailNotification.greetings');
			this.sendMail(this.getMail(user_id), subject, text);
		}
	}

	prepareMailReset (cardset, user_id) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var cards = this.getActiveCardsCount(cardset._id, user_id);
			var subject = TAPi18n.__('mailNotification.subjectReset') + cardset.name;
			var text = TAPi18n.__('mailNotification.textIntro') + TAPi18n.__('mailNotification.textReset');

			if (cards === 1) {
				text += cards + TAPi18n.__('mailNotification.newCards2Singular');
			} else {
				text += cards + TAPi18n.__('mailNotification.newCards2Plural');
			}
			text += cardset.name + ".\n\n" + this.getDeadline(cardset, user_id) + TAPi18n.__('mailNotification.greetings');
			this.sendMail(this.getMail(user_id), subject, text);
		}
	}

	prepareMailEnded (cardset, learners) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			var subject = TAPi18n.__('mailNotification.subjectTitle') + TAPi18n.__('mailNotification.subjectEnding') + cardset.name;
			var text = TAPi18n.__('mailNotification.textIntroEnding') + TAPi18n.__('mailNotification.textEnding') + cardset.name + TAPi18n.__('mailNotification.greetings');
			for (var i = 0; i < learners.length; i++) {
				this.sendMail(this.getMail(learners[i].user_id), subject, text);
			}
		}
	}

	sendMail (mail, subject, text) {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			if (mail) {
				var html = SSR.render("newletter", {message: text, title: subject});
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
