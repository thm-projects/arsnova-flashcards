//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { allUsers } from '../../../api/allusers.js';
import { Cardsets } from '../../../api/cardsets.js';
import { Notifications } from '../../../api/notifications.js';

import './admin_users.html';

import './admin_user.js';


Meteor.subscribe('allUsers');

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

    users.forEach(function(user) {
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
        { key: '_id', label: TAPi18n.__('admin.admin'), cellClass:'admin', fn: function(value, object) {
          if (Roles.userIsInRole(value, 'admin') || Roles.userIsInRole(value, 'editor')) {
            return new Spacebars.SafeString("<span name='admin" + object.profilename + "'<i class='fa fa-check'></i>");
          } else {
            return new Spacebars.SafeString("<span name='normal" + object.profilename + "'></span>");
          }
        }},
        { key: 'profilename', label: TAPi18n.__('admin.users'), fn: function(value) {
          return value;
        }},
        { key: '_id', label: TAPi18n.__('admin.pro'), cellClass:'pro', fn: function(value) {
          if (Roles.userIsInRole(value, 'pro')) {
            return new Spacebars.SafeString("<i class='fa fa-check'></i>");
          }
        }},
        { key: '_id', label: TAPi18n.__('admin.university'), cellClass:'university', fn: function(value) {
          if (Roles.userIsInRole(value, 'university')) {
            return new Spacebars.SafeString("<i class='fa fa-check'></i>");
          }
        }},
        { key: '_id', label: TAPi18n.__('admin.lecturer'), cellClass:'lecturer', fn: function(value) {
          if (Roles.userIsInRole(value, 'lecturer')) {
            return new Spacebars.SafeString("<i class='fa fa-check'></i>");
          }
        }},
        { key: '_id', label: TAPi18n.__('admin.mail'), cellClass:'mailto', sortable: false, fn: function(value) {
          if (Meteor.user()._id !== value) {
            return new Spacebars.SafeString("<a class='mailtoUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.notifyuser') + "' data-toggle='modal' data-target='#messageModalAdmin'><i class='fa fa-envelope'></i></a>");
          }
        }},
        { key: 'dateString', label: TAPi18n.__('admin.created'), fn: function(value, object) {
          return new Spacebars.SafeString("<span name='" + object.date + "'>" + value + "</span>");
        }},
        { key: '_id', label: TAPi18n.__('admin.blocked'), cellClass:'blocked', fn: function(value) {
          if (Roles.userIsInRole(value, 'blocked')) {
            return new Spacebars.SafeString("<i class='fa fa-check'></i>");
          }
        }},
        { key: '_id', label: TAPi18n.__('admin.edit'), cellClass:'edit', sortable: false, fn: function(value) {
          return new Spacebars.SafeString("<a id='linkToAdminUser' class='editUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.edituser') + "' data-userid='" + value + "'><i class='glyphicon glyphicon-pencil'></i></a>");
        }},
        { key: '_id', label: TAPi18n.__('admin.delete'), cellClass:'delete', sortable: false, fn: function(value) {
          if (Meteor.user()._id !== value) {
            if(!Roles.userIsInRole(value, 'admin')) {
              return new Spacebars.SafeString("<a class='deleteUserAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deleteuser') + "' data-toggle='modal' data-target='#userConfirmModalAdmin'><i class='glyphicon glyphicon-ban-circle'></i></a>");
            }
          }
        }}
      ]
    }
  }
});

Template.admin_users.events({
  'click .reactive-table tbody tr': function(event) {
    event.preventDefault();
    var user = this;

    if (event.target.className == "deleteUserAdmin btn btn-xs btn-default" || event.target.className == "glyphicon glyphicon-ban-circle") {
      Session.set('userId', user._id);
    }
    if (event.target.className == "mailtoUserAdmin btn btn-xs btn-default" || event.target.className == "fa fa-envelope") {
      Session.set('userId', user._id);
    }
  },
  'click #linkToAdminUser': function(event) {
    var userid = $(event.currentTarget).data("userid");
    Router.go('admin_user', { _id: userid });
  }
});

/**
 * ############################################################################
 * userConfirmFormAdmin
 * ############################################################################
 */

 Template.userConfirmFormAdmin.events({
   'click #userDeleteAdmin': function() {
     var id = Session.get('userId');

     $('#userConfirmModalAdmin').on('hidden.bs.modal', function() {
       Meteor.call("deleteUser", id);
     }).modal('hide');
   }
 });

 /**
  * ############################################################################
  * messageFormAdmin
  * ############################################################################
  */

  Template.messageFormAdmin.onRendered(function() {
    $('#messageModalAdmin').on('hidden.bs.modal', function() {
      $('#helpMessageTextAdmin').html('');
      $('#messageTextAdminLabel').css('color', '');
      $('#messageTextAdmin').css('border-color', '');
      $('#messageTextAdmin').val('');
      $('#messageCardsetAdmin').val($('#messageCardsetAdmin option:first').val());
    });
  });

  Template.messageFormAdmin.helpers({
    getCardsets: function() {
      var user_id = Session.get('userId');
      return Cardsets.find({ owner : user_id }, {
        sort: {
          name: 1
        }
      });
    }
  });

  Template.messageFormAdmin.events({
    'click #messageTextSave': function(evt, tmpl) {
      var user_id = Session.get('userId');

      if ($('#messageTextAdmin').val().length < 100) {
        $('#messageTextAdminLabel').css('color', '#b94a48');
        $('#messageTextAdmin').css('border-color', '#b94a48');
        $('#helpMessageTextAdmin').html(TAPi18n.__('admin.message.text_chars'));
        $('#helpMessageTextAdmin').css('color', '#b94a48');
      } else {
        var text = $('#messageTextAdmin').val();
        var type = "Benutzer benachrichtigen";
        var target = user_id;
        var cardset_id = "Kein Kartensatz";

        if (tmpl.find('#messageCardsetAdmin')) {
          var cardsetname = tmpl.find('#messageCardsetAdmin').value;
          var cardset = Cardsets.findOne({ name: cardsetname });
          cardset_id = cardset._id;
        }

        Meteor.call("addNotification", target, type, text, cardset_id);
        Meteor.call("addNotification", 'admin', type, text, cardset_id);
        $('#messageModalAdmin').modal('hide');
      }
    },
    'keyup #messageTextAdmin': function() {
      $('#messageTextAdminLabel').css('color', '');
      $('#messageTextAdmin').css('border-color', '');
      $('#helpMessageTextAdmin').html('');
    }
  });
