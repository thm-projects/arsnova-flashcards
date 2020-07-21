import "./fullscreen.html";
import {Template} from "meteor/templating";
import {ReactiveVar} from "meteor/reactive-var";

let presentationMode = new ReactiveVar(1);
let demoMode = new ReactiveVar(1);
let leitnerMode = new ReactiveVar(1);
let wozniakMode = new ReactiveVar(1);

Template.profileViewItemFullscreenCheckbox.helpers({
	gotChecked: function () {
		let mode = 0;
		switch (this.group) {
			case 1:
				mode = presentationMode.get();
				break;
			case 2:
				mode = demoMode.get();
				break;
			case 3:
				mode = leitnerMode.get();
				break;
			case 4:
				mode = wozniakMode.get();
				break;
		}
		return mode === this.mode;
	}
});


Template.profileViewItemFullscreenCheckbox.events({
	"click .fa-stack": function () {
		switch (this.group) {
			case 1:
				presentationMode.set(this.mode);
				break;
			case 2:
				demoMode.set(this.mode);
				break;
			case 3:
				leitnerMode.set(this.mode);
				break;
			case 4:
				wozniakMode.set(this.mode);
				break;
		}
	}
});
