//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Cards} from "../../api/cards.js";
import {Ratings} from "../../api/ratings.js";
import {Paid} from "../../api/paid.js";
import {Leitner, Wozniak} from "../../api/learned.js";
import {ReactiveVar} from "meteor/reactive-var";
import "../card/card.js";
import "../learn/learn.js";
import "./cardset.html";
import {image, tex} from '/imports/ui/card/card.js';

Meteor.subscribe("cardsets");
Meteor.subscribe("userData");
Meteor.subscribe("paid");
Meteor.subscribe("allLearned");
Meteor.subscribe("notifications");
Meteor.subscribe('ratings', function () {
	Session.set('ratingsLoaded', true);
});

/**
 * Creates a web push subscription for the current device.
 * The Browser ask the user for permissions and creates the subscription.
 * Afterwards the subscription will be saved for the current user via the
 * Meteor-method addWebPushSubscription.
 */
function subscribeForPushNotification() {
	try {
		navigator.serviceWorker.getRegistration()
			.then(function (registration) {
				return registration.pushManager.getSubscription()
					.then(function (subscription) {
						if (!subscription) {
							return registration.pushManager.subscribe({userVisibleOnly: true});
						}
					});
			})
			.then(function (subscription) {
				if (subscription) {
					var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
					const key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';
					var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
					const authSecret = rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : '';
					const endpoint = subscription.endpoint;
					const sub = {
						endpoint: endpoint,
						key: key,
						authSecret: authSecret
					};
					Meteor.call("addWebPushSubscription", sub, function (error) {
						if (error) {
							throw new Meteor.Error(error.statusCode, 'Error subscription failed');
						}
					});
				}
			});
	} catch (error) {
		console.log(error);
	}
}

/**
 * Add the current user to the leitner algorithm.
 */
function addToLeitner(cardset_id) {
	subscribeForPushNotification();
	Meteor.call('addToLeitner', cardset_id);
}

function changeCollapseIcon(iconId) {
	if ($(iconId).hasClass("glyphicon-collapse-down")) {
		$(iconId).removeClass("glyphicon-collapse-down");
		$(iconId).addClass("glyphicon-collapse-up");
	} else {
		$(iconId).removeClass("glyphicon-collapse-up");
		$(iconId).addClass("glyphicon-collapse-down");
	}
}

/*
 * ############################################################################
 * cardset
 * ############################################################################
 */

Template.cardset.onCreated(function () {
	if (Session.get('activeCardsetID') !== Router.current().params._id) {
		Session.set('activeCardsetID', Router.current().params._id);
		Session.set('modifiedCard', undefined);
	}
});

Template.cardset.rendered = function () {
	Meteor.subscribe("previewCards", Router.current().params._id);

	var customerId = Meteor.user().customerId;
	if ($('#payment-form').length) {
		Meteor.call('getClientToken', customerId, function (error, clientToken) {
			if (error) {
				throw new Meteor.Error(error.statusCode, 'Error getting client token from braintree');
			} else {
				braintree.setup(clientToken, "dropin", {
					container: "payment-form",
					onPaymentMethodReceived: function (response) {
						$('#buyCardsetBtn').prop("disabled", true);

						var nonce = response.nonce;

						Meteor.call('btCreateTransaction', nonce, Router.current().params._id, function (error) {
							if (error) {
								throw new Meteor.Error('transaction-creation-failed');
							} else {
								Bert.alert(TAPi18n.__('cardset.money.bought'), 'success', 'growl-top-left');
							}
						});
					}
				});
			}
		});
	}
};

Template.cardset.helpers({

	'onEditmodalClose': function (id) {
		Session.set('previousName', Cardsets.findOne(id).name);
		Session.set('previousDescription', Cardsets.findOne(id).description);
		Session.set('previousModule', Cardsets.findOne(id).module);
		Session.set('previousModuleShort', Cardsets.findOne(id).moduleToken);
		Session.set('previousModuleNum', Cardsets.findOne(id).moduleNum);
		Session.set('previousCollegeName', Cardsets.findOne(id).college);
		Session.set('previousCourseName', Cardsets.findOne(id).course);
	},
	'hasCardsetPermission': function () {
		var userId = Meteor.userId();
		var cardsetKind = this.kind;

		var hasRole = false;
		if (Roles.userIsInRole(userId, 'pro') ||
			(Roles.userIsInRole(userId, 'lecturer')) ||
			(Roles.userIsInRole(userId, 'admin')) ||
			(Roles.userIsInRole(userId, 'editor')) ||
			(Roles.userIsInRole(userId, 'university') && (cardsetKind === 'edu' || cardsetKind === 'free')) ||
			(cardsetKind === 'free') ||
			(Paid.find({cardset_id: this._id, user_id: userId}).count() === 1)) {
			hasRole = true;
		}

		return (this.owner === Meteor.userId() || this.editors.includes(Meteor.userId())) || hasRole;
	},
	'isLecturerAndHasRequest': function () {
		return (Roles.userIsInRole(Meteor.userId(), 'lecturer') && this.request === true && this.owner !== Meteor.userId());
	},
	'selectedForLearning': function () {
		if (Session.get('selectingCardsetToLearn')) {
			addToLeitner(this._id);
			Meteor.call("addWozniakCards", this._id);
			Session.set("selectingCardsetToLearn", false);
			Bert.alert(TAPi18n.__('cardset.alert.addedToWorkload'), 'success', 'growl-top-left');
		}
	}
});

