import {Session} from "meteor/session";
let firstTimeVisit = 'isFirstTimeVisit';

export let Route = class Route {
	/**
	 * Function checks if route is a Cardset
	 * @return {Boolean} Return true, when route is a Cardset.
	 */
	static isCardset () {
		return Router.current().route.getName() === "cardsetdetailsid" || Router.current().route.getName() === "cardsetcard";
	}
	/**
	 * Function checks if route is a card edit Mode
	 * @return {Boolean} Return true, when route is new Card or edit Card.
	 */
	static isEditMode () {
		return Router.current().route.getName() === "newCard" || Router.current().route.getName() === "editCard";
	}

	static isNewCard () {
		return Router.current().route.getName() === "newCard";
	}

	static isDemo () {
		return Router.current().route.getName() === "demo" || Router.current().route.getName() === "demolist";
	}

	/**
	 * Function checks if route is a presentation view
	 * @return {Boolean} Return true, when route is a presentation view.
	 */
	static isPresentation () {
		return (Router.current().route.getName() === "presentation" || Router.current().route.getName() === "presentationlist");
	}

	static isPresentationOrDemo () {
		return this.isPresentation() || this.isDemo();
	}

	static isEditModeOrPresentation () {
		return this.isEditMode() || this.isPresentationOrDemo();
	}

	/**
	 * Function checks if route is a Box
	 * @return {Boolean} Return true, when the current route is a Box.
	 */
	static isBox () {
		return Router.current().route.getName() === "box";
	}

	/**
	 * Function checks if route is a Cardset
	 * @return {Boolean} Return true, when route is a Memo.
	 */
	static isMemo () {
		return Router.current().route.getName() === "memo";
	}

	static isHome () {
		return Router.current().route.getName() === "home";
	}

	static isMyCardsets () {
		return Router.current().route.getName() === "create";
	}

	static isAllCardsets () {
		return Router.current().route.getName() === "alldecks";
	}

	static isWorkload () {
		return Router.current().route.getName() === "learn";
	}

	static isShuffle () {
		return Router.current().route.getName() === "shuffle";
	}

	static isEditShuffle () {
		return Router.current().route.getName() === "editshuffle";
	}

	static isRepetitorium () {
		return Router.current().route.getName() === "repetitorium";
	}

	static isPool () {
		return Router.current().route.getName() === "pool";
	}

	static isCourseIteration () {
		return Router.current().route.getName() === "courseIterations";
	}

	static isFirstTimeVisit () {
		if (localStorage.getItem(firstTimeVisit) === undefined || localStorage.getItem(firstTimeVisit) === null) {
			localStorage.setItem(firstTimeVisit, "true");
		}
		if ($(window).width() < 768) {
			this.setFirstTimeVisit();
		}
		Session.set('isFirstTimeVisit', localStorage.getItem(firstTimeVisit));
		return Session.get('isFirstTimeVisit') === "true";
	}


	static setFirstTimeVisit () {
		localStorage.setItem(firstTimeVisit, "false");
	}
};
