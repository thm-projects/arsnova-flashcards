import {AccountUtils} from "../../../util/accounts";

Template.registerHelper("isSignInState", function () {
	return AccountsTemplates.getState() === 'signIn';
});


Template.registerHelper("isSignUpState", function () {
	return AccountsTemplates.getState() === 'signUp';
});

Template.registerHelper("getWhitelistedDomains", function () {
	return AccountUtils.getWhitelistedDomains();
});