Template.cardset.events({
	'click #cardSetSave': function (evt, tmpl) {
		if ($('#editSetName').val() === "") {
			$('#editSetNameLabel').css('color', '#b94a48');
			$('#editSetName').css('border-color', '#b94a48');
			$('#helpEditSetName').html(TAPi18n.__('modal-dialog.name_required'));
			$('#helpEditSetName').css('color', '#b94a48');
		}
		if ($('#editSetDescription').val() === "") {
			$('#editSetDescriptionLabel').css('color', '#b94a48');
			$('#editSetDescription').css('border-color', '#b94a48');
			$('#helpEditSetDescription').html(TAPi18n.__('modal-dialog.description_required'));
			$('#helpEditSetDescription').css('color', '#b94a48');
		}
		if ($('#editSetModule').val() === "") {
			$('#editSetModuleLabel').css('color', '#b94a48');
			$('#editSetModule').css('border-color', '#b94a48');
			$('#helpEditSetModule').html(TAPi18n.__('modal-dialog.module_required'));
			$('#helpEditSetModule').css('color', '#b94a48');
		}
		if ($('#editSetModuleShort').val() === "") {
			$('#editSetModuleShortLabel').css('color', '#b94a48');
			$('#editSetModuleShort').css('border-color', '#b94a48');
			$('#helpEditSetModuleShort').html(TAPi18n.__('modal-dialog.moduleShort_required'));
			$('#helpEditSetModuleShort').css('color', '#b94a48');
		}
		if ($('#editSetModuleNum').val() === "") {
			$('#editSetModuleNumLabel').css('color', '#b94a48');
			$('#editSetModuleNum').css('border-color', '#b94a48');
			$('#helpEditSetModuleNum').html(TAPi18n.__('modal-dialog.moduleNum_required'));
			$('#helpEditSetModuleNum').css('color', '#b94a48');
		}
		if (!Meteor.settings.public.university.singleUniversity) {
			if ($('#editSeCollege').val() === "") {
				$('#editSetCollegeLabel').css('color', '#b94a48');
				$('.editSetCollegeDropdown').css('border-color', '#b94a48');
				$('#helpEditSetCollege').html(TAPi18n.__('modal-dialog.college_required'));
				$('#helpEditSetCollege').css('color', '#b94a48');
			}
		}
		if ($('#editSetCourse').val() === "") {
			$('#editSetCourseLabel').css('color', '#b94a48');
			$('.editSetCourseDropdown').css('border-color', '#b94a48');
			$('#helpEditSetCourse').html(TAPi18n.__('modal-dialog.course_required'));
			$('#helpEditSetCourse').css('color', '#b94a48');
		}
		let name;
		let description;
		let module;
		let moduleShort;
		let moduleNum;
		let college;
		let course;
		if (Meteor.settings.public.university.singleUniversity) {
			if ($('#editSetName').val() !== "" &&
				$('#editSetDescription').val() !== "" &&
				$('#editSetModule').val() !== "" &&
				$('#editSetModuleShort').val() !== "" &&
				$('#editSetModuleNum').val() !== "" &&
				$('#editSetCourse').val() !== "") {
				name = tmpl.find('#editSetName').value;
				description = tmpl.find('#editSetDescription').value;
				module = tmpl.find('#editSetModule').value;
				moduleShort = tmpl.find('#editSetModuleShort').value;
				moduleNum = tmpl.find('#editSetModuleNum').value;
				college = Meteor.settings.public.university.default;
				course = $('#editSetCourse').text();
				Meteor.call("updateCardset", this._id, name, description, module, moduleShort, moduleNum, college, course);
				$('#editSetModal').modal('hide');
			}
		} else {
			if ($('#editSetName').val() !== "" &&
				$('#editSetDescription').val() !== "" &&
				$('#editSetModule').val() !== "" &&
				$('#editSetModuleShort').val() !== "" &&
				$('#editSetModuleNum').val() !== "" &&
				$('#editSetCollege').val() !== "" &&
				$('#editSetCourse').val() !== "") {
				name = tmpl.find('#editSetName').value;
				description = tmpl.find('#editSetDescription').value;
				module = tmpl.find('#editSetModule').value;
				moduleShort = tmpl.find('#editSetModuleShort').value;
				moduleNum = tmpl.find('#editSetModuleNum').value;
				college = $('#editSetCollege').text();
				course = $('#editSetCourse').text();
				Meteor.call("updateCardset", this._id, name, description, module, moduleShort, moduleNum, college, course);
				$('#editSetModal').modal('hide');
			}
		}
	},
	'click #cardSetDelete': function () {
		$("#cardSetDelete").css('display', "none");
		$("#cardSetConfirm").css('display', "");

		$('#editSetModal').on('hidden.bs.modal', function () {
			$("#cardSetDelete").css('display', "");
			$("#cardSetConfirm").css('display', "none");
		});
	},
	'click #cardSetConfirm': function () {
		var id = this._id;

		$('#editSetModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteCardset", id);
			Router.go('create');
		}).modal('hide');
	},
	'click #acceptRequest': function () {
		Meteor.call("acceptProRequest", this._id);
		Bert.alert(TAPi18n.__('cardset.request.accepted'), 'success', 'growl-top-left');
	},
	'click #declineRequest': function () {
		var reason = $('#declineRequestReason').val();
		if (reason === '') {
			Bert.alert(TAPi18n.__('cardset.request.reason'), 'danger', 'growl-top-left');
		} else {
			Meteor.call("declineProRequest", this._id);
			Meteor.call("addNotification", this.owner, "Freischaltung des Kartensatzes " + this.name + " nicht stattgegeben", reason, this._id);
			Bert.alert(TAPi18n.__('cardset.request.declined'), 'info', 'growl-top-left');
		}
	}
});

/*
 * ############################################################################
 * cardsetForm
 * ############################################################################
 */

