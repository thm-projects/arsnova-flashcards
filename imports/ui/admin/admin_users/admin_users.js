//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../../api/cardsets.js";
import {Learned} from "../../../api/learned.js";
import "./admin_users.html";
import "./admin_user.js";


Meteor.subscribe('allUsers');
Meteor.subscribe('learned', function () {
	Session.set('data_loaded', true);
});

/**
 * ############################################################################
 * admin_dashboard
 * ############################################################################
 */

export function drawGraph() {
	if (Session.get('data_loaded')) {
		var box1 = Learned.find({box: 1}).fetch().length;
		var box2 = Learned.find({box: 2}).fetch().length;
		var box3 = Learned.find({box: 3}).fetch().length;
		var box4 = Learned.find({box: 4}).fetch().length;
		var box5 = Learned.find({box: 5}).fetch().length;
		var box6 = Learned.find({box: 6}).fetch().length;

		var userData = [Number(box1), Number(box2), Number(box3), Number(box4), Number(box5), Number(box6)];

		var data = {
			labels: [TAPi18n.__('subject1'), TAPi18n.__('subject2'), TAPi18n.__('subject3'), TAPi18n.__('subject4'), TAPi18n.__('subject5'), TAPi18n.__('subject6')],
			datasets: [
				{
					fillColor: "rgba(242,169,0,0.5)",
					strokeColor: "rgba(74,92,102,0.2)",
					pointColor: "rgba(220,220,220,1)",
					pointStrokeColor: "#fff",
					data: userData
				}
			]
		};
		var canvas = document.getElementById("adminChart");
		var ctx = document.getElementById("adminChart").getContext("2d");
		new Chart(ctx).Bar(data,
			{
				responsive: true,
				options: {
					scales: {
						yAxes: [{
							stacked: true
						}]
					}
				}
			});
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
	}
}

Template.messageFormAdmin.onRendered(function () {
	var self = this;
	self.subscribe("learned", function () {
		self.autorun(function () {
			drawGraph();
		});
	});
});

/**
 * ############################################################################
 * admin_users
 * ############################################################################
 */

