import "./modal.html";
import {Session} from "meteor/session";
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
					Router.go('create');
				}
				break;
			case 2:
				if (Route.isRepetitorium()) {
					setTimeout(function () {
						MainNavigation.focusSearchBar();
					}, 500);
				} else {
					Router.go('repetitorium');
				}
				break;
			case 3:
				if (Route.isPool()) {
					setTimeout(function () {
						MainNavigation.focusSearchBar();
					}, 500);
				} else {
					Router.go('pool');
				}
				break;
			case 4:
				Router.go('learn');
				break;
			case 5:
				if (Route.isMyCardsets()) {
					setTimeout(function () {
						MainNavigation.focusSearchBar();
					}, 500);
				} else {
					Router.go('create');
				}
				break;
			case 6:
				if (Route.isPersonalRepetitorien()) {
					setTimeout(function () {
						MainNavigation.focusSearchBar();
					}, 500);
				} else {
					Router.go('personalRepetitorien');
				}
				break;
			case 7:
				Router.go('transcript');
				break;
		}
	});
	$('#useCasesModal').on('show.bs.modal', function () {
		Session.set('useCasesModalOpen', true);
		Session.set('isNewCardset', true);
		Session.set('useCaseType', 0);
		Session.set('useCaseSelectedCardType', -1);
		$('.setCardTypeUseCase').html(TAPi18n.__('card.chooseCardType'));
		$('.setCardTypeUseCase').val(-1);
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