Template.cardsetForm.onRendered(function () {
	$('#editSetModal').on('hidden.bs.modal', function () {
		var previousCollegeName = Session.get('previousCollegeName');
		var previousCourseName = Session.get('previousCourseName');

		$('#editSetName').val(Session.get('previousName'));
		$('#editSetNameLabel').css('color', '');
		$('#editSetName').css('border-color', '');
		$('#helpEditSetName').html('');

		$('#editSetDescription').val(Session.get('previousDescription'));
		$('#editSetDescriptionLabel').css('color', '');
		$('#editSetDescription').css('border-color', '');
		$('#helpEditSetDescription').html('');

		$('#editSetModule').val(Session.get('previousModule'));
		$('#editSetModuleLabel').css('color', '');
		$('#editSetModule').css('border-color', '');
		$('#helpEditSetModule').html('');

		$('#editSetModuleShort').val(Session.get('previousModuleShort'));
		$('#editSetModuleShortLabel').css('color', '');
		$('#editSetModuleShort').css('border-color', '');
		$('#helpEditSetModuleShort').html('');

		$('#editSetModuleNum').val(Session.get('previousModuleNum'));
		$('#editSetModuleNumLabel').css('color', '');
		$('#editSetModuleNum').css('border-color', '');
		$('#helpEditSetModuleNum').html('');

		$('#editSetCollege').html(previousCollegeName);
		$('#editSetCollege').val(previousCollegeName);
		Session.set('poolFilterCollege', previousCollegeName);
		$('#editSetCollegeLabel').css('color', '');
		$('.editSetCollegeDropdown').css('border-color', '');
		$('#helpEditSetCollege').html('');

		$('#editSetCourse').html(previousCourseName);
		$('#editSetCourse').val(previousCourseName);
		$('#editSetCourseLabel').css('color', '');
		$('.editSetCourseDropdown').css('border-color', '');
		$('#helpEditSetCourse').html('');
	});
});

Template.cardsetForm.events({
	'click .college': function (evt) {
		var collegeName = $(evt.currentTarget).attr("data");
		$('#editSetCollege').html(collegeName);
		$('#editSetCollege').val(collegeName);
		Session.set('poolFilterCollege', collegeName);
		$('#editSetCourse').html((TAPi18n.__('modal-dialog.course_required')));
		$('#editSetCourse').val('');
		$('#editSetCollegeLabel').css('color', '');
		$('.editSetCollegeDropdown').css('border-color', '');
		$('#helpEditSetCollege').html('');
	},
	'click .course': function (evt) {
		var courseName = $(evt.currentTarget).attr("data");
		$('#editSetCourse').html(courseName);
		$('#editSetCourse').val(courseName);
		$('#editSetCourseLabel').css('color', '');
		$('.editSetCourseDropdown').css('border-color', '');
		$('#helpEditSetCourse').html('');
	},
	'keyup #editSetName': function () {
		$('#editSetNameLabel').css('color', '');
		$('#editSetName').css('border-color', '');
		$('#helpEditSetName').html('');
	},
	'keyup #editSetDescription': function () {
		$('#editSetDescriptionLabel').css('color', '');
		$('#editSetDescription').css('border-color', '');
		$('#helpEditSetDescription').html('');
	},
	'keyup #editSetModule': function () {
		$('#editSetModuleLabel').css('color', '');
		$('#editSetModule').css('border-color', '');
		$('#helpEditSetModule').html('');
	},
	'keyup #editSetModuleShort': function () {
		$('#editSetModuleShortLabel').css('color', '');
		$('#editSetModuleShort').css('border-color', '');
		$('#helpEditSetModuleShort').html('');
	},
	'keyup #editSetModuleNum': function () {
		$('#editSetModuleNumLabel').css('color', '');
		$('#editSetModuleNum').css('border-color', '');
		$('#helpEditSetModuleNum').html('');
	}
});

/*
 * ############################################################################
 * cardsetPreview
 * ############################################################################
 */

Template.cardsetPreview.events({
	"click #buyProBtn": function () {
		Router.go('profileMembership', {
			_id: Meteor.userId()
		});
	}
});

Template.cardsetPreview.onCreated(function () {
	Cards._collection.remove({cardset_id: Router.current().params._id});
});

/*
 * ############################################################################
 * descriptionEditorEdit
 * ############################################################################
 */

Template.descriptionEditorEdit.rendered = function () {
	$("#editSetDescription").markdown({
		autofocus: false,
		hiddenButtons: ["cmdPreview", "cmdImage", "cmdItalic"],
		fullscreen: false,
		iconlibrary: "fa",
		footer: "<p></p>",
		additionalButtons: [
			[{
				name: "groupCustom",
				data: [{
					name: 'cmdPics',
					title: 'Image',
					icon: 'fa fa-file-image-o',
					callback: image
				}, {
					name: "cmdTex",
					title: "Tex",
					icon: "fa fa-superscript",
					callback: tex
				}]
			}]
		]
	});
};

/*
 * ############################################################################
 * cardsetList
 * ############################################################################
 */
Template.cardsetList.helpers({
	isShuffledCardset: function () {
		return Cardsets.findOne({_id: Router.current().params._id}).shuffled;
	},
	cardsetList: function () {
		if (this.shuffled) {
			return Cardsets.find({_id: {$in: this.cardGroups}}, {name: 1}).fetch();
		} else {
			return Cardsets.find({_id: this._id}).fetch();
		}
	},
	cardSubject: function () {
		return _.uniq(Cards.find({
			cardset_id: this._id
		}, {
			cardset_id: 1,
			subject: 1,
			sort: {subject: 1}
		}).fetch(), function (card) {
			return card.subject;
		});
	},
	cardList: function () {
		return Cards.find({
			cardset_id: this.cardset_id,
			subject: this.subject
		}, {
			_id: 1,
			difficulty: 1,
			front: 1,
			sort: {front: 1}
		});
	},
	getColors: function () {
		switch (this.kind) {
			case "personal":
				return "btn-danger";
			case "free":
				return "btn-info";
			case "edu":
				return "btn-success";
			case "pro":
				return "btn-warning";
		}
	},
	gotReferences: function () {
		return Cardsets.findOne({_id: Router.current().params._id}).cardGroups !== [""];
	}
});

Template.cardsetList.events({
	'click .cardListRow': function (evt) {
		Session.set('modifiedCard', $(evt.target).data('id'));
		Router.go('cardsetdetailsid', {_id: Router.current().params._id});
	}
});
/*
 * ############################################################################
 * cardsetInfo
 * ############################################################################
 */

