import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import * as RouteNames from "../../../../util/routeNames";
import * as config from "../../../../config/routes";
import {Meteor} from "meteor/meteor";
import {ServerStyle} from "../../../../api/styles";
import {Session} from "meteor/session";

FlowRouter.route('/impressum', {
	name: RouteNames.impressum,
	whileWaiting: function () {
		this.render(config.mainTemplate, config.loadingScreenTemplate);
	},
	waitOn: function () {
		return [
			import("../../../../ui/impressum/impressum.js"),
			Meteor.subscribe('defaultAppData')
		];
	},
	data: function () {
		document.title = TAPi18n.__('title.welcome.legalNotice',  {app: ServerStyle.getAppTitle()}, ServerStyle.getServerLanguage());
		Session.set('helpFilter', undefined);
	},
	action: function (params, qs, data) {
		this.render(config.mainTemplate, 'contact', data);
	}
});
