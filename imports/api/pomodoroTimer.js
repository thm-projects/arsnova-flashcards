import {Session} from "meteor/session";
import {Bonus} from "./bonus.js";
import {Cardsets} from "./cardsets.js";
import {Route} from "./route.js";
import swal from "sweetalert2";

Session.set('pomodoroBreakActive', false);
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
let defaultGoalPoms = 1;
let goalPoms = defaultGoalPoms;

/*this is the beginning of the red progress tracking arc*/
let pomBeginAngle = 0;
let breakBeginAngle = 0;

/*how long to work in each cycle*/
let defaultPomLength = 25;
let pomLength = defaultPomLength;

/*how long to break each cycle*/
let defaultBreakLength = 5;
let breakLength = defaultBreakLength;

/*is it running?*/
let defaultPomRunning = false;
let pomRunning = defaultPomRunning;
let defaultBreakRunning = false;
let breakRunning = defaultBreakRunning;

let isClockInBigmode = false;
let cloudShown = true;

//which pomodoro sound
let DefaultIsBellSoundEnabled = true;
let DefaultIsSuccessSoundEnabled = true;
let DefaultIsFailSoundEnabled = true;
let isBellSoundEnabled = DefaultIsBellSoundEnabled;
let isSuccessSoundEnabled = DefaultIsSuccessSoundEnabled;
let isFailSoundEnabled = DefaultIsFailSoundEnabled;

let bellSound = new Audio('/audio/Schulgong.mp3');
let failSound = new Audio('/audio/fail.mp3');
let successSound = new Audio('/audio/success.mp3');