Template.cardsetInfo.onRendered(function () {
	$('[data-toggle="tooltip"]').tooltip({
		container: 'body'
	});
});

Template.cardsetInfo.helpers({
	getKind: function () {
		switch (this.kind) {
			case "personal":
				return '<span class="label label-warning">Private</span>';
			case "free":
				return '<span class="label label-info">Free</span>';
			case "edu":
				return '<span class="label label-success">Edu</span>';
			case "pro":
				return '<span class="label label-danger">Pro</span>';
			default:
				return '<span class="label label-default">Undefined!</span>';
		}
	},
	getStatus: function () {
		if (this.visible) {
			return (this.kind.charAt(0).toUpperCase() + this.kind.slice(1));
		} else {
			if (this.kind === 'pro' && this.request === true) {
				return TAPi18n.__('sidebar-nav.review');
			} else {
				return TAPi18n.__('sidebar-nav.private');
			}
		}
	},
	isDisabled: function () {
		return !!(this.quantity < 5 || this.reviewed || this.request);
	},
	isPublished: function () {
		return (this.kind === 'personal');
	}
});

Template.cardsetInfo.events({
	'click #exportCardsBtn': function () {
		var cardset = Cardsets.findOne(this._id);
		var cards = Cards.find({
			cardset_id: this._id
		}, {
			fields: {
				'cardset_id': 0,
				'cardGroup': 0,
				'_id': 0
			}, sort: {
				'subject': 1,
				'front': 1
			}
		}).fetch();

		var cardsString = '';

		for (var i = 0; i < cards.length; i++) {
			cardsString += JSON.stringify(cards[i]);
			if (i < cards.length - 1) {
				cardsString += ", ";
			}
		}

		var exportData = new Blob([cardsString], {
			type: "application/json"
		});
		saveAs(exportData, cardset.name + ".json");
	},
	'click #editShuffle': function () {
		Router.go('editshuffle', {_id: Router.current().params._id});
	}
});

/*
 * ############################################################################
 * cardsetInfoBox
 * ############################################################################
 */

Template.cardsetInfoBox.onRendered(function () {
	$('[data-toggle="tooltip"]').tooltip({
		container: 'body'
	});
});

Template.cardsetInfoBox.helpers({
	canViewForFree: function () {
		return (this.kind === "edu" && (Roles.userIsInRole(Meteor.userId(), ['university', 'lecturer'])));
	},
	ratingEnabled: function () {
		return this.ratings === true;
	},
	hasRated: function () {
		var count = Ratings.find({
			cardset_id: this._id,
			user: Meteor.userId()
		}).count();
		var cardset = Cardsets.findOne(this._id);
		if (cardset !== null) {
			return count !== 0;
		}
	},
	getUserRating: function () {
		var userrating = Ratings.findOne({
			cardset_id: this._id,
			user: Meteor.userId()
		});
		if (userrating) {
			return userrating.rating;
		} else {
			return 0;
		}
	},
	hasAmount: function () {
		return this.kind === 'pro' || this.kind === 'edu';
	},
	getAmount: function () {
		return this.price + '€';
	},
	getColors: function () {
		switch (this.kind) {
			case "personal":
				return "btn-danger";
			case "free":
				return "btn-info";
			case "edu":
				return "btn-success";
			case "pro":
				return "btn-warning";
		}
	},
	getName: function () {
		let shuffled = "";
		if (this.shuffled) {
			shuffled = TAPi18n.__('admin.shuffled') + " ";
		}
		return shuffled;
	},
	isPurchased: function () {
		return Paid.findOne({cardset_id: this._id}) !== undefined;
	},
	getDateOfPurchase: function () {
		return moment(Paid.findOne({cardset_id: this._id}).date).locale(getUserLanguage()).format('LL');
	},
	getReviewer: function () {
		var reviewer = Meteor.users.findOne(this.reviewer);
		return (reviewer !== undefined) ? reviewer.profile.name : undefined;
	}
});

Template.cardsetInfoBox.events({
	'click #rating': function () {
		var cardset_id = Template.parentData(1)._id;
		var rating = $('#rating').data('userrating');
		var count = Ratings.find({
			cardset_id: cardset_id,
			user: Meteor.userId()
		}).count();
		if (count === 0) {
			Meteor.call("addRating", cardset_id, Meteor.userId(), rating);
		} else {
			Meteor.call("updateRating", cardset_id, Meteor.userId(), rating);
		}
	}
});
/*
 * ############################################################################
 * leaveLearnPhaseForm
 * ############################################################################
 */

Template.leaveLearnPhaseForm.events({
	'click #leaveLearnPhaseConfirm': function () {
		var id = Router.current().params._id;


		$('#leaveModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		$('#leaveModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteLeitner", id);
			Router.go('home');
		});
	}
});

/*
 * ############################################################################
 * leaveEditorsForm
 * ############################################################################
 */

Template.leaveEditorsForm.events({
	'click #leaveEditorsConfirm': function () {
		$('#leaveEditorsModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		$('#leaveEditorsModal').on('hidden.bs.modal', function () {
			Meteor.call("leaveEditors", Router.current().params._id);
		});
	}
});

/*
 * ############################################################################
 * cardsetSidebar
 * ############################################################################
 */
