import {Learned} from "./learned.js";

export function Graph(user_id, card_id) {
	var query = {};
	if (user_id !== undefined) {
		query.user_id = user_id;
	}
	if (card_id !== undefined) {
		query.cardset_id = card_id;
	}
	query.box = 1;
	var box1 = Learned.find(query).count();
	query.box = 2;
	var box2 = Learned.find(query).count();
	query.box = 3;
	var box3 = Learned.find(query).count();
	query.box = 4;
	var box4 = Learned.find(query).count();
	query.box = 5;
	var box5 = Learned.find(query).count();
	query.box = 6;
	var box6 = Learned.find(query).count();
	var userData = [Number(box1), Number(box2), Number(box3), Number(box4), Number(box5), Number(box6)];

	return {
		labels: [TAPi18n.__('subject1'), TAPi18n.__('subject2'), TAPi18n.__('subject3'), TAPi18n.__('subject4'), TAPi18n.__('subject5'), TAPi18n.__('subject6')],
		datasets: [{
			fillColor: "rgba(242,169,0,0.5)",
			strokeColor: "rgba(74,92,102,0.2)",
			pointColor: "rgba(220,220,220,1)",
			pointStrokeColor: "#fff",
			data: userData
		}]
	};
}
