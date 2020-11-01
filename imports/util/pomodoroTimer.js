import {Session} from "meteor/session";
import {Bonus} from "./bonus.js";
import {Cardsets} from "../api/subscriptions/cardsets.js";
import {Route} from "./route.js";
import swal from "sweetalert2";
import * as config from "../config/pomodoroTimer.js";
import {LeitnerTasks} from "../api/subscriptions/leitnerTasks";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {ServerStyle} from "./styles";
import {NavigatorCheck} from "./navigatorCheck";
import {Fullscreen} from "./fullscreen";

if (Meteor.isClient) {
	Session.set('pomodoroBreakActive', false);
	Session.setDefault('presentationPomodoroActive', false);
}

/*This is a ton of script, mostly popups, so strap in for a wild ride!*/
/*endPom is the angle of the minute hand at which the work period will end.*/
let defaultEndPom = 0;
let endPom = defaultEndPom;

/*the angle at which the break will end*/
let defaultEndBreak = 0;
let endBreak = defaultEndBreak;

/*the number of cycles completed since beginning the session*/
let defaultTotalPoms = 0;
let totalPoms = defaultTotalPoms;

/*what goal was set in the session begin popup. default one.*/
let goalPoms;

/*this is the beginning of the red progress tracking arc*/
let pomBeginAngle = 0;
let breakBeginAngle = 0;
/*how long to work in each cycle*/
let pomLength;

/*how long to break each cycle*/
let breakLength;

/*is it running?*/
let defaultPomRunning = false;
let pomRunning = defaultPomRunning;
let defaultBreakRunning = false;
let breakRunning = defaultBreakRunning;

let isClockInBigmode = false;
let cloudShown = true;

//which pomodoro sound
let isBellSoundEnabled;
let isSuccessSoundEnabled;
let isFailSoundEnabled;

let pomodoroInterval;

let workloadTimerInterval;

let isFullscreenEnabled;

