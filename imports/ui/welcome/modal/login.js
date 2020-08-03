import "./login.html";
import "../../../util/accounts.js";
import {Template} from "meteor/templating";

Template.loginModal.onRendered(function () {
	$('#loginModal').on('show.bs.modal', function () {
		AccountsTemplates.setState('signIn');
	});
});

Template.loginModal.onDestroyed(function () {
	$(".modal-backdrop").remove();
});

Template['override-atForm'].replaces('atForm');
Template['override-atResult'].replaces('atResult');
