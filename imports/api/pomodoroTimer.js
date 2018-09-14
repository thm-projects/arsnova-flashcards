/*This is a ton of script, mostly popups, so strap in for a wild ride!*/
/*endPom is the angle of the minute hand at which the work period will end.*/
import {StaticWelcomeMethod} from "../ui/welcome/welcome";
import {Route} from "./route";

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
let success = "";
let momentum = "";
//which pomodoro sound
let soundBell = true;
let soundSuccess = true;
let soundFail = true;

export let PomodoroTimer = class PomodoroTimer {

	static clockHandler(option) {
		if (option === 0) {
			soundBell = !soundBell;
		} else if (option === 1) {
			soundSuccess = !soundSuccess;
		} else if (option === 2) {
			soundFail = !soundFail;
		}
	}

	/*The following code snippet is a life saver and was found on stack overflow. It allows you to draw an arc around a circle in svg using only the polar coordinates.*/
	static polarToCartesian(centerX, centerY, radius, angleInDegrees) {
		let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

		return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		};
	}

	static describeArc(x, y, radius, startAngle, endAngle) {
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
	static r(el, deg) {
		el.setAttribute('transform', 'rotate(' + deg + ' 50 50)');
	}

	/*the arcs around the clock get redrawn every second, as do the hands on the clock, thanks to this setInterval function. It runs every second.*/
	static interval() {
		/*you succeeded so you get the success sound and a success message. good for you! */
		if (totalPoms <= 1 && (goalPoms - totalPoms) <= 1) {
			success = TAPi18n.__("pomodoro.success1") + TAPi18n.__("pomodoro.onePomo") + TAPi18n.__("pomodoro.success4") + TAPi18n.__("pomodoro.onePomo1") + TAPi18n.__("pomodoro.success5");
		} else if (totalPoms <= 1) {
			success = TAPi18n.__("pomodoro.success1") + TAPi18n.__("pomodoro.onePomo") + TAPi18n.__("pomodoro.success4") + totalPoms * pomLength + TAPi18n.__("pomodoro.success5");
		} else {
			success = TAPi18n.__("pomodoro.success1") + totalPoms + TAPi18n.__("pomodoro.success4") + totalPoms * pomLength + TAPi18n.__("pomodoro.success5");
		}

		if (goalPoms === 1) {
			momentum = TAPi18n.__("pomodoro.momentum1");
		} else {
			momentum = TAPi18n.__("pomodoro.momentum");
		}

		if (document.getElementById("pomodoroMin") == null) {
			pomRunning = false;
			breakRunning = false;
			totalPoms = 0;
			return;
		}
		/*here, we get the current time, and since there are 360 degrees around a circle, and 60 minutes in an hour, each minute is 360/60 = 6 degrees of rotation. multiply that by the number of minutes and add the seconds and their corresponding degree value and you get a minute hand that moves every second. Similar with the hour hand.*/
		let d = new Date();
		this.r(document.getElementById("pomodoroMin"), 6 * d.getMinutes() + d.getSeconds() / 10);
		this.r(document.getElementById("pomodoroHour"), 30 * (d.getHours() % 12) + d.getMinutes() / 2);

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
			document.getElementById("progressArc")
				.setAttribute("d", this.describeArc(50, 50, 44, pomBeginAngle, endPom));
			document.getElementById("pomArc")
				.setAttribute("d", this.describeArc(50, 50, 44, 6 * d.getMinutes() + d.getSeconds() / 10, endPom));
			document.getElementById("breakArc")
				.setAttribute("d", this.describeArc(50, 50, 44, endPom, endBreak));
		}

		/*this is the trigger to end the work period. it ends when the polar coodinates of the minute hand match the polar coodinates of the end of the work arc*/
		if ((6 * d.getMinutes() + d.getSeconds() / 10 >= endPom - 0.1 && 6 * d.getMinutes() + d.getSeconds() / 10 <= endPom + 0.1) && pomRunning) {
			pomRunning = false;

			/*the bell to signify the end of a period*/
			if (soundBell) {
				document.getElementById("bell").play();
			}

			/*a work period just ended, so increase the total pomodoros done by one.*/
			totalPoms++;

			/*erase all the arcs, because you want the next period to start when the confirm button is clicked, not immediately after the previous period. That gives you time to finish what you were doing without being penalized.*/
			document.getElementById("pomArc").setAttribute("d", this.describeArc(0, 0, 0, 0, 0));
			document.getElementById("progressArc").setAttribute("d", this.describeArc(0, 0, 0, 0, 0));
			document.getElementById("breakArc").setAttribute("d", this.describeArc(0, 0, 0, 0, 0));

			/*the first sweet alert! This is what pops up when you finish a pomodoro. It congradulates the user and lets them start their break when they are ready. There is no option to stop the session in this box, that function is relegated to the second click on the clock, as noted by the title.*/
			swal({
					title: TAPi18n.__("pomodoro.goodJob"),
					text: success,
					type: "success",
					html: true,
					confirmButtonText: TAPi18n.__("pomodoro.continue")
				},

				/*and this is what runs when the user clicks the confirm button on the popup. It starts the break, and gets the current time and sets the end from there.*/
				function () {
					breakRunning = true;
					var popTime = new Date();
					breakBeginAngle = 6 * popTime.getMinutes() + popTime.getSeconds() / 10;
					endBreak = 6 * popTime.getMinutes() + popTime.getSeconds() / 10 + 6 * breakLength;
				});
		}

		/*this is what runs every second while the break is active. It just draws the break arc and the progress arc behind it.*/
		if (breakRunning) {
			document.getElementById("progressArc")
				.setAttribute("d", this.describeArc(50, 50, 44, breakBeginAngle, endBreak));
			document.getElementById("breakArc")
				.setAttribute("d", this.describeArc(50, 50, 44, 6 * d.getMinutes() + d.getSeconds() / 10, endBreak));
		}

		/*this is what triggers when the angle of the minute hand matches the angle of the end of the break arc*/
		if ((6 * d.getMinutes() + d.getSeconds() / 10 >= endBreak - 0.1 && 6 * d.getMinutes() + d.getSeconds() / 10 <= endBreak + 0.1) && breakRunning) {
			breakRunning = false;

			if (soundBell) {
				document.getElementById("bell").play();
			}

			document.getElementById("progressArc").setAttribute("d", this.describeArc(0, 0, 0, 0, 0));
			document.getElementById("breakArc").setAttribute("d", this.describeArc(0, 0, 0, 0, 0));

			/*in the pomodoro productivity set up, every 4 pomodoros you get a 15 minute break. I decided to make it proportional to the user chosen break length. If you just did 3 pomodoros, your next break will be longer, and if you have just completed your 4th break, this sets the break length back to 5mins*/
			if ((totalPoms + 1) % 4 === 0) {
				breakLength *= 3;
			} else if (totalPoms % 4 === 0) {
				breakLength /= 3;
			}

			swal({
					title: TAPi18n.__("pomodoro.breakOver"),
					text: TAPi18n.__("pomodoro.breakRefresh"),
					html: true,
					confirmButtonText: TAPi18n.__("pomodoro.continue")
				},

				/*starts the work cycle up again, automatically.*/
				function () {
					pomRunning = true;
					var popTime = new Date();
					endPom = 6 * popTime.getMinutes() + popTime.getSeconds() / 10 + 6 * pomLength;
					endBreak = endPom + 6 * breakLength;
					pomBeginAngle = 6 * popTime.getMinutes() + popTime.getSeconds() / 10;
				});
		}
	}

	/*updates the sentence in the modal under the place where you set your goal for the session with the correct total amount of time it will take to complete that many pomodoros. With correct grammar, which is why it's such a long function.*/
	static updateTimeParagraph() {
		let longBreak = breakLength * 3;
		let isAnd = "";
		let hourAmmount = Math.floor(((pomLength + breakLength) * goalPoms + (Math.floor(goalPoms / 4) * longBreak)) / 60);
		let minuteAmmount = ((pomLength + breakLength) * goalPoms + (Math.floor(goalPoms / 4) * longBreak)) % 60;
		let hourString = "";
		let minuteString = "";
		if (hourAmmount && minuteAmmount) {
			isAnd = "and";
		}
		if (hourAmmount === 1) {
			hourString = " <b>" + hourAmmount + TAPi18n.__("pomodoro.hour") + "</b>";
		} else if (hourAmmount > 1) {
			hourString = " <b>" + hourAmmount + TAPi18n.__("pomodoro.hours") + "</b> ";
		}
		if (minuteAmmount === 1) {
			minuteString = " <b>" + minuteAmmount + TAPi18n.__("pomodoro.minute") + "</b> ";
		} else if (minuteAmmount > 1) {
			minuteString = " <b>" + minuteAmmount + TAPi18n.__("pomodoro.minutes2") + "</b> ";
		}
		if (minuteAmmount < 1) {
			$("#workTime").html(TAPi18n.__("pomodoro.SessionTime1") + hourString + TAPi18n.__("pomodoro.SessionTime2"));
		} else if (hourAmmount < 1) {
			$("#workTime").html(TAPi18n.__("pomodoro.SessionTime1") + minuteString + TAPi18n.__("pomodoro.SessionTime2"));
		} else {
			$("#workTime").html(TAPi18n.__("pomodoro.SessionTime1") + hourString + TAPi18n.__("pomodoro.isAnd") + minuteString + TAPi18n.__("pomodoro.SessionTime2"));
		}
	}

	/*if not in a session, clicking the clock opens the start up modal to begin one, and if you are in a session, clicking pops up a warning dialog before exiting the session  */
	static clickClock() {
		/*okay, so I tried this pen on my android phone and no sounds would play. Turns out that you need to attach sounds to a click function or they won't run on chrome for android. This empty sound allows the success and failure sounds to play, but not the bell sound. Oh well, this app wouldn't work on a phone anyway, because the screen would lock and exit it.*/
		document.getElementById("chromeMobile").play();
		let stillOpenString = "";
		let notDoneString = "";


		if ((goalPoms - totalPoms) > 1) {
			stillOpenString = "<b>" + (goalPoms - totalPoms) + "</b>" + TAPi18n.__("pomodoro.stillOpen2");
			notDoneString = "<b>" + goalPoms + "</b>" + TAPi18n.__("pomodoro.notDone3");
		} else {
			stillOpenString = "<b>" + TAPi18n.__("pomodoro.onePomo") + "</b>" + TAPi18n.__("pomodoro.stillOpen4");
			notDoneString = "<b>" + TAPi18n.__("pomodoro.onePomo1") + "</b>" + TAPi18n.__("pomodoro.notDone4");
		}
		if (pomRunning || breakRunning) {
			/*if you still haven't reached your goal, you are encouraged with an update of how many pomodoros and minutes you have left to reach it.*/
			if (totalPoms < goalPoms) {
				swal({
						title: TAPi18n.__("pomodoro.fastgoing"),
						type: "warning",
						text: TAPi18n.__("pomodoro.stillOpen1") + stillOpenString + TAPi18n.__("pomodoro.stillOpen3"),
						html: true,
						showCancelButton: true,
						confirmButtonText: TAPi18n.__("pomodoro.continue"),
						cancelButtonText: TAPi18n.__("pomodoro.stopBig"),
						closeOnCancel: false,
						closeOnClickOutside: false
					},

					/*If you give up before you complete your goal you get a failure sound, taken from a show me and my lady have been watching lately, and a failure box. Shame!*/
					function (isConfirm) {
						if (!isConfirm) {
							if (soundFail) {
								new Audio('/audio/fail.mp3').play();
							}
							sweetAlert({
								title: TAPi18n.__("pomodoro.notDone"),
								text: TAPi18n.__("pomodoro.notDone2") + notDoneString,
								html: true,
								type: "error"
							});

							/*reset everything for new session*/
							totalPoms = 0;
							pomRunning = false;
							breakRunning = false;
							$("#instructions").html(TAPi18n.__('pomodoro.clickClock') + "<span class= 'green'> " + TAPi18n.__('pomodoro.start') + "</span>");
							document.getElementById("progressArc").setAttribute("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
							document.getElementById("pomArc").setAttribute("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
							document.getElementById("breakArc").setAttribute("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
							/* Method for WelcomePage */
							StaticWelcomeMethod.showPomodoroNormal();
							if ((Route.isBox() || Route.isMemo())) {
								Router.go('cardsetdetailsid', {
									_id: Router.current().params._id
								});
							}
						}
					});
			} else {
				/*So if you've completed your goal for the session you get this frien dlier pop up congradulating you and lightly suggesting you keep working.*/
				swal({
						title: TAPi18n.__("pomodoro.productivity"),
						type: "warning",
						text: TAPi18n.__("pomodoro.reachedgoal") + goalPoms + momentum + "! " + TAPi18n.__("pomodoro.session"),
						html: true,
						showCancelButton: true,
						confirmButtonText: TAPi18n.__("pomodoro.stopBig"),
						cancelButtonText: TAPi18n.__("pomodoro.continue"),
						closeOnConfirm: false
					},
					function (isConfirm) {
						if (isConfirm) {
							if (soundSuccess) {
								new Audio('/audio/success.mp3').play();
							}

							sweetAlert({
								title: TAPi18n.__("pomodoro.goodJob"),
								text: success,
								html: true,
								type: "success"
							});

							/*reset everything*/
							totalPoms = 0;
							pomRunning = false;
							breakRunning = false;
							$("#instructions").html(TAPi18n.__('pomodoro.clickClock') + "<span class= 'green'> " + TAPi18n.__('pomodoro.start') + "</span>");
							document.getElementById("progressArc").setAttribute("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
							document.getElementById("pomArc").setAttribute("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
							document.getElementById("breakArc").setAttribute("d", PomodoroTimer.describeArc(0, 0, 0, 0, 0));
							/* Method for WelcomePage */
							StaticWelcomeMethod.showPomodoroNormal();
							if ((Route.isBox() || Route.isMemo())) {
								Router.go('cardsetdetailsid', {
									_id: Router.current().params._id
								});
							}
						}
					});
			}
		} else {
			/*and if you're not currently in a session, this activates the starting pop up*/
			$("#pomodoroTimerModal").modal();
		}
	}

	/*gets the goal number of pomodoros*/
	static updatePomNumSlider() {
		$('#pomQuantity').val($('#pomNumSlider').val());
		goalPoms = $('#pomNumSlider').val();
		this.updateTimeParagraph();
	}

	static updatePomQuantity() {
		$('#pomNumSlider').val($('#pomQuantity').val());
		goalPoms = $('#pomQuantity').val();
		this.updateTimeParagraph();
	}

	/*hides the goal box, shows the place where you can change the pomodoro length*/
	static updateSettingsBtn() {
		$("#settings").toggle();
		$("#goalDiv").toggle();
		if ($("#modalTitle").html() === TAPi18n.__("pomodoro.goal")) {
			$("#modalTitle").html(TAPi18n.__("pomodoro.minutes"));
		} else {
			$("#modalTitle").html(TAPi18n.__("pomodoro.goal"));
		}
	}

	/*when you update the work slider or input box or the break ones, it updates the total time and makes sure you didn't go over 60 minutes total work and break time per cycle. I could probably refactor all the following code. Someday!*/
	static updateWorkLength() {
		$('#workSlider').val($('#workLength').val());
		pomLength = parseInt($('#workLength').val(), 10);

		if (pomLength + breakLength > 60) {
			breakLength = 60 - pomLength;
			$('#playLength').val(breakLength);
			$('#playSlider').val(breakLength);
		}
		this.updateTimeParagraph();
	}

	static updateWorkSlider() {
		$('#workLength').val($('#workSlider').val());
		pomLength = parseInt($('#workSlider').val(), 10);
		if (pomLength + breakLength > 60) {
			breakLength = 60 - pomLength;
			$('#playLength').val(breakLength);
			$('#playSlider').val(breakLength);
		}
		this.updateTimeParagraph();
	}

	static updatePlayLength() {
		$('#playSlider').val($('#playLength').val());
		breakLength = parseInt($('#playLength').val(), 10);
		if (pomLength + breakLength > 60) {
			pomLength = 60 - breakLength;
			$('#workLength').val(pomLength);
			$('#workSlider').val(pomLength);
		}
		this.updateTimeParagraph();
	}

	static updatePlaySlider() {
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
	static start() {
		let curTime = new Date();
		endPom = (6 * curTime.getMinutes() + curTime.getSeconds() / 10 + 6 * pomLength);
		endBreak = (endPom + 6 * breakLength);
		pomRunning = true;
		pomBeginAngle = 6 * curTime.getMinutes() + curTime.getSeconds() / 10;
		$("#instructions").html(TAPi18n.__("pomodoro.stop1") + "<b>" + TAPi18n.__("pomodoro.stop2") + "</b>");
		/* Method for WelcomePage */
		StaticWelcomeMethod.showPomodoroFullsize();
	}

	static close() {
	}

	static isPomodoroRunning() {
		return (pomRunning || breakRunning);
	}
};
