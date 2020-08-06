Template.registerHelper("isSignInState", function () {
	return AccountsTemplates.getState() === 'signIn';
});
