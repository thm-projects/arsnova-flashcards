import {Meteor} from "meteor/meteor";
import {LeitnerLearningWorkload} from "../imports/api/subscriptions/leitner/leitnerLearningWorkload";
import {Cardsets} from "../imports/api/subscriptions/cardsets";
import {MailNotifier} from "./sendmail.js";
import {WebNotifier} from "./sendwebpush.js";
import {Bonus} from "../imports/util/bonus";
import {LeitnerUtilities} from "../imports/util/leitner.js";
import {ServerSettings} from "../imports/util/settings";
import {LeitnerActivationDay} from "../imports/api/subscriptions/leitner/leitnerActivationDay";
import {LeitnerLearningPhase} from "../imports/api/subscriptions/leitner/leitnerLearningPhase";
import {LeitnerLearningPhaseUtilities} from "../imports/util/learningPhase";

/** Function gets called when the learning-phase ended and excludes the cardset from the leitner algorithm
 *  @param {Object} learningPhase - The the active learning-phase
 * */
function disableLearningPhaseAndWorkloads(learningPhase) {
	if (!Meteor.isServer) {
		throw new Meteor.Error("not-authorized");
	} else {
		LeitnerLearningPhase.update({
			_id: learningPhase._id
		}, {
			$set: {
				isActive: false
			}
		});
		LeitnerLearningWorkload.update({
			learning_phase_id: learningPhase._id
		}, {
			$set: {
				isActive: false
			}
		}, {multi: true});
	}
}

function missedDeadlineCheck(learningPhase, cardUnlockedDate) {
	cardUnlockedDate = moment(cardUnlockedDate);
	cardUnlockedDate.add(learningPhase.daysBeforeReset, 'days');
	//Compensate for the 24h cronjob interval
	cardUnlockedDate.subtract(1, 'hour');
	return cardUnlockedDate <= moment();
}

