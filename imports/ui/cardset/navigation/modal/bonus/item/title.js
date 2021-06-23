import "./title.html";
import * as config from "../../../../../../config/bonusForm.js";

Template.bonusFormTitle.helpers({
	getMaxTitleLength: function () {
		return config.maxTitleLength;
	}
});
