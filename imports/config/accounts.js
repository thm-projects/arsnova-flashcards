import {accountSubmitHook} from "../util/accounts";

AccountsTemplates.configure({
	// Behavior
	confirmPassword: true,
	enablePasswordChange: true,
	forbidClientAccountCreation: false,
	overrideLoginErrors: false,
	sendVerificationEmail: true,
	enforceEmailVerification: true,
	lowercaseUsername: false,
	focusFirstInput: true,

	// Appearance
	showAddRemoveServices: true,
	showForgotPasswordLink: true,
	showLabels: true,
	showPlaceholders: true,
	showResendVerificationEmailLink: true,

	// Client-side Validation
	continuousValidation: true,
	negativeFeedback: true,
	negativeValidation: true,
	positiveValidation: true,
	positiveFeedback: true,
	showValidating: true,

	// Hooks
	onSubmitHook: accountSubmitHook,

	// Privacy Policy and Terms of Use
	privacyUrl: 'datenschutz',
	termsUrl: 'agb',

	// Translation modifications need to be inserted here. A normal i18n support is not possible on cards
	// Use https://github.com/meteor-useraccounts/core/blob/master/Guide.md#i18n as a guide
	// Some custom input fields need to be modified at /imports/util/accounts.js
	// The basic modal title is located in the i18n folder
	texts: {
		errors: {
			verifyEmailFirst: "Bitte verifiziere zuerst deine E-Mail."
		}
	}
});