Template.admin_users.helpers({
	userListAdmin: function () {
		var users = Meteor.users.find();
		var fields = [];
		var dateString = null;
		var date = null;

		users.forEach(function (user) {
			dateString = moment(user.createdAt).locale(getUserLanguage()).format('LL');
			date = moment(user.createdAt).format("YYYY-MM-DD");
			fields.push({"_id": user._id, "profilename": user.profile.name, "dateString": dateString, "date": date});
		});

		return fields;
	},
	tableSettings: function () {
		return {
			showNavigationRowsPerPage: false,
			rowsPerPage: 20,
			fields: [
				{
					key: '_id', label: TAPi18n.__('admin.admin'), cellClass: 'admin',
					fn: function (value, object) {
						if (Roles.userIsInRole(value, 'admin')) {
							return new Spacebars.SafeString("<span name='Admin" + object.profilename + "'><i class='fa fa-check'></i> (Super Admin)</span>");
						} else if (Roles.userIsInRole(value, 'editor')) {
							return new Spacebars.SafeString("<span name='admin" + object.profilename + "'><i class='fa fa-check'></i></span>");
						} else {
							return new Spacebars.SafeString("<span name='normal" + object.profilename + "'></span>");
						}
					}
				},
				{
					key: 'profilename', label: TAPi18n.__('admin.users'),
					fn: function (value) {
						return value;
					}
				},
				{
					key: '_id', label: TAPi18n.__('admin.pro'), cellClass: 'pro',
					fn: function (value) {
						if (Roles.userIsInRole(value, 'pro')) {
							return new Spacebars.SafeString("<i class='fa fa-check'></i>");
						}
					}
				},
				{
					key: '_id', label: TAPi18n.__('admin.university'), cellClass: 'university',
					fn: function (value) {
						if (Roles.userIsInRole(value, 'university')) {
							return new Spacebars.SafeString("<i class='fa fa-check'></i>");
						}
					}
				},
				{
					key: '_id', label: TAPi18n.__('admin.lecturer'), cellClass: 'lecturer',
					fn: function (value) {
						if (Roles.userIsInRole(value, 'lecturer')) {
							return new Spacebars.SafeString("<i class='fa fa-check'></i>");
						}
					}
				},
				{
					key: '_id',
					label: TAPi18n.__('admin.mail'),
					cellClass: 'mailto',
					sortable: false,
					fn: function (value) {
						if (Meteor.user()._id !== value) {
							return new Spacebars.SafeString("<a class='mailtoUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.notifyuser') + "' data-toggle='modal' data-target='#messageModalAdmin'><i class='fa fa-envelope'></i></a>");
						}
					}
				},
				{
					key: 'dateString', label: TAPi18n.__('admin.joined'),
					fn: function (value, object) {
						return new Spacebars.SafeString("<span name='" + object.date + "'>" + value + "</span>");
					}
				},
				{
					key: '_id', label: TAPi18n.__('admin.blocked'), cellClass: 'blocked',
					fn: function (value) {
						if (Roles.userIsInRole(value, 'blocked')) {
							return new Spacebars.SafeString("<i class='fa fa-check'></i>");
						}
					}
				},
				{
					key: '_id',
					label: TAPi18n.__('admin.edit'),
					cellClass: 'edit',
					sortable: false,
					fn: function (value) {
						return new Spacebars.SafeString("<a id='linkToAdminUser' class='editUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.edituser') + "' data-userid='" + value + "'><i class='glyphicon glyphicon-pencil'></i></a>");
					}
				},
				{
					key: '_id',
					label: TAPi18n.__('admin.delete'),
					cellClass: 'delete',
					sortable: false,
					fn: function (value) {
						if (Meteor.user()._id !== value) {
							if (!Roles.userIsInRole(value, 'admin')) {
								return new Spacebars.SafeString("<a class='deleteUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deleteuser') + "' data-toggle='modal' data-target='#userConfirmModalAdmin'><i class='glyphicon glyphicon-ban-circle'></i></a>");
							}
						}
					}
				}
			]
		};
	}
});

Template.admin_users.events({
	'click .reactive-table tbody tr': function (event) {
		event.preventDefault();
		var user = this;

		if (event.target.className == "deleteUserAdmin btn btn-xs btn-default" || event.target.className == "glyphicon glyphicon-ban-circle") {
			Session.set('userId', user._id);
		}
		if (event.target.className == "mailtoUserAdmin btn btn-xs btn-default" || event.target.className == "fa fa-envelope") {
			Session.set('userId', user._id);
			Session.set('getUsername', user.profilename);
		}
	},
	'click #linkToAdminUser': function (event) {
		var userid = $(event.currentTarget).data("userid");
		Router.go('admin_user', {_id: userid});
	}
});

/**
 * ############################################################################
 * userConfirmFormAdmin
 * ############################################################################
 */

Template.userConfirmFormAdmin.events({
	'click #userDeleteAdmin': function () {
		var id = Session.get('userId');

		$('#userConfirmModalAdmin').on('hidden.bs.modal', function () {
			Meteor.call("deleteUser", id);
		}).modal('hide');
	}
});

/**
 * ############################################################################
 * messageFormAdmin
 * ############################################################################
 */

Template.messageFormAdmin.onRendered(function () {
	$('#messageModalAdmin').on('hidden.bs.modal', function () {
		$('#helpMessageTextAdmin').html('');
		$('#messageTextAdminLabel').css('color', '');
		$('#messageTextAdmin').css('border-color', '');
		$('#messageTextAdmin').val('');
		$('#messageReasonAdmin').val($('#messageReasonAdmin option:first').val());
		Session.set('showCardset', false);
	});
});

Template.messageFormAdmin.helpers({
	getUsername: function () {
		var username = Session.get('getUsername');
		return username;
	},
	getCardsets: function () {
		var user_id = Session.get('userId');
		return Cardsets.find({owner: user_id}, {
			sort: {
				name: 1
			}
		});
	},
	isCardset: function () {
		var showCardset = Session.get('showCardset');

		if (showCardset) {
			return true;
		} else {
			return false;
		}
	}
});

Template.messageFormAdmin.events({
	'click #messageTextSave': function () {
		var user_id = Session.get('userId');

		if ($('#messageTextAdmin').val().length < 50) {
			$('#messageTextAdminLabel').css('color', '#b94a48');
			$('#messageTextAdmin').css('border-color', '#b94a48');
			$('#helpMessageTextAdmin').html(TAPi18n.__('admin.message.text_chars'));
			$('#helpMessageTextAdmin').css('color', '#b94a48');
		} else {
			var text = $('#messageTextAdmin').val();
			var type;
			var link_id;

			if ($('#messageReasonAdmin').val() === "Beschwerde Benutzer" || $('#messageReasonAdmin').val() === "Complaint user" || $('#messageReasonAdmin').html() === 'Beschwerde Benutzer' || $('#messageReasonAdmin').html() === 'Complaint user') {
				type = "Adminbenachrichtigung (Beschwerde Benutzer)";
				link_id = user_id;
			} else {
				type = "Adminbenachrichtigung (Beschwerde Kartensatz)";
				var selectedCardset = $('#messageCardsetAdmin').children(":selected").attr("id");
				link_id = selectedCardset;
			}

			var target = user_id;

			Meteor.call("addNotification", target, type, text, link_id, target);
			Meteor.call("addNotification", 'admin', type, text, link_id, target);
			$('#messageModalAdmin').modal('hide');
		}
	},
	'keyup #messageTextAdmin': function () {
		$('#messageTextAdminLabel').css('color', '');
		$('#messageTextAdmin').css('border-color', '');
		$('#helpMessageTextAdmin').html('');
	},
	'change #messageReasonAdmin': function () {
		if ($('#messageReasonAdmin').val() === "Beschwerde Benutzer" || $('#messageReasonAdmin').val() === "Complaint user") {
			Session.set('showCardset', false);
		} else {
			Session.set('showCardset', true);
		}
	}
});
