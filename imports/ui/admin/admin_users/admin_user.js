//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { allUsers } from '../../../api/allusers.js';
import { Cardsets } from '../../../api/cardsets.js';

import './admin_user.html';

/**
 * ############################################################################
 * admin_user
 * ############################################################################
 */

Template.admin_user.helpers({
  getService: function() {
    var userId = Router.current().params._id;
    if (userId !== undefined) {
      var user = Meteor.users.findOne(userId);
      if (user !== undefined) {
        if (user.services !== undefined){
          var service = _.keys(user.services)[0];
          service = service.charAt(0).toUpperCase() + service.slice(1);
          return service;
        }
      }
    }
    return null;
  },
  getDateUser: function() {
    return moment(this.createdAt).locale(getUserLanguage()).format('LL');
  },
  getLvl: function() {
    if (this.lvl === undefined) {
      return 0;
    } else {
      return this.lvl;
    }
  },
  getOnlineStatus: function(status) {
    if (status === true) {
      return "Online";
    } else {
      return "Offline";
    }
  },
  getLastLogin: function(lastLogin) {
    if (lastLogin) {
      return moment(this.status.lastLogin.date).locale(getUserLanguage()).format('LLL');
    } else {
      return null;
    }
  },
  cardsetListUserAdmin: function() {
    return Cardsets.find({ owner: this._id });
  },
  tableSettings: function() {
    return {
      showFilter: false,
      showNavigationRowsPerPage: false,
      fields: [
        { key: 'name', label: TAPi18n.__('admin.name') },
        { key: 'date', label: TAPi18n.__('admin.created'), fn: function(value) {
            return moment(value).locale(getUserLanguage()).format('LL');
        }},
        { key: '_id', label: TAPi18n.__('admin.edit'), sortable: false, cellClass: 'edit', fn: function(value) {
          return new Spacebars.SafeString("<a id='linkToAdminUserCardset' class='editCardsetAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.editcardset') + "' data-cardsetid='" + value + "'><i class='glyphicon glyphicon-pencil'></i></a>");
        }},
        { key: 'delete', label: TAPi18n.__('admin.delete'), sortable: false, fn: function() {
          return new Spacebars.SafeString("<a class='deleteCardsetAdmin btn btn-xs btn-default' title='" + TAPi18n.__('admin.deletecardset') + "' data-toggle='modal' data-target='#cardsetConfirmModalUserAdmin'><i class='glyphicon glyphicon-ban-circle'></i></a>");
        }}
      ]
    }
  },
  'isVisible': function(id) {
    if (id) {
      return Meteor.users.findOne(id).visible;
    } else {
      return null;
    }
  },
  proUser: function(value) {
    return Roles.userIsInRole(this._id, 'pro') === value;
  },
  eduUser: function(value) {
    return Roles.userIsInRole(this._id, 'university') === value;
  },
  lecturerUser: function(value) {
    return Roles.userIsInRole(this._id, 'lecturer') === value;
  },
  blockedUser: function(value) {
    return Roles.userIsInRole(this._id, 'blocked') === value;
  },
  editorUser: function(value) {
    return Roles.userIsInRole(this._id, 'editor') === value;
  },
  isAdminUser: function(id) {
    if (id) {
      var currentUser = Meteor.user()._id;

      if (Roles.userIsInRole(id, 'admin')) {
        if (Roles.userIsInRole(currentUser, 'editor')) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return null;
    }
  },
  isCurrentUser: function(id) {
    if(id) {
      var currentUser = Meteor.user()._id;

      if (id === currentUser) {
        return false;
      } else {
        return true;
      }
    } else {
      return null;
    }
  }
});

Template.admin_user.events({
  'click #userSaveAdmin': function(event, tmpl) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    var email = $('#editUserEmailAdmin').val();
    var check = re.test(email);

    if (check === false && email !== "") {
      $('#editUserEmailLabelAdmin').css('color', '#b94a48');
      $('#editUserEmailAdmin').css('border-color', '#b94a48');
      $('#helpEditUserEmailAdmin').html(TAPi18n.__('admin.user.email_invalid'));
      $('#helpEditUserEmailAdmin').css('color', '#b94a48');
    }
    if (check === true || email === "") {
      var visible = null;

      if ($('#profilepublicoption1Admin').hasClass('active')) {
        visible = true;
      } else if ($('#profilepublicoption2Admin').hasClass('active')) {
        visible = false;
      }
      if ($('#editUserProAdmin').length) {
        if ('true' === tmpl.find('#editUserProAdmin > .active > input').value) {
          Meteor.call('updateRoles', this._id, 'pro');
        } else {
          Meteor.call('updateRoles', this._id, 'standard');
        }
      }
      if ($('#editUserEduAdmin').length) {
        if ('true' === tmpl.find('#editUserEduAdmin > .active > input').value) {
            Meteor.call('updateRoles', this._id, 'university');
        } else {
          Meteor.call('removeRoles', this._id, 'university');
        }
      }
      if ($('#editUserLecturerAdmin').length)
      {
        if ('true' === tmpl.find('#editUserLecturerAdmin > .active > input').value) {
            Meteor.call('updateRoles', this._id, 'lecturer');
        } else {
          Meteor.call('removeRoles', this._id, 'lecturer');
        }
      }
      if ($('#editUserBlockedAdmin').length)
      {
        if ('true' === tmpl.find('#editUserBlockedAdmin > .active > input').value) {
            Meteor.call('updateRoles', this._id, 'blocked');
            Meteor.call('blockUser', this._id);
        } else {
          Meteor.call('removeRoles', this._id, 'blocked');
          Meteor.call('standardUser', this._id, this.profile.name)
        }
      }
      if ($('#editUserEditorAdmin').length) {
        if ('true' === tmpl.find('#editUserEditorAdmin > .active > input').value) {
            Meteor.call('updateRoles', this._id, 'editor');
        } else {
          Meteor.call('removeRoles', this._id, 'editor');
        }
      }

      Meteor.call('updateUser', this._id, visible, email);
      window.history.go(-1);
    }
  },
  'click #userCancelAdmin': function() {
    window.history.go(-1);
  },
  'click #userDeleteAdmin': function() {
    $("#userDeleteAdmin").css('display', "none");
    $("#userConfirmAdmin").css('display', "");
  },
  'click #userConfirmAdmin': function() {
    var id = this._id;
    Meteor.call("deleteUser", id);
    window.history.go(-1);
  },
  'click .reactive-table tbody tr': function(event) {
    event.preventDefault();
    var cardset = this;

    if (event.target.className == "deleteCardsetAdmin btn btn-xs btn-default" || event.target.className == "glyphicon glyphicon-ban-circle") {
      Session.set('cardsetId', cardset._id);
    }
  },
  'click #linkToAdminUserCardset': function(event) {
    var cardsetid = $(event.currentTarget).data("cardsetid");
    Router.go('admin_cardset', { _id: cardsetid });
  },
  'keyup #editUserEmailAdmin': function() {
    $('#editUserEmailLabelAdmin').css('color', '');
    $('#editUserEmailAdmin').css('border-color', '');
    $('#helpEditUserEmailAdmin').html('');
  }
});

/**
 * ############################################################################
 * cardsetConfirmFormUserAdmin
 * ############################################################################
 */

 Template.cardsetConfirmFormUserAdmin.events({
   'click #cardsetDeleteUserAdmin': function() {
     var id = Session.get('cardsetId');

     $('#cardsetConfirmModalUserAdmin').on('hidden.bs.modal', function() {
       Meteor.call("deleteCardset", id);
     }).modal('hide');
   }
 });
