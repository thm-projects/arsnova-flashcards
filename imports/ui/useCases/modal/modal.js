import "./modal.html";
import {Session} from "meteor/session";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Route} from "../../../api/route";
import {MainNavigation} from "../../../api/mainNavigation";

//0 = Nothing
//1 = CreateCardIndex
//2 = GoToRepetitorium
//3 = GoToPool
//4 = GoToWorkload
Session.setDefault('useCaseType', 0);
Session.setDefault('useCaseSelectedCardType', -1);
Session.setDefault('useCasesModalOpen', false);
Session.setDefault('useCaseCardsets', undefined);
Session.setDefault('useCaseTarget', undefined);

/*
 * ############################################################################
 * useCasesModal
 * ############################################################################
 */

Template.useCasesModal.onRendered(function () {
	$('#useCasesModal').on('hidden.bs.modal', function () {
		Session.set('useCasesModalOpen', false);
		$('.setCardTypeUseCase').html(TAPi18n.__('card.chooseCardType'));
		$('.setCardTypeUseCase').val(-1);
		switch (Session.get('useCaseType')) {
			case 1:
				if (Route.isMyCardsets()) {
					$('#setCardsetFormModal').modal('show');
				} else {
					FlowRouter.go('create');
				}
				break;
			case 2:
				if (Route.isRepetitorium()) {
					setTimeout(function () {
						MainNavigation.focusSearchBar();
					}, 500);
				} else {
					FlowRouter.go('repetitorium');
				}
				break;
			case 3:
				if (Route.isPool()) {
					setTimeout(function () {
						MainNavigation.focusSearchBar();
					}, 500);
				} else {
					FlowRouter.go('pool');
				}
				break;
			case 4:
				FlowRouter.go('learn');
				break;
			case 5:
				FlowRouter.go('create');
				break;
			case 6:
				FlowRouter.go('personalRepetitorien');
				break;
			case 7:
				FlowRouter.go('transcriptsPersonal');
				break;
			case 8:
				FlowRouter.go('transcriptsBonus');
				break;
			case 9:
				FlowRouter.go('cardsetdetailsid', {
					_id: Session.get('useCaseTarget')
				});
				break;
		}
	});
	$('#useCasesModal').on('show.bs.modal', function () {
		Session.set('useCasesModalOpen', true);
		Session.set('isNewCardset', true);
		Session.set('useCaseType', 0);
		Session.set('useCaseSelectedCardType', -2);
		Session.set('useCaseTarget', undefined);
		$('.setCardTypeUseCase').html(TAPi18n.__('card.chooseCardType'));
		$('.setCardTypeUseCase').val(-1);
		Meteor.call('getUseCaseCardsets',function (error, result) {
			if (result) {
				Session.set('useCaseCardsets', result);
			}
		});
	});
});

Template.useCasesModal.helpers({
	getWelcomeMessage: function (firstName) {
		let time = moment().format('H');
		let greeting = "";
		if (time >= 0 && time < 12) {
			greeting = TAPi18n.__('useCases.modal.greeting.morning');
		} else if (time >= 12 && time < 18) {
			greeting = TAPi18n.__('useCases.modal.greeting.afternoon');
		} else {
			greeting = TAPi18n.__('useCases.modal.greeting.evening');
		}
		return TAPi18n.__('useCases.modal.text', {greeting: greeting, firstName: firstName});
	},
	getFirstName: function () {
		if (Meteor.user() && Meteor.user().profile.givenname !== undefined && Meteor.user().profile.givenname !== "") {
			return Meteor.user().profile.givenname;
		} else {
			return TAPi18n.__('useCases.modal.noName');
		}
	}
});
