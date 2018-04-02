//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./presentation.html";
import {updateNavigation} from "../card/card";

Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
Session.set('animationPlaying', false);


/*
 * ############################################################################
 * presentationView
 * ############################################################################
 */

Template.presentationView.onRendered(function () {
	updateNavigation();
});

Template.presentationView.helpers({});

Template.presentationView.events({});