export let PomodoroTimer = class PomodoroTimer {

	static setCloudShown (value) {
		cloudShown = value;
	}

	static isClockInBigmode () {
		return isClockInBigmode;
	}

	static clockHandler (option) {
		switch (option) {
			case 0:
				isBellSoundEnabled = !isBellSoundEnabled;
				break;
			case 1:
				isSuccessSoundEnabled = !isSuccessSoundEnabled;
				break;
			case 2:
				isFailSoundEnabled = !isFailSoundEnabled;
				break;
			case 3:
				isFullscreenEnabled = !isFullscreenEnabled;
				break;
		}
	}

	static startInterval () {
		PomodoroTimer.interval();
		if (pomodoroInterval === undefined) {
			pomodoroInterval = setInterval(function () {
				PomodoroTimer.interval();
			}, 1000);
		}
	}

	static clearInterval () {
		clearInterval(pomodoroInterval);
		pomodoroInterval = undefined;
	}

	/*The following code snippet is a life saver and was found on stack overflow. It allows you to draw an arc around a circle in svg using only the polar coordinates.*/
	static polarToCartesian (centerX, centerY, radius, angleInDegrees) {
		let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

		return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		};
	}

	static describeArc (x, y, radius, startAngle, endAngle) {
		let start = this.polarToCartesian(x, y, radius, endAngle);
		let end = this.polarToCartesian(x, y, radius, startAngle);

		let arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

		let d = [
			"M", start.x, start.y,
			"A", radius, radius, 0, arcSweep, 0, end.x, end.y
		].join(" ");

		return d;
	}

	/*this function rotates the hands of the clock based on the time.*/
	static setRotation (el, deg) {
		el.attr('transform', 'rotate(' + deg + ' 50 50)');
	}

	static setMinutePoisition () {
		this.setRotation($(".pomodoroMin"), this.getMinuteRotation());
	}

	static setHourPosition () {
		this.setRotation($(".pomodoroHour"), this.getHourRotation());
	}

	static getMinuteRotation () {
		let date = new Date();
		return 6 * date.getMinutes() + date.getSeconds() / 10;
	}

	static getHourRotation () {
		let date = new Date();
		return 30 * (date.getHours() % 12) + date.getMinutes() / 2;
	}

	static updateArcs () {
		let d = new Date();
		if (pomRunning) {
			/*goes and draws the necessary arcs around the circle*/
			$(".progressArc").attr("d", this.describeArc(50, 50, 44, pomBeginAngle, endPom));
			$(".pomArc").attr("d", this.describeArc(50, 50, 44, 6 * d.getMinutes() + d.getSeconds() / 10, endPom));
			$(".breakArc").attr("d", this.describeArc(50, 50, 44, endPom, endBreak));
		} else {
			$(".pomArc").attr("d", this.describeArc(0, 0, 0, 0, 0));
			$(".progressArc").attr("d", this.describeArc(0, 0, 0, 0, 0));
			$(".breakArc").attr("d", this.describeArc(0, 0, 0, 0, 0));
		}
	}

	static startBreakAlert () {
		let dialogue = {
			title: "",
			html: "",
			cancel: "",
			confirm: ""
		};
		pomRunning = false;

		/*the bell to signify the end of a period*/
		if (isBellSoundEnabled) {
			config.bellSound.play();
		}

		/*a work period just ended, so increase the total pomodoros done by one.*/
		totalPoms++;

		/*erase all the arcs, because you want the next period to start when the confirm button is clicked, not immediately after the previous period. That gives you time to finish what you were doing without being penalized.*/
		this.updateArcs();
		/*the first sweet alert! This is what pops up when you finish a pomodoro. It congradulates the user and lets them start their break when they are ready. There is no option to stop the session in this box, that function is relegated to the second click on the clock, as noted by the title.*/
		if (Route.isPresentation() || Route.isDemo()) {
			dialogue.title = TAPi18n.__('sweetAlert.pomodoro.presentation.break.start.title');
			dialogue.html = TAPi18n.__('sweetAlert.pomodoro.presentation.break.start.text', {
				pomodoroBreak: breakLength,
				pomodoroTotal: totalPoms,
				pomodoro: TAPi18n.__('pomodoro.name', {count: totalPoms})
			});
			dialogue.confirm = TAPi18n.__('sweetAlert.pomodoro.presentation.break.start.button.confirm');
		} else {
			if (Bonus.isInBonus(FlowRouter.getParam('_id'))) {
				dialogue.title = TAPi18n.__('sweetAlert.pomodoro.bonus.break.start.title');
				dialogue.html = TAPi18n.__('sweetAlert.pomodoro.bonus.break.start.text', {
					pomodoroBreak: breakLength,
					pomodoroTotal: totalPoms,
					pomodoro: TAPi18n.__('pomodoro.name', {count: totalPoms})
				});
				dialogue.confirm = TAPi18n.__('sweetAlert.pomodoro.bonus.break.start.button.confirm');
			} else {
				dialogue.title = TAPi18n.__('sweetAlert.pomodoro.user.break.start.title');
				dialogue.html = TAPi18n.__('sweetAlert.pomodoro.user.break.start.text', {
					pomodoroBreak: breakLength,
					pomodoroTotal: totalPoms,
					pomodoro: TAPi18n.__('pomodoro.name', {count: totalPoms})
				});
				dialogue.confirm = TAPi18n.__('sweetAlert.pomodoro.user.break.start.button.confirm');
			}
		}
		this.updateServerTimerIntervalStop();
		if (Route.isBox() || Route.isMemo()) {
			this.showPomodoroFullsize();
		}
		swal.fire({
			title: dialogue.title,
			html: dialogue.html,
			type: "success",
			confirmButtonText: dialogue.confirm,
			allowOutsideClick: false
		}).then(() => {
			if (Fullscreen.getChooseModeSession() === 1) {
				Fullscreen.enable();
			}
			/*and this is what runs when the user clicks the confirm button on the popup. It starts the break, and gets the current time and sets the end from there.*/
			if (Route.isBox()) {
				Meteor.call('startLeitnerBreak', FlowRouter.getParam('_id'));
				this.updateServerTimerIntervalStart();
			}
			breakRunning = true;
			Session.set('pomodoroBreakActive', breakRunning);
			let popTime = new Date();
			breakBeginAngle = 6 * popTime.getMinutes() + popTime.getSeconds() / 10;
			endBreak = 6 * popTime.getMinutes() + popTime.getSeconds() / 10 + 6 * breakLength;
		});
	}

	static endBreakAlert () {
		let dialogue = {
			title: "",
			html: "",
			cancel: "",
			confirm: ""
		};
		breakRunning = false;
		Session.set('pomodoroBreakActive', breakRunning);
		if (isBellSoundEnabled) {
			config.bellSound.play();
		}

		$(".progressArc").attr("d", this.describeArc(0, 0, 0, 0, 0));
		$(".breakArc").attr("d", this.describeArc(0, 0, 0, 0, 0));
		/*in the pomodoro productivity set up, every 4 pomodoros you get a 15 minute break. I decided to make it proportional to the user chosen break length. If you just did 3 pomodoros, your next break will be longer, and if you have just completed your 4th break, this sets the break length back to 5mins*/
		if (Route.isDemo()) {
			if ((totalPoms + 1) % config.defaultDemoSettings.longBreak.goal === 0) {
				breakLength = config.defaultDemoSettings.longBreak.length;
			} else if (totalPoms % config.defaultDemoSettings.longBreak.goal === 0) {
				breakLength = config.defaultDemoSettings.break.length;
			}
		} else if (Route.isPresentation()) {
			if ((totalPoms + 1) % config.defaultPresentationSettings.longBreak.goal === 0) {
				breakLength = config.defaultPresentationSettings.longBreak.length;
			} else if (totalPoms % config.defaultPresentationSettings.longBreak.goal === 0) {
				breakLength = config.defaultPresentationSettings.break.length;
			}
		} else {
			if (Bonus.isInBonus(FlowRouter.getParam('_id'))) {
				let leitnerTask = LeitnerTasks.findOne({}, {sort: {createdAt: -1}});
				leitnerTask.timer.workload.completed++;
				breakLength = this.getCurrentBreakLength(leitnerTask);
			} else {
				if ((totalPoms + 1) % config.defaultSettings.longBreak.goal === 0) {
					breakLength = config.defaultSettings.longBreak.length;
				} else if (totalPoms % config.defaultSettings.longBreak.goal === 0) {
					breakLength = config.defaultSettings.break.length;
				}
			}
		}
		if (Route.isPresentation() || Route.isDemo()) {
			dialogue.title = TAPi18n.__('sweetAlert.pomodoro.presentation.break.end.title');
			dialogue.html = TAPi18n.__('sweetAlert.pomodoro.presentation.break.end.text', {
				pomodoroLength: pomLength
			});
			dialogue.confirm = TAPi18n.__('sweetAlert.pomodoro.presentation.break.end.button.confirm');
		} else {
			if (Bonus.isInBonus(FlowRouter.getParam('_id'))) {
				dialogue.title = TAPi18n.__('sweetAlert.pomodoro.bonus.break.end.title');
				dialogue.html = TAPi18n.__('sweetAlert.pomodoro.bonus.break.end.text', {
					pomodoroLength: pomLength
				});
				dialogue.confirm = TAPi18n.__('sweetAlert.pomodoro.bonus.break.end.button.confirm');
			} else {
				dialogue.title = TAPi18n.__('sweetAlert.pomodoro.user.break.end.title');
				dialogue.html = TAPi18n.__('sweetAlert.pomodoro.user.break.end.text', {
					pomodoroLength: pomLength
				});
				dialogue.confirm = TAPi18n.__('sweetAlert.pomodoro.user.break.end.button.confirm');
			}
		}
		this.updateServerTimerIntervalStop();
		swal.fire({
			title: dialogue.title,
			html: dialogue.html,
			confirmButtonText: dialogue.confirm,
			allowOutsideClick: false
		}).then(() => {
			if (Fullscreen.getChooseModeSession() === 1) {
				Fullscreen.enable();
			}
			/*starts the work cycle up again, automatically.*/
			if (Route.isBox()) {
				Meteor.call('endLeitnerBreak', FlowRouter.getParam('_id'));
				PomodoroTimer.updateServerTimerIntervalStart();
			}
			if (Route.isBox() || Route.isMemo()) {
				this.showPomodoroNormal();
			}
			pomRunning = true;
			let popTime = new Date();
			endPom = 6 * popTime.getMinutes() + popTime.getSeconds() / 10 + 6 * pomLength;
			endBreak = endPom + 6 * breakLength;
			pomBeginAngle = 6 * popTime.getMinutes() + popTime.getSeconds() / 10;
		});
	}

	/*the arcs around the clock get redrawn every second, as do the hands on the clock, thanks to this setInterval function. It runs every second.*/
	static interval () {
		/*here, we get the current time, and since there are 360 degrees around a circle, and 60 minutes in an hour, each minute is 360/60 = 6 degrees of rotation. multiply that by the number of minutes and add the seconds and their corresponding degree value and you get a minute hand that moves every second. Similar with the hour hand.*/
		let d = new Date();
		this.setMinutePoisition();
		this.setHourPosition();
		/*this if statement fixes a problem with drawing the arcs once the minute hand passes the hour. drawing the arcs only works if the second point on the circle is greater than the first, which is a problem if say, the beginning of the arc is at 300 degrees and the end passes 0 and ends at 15 degrees. this lets the arc get drawn correctly, and still trigger the end of work period event*/
		if (d.getMinutes() === 0 && d.getSeconds() < 5) {
			if (endPom >= 360) {
				endPom -= 360;
			}
			if (endBreak >= 360) {
				endBreak -= 360;
			}
		}

		/*this function runs every second as the work period progresses.*/
		this.updateArcs();

		/*this is the trigger to end the work period. it ends when the polar coodinates of the minute hand match the polar coodinates of the end of the work arc*/
		if ((6 * d.getMinutes() + d.getSeconds() / 10 >= endPom - 0.1 && 6 * d.getMinutes() + d.getSeconds() / 10 <= endPom + 0.1) && pomRunning) {
			this.startBreakAlert();
		}

		/*this is what runs every second while the break is active. It just draws the break arc and the progress arc behind it.*/
		if (breakRunning) {
			$(".progressArc").attr("d", this.describeArc(50, 50, 44, breakBeginAngle, endBreak));
			$(".breakArc").attr("d", this.describeArc(50, 50, 44, 6 * d.getMinutes() + d.getSeconds() / 10, endBreak));
		}

		/*this is what triggers when the angle of the minute hand matches the angle of the end of the break arc*/
		if ((6 * d.getMinutes() + d.getSeconds() / 10 >= endBreak - 0.1 && 6 * d.getMinutes() + d.getSeconds() / 10 <= endBreak + 0.1) && breakRunning) {
			this.endBreakAlert();
		}
	}

	/*updates the sentence in the modal under the place where you set your goal for the session with the correct total amount of time it will take to complete that many pomodoros. With correct grammar, which is why it's such a long function.*/
	static updateTimeParagraph () {
		let longBreak = breakLength * 3;
		let andString = "";
		let hourAmmount = Math.floor(((pomLength + breakLength) * goalPoms + (Math.floor(goalPoms / 4) * longBreak)) / 60);
		let minuteAmmount = ((pomLength + breakLength) * goalPoms + (Math.floor(goalPoms / 4) * longBreak)) % 60;
		if (hourAmmount && minuteAmmount) {
			andString = TAPi18n.__('pomodoro.form.time.and');
		}
		let hourString = "";
		let minuteString = "";
		if (hourAmmount !== 0) {
			hourString = " <span class='pomodoroHighlight'>" + TAPi18n.__('pomodoro.form.time.hour', {count: hourAmmount}) + "</span> ";
		}
		if (minuteAmmount !== 0) {
			minuteString = " <span class='pomodoroHighlight'>" + TAPi18n.__('pomodoro.form.time.minute', {count: minuteAmmount}) + "</span> ";
		}
		if (Route.isCardset()) {
			$("#workTime").html(TAPi18n.__('pomodoro.form.bonus.totalTime', {
				time: hourString + andString + minuteString
			}));
		} else {
			$("#workTime").html(TAPi18n.__('pomodoro.form.user.totalTime', {
				time: hourString + andString + minuteString
			}));
		}
	}

	static stop () {
		if (this.isPomodoroRunning()) {
			this.clickClock();
		}
	}

	/*if not in a session, clicking the clock opens the start up modal to begin one, and if you are in a session, clicking pops up a warning dialog before exiting the session  */
	static clickClock () {
		/*okay, so I tried this pen on my android phone and no sounds would play. Turns out that you need to attach sounds to a click function or they won't run on chrome for android. This empty sound allows the success and failure sounds to play, but not the bell sound. Oh well, this app wouldn't work on a phone anyway, because the screen would lock and exit it.*/
		let dialogue = {
			title: "",
			html: "",
			cancel: "",
			confirm: ""
		};
		let count = (goalPoms - totalPoms);
		if (pomRunning || breakRunning) {
			/*if you still haven't reached your goal, you are encouraged with an update of how many pomodoros and minutes you have left to reach it.*/
			if (totalPoms < goalPoms) {
				if (Route.isPresentation() || Route.isDemo()) {
					dialogue.title = TAPi18n.__('sweetAlert.pomodoro.presentation.end.title');
					dialogue.html = TAPi18n.__('sweetAlert.pomodoro.presentation.end.text', {
						pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
						pomodoroGoal: goalPoms
					});
					dialogue.cancel = TAPi18n.__('sweetAlert.pomodoro.presentation.end.button.cancel');
					dialogue.confirm = TAPi18n.__('sweetAlert.pomodoro.presentation.end.button.confirm');
				} else if (Bonus.isInBonus(FlowRouter.getParam('_id')) && Route.isBox()) {
					dialogue.title = TAPi18n.__('sweetAlert.pomodoro.bonus.quit.title');
					dialogue.html = TAPi18n.__('sweetAlert.pomodoro.bonus.quit.text', {
						missingPomodoros: count,
						pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
						pomodoroGoal: goalPoms,
						remainingMinutes: count * pomLength
					});
					dialogue.confirm = TAPi18n.__('sweetAlert.pomodoro.bonus.quit.button.confirm');
					dialogue.cancel = TAPi18n.__('sweetAlert.pomodoro.bonus.quit.button.cancel');
				} else {
					dialogue.title = TAPi18n.__('sweetAlert.pomodoro.user.quit.title');
					dialogue.html = TAPi18n.__('sweetAlert.pomodoro.user.quit.text', {
						missingPomodoros: count,
						pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
						pomodoroGoal: goalPoms,
						remainingMinutes: count * pomLength
					});
					dialogue.confirm = TAPi18n.__('sweetAlert.pomodoro.user.quit.button.confirm');
					dialogue.cancel = TAPi18n.__('sweetAlert.pomodoro.user.quit.button.cancel');
				}
				swal.fire({
					title: dialogue.title,
					type: "warning",
					html: dialogue.html,
					showCancelButton: true,
					confirmButtonText: dialogue.confirm,
					cancelButtonText: dialogue.cancel,
					allowOutsideClick: false
				}).then((result) => {
					if (result.value) {
						if (Route.isDemo()) {
							this.setPresentationPomodoro(true);
						}
					}
					/*If you give up before you complete your goal you get a failure sound, taken from a show me and my lady have been watching lately, and a failure box. Shame!*/
					if (!result.value) {
						if (!Route.isPresentation() && !Route.isDemo()) {
							if (isFailSoundEnabled) {
								config.failSound.play();
							}

							if (Bonus.isInBonus(FlowRouter.getParam('_id')) && Route.isBox()) {
								dialogue.title = TAPi18n.__('sweetAlert.pomodoro.bonus.quit.confirm.title');
								dialogue.html = TAPi18n.__('sweetAlert.pomodoro.bonus.quit.confirm.text', {
									pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
									pomodoroGoal: goalPoms
								});
								dialogue.confirm = TAPi18n.__('sweetAlert.pomodoro.bonus.quit.confirm.button.confirm');
							} else {
								dialogue.title = TAPi18n.__('sweetAlert.pomodoro.user.quit.confirm.title');
								dialogue.html = TAPi18n.__('sweetAlert.pomodoro.user.quit.confirm.text', {
									pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
									pomodoroGoal: goalPoms
								});
								dialogue.confirm = TAPi18n.__('sweetAlert.pomodoro.user.quit.confirm.button.confirm');
							}
							swal.fire({
								title: dialogue.title,
								html: dialogue.html,
								type: "error",
								allowOutsideClick: false,
								confirmButtonText: dialogue.confirm
							}).then(() => {
								this.setPresentationPomodoro(true);
								PomodoroTimer.showPomodoroNormal();
								if (Route.isHome()) {
									Fullscreen.disable();
								}
								if ((Route.isBox() || Route.isMemo())) {
									Session.set('pomodoroBreakActive', false);
									if (Bonus.isInBonus(FlowRouter.getParam('_id'), Meteor.userId())) {
										FlowRouter.go('cardsetdetailsid', {
											_id: FlowRouter.getParam('_id')
										});
									}
								}
							});
						}
					}
				});
			} else {
				/*So if you've completed your goal for the session you get this friendlier pop up congradulating you and lightly suggesting you keep working.*/
				if (Route.isPresentation() || Route.isDemo()) {
					dialogue.title = TAPi18n.__('sweetAlert.pomodoro.presentation.end.title');
					dialogue.html = TAPi18n.__('sweetAlert.pomodoro.presentation.end.text', {
						pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
						pomodoroGoal: goalPoms
					});
					dialogue.cancel = TAPi18n.__('sweetAlert.pomodoro.presentation.end.button.cancel');
					dialogue.confirm = TAPi18n.__('sweetAlert.pomodoro.presentation.end.button.confirm');
				} else if (Bonus.isInBonus(FlowRouter.getParam('_id'))) {
					dialogue.title = TAPi18n.__('sweetAlert.pomodoro.bonus.end.title');
					dialogue.html = TAPi18n.__('sweetAlert.pomodoro.bonus.end.text', {
						pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
						pomodoroGoal: goalPoms
					});
					dialogue.cancel = TAPi18n.__('sweetAlert.pomodoro.bonus.end.button.cancel');
					dialogue.confirm = TAPi18n.__('sweetAlert.pomodoro.bonus.end.button.confirm');
				} else {
					dialogue.title = TAPi18n.__('sweetAlert.pomodoro.user.end.title');
					dialogue.html = TAPi18n.__('sweetAlert.pomodoro.user.end.text', {
						pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
						pomodoroGoal: goalPoms
					});
					dialogue.cancel = TAPi18n.__('sweetAlert.pomodoro.user.end.button.cancel');
					dialogue.confirm = TAPi18n.__('sweetAlert.pomodoro.user.end.button.confirm');
				}
				swal.fire({
					title: dialogue.title,
					type: "warning",
					html: dialogue.html,
					showCancelButton: true,
					confirmButtonText: dialogue.confirm,
					cancelButtonText: dialogue.cancel,
					allowOutsideClick: false
				}).then((result) => {
					/*you succeeded so you get the success sound and a success message. good for you! */
					if (result.value) {
						if (!Route.isPresentation() && !Route.isDemo()) {
							if (isSuccessSoundEnabled) {
								config.successSound.play();
							}
							if (Bonus.isInBonus(FlowRouter.getParam('_id'))) {
								dialogue.title = TAPi18n.__('sweetAlert.pomodoro.bonus.end.confirm.title');
								dialogue.html = TAPi18n.__('sweetAlert.pomodoro.bonus.end.confirm.text', {
									pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
									pomodoroTotal: totalPoms,
									pomodoroTime: pomLength * totalPoms
								});
								dialogue.confirm = TAPi18n.__('sweetAlert.pomodoro.bonus.end.confirm.button.confirm');
							} else {
								dialogue.title = TAPi18n.__('sweetAlert.pomodoro.user.end.confirm.title');
								dialogue.html = TAPi18n.__('sweetAlert.pomodoro.user.end.confirm.text', {
									pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
									pomodoroTotal: totalPoms,
									pomodoroTime: pomLength * totalPoms
								});
								dialogue.confirm = TAPi18n.__('sweetAlert.pomodoro.user.end.confirm.button.confirm');
							}
							swal.fire({
								title: dialogue.title,
								html: dialogue.html,
								type: "success",
								allowOutsideClick: false,
								confirmButtonText: dialogue.confirm
							}).then(() => {
								PomodoroTimer.showPomodoroNormal();
								if (Route.isHome()) {
									Fullscreen.disable();
								}
								if ((Route.isBox() || Route.isMemo())) {
									Session.set('pomodoroBreakActive', false);
									if (Bonus.isInBonus(FlowRouter.getParam('_id'), Meteor.userId())) {
										FlowRouter.go('cardsetdetailsid', {
											_id: FlowRouter.getParam('_id')
										});
									}
								}
							});
						}
						this.setPresentationPomodoro(true);
					}
				});
			}
		} else {
			if (!Bonus.isInBonus(FlowRouter.getParam('_id')) && (!Route.isMemo() || !Route.isBox())) {
				/*and if you're not currently in a session, this activates the starting pop up*/
				$("#pomodoroTimerModal").modal();
			}
		}
	}

	/*gets the goal number of pomodoros*/
	static updatePomNumSlider () {
		if (Route.isCardset()) {
			$('#pomNumLabel').html(TAPi18n.__('pomodoro.form.bonus.count', {
				count: this.getGoalPoms(),
				link: TAPi18n.__('pomodoro.form.link'),
				tooltip: TAPi18n.__('pomodoro.form.tooltip.link', {pomodoro: TAPi18n.__('pomodoro.name')}),
				pomodoro: TAPi18n.__('pomodoro.name', {count: this.getGoalPoms()})
			}));
		} else {
			$('#pomNumLabel').html(TAPi18n.__('pomodoro.form.user.count', {
				count: this.getGoalPoms(),
				link: TAPi18n.__('pomodoro.form.link'),
				tooltip: TAPi18n.__('pomodoro.form.tooltip.link', {pomodoro: TAPi18n.__('pomodoro.name')}),
				pomodoro: TAPi18n.__('pomodoro.name', {count: this.getGoalPoms()})
			}));
		}
		goalPoms = this.getGoalPoms();
		this.updateTimeParagraph();
	}

	static resetTimer () {
		/*reset everything*/
		totalPoms = 0;
		pomRunning = false;
		breakRunning = false;
		Session.set('presentationPomodoroActive', false);
		$(".progressArc").attr("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
		$(".pomArc").attr("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
		$(".breakArc").attr("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
	}

	static getGoalPoms () {
		return parseInt($('#pomNumSlider').val());
	}

	/*hides the goal box, shows the place where you can change the pomodoro length*/
	static updateSettingsBtn () {
		if (Route.isPresentation() || Route.isDemo()) {
			$("#modalTitle").html(TAPi18n.__('pomodoro.form.presentation.title'));
		} else if (!Route.isCardset()) {
			$("#settings").toggle();
			$("#goalDiv").toggle();
			if ($("#modalTitle").html() === TAPi18n.__('pomodoro.form.user.title')) {
				$("#modalTitle").html(TAPi18n.__('pomodoro.form.user.settings.title'));
			} else {
				$("#modalTitle").html(TAPi18n.__('pomodoro.form.user.title'));
			}
		}
	}

	/*when you update the work slider or input box or the break ones, it updates the total time and makes sure you didn't go over 60 minutes total work and break time per cycle. I could probably refactor all the following code. Someday!*/
	static updateWorkSlider () {
		pomLength = this.getPomLength();
		let minuteString = TAPi18n.__('pomodoro.form.time.minute', {count: pomLength});
		if (Route.isPresentation() || Route.isDemo()) {
			$('#workSliderLabel').html(TAPi18n.__('pomodoro.form.presentation.work', {
				minutes: minuteString
			}));
		} else if (Route.isCardset()) {
			$('#workSliderLabel').html(TAPi18n.__('pomodoro.form.bonus.work', {
				minutes: minuteString
			}));
		} else {
			$('#workSliderLabel').html(TAPi18n.__('pomodoro.form.user.work', {
				minutes: minuteString
			}));
		}
		if (pomLength + breakLength > 60) {
			breakLength = 60 - pomLength;
			$('#breakSlider').val(breakLength);
			this.updateBreakSlider();
		}
		this.updateTimeParagraph();
	}

	static getPomLength () {
		return parseInt($('#workSlider').val(), 10);
	}

	static updateBreakSlider () {
		breakLength = this.getBreakLength();
		let minuteString = TAPi18n.__('pomodoro.form.time.minute', {count: breakLength});
		if (Route.isPresentation() || Route.isDemo()) {
			$('#breakSliderLabel').html(TAPi18n.__('pomodoro.form.presentation.break', {
				minutes: minuteString
			}));
		} else if (Route.isCardset()) {
			$('#breakSliderLabel').html(TAPi18n.__('pomodoro.form.bonus.break', {
				minutes: minuteString
			}));
		} else {
			$('#breakSliderLabel').html(TAPi18n.__('pomodoro.form.user.break', {
				minutes: minuteString
			}));
		}
		if (pomLength + breakLength > 60) {
			pomLength = 60 - breakLength;
			$('#workSlider').val(pomLength);
			this.updateWorkSlider();
		}
		this.updateTimeParagraph();
	}

	static getBreakLength () {
		return parseInt($('#breakSlider').val(), 10);
	}

	static getFullscreenConfig () {
		return isFullscreenEnabled;
	}

	static getSoundConfig () {
		return [isBellSoundEnabled, isSuccessSoundEnabled, isFailSoundEnabled];
	}

	static initializeModalContent () {
		$('#pomNumSlider').val(goalPoms);
		this.updatePomNumSlider();
		let workSlider = $('#workSlider');
		if (Route.isDemo()) {
			workSlider.attr('max', config.defaultDemoSettings.work.max);
			workSlider.attr('min', config.defaultDemoSettings.work.min);
			workSlider.attr('step', config.defaultDemoSettings.work.step);
		} else if (Route.isPresentation()) {
			workSlider.attr('max', config.defaultPresentationSettings.work.max);
			workSlider.attr('min', config.defaultPresentationSettings.work.min);
			workSlider.attr('step', config.defaultPresentationSettings.work.step);
		} else {
			workSlider.attr('max', config.defaultSettings.work.max);
			if (Meteor.settings.public.debug.leitnerTimer) {
				workSlider.attr('min', 1);
				workSlider.attr('step', 1);
			} else {
				workSlider.attr('min', config.defaultSettings.work.min);
				workSlider.attr('step', config.defaultSettings.work.step);
			}
		}
		$('#workSlider').val(pomLength);
		this.updateWorkSlider();
		let breakSlider = $('#breakSlider');
		if (Route.isDemo()) {
			breakSlider.attr('max', config.defaultDemoSettings.break.max);
			breakSlider.attr('min', config.defaultDemoSettings.break.min);
			breakSlider.attr('step', config.defaultDemoSettings.break.step);
		} else if (Route.isPresentation()) {
			breakSlider.attr('max', config.defaultPresentationSettings.break.max);
			breakSlider.attr('min', config.defaultPresentationSettings.break.min);
			breakSlider.attr('step', config.defaultPresentationSettings.break.step);
		} else {
			breakSlider.attr('max', config.defaultSettings.break.max);
			if (Meteor.settings.public.debug.leitnerTimer) {
				breakSlider.attr('min', 1);
				breakSlider.attr('step', 1);
			} else {
				breakSlider.attr('min', config.defaultSettings.break.min);
				breakSlider.attr('step', config.defaultSettings.break.step);
			}
		}
		breakSlider.val(breakLength);
		this.updateBreakSlider();
		this.updateSettingsBtn();
		if (!Route.isCardset() && !Route.isPresentation() && !Route.isDemo()) {
			$("#settings").css('display', 'none');
			$("#goalDiv").css('display', 'block');
		}
		$('#sound1').prop('checked', isBellSoundEnabled);
		$('#sound2').prop('checked', isSuccessSoundEnabled);
		$('#sound3').prop('checked', isFailSoundEnabled);
		Session.set('pomodoroSoundConfig', [isBellSoundEnabled, isSuccessSoundEnabled, isFailSoundEnabled]);
	}

	static initializeVariables () {
		Session.set('pomodoroBreakActive', false);
		totalPoms = defaultTotalPoms;
		endPom = defaultEndPom;
		endBreak = defaultEndBreak;
		pomRunning = defaultPomRunning;
		breakRunning = defaultBreakRunning;
		// Only used for landing page pomodoro
		isFullscreenEnabled = true;
		if (Route.isBox()) {
			let leitnerTask = LeitnerTasks.findOne({user_id: Meteor.userId(), cardset_id: FlowRouter.getParam('_id')});
			if (leitnerTask !== undefined && leitnerTask.pomodoroTimer !== undefined && leitnerTask.pomodoroTimer.soundConfig !== undefined) {
				goalPoms = leitnerTask.pomodoroTimer.quantity;
				pomLength = leitnerTask.pomodoroTimer.workLength;
				breakLength = leitnerTask.pomodoroTimer.breakLength;
				isBellSoundEnabled = leitnerTask.pomodoroTimer.soundConfig[0];
				isSuccessSoundEnabled = leitnerTask.pomodoroTimer.soundConfig[1];
				isFailSoundEnabled = leitnerTask.pomodoroTimer.soundConfig[2];
			} else {
				goalPoms = config.defaultSettings.goal;
				pomLength = config.defaultSettings.work.length;
				breakLength = config.defaultSettings.break.length;
				isBellSoundEnabled = config.defaultSettings.sounds.bell;
				isSuccessSoundEnabled = config.defaultSettings.sounds.success;
				isFailSoundEnabled = config.defaultSettings.sounds.failure;
			}
		} else if (Route.isCardset()) {
			let cardset = Cardsets.findOne({_id: FlowRouter.getParam('_id')});
			if (cardset !== undefined && cardset.learningActive) {
				goalPoms = cardset.pomodoroTimer.quantity;
				pomLength = cardset.pomodoroTimer.workLength;
				breakLength = cardset.pomodoroTimer.breakLength;
				isBellSoundEnabled = cardset.pomodoroTimer.soundConfig[0];
				isSuccessSoundEnabled = cardset.pomodoroTimer.soundConfig[1];
				isFailSoundEnabled = cardset.pomodoroTimer.soundConfig[2];
			} else {
				goalPoms = config.defaultSettings.goal;
				pomLength = config.defaultSettings.work.length;
				breakLength = config.defaultSettings.break.length;
				isBellSoundEnabled = config.defaultSettings.sounds.bell;
				isSuccessSoundEnabled = config.defaultSettings.sounds.success;
				isFailSoundEnabled = config.defaultSettings.sounds.failure;
			}
		} else {
			if (Route.isDemo()) {
				goalPoms = config.defaultDemoSettings.goal;
				pomLength = config.defaultDemoSettings.work.length;
				breakLength = config.defaultDemoSettings.break.length;
				isBellSoundEnabled = config.defaultDemoSettings.sounds.bell;
				isSuccessSoundEnabled = config.defaultDemoSettings.sounds.success;
				isFailSoundEnabled = config.defaultDemoSettings.sounds.failure;
			} else if (Route.isPresentation()) {
				goalPoms = config.defaultPresentationSettings.goal;
				pomLength = config.defaultPresentationSettings.work.length;
				breakLength = config.defaultPresentationSettings.break.length;
				isBellSoundEnabled = config.defaultPresentationSettings.sounds.bell;
				isSuccessSoundEnabled = config.defaultPresentationSettings.sounds.success;
				isFailSoundEnabled = config.defaultPresentationSettings.sounds.failure;
			} else {
				goalPoms = config.defaultSettings.goal;
				pomLength = config.defaultSettings.work.length;
				breakLength = config.defaultSettings.break.length;
				isBellSoundEnabled = config.defaultSettings.sounds.bell;
				isSuccessSoundEnabled = config.defaultSettings.sounds.success;
				isFailSoundEnabled = config.defaultSettings.sounds.failure;
			}
		}
	}

	/*any way you close the modal, by clicking the close button, confirm button, or clicking outside the box, starts a session. Makes it faster when you just want to start working. This initializes the end positions of all the arcs, and changes the instructions at the top of the screen.*/
	static start () {
		let curTime = new Date();
		endPom = (6 * curTime.getMinutes() + curTime.getSeconds() / 10 + 6 * pomLength);
		endBreak = (endPom + 6 * breakLength);
		pomRunning = true;
		pomBeginAngle = 6 * curTime.getMinutes() + curTime.getSeconds() / 10;
		Session.set('presentationPomodoroActive', true);
		if (Route.isBox() && Bonus.isInBonus(FlowRouter.getParam('_id'))) {
			this.restoreWorkloadTime(curTime);
		}
		/* Method for WelcomePage */
		if (Route.isHome()) {
			this.showPomodoroFullsize();
			if (isFullscreenEnabled) {
				Fullscreen.enable();
			}
		}
	}

	static isPomodoroRunning () {
		return (pomRunning || breakRunning);
	}

	static showPomodoroFullsize () {
		if ($(document).has('#pomodoroTimerNormalContainer').length || (Route.isBox() || Route.isMemo())) {
			$('#pomodoroTimerOverlay .svg-container').html($('.pomodoroTimer').first().clone());
			$('#pomodoroTimerOverlay .svg-container .pomodoroTimer').bind().on('click', function () {
				PomodoroTimer.clickClock();
			});
			isClockInBigmode = true;
			$('#pomodoroTimerOverlay').css('display', 'block');
			$('#pomodoroTimerNormalContainer').css('display', 'none');
		}
	}

	static showPomodoroNormal () {
		if ($(document).has('#pomodoroTimerNormalContainer').length || (Route.isBox() || Route.isMemo())) {
			if (document.fullscreenElement && (!Route.isBox() && !Route.isMemo())) {
				document.exitFullscreen();
			}
			$('#pomodoroTimerNormalContainer').css('display', 'block');
			$('.modal-backdrop').css('display', 'none');
			$('#pomodoroTimerOverlay').css('display', 'none');
			$('#pomodoroTimerOverlay .pomodoroClock').css('height', 'unset');
			isClockInBigmode = false;
		}
		this.pomoPosition();
	}

	/**
	 * PomoSetup for switching from bottom right to middle
	 */
	static pomoPosition () {
		if (!PomodoroTimer.isClockInBigmode() && !Meteor.userId()) {
			let centerLandingPagePomodoro = ServerStyle.gotCenteredLandingPagePomodoro();
			if (NavigatorCheck.isSmartphone()) {
				centerLandingPagePomodoro = true;
			}
			if ((Session.get('isLandingPagePomodoroActive') || !cloudShown) && centerLandingPagePomodoro) {
				if ($("#pomodoroTimerWordcloudContainer").is(':empty')) {
					$('.pomodoroTimer').detach().appendTo('#pomodoroTimerWordcloudContainer');
				}
				$('#pomodoroTimerWordcloudContainer').css('display', 'block');
				$('#wordcloud-container').css('display', 'none');
				$('#pomodoroTimerNormalContainer').css('display', 'none');
			} else {
				$('#pomodoroTimerNormalContainer').css('display', 'block');
				if ($("#pomodoroTimerNormalContainer").is(':empty')) {
					$('.pomodoroTimer').detach().prependTo('#pomodoroTimerNormalContainer');
				}
				$('#pomodoroTimerWordcloudContainer').css('display', 'none');
				$('#wordcloud-container').css('display', 'block');
				$('.pomodoroClock').removeAttr("style");
			}
		} else {
			$('#wordcloud-container').css('display', 'block');
		}
	}

	static isPresentationPomodoroActive () {
		return Session.get('presentationPomodoroActive');
	}

	static setPresentationPomodoro (forceOff = false) {
		if (Session.get('presentationPomodoroActive') || forceOff) {
			this.resetTimer();
		} else {
			Session.set('presentationPomodoroActive', true);
			$('#pomodoroTimerModal').modal('show');
		}
	}

	static getCurrentBreakLength (leitnerTask) {
		let length = config.defaultSettings.break.length;
		if (leitnerTask !== undefined) {
			let completed = leitnerTask.timer.workload.completed;
			let longBreakGoal = config.defaultSettings.longBreak.goal;
			if (completed !== 0 && completed % longBreakGoal === 0) {
				length = config.defaultSettings.longBreak.length;
			} else {
				length = leitnerTask.pomodoroTimer.breakLength;
			}
		}
		return length;
	}

	static getRemainingTime (leitnerTask, returnPassedTime = false) {
		if (leitnerTask !== undefined) {
			switch (leitnerTask.timer.status) {
				case 0:
				case 1:
					if (returnPassedTime) {
						return leitnerTask.timer.workload.current;
					} else {
						return leitnerTask.pomodoroTimer.workLength - leitnerTask.timer.workload.current;
					}
					break;
				case 2:
				case 3:
					if (returnPassedTime) {
						return leitnerTask.timer.break.current;
					} else {
						return this.getCurrentBreakLength(leitnerTask) - leitnerTask.timer.break.current;
					}
			}
		} else {
			return 30;
		}
	}

	static restoreWorkloadTime (curTime) {
		if (Bonus.isInBonus(FlowRouter.getParam('_id'))) {
			if (Route.isBox()) {
				let leitnerTask = LeitnerTasks.findOne({}, {sort: {createdAt: -1}});
				if (leitnerTask !== undefined && leitnerTask.timer !== undefined) {
					let status = leitnerTask.timer.status;
					let revertMinutes = this.getRemainingTime(leitnerTask, true);
					let remainingTime = this.getRemainingTime(leitnerTask);
					totalPoms = leitnerTask.timer.workload.completed;
					breakLength = this.getCurrentBreakLength(leitnerTask);
					let curPosition = 6 * curTime.getMinutes() + curTime.getSeconds() / 10;
					if (status === 0 && remainingTime <= 0) {
						status = 1;
					} else if (status === 2 && remainingTime <= 0) {
						status = 3;
					}

					switch (status) {
						case 0:
							leitnerTask.timer.workload.completed++;
							breakLength = this.getCurrentBreakLength(leitnerTask);
							pomRunning = true;
							breakRunning = false;
							endPom = (curPosition + 6 * (pomLength - revertMinutes));
							endBreak = (endPom + 6 * breakLength);
							pomBeginAngle = curPosition - (6 * revertMinutes);
							this.showPomodoroNormal();
							break;
						case 1:
							pomRunning = false;
							leitnerTask.timer.workload.completed++;
							breakLength = this.getCurrentBreakLength(leitnerTask);
							this.startBreakAlert();
							break;
						case 2:
							pomRunning = false;
							breakRunning = true;
							breakBeginAngle = curPosition - (6 * revertMinutes);
							endBreak = curPosition + 6 * (this.getCurrentBreakLength(leitnerTask) - revertMinutes);
							this.showPomodoroFullsize();
							break;
						case 3:
							pomRunning = false;
							breakRunning = false;
							this.showPomodoroFullsize();
							this.endBreakAlert();
							break;
					}
					Session.set('pomodoroBreakActive', breakRunning);
				}
			}
		}
	}

	static updateServerTimerStart () {
		let leitnerTask = LeitnerTasks.findOne({
			user_id: Meteor.userId(),
			cardset_id: FlowRouter.getParam('_id')
		}, {
			sort: {createdAt: -1}
		});
		if (Route.isBox() && leitnerTask !== undefined) {
			Meteor.call('updateLeitnerTimer', FlowRouter.getParam('_id'));
			this.updateServerTimerIntervalStart();
		}
	}

	static updateServerTimerIntervalStart () {
		let leitnerTask = LeitnerTasks.findOne({
			user_id: Meteor.userId(),
			cardset_id: FlowRouter.getParam('_id')
		}, {
			sort: {createdAt: -1}
		});
		if (Route.isBox() && leitnerTask !== undefined) {
			if (workloadTimerInterval === undefined) {
				workloadTimerInterval = setInterval(function () {
					Meteor.call('updateLeitnerTimer', FlowRouter.getParam('_id'));
				}, 60000);
			}
		}
	}

	static updateServerTimerIntervalStop () {
		if (Route.isBox()) {
			Meteor.call('updateLeitnerTimer', FlowRouter.getParam('_id'));
			if (workloadTimerInterval !== undefined) {
				clearInterval(workloadTimerInterval);
				workloadTimerInterval = undefined;
			}
		}
	}

	static isTransitionRequest () {
		let leitnerTask = LeitnerTasks.findOne({
			user_id: Meteor.userId(),
			cardset_id: FlowRouter.getParam('_id')
		}, {
			sort: {createdAt: -1}
		});
		if (leitnerTask !== undefined && (leitnerTask.timer.status === 1 || leitnerTask.timer.status === 3)) {
			return true;
		}
	}
};
