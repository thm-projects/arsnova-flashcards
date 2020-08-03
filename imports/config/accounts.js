import {accountSubmitHook} from "../util/accounts";

AccountsTemplates.configure({
	// Behavior
	confirmPassword: true,
	enablePasswordChange: true,
	forbidClientAccountCreation: false,
	overrideLoginErrors: false,
	sendVerificationEmail: true,
	enforceEmailVerification: true,
	lowercaseUsername: true,
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
	termsUrl: 'agb'
});
