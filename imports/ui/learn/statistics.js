import "./statistics.html";

Template.statistics.rendered = function () {
	$(function () {
		$('#container').highcharts({
			chart: {
				type: 'column'
			},
			title: {
				text: 'Lernfortschritt'
			},
			xAxis: {
				categories: ['Heute', 'Gestern', 'vor 3 Tagen', 'vor 7 Tagen', 'vor vor 4 Wochen']
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Karten pro Satz'
				}
			},
			legend: {
				reversed: true
			},
			plotOptions: {
				series: {
					stacking: 'normal'
				}
			},
			series: [{
				name: 'HTML5',
				data: [5, 3, 4, 3, 5]
			}, {
				name: 'Javascript',
				data: [2, 2, 3, 2, 5]
			}, {
				name: 'Git',
				data: [3, 4, 4, 2, 5]
			}, {
				name: 'Websocket',
				data: [2, 2, 3, 2, 5]
			}, {
				name: 'Usability',
				data: [2, 2, 3, 2, 5]
			}]
		});
	});
};