Template.cardsetSidebar.events({
	"click #learnBox": function () {
		addToLeitner(this._id);
		Router.go('box', {
			_id: this._id
		});
	},
	"click #learnMemo": function () {
		Meteor.call("addWozniakCards", this._id);
		Router.go('memo', {
			_id: this._id
		});
	},
	"click #leitnerProgress": function () {
		Router.go('progress', {
			_id: this._id,
			user_id: Meteor.userId()
		});
	},
	"click #startStopLearning": function () {
		if (Roles.userIsInRole(Meteor.userId(), "lecturer") && this.owner === Meteor.userId()) {
			var now = new Date();
			var end = new Date();
			end.setMonth(end.getMonth() + 3);
			var today = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
			var tomorrow = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + ((now.getDate() + 1) < 10 ? "0" : "") + (now.getDate() + 1);
			var threeMonths = end.getFullYear() + "-" + ((end.getMonth() + 1) < 10 ? "0" : "") + (end.getMonth() + 1) + "-" + (end.getDate() < 10 ? "0" : "") + end.getDate();
			document.getElementById('inputLearningStart').setAttribute("min", today);
			document.getElementById('inputLearningStart').setAttribute("max", threeMonths);
			$('#inputLearningStart').val(today);
			document.getElementById('inputLearningEnd').setAttribute("min", tomorrow);
			$('#inputLearningEnd').val(threeMonths);
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	"click #showStats": function () {
		Router.go('cardsetstats', {_id: Router.current().params._id});
	},
	"click #manageEditors": function () {
		Router.go('cardseteditors', {_id: Router.current().params._id});
	},
	"click #collapseManageButton": function () {
		changeCollapseIcon("#collapseMangeIcon");
	}
});

Template.cardsetSidebar.helpers({
	enableIfPublished: function () {
		return this.kind !== 'personal';
	},
	gotEnoughCards: function () {
		return (this.quantity >= 1);
	},
	'learningLeitner': function () {
		return Leitner.findOne({cardset_id: Router.current().params._id, user_id: Meteor.userId()});
	},
	'learningMemo': function () {
		return Wozniak.findOne({
			cardset_id: Router.current().params._id,
			user_id: Meteor.userId(),
			interval: {$ne: 0}
		});
	}
});

/*
* ############################################################################
* cardsetInfoBox
* ############################################################################
*/
Template.cardsetInfoBox.events({
	"click #collapseCardsetInfoButton": function () {
		changeCollapseIcon("#collapseCardsetInfoIcon");
	}
});

Template.cardsetInfoBox.helpers({
	getAuthors: function () {
		let cardsets = this.cardGroups;
		let owner_id = [];
		cardsets.push(Router.current().params._id);
		let owners = _.uniq(Cardsets.find({_id: {$in: cardsets}}, {fields: {owner: 1}}).fetch(), function (item) {
			return item.owner;
		});
		owners.forEach(function (element) {
			owner_id.push(element.owner);
		});
		return Meteor.users.find({_id: {$in: owner_id}}, {sort: {'profile.birthname': 1}, fields: {profile: 1}});
	}
});

/*
* ############################################################################
* cardsetLearnActivityStatistic
* ############################################################################
*/
Template.cardsetLearnActivityStatistic.helpers({
	getCardsetStats: function () {
		return Session.get("learnerStats");
	}
});

Template.cardsetLearnActivityStatistic.events({
	"click #exportCSV": function () {
		var cardset = Cardsets.findOne({_id: this._id});
		var hiddenElement = document.createElement('a');
		var header = [];
		header[0] = TAPi18n.__('subject1');
		header[1] = TAPi18n.__('subject2');
		header[2] = TAPi18n.__('subject3');
		header[3] = TAPi18n.__('subject4');
		header[4] = TAPi18n.__('subject5');
		header[5] = TAPi18n.__('subject6');
		header[6] = TAPi18n.__('box_export_birth_name');
		header[7] = TAPi18n.__('box_export_given_name');
		header[8] = TAPi18n.__('box_export_mail');
		Meteor.call("getCSVExport", cardset._id, header, function (error, result) {
			if (error) {
				throw new Meteor.Error(error.statusCode, 'Error could not receive content for .csv');
			}
			if (result) {
				var statistics = TAPi18n.__('box_export_statistics');
				hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(result);
				hiddenElement.target = '_blank';
				var str = (cardset.name + "_" + statistics + "_" + new Date() + ".csv");
				hiddenElement.download = str.replace(/ /g, "_").replace(/:/g, "_");
				document.body.appendChild(hiddenElement);
				hiddenElement.click();
			}
		});
	},
	"click #backButton": function () {
		Router.go('cardsetdetailsid', {_id: this._id});
	},
	"mouseover .field-tip": function () {
		$(".tip-content").css("bottom", "");
		$(".tip-content").css("top", $("#exportCSV").offset().top);
	},
	"click .detailed-stats": function (event) {
		Router.go('progress', {
			_id: Router.current().params._id,
			user_id: $(event.target).data('id')
		});
	}
});

Template.cardsetLearnActivityStatistic.created = function () {
	Session.set("learnerStats", "");
	Meteor.call("getLearningData", Router.current().params._id, function (error, result) {
		if (error) {
			throw new Meteor.Error(error.statusCode, 'Error could not receive content for stats');
		}
		if (result) {
			Session.set("learnerStats", result);
		}
	});
};

/*
* ############################################################################
* cardsetManageEditors
* ############################################################################
*/

Template.cardsetManageEditors.helpers({
	getEditors: function () {
		return Session.get("editorsList");
	}
});

Template.cardsetManageEditors.events({
	"click #backButton": function () {
		Router.go('cardsetdetailsid', {_id: Router.current().params._id});
	},
	"click .addEditor": function (event) {
		Meteor.call("addEditor", Router.current().params._id, $(event.target).data('id'));
	},
	"click .removeEditor": function (event) {
		Meteor.call("removeEditor", Router.current().params._id, $(event.target).data('id'));
	}
});

Template.cardsetManageEditors.created = function () {
	Session.set("editorsList", "");
	Meteor.call("getEditors", Router.current().params._id, function (error, result) {
		if (error) {
			throw new Meteor.Error(error.statusCode, 'Error could not receive content for editors');
		}
		if (result) {
			Session.set("editorsList", result);
		}
	});
};

/*
* ############################################################################
* cardsetStartLearnForm
* ############################################################################
*/

Template.cardsetStartLearnForm.events({
	"input #inputLearningStart": function () {
		const start = new Date($('#inputLearningStart').val());
		const end = new Date($('#inputLearningEnd').val());
		if (isNaN(start.getTime()) || start < new Date()) {
			const today = new Date();
			$('#inputLearningStart').val(today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + "-" + (today.getDate() < 10 ? '0' : '') + end.getDate());
		}
		if (start >= end) {
			end.setDate(end.getDate() - 1);
			$('#inputLearningStart').val(end.getFullYear() + "-" + ((end.getMonth() + 1) < 10 ? '0' : '') + (end.getMonth() + 1) + "-" + (end.getDate() < 10 ? '0' : '') + end.getDate());
		}
		document.getElementById('inputLearningEnd').setAttribute("min", (start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate()));
	},
	"input #inputLearningEnd": function () {
		const start = new Date($('#inputLearningStart').val());
		let end = new Date($('#inputLearningEnd').val());
		if (isNaN(end.getTime()) || start >= end) {
			end = start;
			end.setDate(end.getDate() + 1);
			$('#inputLearningEnd').val(end.getFullYear() + "-" + ((end.getMonth() + 1) < 10 ? '0' : '') + (end.getMonth() + 1) + "-" + (end.getDate() < 10 ? '0' : '') + end.getDate());
		}
		document.getElementById('inputLearningStart').setAttribute("max", (end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + (end.getDate() - 1)));
	},
	"click #confirmLearn": function () {
		if (!Cardsets.findOne(Router.current().params._id).learningActive) {
			var maxCards = $('#inputMaxCards').val();
			var daysBeforeReset = $('#inputDaysBeforeReset').val();
			var learningStart = new Date($('#inputLearningStart').val());
			var learningEnd = new Date($('#inputLearningEnd').val());
			var learningInterval = [];
			for (let i = 0; i < 5; ++i) {
				learningInterval[i] = $('#inputLearningInterval' + (i + 1)).val();
			}
			if (!learningInterval[0]) {
				learningInterval[0] = 1;
			}
			for (let i = 1; i < 5; ++i) {
				if (!learningInterval[i]) {
					learningInterval[i] = (parseInt(learningInterval[i - 1]) + 1);
				}
			}

			Meteor.call("activateLearning", this._id, maxCards, daysBeforeReset, learningStart, learningEnd, learningInterval);
		}
		$('#confirmLearnModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	},
	"click #cancelLearn": function () {
		$('#inputMaxCards').val(null);
		$('#inputDaysBeforeReset').val(null);

		$('#inputLearningInterval1').val(1);
		$('#inputLearningInterval2').val(3);
		$('#inputLearningInterval3').val(7);
		$('#inputLearningInterval4').val(28);
		$('#inputLearningInterval5').val(84);
	},
	"input #inputMaxCards": function () {
		if (parseInt($('#inputMaxCards').val()) <= 0) {
			$('#inputMaxCards').val(1);
		} else if (parseInt($('#inputMaxCards').val()) > 100) {
			$('#inputMaxCards').val(100);
		}
	},
	"input #inputDaysBeforeReset": function () {
		if (parseInt($('#inputDaysBeforeReset').val()) <= 0) {
			$('#inputDaysBeforeReset').val(1);
		} else if (parseInt($('#inputDaysBeforeReset').val()) > 100) {
			$('#inputDaysBeforeReset').val(100);
		}
	},
	"input #inputLearningInterval1, input #inputLearningInterval2, input #inputLearningInterval3, input #inputLearningInterval4, input #inputLearningInterval5": function () {
		var error = false;
		for (let i = 1; i < 5; ++i) {
			if (parseInt($('#inputLearningInterval' + i).val()) <= 0) {
				$('#inputLearningInterval' + i).val(1);
			} else if (parseInt($('#inputLearningInterval' + i).val()) > 999) {
				$('#inputLearningInterval' + i).val(999);
			}
			if (parseInt($('#inputLearningInterval' + i).val()) > parseInt($('#inputLearningInterval' + (i + 1)).val())) {
				error = true;
			}
		}
		if (error) {
			for (let j = 1; j <= 5; ++j) {
				$('#inputLearningInterval' + j).parent().parent().addClass('has-warning');
				$('#errorInputLearningInterval').html(TAPi18n.__('confirmLearn-form.wrongOrder'));
			}
		} else {
			for (let k = 1; k <= 5; ++k) {
				$('#inputLearningInterval' + k).parent().parent().removeClass('has-warning');
				$('#errorInputLearningInterval').html('');
			}
		}
	}
});

/*
 * ############################################################################
 * cardsetEndLearnForm
 * ############################################################################
 */

Template.cardsetEndLearnForm.events({
	"click #confirmEndLearn": function () {
		if (Cardsets.findOne(Router.current().params._id).learningActive) {
			Meteor.call("deactivateLearning", Router.current().params._id);
		}
		$('#confirmEndLearnModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	}
});

/*
 * ############################################################################
 * cardsetImportForm
 * ############################################################################
 */

Template.cardsetImportForm.onCreated(function () {
	Template.instance().uploading = new ReactiveVar(false);
});

Template.cardsetImportForm.onRendered(function () {
	$('#importModal').on('hidden.bs.modal', function () {
		$('#uploadError').html('');
	});
});

Template.cardsetImportForm.helpers({
	uploading: function () {
		return Template.instance().uploading.get();
	}
});

Template.cardsetImportForm.events({
	'change [name="uploadFile"]': function (evt, tmpl) {
		tmpl.uploading.set(true);
		var cardset_id = Template.parentData(1)._id;

		if (evt.target.files[0].name.match(/\.(json)$/)) {
			var reader = new FileReader();
			reader.onload = function () {
				try {
					var res = $.parseJSON('[' + this.result + ']');

					Meteor.call('parseUpload', res, cardset_id, function (error) {
						if (error) {
							tmpl.uploading.set(false);
							$('#uploadError').html('<br><div class="alert alert-danger" role="alert">' + TAPi18n.__('upload-form.wrong-template') + ": " + error.message + '</div>');
						} else {
							tmpl.uploading.set(false);
							Bert.alert(TAPi18n.__('upload-form.success'), 'success', 'growl-top-left');
							$('#importModal').modal('toggle');
						}
					});
				} catch (e) {
					tmpl.uploading.set(false);
					$('#uploadError').html('<br><div class="alert alert-danger" role="alert">' + TAPi18n.__('upload-form.wrong-template') + ": " + e.message + '</div>');
				}
			};
			reader.readAsText(evt.target.files[0]);
		} else if (evt.target.files[0].name.match(/\.(csv)$/)) {
			Papa.parse(evt.target.files[0], {
				header: true,
				complete: function (results) {
					Meteor.call('parseUpload', results.data, cardset_id, function (error) {
						if (error) {
							tmpl.uploading.set(false);
							Bert.alert(TAPi18n.__('upload-form.wrong-template'), 'danger', 'growl-top-left');
						} else {
							tmpl.uploading.set(false);
							Bert.alert(TAPi18n.__('upload-form.success'), 'success', 'growl-top-left');
							$('#importModal').modal('toggle');
						}
					});
				}
			});
		} else {
			tmpl.uploading.set(false);
			$('#uploadError').html('<br><div class="alert alert-danger" role="alert">' + TAPi18n.__('upload-form.wrong-file') + '</div>');
		}
	}
});

/*
 * ############################################################################
 * cardsetConfirmForm
 * ############################################################################
 */

Template.cardsetConfirmForm.events({
	'click #cardDelete': function () {
		var id = Session.get('cardId');

		$('#confirmModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteCard", id);
		}).modal('hide');
	}
});

/*
 * ############################################################################
 * cardsetPublishForm
 * ############################################################################
 */

Template.cardsetPublishForm.onRendered(function () {
	$('#publishModal').on('hidden.bs.modal', function () {
		var cardset = Cardsets.findOne(Router.current().params._id);

		$('#publishKind > label').removeClass('active');
		$('#publishKind > label > input').filter(function () {
			return this.value === cardset.kind;
		}).parent().addClass('active');

		$('#publishKind > label > input').filter(function () {
			return this.value === cardset.kind;
		}).prop('checked', true);

		$('#publishPrice').val(cardset.price);
	});
});

Template.cardsetPublishForm.helpers({
	kindWithPrice: function () {
		return Session.get('kindWithPrice');
	},
	kindIsActive: function (kind) {
		return kind === this.kind;
	},
	priceIsSelected: function (price) {
		return price === this.price ? 'selected' : '';
	}
});

Template.cardsetPublishForm.events({
	'shown.bs.modal #publishModal': function () {
		Session.set('kindWithPrice', false);
	},
	'hidden.bs.modal #publishModal': function () {
		Session.set('kindWithPrice', false);
	},
	'click #cardsetPublish': function (evt, tmpl) {
		var id = this._id;
		var kind = tmpl.find('#publishKind > .active > input').value;
		var price = 0;
		var visible = true;
		var license = [];

		if (kind === 'edu' || kind === 'pro') {
			if (tmpl.find('#publishPrice') !== null) {
				price = tmpl.find('#publishPrice').value;
			} else {
				price = this.price;
			}
		}
		if (kind === 'personal') {
			visible = false;
			Meteor.call('updateLicense', id, license);
		}
		if (kind === 'pro') {
			visible = false;
			Meteor.call("makeProRequest", id);

			var text = "Kartensatz " + this.name + " zur Überprüfung freigegeben";
			var type = "Kartensatz-Freigabe";
			var target = "lecturer";

			Meteor.call("addNotification", target, type, text, this._id);

			license.push("by");
			license.push("nd");
			Meteor.call("updateLicense", id, license);
			Bert.alert('Kartensatz zur Überprüfung freigegeben', 'success', 'growl-top-left');
		}

		Meteor.call("publishCardset", id, kind, price, visible);
		$('#publishModal').modal('hide');
	},
	'change #publishKind': function () {
		var kind = $('#publishKind input[name=kind]:checked').val();
		var kindWithPrice = (kind === 'edu' || kind === 'pro');
		Session.set('kindWithPrice', kindWithPrice);
	}
});

/*
 * ############################################################################
 * deleteCardsForm
 * ############################################################################
 */

Template.deleteCardsForm.events({
	'click #deleteCardsConfirm': function () {
		var id = this._id;
		$('#deleteCardsModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteCards", id);
		}).modal('hide');
	}
});

/*
 * ############################################################################
 * selectLicenseForm
 * ############################################################################
 */

Template.selectLicenseForm.onRendered(function () {
	$('#selectLicenseModal').on('hidden.bs.modal', function () {
		var cardset = Cardsets.findOne(Router.current().params._id);
		var license = cardset.license;

		$('#cc-modules > label').removeClass('active');
		$('#modulesLabel').css('color', '');
		$('#helpCC-modules').html('');

		if (license.includes('by')) {
			$('#cc-option0').addClass('active');
		}
		if (license.includes('nc')) {
			$('#cc-option1').addClass('active');
		}
		if (license.includes('nd')) {
			$('#cc-option2').addClass('active');
		}
		if (license.includes('sa')) {
			$('#cc-option3').addClass('active');
		}
	});
});

Template.selectLicenseForm.events({
	'click #licenseSave': function () {
		if ($("#cc-option2").hasClass('active') && $("#cc-option3").hasClass('active') || $("#cc-modules").children().hasClass('active') && !($("#cc-option0").hasClass('active'))) {
			$('#modulesLabel').css('color', '#b94a48');
			$('#helpCC-modules').html(TAPi18n.__('modal-dialog.wrongCombination'));
			$('#helpCC-modules').css('color', '#b94a48');
		} else {
			var license = [];

			if ($("#cc-option0").hasClass('active')) {
				license.push("by");
			}
			if ($("#cc-option1").hasClass('active')) {
				license.push("nc");
			}
			if ($("#cc-option2").hasClass('active')) {
				license.push("nd");
			}
			if ($("#cc-option3").hasClass('active')) {
				license.push("sa");
			}

			Meteor.call('updateLicense', this._id, license);
			$('#selectLicenseModal').modal('hide');
		}
	},
	'change #cc-modules': function () {
		$('#modulesLabel').css('color', '');
		$('#helpCC-modules').html('');
	}
});

Template.selectLicenseForm.helpers({
	licenseIsActive: function (license) {
		var cardset = Cardsets.findOne(Router.current().params._id);
		if (cardset !== undefined) {
			var licenses = cardset.license;

			if (licenses.includes(license)) {
				return true;
			}
		} else {
			return null;
		}
	}
});

/*
 * ############################################################################
 * reportCardsetForm
 * ############################################################################
 */

Template.reportCardsetForm.onRendered(function () {
	$('#reportModal').on('hidden.bs.modal', function () {
		$('#helpReportCardsetText').html('');
		$('#reportCardsetTextLabel').css('color', '');
		$('#reportCardsetText').css('border-color', '');
		$('#reportCardsetText').val('');
		$('#reportCardsetReason').val($('#reportCardsetReason option:first').val());
	});
});
Template.reportCardsetForm.events({
	'click #reportCardsetSave': function () {
		if ($('#reportCardsetText').val().length < 50) {
			$('#reportCardsetTextLabel').css('color', '#b94a48');
			$('#reportCardsetText').css('border-color', '#b94a48');
			$('#helpReportCardsetText').html(TAPi18n.__('modal-dialog.text_chars'));
			$('#helpReportCardsetText').css('color', '#b94a48');
		} else {
			var text = $('#reportCardsetText').val();
			var type;
			var link_id;

			if ($('#reportCardsetReason').val() === "Benutzer melden" || $('#reportCardsetReason').val() === "Report user") {
				type = "Gemeldeter Benutzer";
				link_id = this.owner;
			} else {
				type = "Gemeldeter Kartensatz";
				link_id = this._id;
			}

			var target = "admin";

			Meteor.call("addNotification", target, type, text, link_id, target);
			$('#reportModal').modal('hide');
		}
	},
	'keyup #reportCardsetText': function () {
		$('#reportCardsetTextLabel').css('color', '');
		$('#reportCardsetText').css('border-color', '');
		$('#helpReportCardsetText').html('');
	}
});

/*
 * ############################################################################
 * resetLeitnerForm
 * ############################################################################
 */
Template.resetLeitnerForm.events({
	"click #resetLeitnerConfirm": function () {
		$('#resetLeitnerModal').on('hidden.bs.modal', function () {
			Meteor.call("resetLeitner", Router.current().params._id);
		}).modal('hide');
	}
});

/*
 * ############################################################################
 * resetMemoForm
 * ############################################################################
 */
Template.resetMemoForm.events({
	"click #resetMemoConfirm": function () {
		$('#resetMemoModal').on('hidden.bs.modal', function () {
			Meteor.call("resetWozniak", Router.current().params._id);
		}).modal('hide');
	}
});

/*
* ############################################################################
* learningPhaseInfoBox
* ############################################################################
*/
Template.learningPhaseInfoBox.helpers({
	getDateEnd: function () {
		return moment(this.learningEnd).format("DD.MM.YYYY");
	},
	getDateStart: function () {
		return moment(this.learningStart).format("DD.MM.YYYY");
	},
	getDeadline: function () {
		if (this.daysBeforeReset === 1) {
			return this.daysBeforeReset + " " + TAPi18n.__('panel-body-experience.day');
		} else {
			return this.daysBeforeReset + " " + TAPi18n.__('panel-body-experience.day_plural');
		}
	},
	getLearningStatus: function () {
		if (this.learningEnd.getTime() > new Date().getTime()) {
			return TAPi18n.__('set-list.activeLearnphase');
		} else {
			return TAPi18n.__('set-list.inactiveLearnphase');
		}
	},
	getWorkload: function () {
		if (this.maxCards === 1) {
			return this.maxCards + " " + TAPi18n.__('confirmLearn-form.card');
		} else {
			return this.maxCards + " " + TAPi18n.__('confirmLearn-form.cards');
		}
	}
});

Template.learningPhaseInfoBox.events({
	"click #collapseLearningPhaseInfoButton": function () {
		changeCollapseIcon("#collapseLearningPhaseInfoIcon");
	}
});

/*
 * ############################################################################
 * leitnerLearning
 * ############################################################################
 */

Template.leitnerLearning.helpers({
	addToLeitner: function () {
		if (this.owner !== Meteor.userId() && !this.editors.includes(Meteor.userId())) {
			addToLeitner(this._id);
		}
	},
	learningEnded: function () {
		return (this.learningEnd.getTime() < new Date().getTime());
	},
	allLearned: function () {
		return (Leitner.find({cardset_id: this._id, user_id: Meteor.userId(), box: {$ne: 6}}).count() === 0);
	},
	Deadline: function () {
		var active = Leitner.findOne({cardset_id: this._id, user_id: Meteor.userId(), active: true});
		var deadline = new Date(active.currentDate.getTime() + this.daysBeforeReset * 86400000);
		if (deadline.getTime() > this.learningEnd.getTime()) {
			return (TAPi18n.__('deadlinePrologue') + this.learningEnd.toLocaleDateString() + TAPi18n.__('deadlineEpilogue1'));
		} else {
			return (TAPi18n.__('deadlinePrologue') + deadline.toLocaleDateString() + TAPi18n.__('deadlineEpilogue2'));
		}
	},
	notEmpty: function () {
		return Leitner.find({
			cardset_id: this._id,
			user_id: Meteor.userId(),
			active: true
		}).count();
	}
});

Template.leitnerLearning.events({
	"click #learnBoxActive": function () {
		Router.go('box', {
			_id: Router.current().params._id
		});
	}
});
