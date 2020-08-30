import {accountSubmitHook} from "../util/accounts";

// Minimum Field lengths have to be defined in /imports/util/accounts.js

let options = {
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
	// The Captcha has to be disabled by default in order for local development support. It will be enabled on the production and staging servers through the settings.json file.
	showReCaptcha: false,

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
	// This file usually just contains the Strings that the official translation doesn't seem to touch
	// You can get a full list of available translation fields at: https://github.com/meteor-useraccounts/core/blob/master/lib/core.js#L272
	// Some custom input fields need to be modified at /imports/util/accounts.js
	// The basic modal title is located in the i18n folder
	texts: {
		errors: {
			verifyEmailFirst: "Bitte verifiziere zuerst deine Mail-Adresse."
		},
		info: {
			signUpVerifyEmail: "Erfolgreiche Registrierung! Bitte überprüfe deine Mailbox und folge den Anweisungen."
		},
		minRequiredLength: "Erforderliche Mindestlänge"
	}
};

if (Meteor.settings.public.reCaptcha.enabled) {
	options.showReCaptcha = true;
}

AccountsTemplates.configure(options);
