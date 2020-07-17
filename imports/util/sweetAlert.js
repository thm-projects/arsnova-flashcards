import {Meteor} from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import swal from "sweetalert2";
import {CardVisuals} from "./cardVisuals";
import * as config from "../config/sweetAlert.js";
import {Route} from "./route.js";

export let SweetAlertMessages = class SweetAlertMessages {
	static completeProfile () {
		swal.fire(config.completeProfile()).then((result) => {
			if (result.value) {
				FlowRouter.go('profileSettings', {
					_id: Meteor.userId()
				});
			}
		});
	}

	static continuePresentation () {
		swal.fire(config.continuePresentation()).then((result) => {
			if (result.value) {
				if (document.fullscreenElement === null) {
					document.documentElement.requestFullscreen();
				}
			} else {
				if (document.fullscreenElement) {
					document.exitFullscreen();
				}
				$('.modal-backdrop').css('display', 'none');
				if (Route.isPresentationTranscriptPersonal()) {
					FlowRouter.go('transcriptsPersonal');
				} else {
					FlowRouter.go('cardsetdetailsid', {
						_id: FlowRouter.getParam('_id')
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
				if (document.fullscreenElement) {
					document.exitFullscreen();
				}
				$('.modal-backdrop').css('display', 'none');
				if (Route.isPresentationTranscriptPersonal()) {
					FlowRouter.go('transcriptsPersonal');
				} else {
					FlowRouter.go('cardsetdetailsid', {
						_id: FlowRouter.getParam('_id')
					});
				}
			}
		});
	}

	static exitPresentation () {
		swal.fire(config.exitPresentation()).then((result) => {
			if (result.value) {
				if (document.fullscreenElement) {
					document.exitFullscreen();
				}
				$('.modal-backdrop').css('display', 'none');
				if (Route.isPresentationTranscriptPersonal()) {
					FlowRouter.go('transcriptsPersonal');
				} else {
					FlowRouter.go('cardsetdetailsid', {
						_id: FlowRouter.getParam('_id')
					});
				}
			} else {
				if (document.fullscreenElement === null) {
					document.documentElement.requestFullscreen();
				}
			}
		});
	}

	static leitnerSimulatorError () {
		swal.fire(config.leitnerSimulatorError());
	}
};