Meteor.methods({
	/** Function gets called by the leitner Cronjob and checks which users are valid for receiving new cards / getting reset for missing the deadline / in which cardset the learning-phase ended*/
	updateLeitnerCards: function () {
		if (!Meteor.isServer) {
			throw new Meteor.Error("not-authorized");
		} else {
			let leitnerLearningPhase = LeitnerLearningPhase.find({isActive: true}).fetch();
			let cronjobStartDate = new Date();
			if (Meteor.settings.debug.leitner) {
				console.log(`Found ${leitnerLearningPhase.length} active leitner learning phases.`);
			}
			leitnerLearningPhase.forEach(learningPhase => {
				//Set the bonusStats for the associated card set
				let bonusText = '';
				let canExecuteNormalCronjobRun = true;
				if (learningPhase.isBonus) {
					bonusText = '(Bonus)';
					canExecuteNormalCronjobRun = moment(learningPhase.end).isAfter(cronjobStartDate);
					Cardsets.update({
						_id: learningPhase.cardset_id
					}, {
						$set: {
							bonusStatus: LeitnerLearningPhaseUtilities.setLeitnerBonusStatus(learningPhase, cronjobStartDate)
						}
					});
				}

				cronjobStartDate = moment(cronjobStartDate);
				let cardset = Cardsets.findOne({_id: learningPhase.cardset_id});
				if (canExecuteNormalCronjobRun) {
					let leitnerWorkloads = LeitnerLearningWorkload.find({learning_phase_id: learningPhase._id}).fetch();
					if (Meteor.settings.debug.leitner) {
						console.log(`Found ${leitnerWorkloads.length} active workloads for learning phase: [${learningPhase._id}]${bonusText} in cardset [${cardset.name}]`);
					}
					leitnerWorkloads.forEach(workload => {
						//Check if workload is enabled for active private learning phases
						if (workload.isActive === false && !learningPhase.isBonus) {
							LeitnerLearningWorkload.update({
								_id: workload._id,
							}, {
								$set: {
									isActive: true
								}
							});
						}

						let workloadCreatedDate = moment(workload.createdAt);
						//Check if user joined the learning phase on the same day as the cronjob gets executed
						if (!workloadCreatedDate.isSame(cronjobStartDate, 'date')) {
							let user = Meteor.users.findOne({_id: workload.user_id});
							//Check if the user learned all cards in his workload
							if (workload.activeCardCount === 0) {
								LeitnerUtilities.setCards(learningPhase, workload, cardset, user, false);
							} else if (missedDeadlineCheck(learningPhase, workload.activationDate)) {
								console.log(`===> Missed deadline for workload [${workload._id}]${bonusText} in cardset [${cardset.name}]: Resetting cards.\n`);
								LeitnerUtilities.resetCards(learningPhase, workload, cardset, user);
							} else {
								let activationDay = LeitnerActivationDay.findOne({
									workload_id: workload._id
								}, {sort: {createdAt: -1}});
								Meteor.call('prepareMail', cardset, user, 1, false, activationDay._id);
								Meteor.call('prepareWebpush', cardset, user, 1, false, activationDay._id);
								if (Meteor.settings.debug.leitner) {
									console.log(`===> Nothing to do for workload [${workload._id}]${bonusText} in cardset [${cardset.name}]: Sending reminder messages.\n`);
								}
							}
						} else {
							if (Meteor.settings.debug.leitner) {
								console.log(`===> Skipped workload [${workload._id}]${bonusText} in cardset [${cardset.name}]: Join Date matches cronjob Date.\n`);
							}
						}
					});
				} else {
					if (Meteor.settings.debug.leitner) {
						console.log(`Disable learning phase: [${learningPhase._id}]${bonusText} in cardset [${cardset.name}]\n`);
					}
					disableLearningPhaseAndWorkloads(learningPhase._id);
				}
			});
		}
	},
	prepareMail: function (cardset, user, messageType = 0, isNewcomer = false, activation_day_id = undefined) {
		if (Meteor.isServer && ServerSettings.isMailEnabled()) {
			let canSendMail = (user.mailNotification && !isNewcomer && Roles.userIsInRole(user._id, ['admin', 'editor', 'university', 'lecturer', 'pro']) && !Roles.userIsInRole(user._id, ['blocked', 'firstLogin']));
			let activationDay = LeitnerActivationDay.findOne({_id: activation_day_id});
			let learningPhase = LeitnerLearningPhase.findOne({_id: activationDay.learning_phase_id});
			if (Bonus.isInBonus(cardset._id, user._id) && learningPhase !== undefined && learningPhase.forceNotifications.mail && (user.email !== undefined && user.email.length) && !isNewcomer) {
				canSendMail = true;
			}
			if (canSendMail) {
				try {
					if (Meteor.settings.debug.leitner) {
						switch (messageType) {
							case 1:
								console.log("===> Sending E-Mail reminder Message");
								break;
							case 2:
								console.log("===> Sending E-Mail reset Message");
								break;
							default:
								console.log("===> Sending new E-Mail Message");
						}
					}
					MailNotifier.prepareMail(cardset, user._id, learningPhase, messageType);
					if (activation_day_id !== undefined) {
						LeitnerActivationDay.update({
								_id: activation_day_id
							},
							{
								$set: {
									'notifications.mail.active': true,
									'notifications.mail.sent': true,
									'notifications.mail.address': user.email
								}
							}
						);
					}
				} catch (error) {
					console.log(`[${TAPi18n.__('admin-settings.test-notifications.sendMail')}] ${error}`);
				}
			}
		}
	},
	prepareWebpush: function (cardset, user, messageType = 0, isNewcomer = false, activation_day_id = undefined) {
		if (Meteor.isServer && ServerSettings.isPushEnabled()) {
			let canSendPush = (user.webNotification && !isNewcomer);
			let activationDay = LeitnerActivationDay.findOne({_id: activation_day_id});
			let learningPhase = LeitnerLearningPhase.findOne({_id: activationDay.learning_phase_id});
			if (Bonus.isInBonus(cardset._id, user._id) && learningPhase !== undefined && learningPhase.forceNotifications.push && !isNewcomer) {
				canSendPush = true;
			}
			if (canSendPush) {
				try {
					let web = new WebNotifier();
					if (Meteor.settings.debug.leitner) {
						console.log("===> Sending Webpush reminder Message");
					}
					web.prepareWeb(cardset, user._id, learningPhase,undefined, messageType);
					if (activation_day_id !== undefined) {
						LeitnerActivationDay.update({
								_id: activation_day_id
							},
							{
								$set: {
									'notifications.web.active': true,
									'notifications.web.sent': true
								}
							}
						);
					}
				} catch (error) {
					console.log(`[${TAPi18n.__('admin-settings.test-notifications.sendWeb')}] ${error}`);
				}
			}
		}
	}
});
