import {Meteor} from "meteor/meteor";
import swal from "sweetalert2";
import * as screenfull from 'screenfull';
import {CardVisuals} from "./cardVisuals";
import * as config from "../config/sweetAlert.js";
import {Route} from "./route.js";

export let SweetAlertMessages = class SweetAlertMessages {
	static completeProfile () {
		swal.fire(config.completeProfile()).then((result) => {
			if (result.value) {
				Router.go('profileSettings', {
					_id: Meteor.userId()
				});
			}
		});
	}

	static continuePresentation () {
		swal.fire(config.continuePresentation()).then((result) => {
			if (result.value) {
				screenfull.request();
			} else {
				screenfull.exit();
				if (Route.isPresentationTranscript()) {
					Router.go('transcripts');
				} else {
					Router.go('cardsetdetailsid', {
						_id: Router.current().params._id
					});
				}
			}
		});
	}

	static activateFullscreen () {
		swal.fire(config.activateFullscreen()).then((result) => {
			if (result.value) {
				CardVisuals.toggleFullscreen();
			} else {
				screenfull.exit();
				if (Route.isPresentationTranscript()) {
					Router.go('transcripts');
				} else {
					Router.go('cardsetdetailsid', {
						_id: Router.current().params._id
					});
				}
			}
		});
	}

	static exitPresentation () {
		swal.fire(config.exitPresentation()).then((result) => {
			if (result.value) {
				screenfull.exit();
				if (Route.isPresentationTranscript()) {
					Router.go('transcripts');
				} else {
					Router.go('cardsetdetailsid', {
						_id: Router.current().params._id
					});
				}
			} else {
				screenfull.request();
			}
		});
	}
};
