import "./login.html";
import "../../../util/accounts.js";
import {Template} from "meteor/templating";
import {LoginTasks} from "../../../util/login";

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

Template.redirectPasswordReset.onRendered(function () {
	LoginTasks.setLoginRedirect();
});

Template['cards-login'].replaces('atForm');
Template['cards-terms-link'].replaces('atTermsLink');
Template['email-verified-dialog'].replaces("_justVerifiedEmailDialog");
Template['reset-password-dialog'].replaces("_resetPasswordDialog");
Template['just-reset-password-dialog'].replaces("_justResetPasswordDialog");
