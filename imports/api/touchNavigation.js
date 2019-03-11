import ZingTouch from "zingtouch";
import {Route} from "./route";
import {Session} from "meteor/session";
import {CardNavigation} from "./cardNavigation";

export let TouchNavigation = class TouchNavigation {
	static cards () {
		let element = document.getElementById('cardCarousel');
		let gesture = new ZingTouch.Swipe({});
		let region = new ZingTouch.Region(document.getElementById('cardCarousel'));
		region.bind(element, gesture, function (event) {
			if (!$('.input-search').is(":focus") && !$('#lightbox').is(":visible") && !$('.modal').is(":visible")) {
				if (event.detail.data[0].currentDirection >= 90 && event.detail.data[0].currentDirection <= 270) {
					if (CardNavigation.isVisible()) {
						if ((Route.isBox() || Route.isMemo()) && Session.get('isQuestionSide')) {
							CardNavigation.skipAnswer();
						} else {
							$('.scrollRight').click();
						}
					}
				} else {
					if (CardNavigation.isVisible()) {
						if ((Route.isBox() || Route.isMemo()) && Session.get('isQuestionSide')) {
							CardNavigation.skipAnswer(false);
						} else {
							$('.scrollLeft').click();
						}
					}
				}
			}
		}, false);
	}
};
