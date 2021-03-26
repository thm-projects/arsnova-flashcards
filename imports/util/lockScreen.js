import {NavigatorCheck} from "./navigatorCheck";
import {defaultBackground, backgrounds} from "../config/lockScreen";

function getMaximumFromGameConfig(subConfig, current, style, title) {
	const mobile = NavigatorCheck.isSmartphone() || NavigatorCheck.isTablet();
	const landscape = NavigatorCheck.isLandscape();
	if (!mobile) {
		if (subConfig.desktop) {
			return [
				current > subConfig.desktop ? subConfig.desktop : current,
				style + title + ":" + subConfig.desktop + "px;"
			];
		}
	} else if (subConfig.mobile) {
		if (landscape) {
			if (subConfig.mobile.landscape) {
				return [
					current > subConfig.mobile.landscape ? subConfig.mobile.landscape : current,
					style + title + ":" + subConfig.mobile.landscape + "px;"
				];
			}
		} else {
			if (subConfig.mobile.portrait) {
				return [
					current > subConfig.mobile.portrait ? subConfig.mobile.portrait : current,
					style + title + ":" + subConfig.mobile.portrait + "px;"
				];
			}
		}
	}
	return [current, style];
}

export let LockScreen = class LockScreen {
	static setPomodoroCorner (options = "top_right") {
		const overlay = $("#pomodoroTimerOverlay")[0];
		const corner = options.split("_");
		if (corner[0] === "bottom") {
			overlay.style.setProperty("bottom", "0", "important");
		} else {
			overlay.style.bottom = "";
		}
		if (corner.length > 1 && corner[1] === "right") {
			overlay.style.setProperty("right", "0", "important");
		} else {
			overlay.style.right = "";
		}
	}

	static openGame (gameId, options) {
		LockScreen.hideBackground();
		let width = window.innerWidth, height = window.innerHeight, style = "border: none;";
		if (options) {
			if (options.maxWidth) {
				[width, style] = getMaximumFromGameConfig(options.maxWidth, width, style, 'max-width');
			}
			if (options.maxHeight) {
				[height, style] = getMaximumFromGameConfig(options.maxWidth, height, style, 'max-height');
			}
		}
		const elem = $('#gameModal .modal-dialog');
		elem.html('<iframe id="gameViewer" style="' + style + '" width="' + width + 'px" height="' + height +
			'px" src="/games/game' + gameId + '/index.html"></iframe>');
		if (options.background) {
			elem[0].style.setProperty("background", options.background, "important");
		} else {
			elem[0].style.setProperty("background", "var(--games-and-backgrounds-default-background)", "important");
		}
		LockScreen.setPomodoroCorner(options.clockPosition);
		$('#gameModal').modal('show').css("display", "flex");
		LockScreen.showNavbarForGamesAndBackgrounds(false);
	}

	static hideGame () {
		setTimeout(function () {
			$('#gameModal').modal('hide').css("display", "none");
		}, 1000);
	}

	static openBackground (backgroundId, options) {
		LockScreen.hideGame();
		const elem = $('#gameBackgroundModal .modal-dialog');
		elem.html('<iframe id="backgroundViewer" style="border: none;" width="' + window.innerWidth + 'px" height="' +
			window.innerHeight + 'px" src="/gameBackgrounds/background' + backgroundId + '/index.html"></iframe>');
		if (options.background) {
			elem[0].style.setProperty("background", options.background, "important");
		} else {
			elem[0].style.setProperty("background", "var(--games-and-backgrounds-default-background)", "important");
		}
		LockScreen.setPomodoroCorner(options.clockPosition);
		$('#gameBackgroundModal').modal('show').css("display", "flex");
		LockScreen.showNavbarForGamesAndBackgrounds(false);
	}

	static hideBackground () {
		setTimeout(function () {
			$('#gameBackgroundModal').modal('hide').css("display", "none");
		}, 1000);
	}

	static resize () {
		const modal = $('#gameBackgroundModal > .modal-dialog > iframe');
		if (modal.length) {
			modal.height(window.innerHeight + 'px');
			modal.width(window.innerWidth + 'px');
		}
		const gameModal = $('#gameModal > .modal-dialog > iframe');
		if (modal.length) {
			let height = gameModal.css('max-height') || window.innerHeight;
			let width = gameModal.css('max-width') || window.innerWidth;
			if (height > window.innerHeight) {
				height = window.innerHeight;
			}
			if (width > window.innerWidth) {
				width = window.innerWidth;
			}
			gameModal.height(height + 'px');
			gameModal.width(width + 'px');
		}
		LockScreen.showNavbarForGamesAndBackgrounds();
	}

	static filterByFeatures (configObject) {
		const mobile = NavigatorCheck.isTablet() || NavigatorCheck.isSmartphone();
		const safari = NavigatorCheck.isSafari();
		return configObject.filter((elem) => {
			if (elem.features) {
				if ((elem.features.mobile === false && mobile) ||
					(elem.features.safari === false && safari)) {
					return false;
				}
			}
			return true;
		});
	}

	static showNavbarForGamesAndBackgrounds (active) {
		const navbar = $('.lockScreenCarouselWrapper')[0];
		if (!navbar) {
			return;
		}
		if (active === true) {
			navbar.classList.add("active");
		} else if (active === false) {
			navbar.classList.remove("active");
		}
		const backgroundsQuery = $('#backgrounds');
		const heightBackgrounds = backgroundsQuery[0].offsetHeight;
		const heightGames = $('#games')[0].offsetHeight;
		let height;
		if (heightBackgrounds > 1000 && heightGames < 1000) {
			height = heightGames;
		} else if (heightGames > 1000 && heightBackgrounds < 1000) {
			height = heightBackgrounds;
		} else {
			height = heightBackgrounds > heightGames ? heightBackgrounds : heightGames;
		}
		if (height < 1) {
			height = backgroundsQuery.height();
		}
		navbar.style.bottom = -height + "px";
		$('.tab-content').css("height", height + "px");
	}

	static setBackgroundOverlayActive (active) {
		const backgroundElem = $('#background')[0].parentElement;
		const backgroundOverlay = $('#backgrounds')[0];
		const gameElem = $('#game')[0].parentElement;
		const gameOverlay = $('#games')[0];
		if (active) {
			backgroundOverlay.classList.add("active", "in");
			gameOverlay.classList.remove("active", "in");
			backgroundElem.classList.add("active");
			gameElem.classList.remove("active");
		} else {
			gameOverlay.classList.add("active", "in");
			backgroundOverlay.classList.remove("active", "in");
			gameElem.classList.add("active");
			backgroundElem.classList.remove("active");
		}
	}

	static initOwlCarousel (id) {
		$(id).owlCarousel({
			loop: true,
			margin: 10,
			nav: true,
			navText: [
				"<span class='fa fa-caret-left'></span>",
				"<span class='fa fa-caret-right'></span>"
			],
			autoplay: false,
			autoplayHoverPause: false,
			responsive: {
				0: {
					items: 1
				},
				450: {
					items: 2
				},
				600: {
					items: 3
				},
				1000: {
					items: 5
				}
			}
		});
	}

	static hideGameUI () {
		$("#pomodoroTimerOverlay")[0].style.display = "";
	}

	static changeToGameUI (activate) {
		const overlay = $("#pomodoroTimerOverlay");
		const timer = $(".pomodoroTimer");
		const clock = $(".pomodoroClock");
		if (activate) {
			if (!$('#gameBackgroundModal > .modal-dialog > iframe').length) {
				const background = backgrounds.find(elem => elem.id === defaultBackground);
				if (background) {
					LockScreen.openBackground(defaultBackground, background);
				}
			} else {
				$('#gameBackgroundModal').modal('show');
			}
			overlay[0].style.transition = "";
			overlay[0].style.setProperty("background-color", "unset", "important");
			timer[0].style.setProperty("width", "100%", "important");
			setTimeout(function () {
				overlay[0].style.transition = "all 1s";
				overlay[0].style.setProperty("height", "20%", "important");
				overlay[0].style.setProperty("display", "inline-block", "important");
				overlay[0].style.zIndex = "3300";
			});
			clock[0].style.setProperty("width", "auto", "important");
			setTimeout(function () {
				timer[0].style.setProperty("width", "20vh", "important");
				overlay[0].style.width = "unset";
				setTimeout(function () {
					LockScreen.showNavbarForGamesAndBackgrounds(true);
				});
			}, 1000);
		} else {
			overlay[0].style.height = "";
			overlay[0].style.right = "";
			overlay[0].style.bottom = "";
			overlay[0].style.backgroundColor = "";
			overlay[0].style.width = "";
			overlay[0].style.zIndex = "";
			clock[0].style.width = "";
			timer[0].style.width = "";
			setTimeout(function () {
				overlay[0].style.transition = "";
				timer[0].style.transition = "";
			}, 1000);
			LockScreen.hideBackground();
			LockScreen.hideGame();
		}
	}

	static checkAnimationActive () {
		const elem = $(".lockScreenCarouselWrapper");
		if (elem && elem[0] && elem[0].classList.contains("hidden")) {
			LockScreen.startBreakAnimation();
		}
	}

	static startBreakAnimation () {
		LockScreen.setBackgroundOverlayActive(true);
		LockScreen.changeToGameUI(true);
		const dom = $(".lockScreenCarouselWrapper")[0];
		dom.style.opacity = "0";
		dom.classList.remove("hidden");
		setTimeout(() => {
			dom.style.opacity = "1";
		}, 1000);
	}

	static endBreakAnimation () {
		const dom = $(".lockScreenCarouselWrapper")[0];
		if (dom) {
			dom.style.opacity = "0";
			dom.classList.add("hidden");
		}
		LockScreen.changeToGameUI(false);
	}
};