export let PomodoroTimer = class PomodoroTimer {

	static setCloudShown (value) {
		cloudShown = value;
	}

	static isClockInBigmode () {
		return isClockInBigmode;
	}

	static clockHandler (option) {
		if (option === 0) {
			isBellSoundEnabled = !isBellSoundEnabled;
		} else if (option === 1) {
			isSuccessSoundEnabled = !isSuccessSoundEnabled;
		} else if (option === 2) {
			isFailSoundEnabled = !isFailSoundEnabled;
		}
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

	/*the arcs around the clock get redrawn every second, as do the hands on the clock, thanks to this setInterval function. It runs every second.*/
	static interval () {
		/*here, we get the current time, and since there are 360 degrees around a circle, and 60 minutes in an hour, each minute is 360/60 = 6 degrees of rotation. multiply that by the number of minutes and add the seconds and their corresponding degree value and you get a minute hand that moves every second. Similar with the hour hand.*/
		let d = new Date();
		this.setMinutePoisition();
		this.setHourPosition();
		let dialogue = {
			title: "",
			html: "",
			cancel: "",
			confirm: ""
		};
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
		if (pomRunning) {
			/*goes and draws the necessary arcs around the circle*/
			$(".progressArc").attr("d", this.describeArc(50, 50, 44, pomBeginAngle, endPom));
			$(".pomArc").attr("d", this.describeArc(50, 50, 44, 6 * d.getMinutes() + d.getSeconds() / 10, endPom));
			$(".breakArc").attr("d", this.describeArc(50, 50, 44, endPom, endBreak));
		}

		/*this is the trigger to end the work period. it ends when the polar coodinates of the minute hand match the polar coodinates of the end of the work arc*/
		if ((6 * d.getMinutes() + d.getSeconds() / 10 >= endPom - 0.1 && 6 * d.getMinutes() + d.getSeconds() / 10 <= endPom + 0.1) && pomRunning) {
			pomRunning = false;

			/*the bell to signify the end of a period*/
			if (isBellSoundEnabled) {
				bellSound.play();
			}

			/*a work period just ended, so increase the total pomodoros done by one.*/
			totalPoms++;

			/*erase all the arcs, because you want the next period to start when the confirm button is clicked, not immediately after the previous period. That gives you time to finish what you were doing without being penalized.*/
			$(".pomArc").attr("d", this.describeArc(0, 0, 0, 0, 0));
			$(".progressArc").attr("d", this.describeArc(0, 0, 0, 0, 0));
			$(".breakArc").attr("d", this.describeArc(0, 0, 0, 0, 0));

			/*the first sweet alert! This is what pops up when you finish a pomodoro. It congradulates the user and lets them start their break when they are ready. There is no option to stop the session in this box, that function is relegated to the second click on the clock, as noted by the title.*/
			if (Bonus.isInBonus(Router.current().params._id)) {
				dialogue.title = TAPi18n.__('pomodoro.sweetAlert.bonus.break.start.title');
				dialogue.html = TAPi18n.__('pomodoro.sweetAlert.bonus.break.start.text', {
					pomodoroBreak: breakLength,
					pomodoroTotal: totalPoms,
					pomodoro: TAPi18n.__('pomodoro.name', {count: totalPoms})
				});
				dialogue.confirm = TAPi18n.__('pomodoro.sweetAlert.bonus.break.start.button.confirm');
			} else {
				dialogue.title = TAPi18n.__('pomodoro.sweetAlert.user.break.start.title');
				dialogue.html = TAPi18n.__('pomodoro.sweetAlert.user.break.start.text', {
					pomodoroBreak: breakLength,
					pomodoroTotal: totalPoms,
					pomodoro: TAPi18n.__('pomodoro.name', {count: totalPoms})
				});
				dialogue.confirm = TAPi18n.__('pomodoro.sweetAlert.user.break.start.button.confirm');
			}
			swal({
				title: dialogue.title,
				html: dialogue.html,
				type: "success",
				confirmButtonText: dialogue.confirm,
				allowOutsideClick: false
			}).then(() => {
				/*and this is what runs when the user clicks the confirm button on the popup. It starts the break, and gets the current time and sets the end from there.*/
				breakRunning = true;
				Session.set('pomodoroBreakActive', breakRunning);
				let popTime = new Date();
				breakBeginAngle = 6 * popTime.getMinutes() + popTime.getSeconds() / 10;
				endBreak = 6 * popTime.getMinutes() + popTime.getSeconds() / 10 + 6 * breakLength;
			});
		}

		/*this is what runs every second while the break is active. It just draws the break arc and the progress arc behind it.*/
		if (breakRunning) {
			$(".progressArc").attr("d", this.describeArc(50, 50, 44, breakBeginAngle, endBreak));
			$(".breakArc").attr("d", this.describeArc(50, 50, 44, 6 * d.getMinutes() + d.getSeconds() / 10, endBreak));
		}

		/*this is what triggers when the angle of the minute hand matches the angle of the end of the break arc*/
		if ((6 * d.getMinutes() + d.getSeconds() / 10 >= endBreak - 0.1 && 6 * d.getMinutes() + d.getSeconds() / 10 <= endBreak + 0.1) && breakRunning) {
			breakRunning = false;
			Session.set('pomodoroBreakActive', breakRunning);
			if (isBellSoundEnabled) {
				bellSound.play();
			}

			$(".progressArc").attr("d", this.describeArc(0, 0, 0, 0, 0));
			$(".breakArc").attr("d", this.describeArc(0, 0, 0, 0, 0));

			/*in the pomodoro productivity set up, every 4 pomodoros you get a 15 minute break. I decided to make it proportional to the user chosen break length. If you just did 3 pomodoros, your next break will be longer, and if you have just completed your 4th break, this sets the break length back to 5mins*/
			if ((totalPoms + 1) % 4 === 0) {
				breakLength *= 4;
			} else if (totalPoms % 4 === 0) {
				breakLength /= 4;
			}
			if (Bonus.isInBonus(Router.current().params._id)) {
				dialogue.title = TAPi18n.__('pomodoro.sweetAlert.bonus.break.end.title');
				dialogue.html = TAPi18n.__('pomodoro.sweetAlert.bonus.break.end.text', {
					pomodoroLength: pomLength
				});
				dialogue.confirm = TAPi18n.__('pomodoro.sweetAlert.bonus.break.end.button.confirm');
			} else {
				dialogue.title = TAPi18n.__('pomodoro.sweetAlert.user.break.end.title');
				dialogue.html = TAPi18n.__('pomodoro.sweetAlert.user.break.end.text', {
					pomodoroLength: pomLength
				});
				dialogue.confirm = TAPi18n.__('pomodoro.sweetAlert.user.break.end.button.confirm');
			}
			swal({
				title: dialogue.title,
				html: dialogue.html,
				confirmButtonText: dialogue.confirm,
				allowOutsideClick: false
			}).then(() => {
				/*starts the work cycle up again, automatically.*/
				pomRunning = true;
				let popTime = new Date();
				endPom = 6 * popTime.getMinutes() + popTime.getSeconds() / 10 + 6 * pomLength;
				endBreak = endPom + 6 * breakLength;
				pomBeginAngle = 6 * popTime.getMinutes() + popTime.getSeconds() / 10;
			});
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
				if (Bonus.isInBonus(Router.current().params._id)) {
					dialogue.title = TAPi18n.__('pomodoro.sweetAlert.bonus.quit.title');
					dialogue.html = TAPi18n.__('pomodoro.sweetAlert.bonus.quit.text', {
						missingPomodoros: count,
						pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
						pomodoroGoal: goalPoms,
						remainingMinutes: count * pomLength
					});
					dialogue.confirm = TAPi18n.__('pomodoro.sweetAlert.bonus.quit.button.confirm');
					dialogue.cancel = TAPi18n.__('pomodoro.sweetAlert.bonus.quit.button.cancel');
				} else {
					dialogue.title = TAPi18n.__('pomodoro.sweetAlert.user.quit.title');
					dialogue.html = TAPi18n.__('pomodoro.sweetAlert.user.quit.text', {
						missingPomodoros: count,
						pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
						pomodoroGoal: goalPoms,
						remainingMinutes: count * pomLength
					});
					dialogue.confirm = TAPi18n.__('pomodoro.sweetAlert.user.quit.button.confirm');
					dialogue.cancel = TAPi18n.__('pomodoro.sweetAlert.user.quit.button.cancel');
				}
				swal({
					title: dialogue.title,
					type: "warning",
					html: dialogue.html,
					showCancelButton: true,
					confirmButtonText: dialogue.confirm,
					cancelButtonText: dialogue.cancel,
					allowOutsideClick: false
				}).then((result) => {
					/*If you give up before you complete your goal you get a failure sound, taken from a show me and my lady have been watching lately, and a failure box. Shame!*/
					if (!result.value) {
						if (isFailSoundEnabled) {
							failSound.play();
						}
						if (Bonus.isInBonus(Router.current().params._id)) {
							dialogue.title = TAPi18n.__('pomodoro.sweetAlert.bonus.quit.confirm.title');
							dialogue.html = TAPi18n.__('pomodoro.sweetAlert.bonus.quit.confirm.text', {
								pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
								pomodoroGoal: goalPoms
							});
							dialogue.confirm = TAPi18n.__('pomodoro.sweetAlert.bonus.quit.confirm.button.confirm');
						} else {
							dialogue.title = TAPi18n.__('pomodoro.sweetAlert.user.quit.confirm.title');
							dialogue.html = TAPi18n.__('pomodoro.sweetAlert.user.quit.confirm.text', {
								pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
								pomodoroGoal: goalPoms
							});
							dialogue.confirm = TAPi18n.__('pomodoro.sweetAlert.user.quit.confirm.button.confirm');
						}
						swal({
							title: dialogue.title,
							html: dialogue.html,
							type: "error",
							allowOutsideClick: false,
							confirmButtonText: dialogue.confirm
						}).then(() => {
							PomodoroTimer.showPomodoroNormal();
							if ((Route.isBox() || Route.isMemo())) {
								Session.set('pomodoroBreakActive', false);
								Router.go('cardsetdetailsid', {
									_id: Router.current().params._id
								});
							}
						});
						/*reset everything for new session*/
						totalPoms = 0;
						pomRunning = false;
						breakRunning = false;
						$(".pomodoroInstructions").html(TAPi18n.__('pomodoro.timer.instructions.activate'));
						$(".progressArc").attr("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
						$(".pomArc").attr("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
						$(".breakArc").attr("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
					}
				});
			} else {
				/*So if you've completed your goal for the session you get this friendlier pop up congradulating you and lightly suggesting you keep working.*/
				if (Bonus.isInBonus(Router.current().params._id)) {
					dialogue.title = TAPi18n.__('pomodoro.sweetAlert.bonus.end.title');
					dialogue.html = TAPi18n.__('pomodoro.sweetAlert.bonus.end.text', {
						pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
						pomodoroGoal: goalPoms
					});
					dialogue.cancel = TAPi18n.__('pomodoro.sweetAlert.bonus.end.button.cancel');
					dialogue.confirm = TAPi18n.__('pomodoro.sweetAlert.bonus.end.button.confirm');
				} else {
					dialogue.title = TAPi18n.__('pomodoro.sweetAlert.user.end.title');
					dialogue.html = TAPi18n.__('pomodoro.sweetAlert.user.end.text', {
						pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
						pomodoroGoal: goalPoms
					});
					dialogue.cancel = TAPi18n.__('pomodoro.sweetAlert.user.end.button.cancel');
					dialogue.confirm = TAPi18n.__('pomodoro.sweetAlert.user.end.button.confirm');
				}
				swal({
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
						if (isSuccessSoundEnabled) {
							successSound.play();
						}
						if (Bonus.isInBonus(Router.current().params._id)) {
							dialogue.title = TAPi18n.__('pomodoro.sweetAlert.bonus.end.confirm.title');
							dialogue.html = TAPi18n.__('pomodoro.sweetAlert.bonus.end.confirm.text', {
								pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
								pomodoroGoal: goalPoms,
								pomodoroTotal: pomLength * totalPoms
							});
							dialogue.confirm = TAPi18n.__('pomodoro.sweetAlert.bonus.end.confirm.button.confirm');
						} else {
							dialogue.title = TAPi18n.__('pomodoro.sweetAlert.user.end.confirm.title');
							dialogue.html = TAPi18n.__('pomodoro.sweetAlert.user.end.confirm.text', {
								pomodoro: TAPi18n.__('pomodoro.name', {count: count}),
								pomodoroGoal: goalPoms,
								pomodoroTotal: pomLength * totalPoms
							});
							dialogue.confirm = TAPi18n.__('pomodoro.sweetAlert.user.end.confirm.button.confirm');
						}
						swal({
							title: dialogue.title,
							html: dialogue.html,
							type: "success",
							allowOutsideClick: false,
							confirmButtonText: dialogue.confirm
						}).then(() => {
							PomodoroTimer.showPomodoroNormal();
							if ((Route.isBox() || Route.isMemo())) {
								Session.set('pomodoroBreakActive', false);
								Router.go('cardsetdetailsid', {
									_id: Router.current().params._id
								});
							}
						});
						/*reset everything*/
						totalPoms = 0;
						pomRunning = false;
						breakRunning = false;
						$(".pomodoroInstructions").html(TAPi18n.__('pomodoro.timer.instructions.activate'));
						$(".progressArc").attr("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
						$(".pomArc").attr("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
						$(".breakArc").attr("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
					}
				});
			}
		} else {
			if (!Bonus.isInBonus(Router.current().params._id)) {
				/*and if you're not currently in a session, this activates the starting pop up*/
				$("#pomodoroTimerModal").modal();
			}
		}
	}

	/*gets the goal number of pomodoros*/
	static updatePomNumSlider () {
		if (Route.isCardset()) {
			$('#pomNumLabel').html(TAPi18n.__('pomodoro.form.bonus.count', {
				count: $('#pomNumSlider').val(),
				link: TAPi18n.__('pomodoro.form.link'),
				tooltip: TAPi18n.__('pomodoro.form.tooltip.link', {pomodoro: TAPi18n.__('pomodoro.name')}),
				pomodoro: TAPi18n.__('pomodoro.name', {count: parseInt($('#pomNumSlider').val())})
			}));
		} else {
			$('#pomNumLabel').html(TAPi18n.__('pomodoro.form.user.count', {
				count: $('#pomNumSlider').val(),
				link: TAPi18n.__('pomodoro.form.link'),
				tooltip: TAPi18n.__('pomodoro.form.tooltip.link', {pomodoro: TAPi18n.__('pomodoro.name')}),
				pomodoro: TAPi18n.__('pomodoro.name', {count: parseInt($('#pomNumSlider').val())})
			}));
		}
		goalPoms = $('#pomNumSlider').val();
		this.updateTimeParagraph();
	}

	static getGoalPoms () {
		return parseInt($('#pomNumSlider').val());
	}

	/*hides the goal box, shows the place where you can change the pomodoro length*/
	static updateSettingsBtn () {
		$("#settings").toggle();
		$("#goalDiv").toggle();
		if ($("#modalTitle").html() === TAPi18n.__('pomodoro.form.user.title')) {
			$("#modalTitle").html(TAPi18n.__('pomodoro.form.user.settings.title'));
		} else {
			$("#modalTitle").html(TAPi18n.__('pomodoro.form.user.title'));
		}
	}

	/*when you update the work slider or input box or the break ones, it updates the total time and makes sure you didn't go over 60 minutes total work and break time per cycle. I could probably refactor all the following code. Someday!*/
	static updateWorkSlider () {
		pomLength = parseInt($('#workSlider').val(), 10);
		let minuteString = TAPi18n.__('pomodoro.form.time.minute', {count: pomLength});
		if (Route.isCardset()) {
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
		breakLength = parseInt($('#breakSlider').val(), 10);
		let minuteString = TAPi18n.__('pomodoro.form.time.minute', {count: breakLength});
		if (Route.isCardset()) {
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

	static getSoundConfig () {
		return [isBellSoundEnabled, isSuccessSoundEnabled, isFailSoundEnabled];
	}

	static initializeModalContent () {
		$('#pomNumSlider').val(goalPoms);
		this.updatePomNumSlider();
		$('#workSlider').val(pomLength);
		this.updateWorkSlider();
		$('#breakSlider').val(breakLength);
		this.updateBreakSlider();
	}

	static initializeVariables () {
		Session.set('pomodoroBreakActive', false);
		totalPoms = defaultTotalPoms;
		endPom = defaultEndPom;
		endBreak = defaultEndBreak;
		pomRunning = defaultPomRunning;
		breakRunning = defaultBreakRunning;
		if (((Route.isBox() || Route.isMemo()) && Bonus.isInBonus(Router.current().params._id)) || Route.isCardset()) {
			let cardset = Cardsets.findOne({_id: Router.current().params._id});
			if (cardset.pomodoroTimer !== undefined) {
				goalPoms = cardset.pomodoroTimer.quantity;
				pomLength = cardset.pomodoroTimer.workLength;
				breakLength = cardset.pomodoroTimer.breakLength;
				isBellSoundEnabled = cardset.pomodoroTimer.soundConfig[0];
				isSuccessSoundEnabled = cardset.pomodoroTimer.soundConfig[1];
				isFailSoundEnabled = cardset.pomodoroTimer.soundConfig[2];
			} else {
				goalPoms = defaultGoalPoms;
				pomLength = defaultPomLength;
				breakLength = defaultBreakLength;
				isBellSoundEnabled = DefaultIsBellSoundEnabled;
				isSuccessSoundEnabled = DefaultIsSuccessSoundEnabled;
				isFailSoundEnabled = DefaultIsFailSoundEnabled;
			}
		} else {
			goalPoms = defaultGoalPoms;
			pomLength = defaultPomLength;
			breakLength = defaultBreakLength;
			isBellSoundEnabled = DefaultIsBellSoundEnabled;
			isSuccessSoundEnabled = DefaultIsSuccessSoundEnabled;
			isFailSoundEnabled = DefaultIsFailSoundEnabled;
		}
	}

	/*any way you close the modal, by clicking the close button, confirm button, or clicking outside the box, starts a session. Makes it faster when you just want to start working. This initializes the end positions of all the arcs, and changes the instructions at the top of the screen.*/
	static start () {
		let curTime = new Date();
		endPom = (6 * curTime.getMinutes() + curTime.getSeconds() / 10 + 6 * pomLength);
		endBreak = (endPom + 6 * breakLength);
		pomRunning = true;
		pomBeginAngle = 6 * curTime.getMinutes() + curTime.getSeconds() / 10;
		$(".pomodoroInstructions").html(TAPi18n.__('pomodoro.timer.instructions.deactivate'));
		/* Method for WelcomePage */
		this.showPomodoroFullsize();
	}

	static isPomodoroRunning () {
		return (pomRunning || breakRunning);
	}

	static showPomodoroFullsize () {
		if ($(document).has('#pomoA').length) {
			$('#bigClockDiv').addClass('zIndexFirstPrio bigDiv');
			$('.pomodoroTimer').detach().appendTo('#bigClockDiv');
			isClockInBigmode = true;
		}
	}

	static showPomodoroNormal () {
		if ($(document).has('#pomoA').length) {
			$('#bigClockDiv').removeClass('zIndexFirstPrio bigDiv');
			isClockInBigmode = false;
			this.pomoPosition();
		}
	}

	/**
	 * PomoSetup for switching from bottom right to middle
	 */
	static pomoPosition () {
		if (!PomodoroTimer.isClockInBigmode()) {
			if (!cloudShown) {
				$('.pomodoroTimer').detach().appendTo('#pomoA');
				$('#pomoB').addClass('zIndexLowPrio');
				$('.pomodoroClock').on('click', function () {
					PomodoroTimer.clickClock();
				});
			} else if (cloudShown) {
				$('.pomodoroTimer').detach().appendTo('#pomoB');
				$('#pomoB').removeClass('zIndexLowPrio');
				$('.pomodoroClock').on('click', function () {
					PomodoroTimer.clickClock();
				});
			}
		}
	}
};
