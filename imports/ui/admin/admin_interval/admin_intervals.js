//------------------------IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {AdminSettings} from "../../../api/adminSettings.js";
import {getDays1, getDays2, getDays3} from "../../profile/profile.js";
import "./admin_intervals.html";

Meteor.subscribe('adminSettings', function () {
	//Set the reactive session as true to indicate that the data have been loaded
	Session.set('data_loaded', true);
});


function saveInterval() {
	var inv1 = document.getElementById('inv1').value;
	var inv2 = document.getElementById('inv2').value;
	var inv3 = document.getElementById('inv3').value;

	if (inv1 === "" || inv2 === "" || inv3 === "") {
		Bert.alert(TAPi18n.__('admin-interval.errorAllFields'), 'danger', 'growl-bottom-right');
	} else {
		if (Number(inv1) >= Number(inv2) || Number(inv2) >= Number(inv3)) {
			//Interval must be bigger than 1, 2 must be bigger than 3
			Bert.alert(TAPi18n.__('admin-interval.errorBiggerThan'), 'danger', 'growl-bottom-right');
		} else {
			if (inv1 > 0 && inv2 > 0 && inv3 > 0) {
				Meteor.call('updateInterval', parseInt(inv1), parseInt(inv2), parseInt(inv3));
				Bert.alert(TAPi18n.__('profile.saved'), 'success', 'growl-bottom-right');
				$('#inv1, #inv2, #inv3').val("");
			} else {
				Bert.alert(TAPi18n.__('admin-interval.biggerNull'), 'danger', 'growl-bottom-right');
			}
		}
	}
	return true;
}

Template.admin_interval.events({
	'keypress input': function (event) {
		if (event.keyCode == 13) {
			saveInterval();
		}
	},
	'click #cancelInterval': function () {
		$('#inv1, #inv2, #inv3').val("");
	},
	'click #saveInterval': saveInterval,
	'click #resetInterval': function () {
		var seq = AdminSettings.findOne({name: "seqSettings"});
		if (!(($('#inv1').val() === seq.seqOne && $('#inv2').val() === seq.seqTwo && $('#inv3').val() === seq.seqThree) ||
			(7 === seq.seqOne && 30 === seq.seqTwo && 90 === seq.seqThree))) {
			Meteor.call('updateInterval', 7, 30, 90);
			Bert.alert(TAPi18n.__('profile.saved'), 'success', 'growl-bottom-right');
			$('#inv1, #inv2, #inv3').val("");
		}
	}
});

Template.preview.helpers({
	getDays1: getDays1,
	getDays2: getDays2,
	getDays3: getDays3
});
