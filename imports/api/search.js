import {Meteor} from "meteor/meteor";
import {NavigatorCheck} from "./navigatorCheck";
import {MainNavigation} from "./mainNavigation";

export let Search = class Search {

	static adjustSearchResultWindowSize () {
		if (Meteor.user() || MainNavigation.isGuestLoginActive()) {
			let destination = $('.input-search:visible');
			let target = $('#searchResults');
			if (destination.length && target.length) {
				let offsetTop = (destination.offset().top + destination.height());
				let leftOffset;
				if (!NavigatorCheck.isSmartphone()) {
					if (NavigatorCheck.isIOS()) {
						target.css('width', $(window).width() - (2 * destination.offset().left));
					}
					leftOffset = destination.offset().left;
					target.css('max-height', ($(window).height() - offsetTop));
					target.css('left', leftOffset);
					target.css('top', offsetTop);
				} else {
					target.removeAttr('style');
					target.css('max-height', ($(window).height() - $('#navbar-cards-top').height()));
					target.css('top', offsetTop);
					target.scrollTop(0);
				}
			}
		}
	}
};
