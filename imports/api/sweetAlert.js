import {Meteor} from "meteor/meteor";
import swal from "sweetalert2";

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
};
