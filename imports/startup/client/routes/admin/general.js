import {FlowRouter} from "meteor/ostrio:flow-router-extra";

FlowRouter.route('/admin', function () {
	FlowRouter.go('admin_dashboard');
});
