import {BrowserPolicy} from 'meteor/browser-policy-common';

BrowserPolicy.framing.disallow();
BrowserPolicy.content.disallowEval();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();

BrowserPolicy.content.allowOriginForAll('https://*.google-analytics.com');
BrowserPolicy.content.allowOriginForAll('https://*.youtube.com');
BrowserPolicy.content.allowOriginForAll('https://*.vimeo.com');
BrowserPolicy.content.allowOriginForAll('https://*.mxpnl.com');
BrowserPolicy.content.allowOriginForAll('https://*.zendesk.com');
BrowserPolicy.content.allowOriginForAll('https://*.braintreegateway.com');
BrowserPolicy.content.allowOriginForAll('https://*.cloudflare.com');
BrowserPolicy.content.allowOriginForAll('https://git.thm.de');
BrowserPolicy.content.allowOriginForAll('https://cdn.mathjax.org');
BrowserPolicy.content.allowOriginForAll('https://cdnjs.cloudflare.com');
BrowserPolicy.content.allowOriginForAll('https://fonts.googleapis.com');
BrowserPolicy.content.allowOriginForAll('https://fonts.gstatic.com');
BrowserPolicy.content.allowOriginForAll('https://dict.tu-chemnitz.de');
BrowserPolicy.content.allowOriginForAll('https://casual-effects.com');
BrowserPolicy.content.allowOriginForAll('https://homepages.thm.de');
BrowserPolicy.content.allowOriginForAll('https://homepages-fb.thm.de');

BrowserPolicy.content.allowImageOrigin('*');
