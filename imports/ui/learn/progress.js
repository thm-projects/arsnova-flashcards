import "./progress.html";
import {Leitner} from "../../api/learned";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {getAuthorName} from "../../api/cardsetUserlist.js";
import {Chart} from "chart.js";

let chart;


/*
 * ############################################################################
 * Graph
 * ############################################################################
 */

function drawGraph() {
	let ctx = document.getElementById("boxChart").getContext("2d");
	chart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: [TAPi18n.__('subject1'), TAPi18n.__('subject2'), TAPi18n.__('subject3'), TAPi18n.__('subject4'), TAPi18n.__('subject5'), TAPi18n.__('subject6')],
			datasets: [
				{
					backgroundColor: "rgba(242,169,0,0.5)",
					borderColor: "rgba(74,92,102,0.2)",
					borderWidth: 1,
					data: [0, 0, 0, 0, 0, 0],
					label: TAPi18n.__('cardCount')
				}
			]
		},
		options: {
			responsive: true,
			legend: {
				display: false
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						callback: function (value) {
							if (value % 1 === 0) {
								return value;
							}
						}
					}
				}]
			}
		}
	});
}

function updateGraph() {
	let query = {};
	if (Router.current().route.getName() === "progress") {
		if (Router.current().params._id !== undefined) {
			query.cardset_id = Router.current().params._id;
		}

		if (Router.current().params.user_id !== undefined) {
			query.user_id = Router.current().params.user_id;
		}
	} else if (Router.current().route.getName() === "profileOverview") {
		query.user_id = Meteor.userId();
	}

	for (let i = 0; i < 6; i++) {
		query.box = (i + 1);
		chart.data.datasets[0].data[i] = Leitner.find(query).count();
	}

	chart.update();
}

Template.graph.helpers({
	countBox: function (boxId) {
		if (Router.current().route.getName() === "progress") {
			return Leitner.find({
				cardset_id: Router.current().params._id,
				user_id: Router.current().params.user_id,
				box: boxId
			}).count();
		} else {
			return Leitner.find({
				user_id: Meteor.userId(),
				box: boxId
			}).count();
		}
	},
	getChartTitle: function () {
		if (Router.current().route.getName() === "progress") {
			let title = this.name + ": ";
			if (Meteor.userId() === Router.current().params.user_id) {
				return title + TAPi18n.__('admin.myProgress');
			} else {
				return title +  TAPi18n.__('admin.userProgress') + ' "' + getAuthorName(Router.current().params.user_id) + '"';
			}
		} else {
			return TAPi18n.__('admin.allLearnedCardsets');
		}
	}
});

Template.graph.onRendered(function () {
	drawGraph();
	var self = this;
	self.subscribe("leitner", function () {
		self.autorun(function () {
			updateGraph();
		});
	});
});

/*
 * ############################################################################
 * progress
 * ############################################################################
 */

Template.progress.helpers({
	gotCards: function () {
		return Leitner.find({
			cardset_id: Router.current().params._id,
			user_id: Router.current().params.user_id
		}).count();
	},
	isStatsOwner: function () {
		return Meteor.userId() === Router.current().params.user_id;
	}
});
Template.progress.events({
	"click #backButton": function () {
		if (Meteor.userId() === Router.current().params.user_id) {
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		} else {
			Router.go('cardsetstats', {
				_id: Router.current().params._id
			});
		}
	}
});
