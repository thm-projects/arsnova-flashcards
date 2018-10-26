import {Meteor} from "meteor/meteor";
import swal from "sweetalert2";
import * as screenfull from 'screenfull';

export let SweetAlertMessages = class SweetAlertMessages {
	static completeProfile () {
		swal({
			title: TAPi18n.__('sweetAlert.completeProfile.title'),
			html: TAPi18n.__('sweetAlert.completeProfile.text'),
			type: "warning",
			showCancelButton: true,
			confirmButtonText: TAPi18n.__('sweetAlert.completeProfile.button.confirm'),
			cancelButtonText: TAPi18n.__('sweetAlert.completeProfile.button.cancel'),
			allowOutsideClick: false
		}).then((result) => {
			if (result.value) {
				Router.go('profileSettings', {
					_id: Meteor.userId()
				});
			}
		});
	}

	static continuePresentation () {
		swal({
			title: TAPi18n.__('sweetAlert.presentation.continue.title'),
			html: TAPi18n.__('sweetAlert.presentation.continue.text'),
			type: "warning",
			showCancelButton: true,
			confirmButtonText: TAPi18n.__('sweetAlert.presentation.continue.button.confirm'),
			cancelButtonText: TAPi18n.__('sweetAlert.presentation.continue.button.cancel'),
			allowOutsideClick: false
		}).then((result) => {
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

	static exitPresentation () {
		swal({
			title: TAPi18n.__('sweetAlert.presentation.end.title'),
			html: TAPi18n.__('sweetAlert.presentation.end.text'),
			type: "warning",
			showCancelButton: true,
			confirmButtonText: TAPi18n.__('sweetAlert.presentation.end.button.confirm'),
			cancelButtonText: TAPi18n.__('sweetAlert.presentation.end.button.cancel'),
			allowOutsideClick: false
		}).then((result) => {
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
