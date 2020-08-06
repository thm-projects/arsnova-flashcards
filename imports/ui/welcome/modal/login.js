import "./login.html";
import "../../../util/accounts.js";
import {Template} from "meteor/templating";

Template.loginModal.onCreated(function () {
	T9n.setLanguage('de');
});

Template.loginModal.onRendered(function () {
	$('#loginModal').on('show.bs.modal', function () {
		AccountsTemplates.setState('signIn');
	});
});

Template.loginModal.onDestroyed(function () {
	$(".modal-backdrop").remove();
});

Template['cards-login'].replaces('atForm');
