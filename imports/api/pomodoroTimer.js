import {Session} from "meteor/session";
import {Route} from "./route.js";

Session.set('pomodoroBreakActive', false);
/*This is a ton of script, mostly popups, so strap in for a wild ride!*/
/*endPom is the angle of the minute hand at which the work period will end.*/
let endPom = 0;

/*the angle at which the break will end*/
let endBreak = 0;

/*the number of cycles completed since beginning the session*/
let totalPoms = 0;

/*what goal was set in the session begin popup. default one.*/
let goalPoms = 1;

/*this is the beginning of the red progress tracking arc*/
let pomBeginAngle = 0;
let breakBeginAngle = 0;

/*how long to work in each cycle*/
let pomLength = 25;

/*how long to break each cycle*/
let breakLength = 5;

/*is it running?*/
let pomRunning = false;
let breakRunning = false;

let isClockInBigmode = false;
let cloudShown = true;

//which pomodoro sound
let isBellSoundEnabled = true;
let isSuccessSoundEnabled = true;
let isFailSoundEnabled = true;

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
			swal({
					title: "Good job!",
					text: "You have completed <b>" + totalPoms + " pomodoros</b> of work! Are you ready for a relaxing <b>" + breakLength + " minutes</b> of whatever the heck you feel like?",
					type: "success",
					html: true,
					confirmButtonText: "Yes, I can't wait!"
				},

				/*and this is what runs when the user clicks the confirm button on the popup. It starts the break, and gets the current time and sets the end from there.*/
				function () {
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
				breakLength *= 3;
			} else if (totalPoms % 4 === 0) {
				breakLength /= 3;
			}

			swal({
					title: "Break's over!",
					text: "Hope that break left you feeling refreshed! Now it's time to get back to accomplishing your goals. Ready for<b> " + pomLength + " more minutes</b> of work?",
					html: true,
					confirmButtonText: "Let me at it!"
				},

				/*starts the work cycle up again, automatically.*/
				function () {
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
		let isAnd = "";
		let hourAmmount = Math.floor(((pomLength + breakLength) * goalPoms + (Math.floor(goalPoms / 4) * longBreak)) / 60);
		let minuteAmmount = ((pomLength + breakLength) * goalPoms + (Math.floor(goalPoms / 4) * longBreak)) % 60;
		let hourString = "";
		let minuteString = "";
		if (hourAmmount && minuteAmmount) {
			isAnd = "and";
		}
		if (hourAmmount === 1 && isAnd === "") {
			hourString = " <b>hour</b> ";
		} else if (hourAmmount === 1) {
			hourString = " <b>" + hourAmmount + " hour</b> ";
		} else if (hourAmmount > 1) {
			hourString = " <b>" + hourAmmount + " hours</b> ";
		}
		if (minuteAmmount === 1) {
			minuteString = " <b>" + minuteAmmount + " minute</b> ";
		} else if (minuteAmmount > 1) {
			minuteString = " <b>" + minuteAmmount + " minutes</b> ";
		}
		$("#workTime").html("Reserve the next" + hourString + isAnd + minuteString + "for getting stuff done!");
	}

	/*if not in a session, clicking the clock opens the start up modal to begin one, and if you are in a session, clicking pops up a warning dialog before exiting the session  */
	static clickClock () {
		/*okay, so I tried this pen on my android phone and no sounds would play. Turns out that you need to attach sounds to a click function or they won't run on chrome for android. This empty sound allows the success and failure sounds to play, but not the bell sound. Oh well, this app wouldn't work on a phone anyway, because the screen would lock and exit it.*/
		document.getElementById("chromeMobile").play();
		if (pomRunning || breakRunning) {
			/*if you still haven't reached your goal, you are encouraged with an update of how many pomodoros and minutes you have left to reach it.*/
			if (totalPoms < goalPoms) {
				swal({
						title: "Not so fast!",
						type: "warning",
						text: "You are still <b>" + (goalPoms - totalPoms) + " pomodoros</b> short of your goal of <b>" + goalPoms + " pomodoros</b>! <br><br>Come on, you can do <b>" + (goalPoms - totalPoms) * pomLength + " more minutes</b> of work!",
						html: true,
						showCancelButton: true,
						confirmButtonText: "Continue!",
						cancelButtonText: "Stop.",
						closeOnCancel: false
					},

					/*If you give up before you complete your goal you get a failure sound, taken from a show me and my lady have been watching lately, and a failure box. Shame!*/
					function (isConfirm) {
						if (!isConfirm) {
							if (isFailSoundEnabled) {
								failSound.play();
							}
							swal({
								title: "You didn't make it.",
								text: "You couldn't complete the <b>" + goalPoms + " pomodoros</b> you planned on doing. Sometimes life gets in the way, we get it! See you back here later!",
								html: true,
								type: "error",
								showCancelButton: false,
								allowOutsideClick: false
							}, function () {
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
							$(".pomodoroInstructions").html("click clock to <span class= 'pomodoroGreen'>start</span>");
							$(".progressArc").attr("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
							$(".pomArc").attr("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
							$(".breakArc").attr("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
						}
					});
			} else {
				/*So if you've completed your goal for the session you get this friendlier pop up congradulating you and lightly suggesting you keep working.*/
				swal({
						title: "Stop the productivity train?",
						type: "warning",
						text: "Hey, you've reached your goal of <b>" + goalPoms + " pomodoros</b>! You've built up some good momentum, are you sure you want to stop?",
						html: true,
						showCancelButton: true,
						confirmButtonText: "Stop.",
						cancelButtonText: "Continue!",
						closeOnConfirm: false
					},
					function (isConfirm) {
						/*you succeeded so you get the success sound and a success message. good for you! */
						if (isConfirm) {
							if (isSuccessSoundEnabled) {
								successSound.play();
							}
							swal({
								title: "Great job!",
								text: "In the end you did <b>" + totalPoms + " pomodoros</b>, for a total of <b>" + totalPoms * pomLength + " minutes</b> of work! You are awesome! Come back soon!",
								html: true,
								type: "success"
							}, function () {
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
							$(".pomodoroInstructions").html("click clock to <span class='pomodoroGreen'>start</span>");
							$(".progressArc").attr("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
							$(".pomArc").attr("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
							$(".breakArc").attr("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
						}
					});
			}
		} else {
			/*and if you're not currently in a session, this activates the starting pop up*/
			$("#pomodoroTimerModal").modal();
		}
	}

	/*gets the goal number of pomodoros*/
	static updatePomNumSlider () {
		$('#pomQuantity').val($('#pomNumSlider').val());
		goalPoms = $('#pomNumSlider').val();
		this.updateTimeParagraph();
	}

	static updatePomQuantity () {
		$('#pomNumSlider').val($('#pomQuantity').val());
		goalPoms = $('#pomQuantity').val();
		this.updateTimeParagraph();
	}

	/*hides the goal box, shows the place where you can change the pomodoro length*/
	static updateSettingsBtn () {
		$("#settings").toggle();
		$("#goalDiv").toggle();
		if ($("#modalTitle").html() === "Choose your goal!") {
			$("#modalTitle").html("How many minutes?");
		} else {
			$("#modalTitle").html("Choose your goal!");
		}
	}

	/*when you update the work slider or input box or the break ones, it updates the total time and makes sure you didn't go over 60 minutes total work and break time per cycle. I could probably refactor all the following code. Someday!*/
	static updateWorkLength () {
		$('#workSlider').val($('#workLength').val());
		pomLength = parseInt($('#workLength').val(), 10);

		if (pomLength + breakLength > 60) {
			breakLength = 60 - pomLength;
			$('#playLength').val(breakLength);
			$('#playSlider').val(breakLength);
		}
		this.updateTimeParagraph();
	}

	static updateWorkSlider () {
		$('#workLength').val($('#workSlider').val());
		pomLength = parseInt($('#workSlider').val(), 10);
		if (pomLength + breakLength > 60) {
			breakLength = 60 - pomLength;
			$('#playLength').val(breakLength);
			$('#playSlider').val(breakLength);
		}
		this.updateTimeParagraph();
	}

	static updatePlayLength () {
		$('#playSlider').val($('#playLength').val());
		breakLength = parseInt($('#playLength').val(), 10);
		if (pomLength + breakLength > 60) {
			pomLength = 60 - breakLength;
			$('#workLength').val(pomLength);
			$('#workSlider').val(pomLength);
		}
		this.updateTimeParagraph();
	}

	static updatePlaySlider () {
		$('#playLength').val($('#playSlider').val());
		breakLength = parseInt($('#playSlider').val(), 10);
		if (pomLength + breakLength > 60) {
			pomLength = 60 - breakLength;
			$('#workLength').val(pomLength);
			$('#workSlider').val(pomLength);
		}
		this.updateTimeParagraph();
	}

	/*any way you close the modal, by clicking the close button, confirm button, or clicking outside the box, starts a session. Makes it faster when you just want to start working. This initializes the end positions of all the arcs, and changes the instructions at the top of the screen.*/
	static start () {
		let curTime = new Date();
		endPom = (6 * curTime.getMinutes() + curTime.getSeconds() / 10 + 6 * pomLength);
		endBreak = (endPom + 6 * breakLength);
		pomRunning = true;
		pomBeginAngle = 6 * curTime.getMinutes() + curTime.getSeconds() / 10;
		$(".pomodoroInstructions").html("click clock again to <b>stop</b>");
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
