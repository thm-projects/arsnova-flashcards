import {Meteor} from "meteor/meteor";
import swal from "sweetalert2";
import * as screenfull from 'screenfull';
import {CardVisuals} from "./cardVisuals";
import * as config from "../config/sweetAlert.js";

export let SweetAlertMessages = class SweetAlertMessages {
	static completeProfile () {
		swal(config.completeProfile()).then((result) => {
			if (result.value) {
				Router.go('profileSettings', {
					_id: Meteor.userId()
				});
			}
		});
	}

	static continuePresentation () {
		swal(config.continuePresentation()).then((result) => {
			if (result.value) {
				screenfull.request();
			} else {
				screenfull.exit();
				Router.go('cardsetdetailsid', {
					_id: Router.current().params._id
				});
			}
		});
	}

	static activateFullscreen () {
		swal(config.activateFullscreen()).then((result) => {
			if (result.value) {
				CardVisuals.toggleFullscreen();
			} else {
				screenfull.exit();
				Router.go('cardsetdetailsid', {
					_id: Router.current().params._id
				});
			}
		});
	}

	static exitPresentation () {
		swal(config.exitPresentation()).then((result) => {
			if (result.value) {
				screenfull.exit();
				Router.go('cardsetdetailsid', {
					_id: Router.current().params._id
				});
			} else {
				screenfull.request();
			}
		});
	}
};
