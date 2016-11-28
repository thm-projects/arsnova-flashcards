import {BrowserPolicy} from 'meteor/browser-policy-common';

BrowserPolicy.framing.disallow();
BrowserPolicy.content.allowInlineScripts();
BrowserPolicy.content.disallowEval();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();

BrowserPolicy.content.allowOriginForAll('https://*.google-analytics.com');
BrowserPolicy.content.allowOriginForAll('https://*.mxpnl.com');
BrowserPolicy.content.allowOriginForAll('https://*.zendesk.com');
BrowserPolicy.content.allowOriginForAll('https://*.braintreegateway.com');
BrowserPolicy.content.allowOriginForAll('http://*.cloudflare.com');
BrowserPolicy.content.allowOriginForAll('https://git.thm.de');
