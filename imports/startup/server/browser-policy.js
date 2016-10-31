import {BrowserPolicy} from 'meteor/browser-policy-common';

BrowserPolicy.framing.disallow();
BrowserPolicy.content.allowInlineScripts();
BrowserPolicy.content.disallowEval();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();

var trusted = ['https://*.google-analytics.com', 'https://*.mxpnl.com', 'https://*.zendesk.com', 'https://*.braintreegateway.com', 'https://git.thm.de', 'http://*.cloudflare.com'];

_.each(trusted, function (origin) {
  BrowserPolicy.content.allowOriginForAll(origin);
});
