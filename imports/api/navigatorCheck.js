export let NavigatorCheck = class CardVisuals {

	static isIOS () {
		return ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
	}
};
