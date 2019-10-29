let normalCardset = {
	'_id': 'testCardset',
	'name': 'TestCardSet',
	'description': 'Cardset for tests',
	'date': 1537650325474,
	'dateUpdated': 1539500144049,
	'editors': [],
	'owner': 'no-owner',
	'visible': true,
	'ratings': false,
	'kind': 'personal',
	'price': 0,
	'reviewed': false,
	'reviewer': 'undefined',
	'request': false,
	'rating': 0,
	'raterCount': 0,
	'quantity': 0,
	'license': [],
	'userDeleted': false,
	'learningActive': false,
	'maxCards': 5,
	'daysBeforeReset': 0,
	'learningStart': 0,
	'learningEnd': 0,
	'registrationPeriod': 0,
	'learningInterval': [],
	'wordcloud': false,
	'shuffled': false,
	'cardGroups': [],
	'cardType': 13,
	'difficulty': 2,
	'noDifficulty': true,
	'sortType': 0,
	'originalAuthorName': {
		'title': '',
		'birthname': 'Test',
		'givenname': 'Author'
	},
	'workload': {
		'bonus': {
			'count': 0
		},
		'normal': {
			'count': 0
		}
	}
};

let transcriptBonusCardset = {
	'_id': 'bonusCardset',
	'name': 'BonusCardSet',
	'description': 'Cardset for tests',
	'date': 1537650325474,
	'dateUpdated': 1539500144049,
	'editors': [],
	'owner': 'TestUserId',
	'visible': true,
	'ratings': false,
	'kind': 'personal',
	'price': 0,
	'reviewed': false,
	'reviewer': 'undefined',
	'request': false,
	'rating': 0,
	'raterCount': 0,
	'quantity': 1,
	'license': [],
	'userDeleted': false,
	'learningActive': false,
	'maxCards': 5,
	'daysBeforeReset': 0,
	'learningStart': 0,
	'learningEnd': 0,
	'registrationPeriod': 0,
	'learningInterval': [],
	'wordcloud': false,
	'shuffled': false,
	'cardGroups': [],
	'cardType': 19,
	'difficulty': 2,
	'noDifficulty': true,
	'sortType': 0,
	'originalAuthorName': {
		'title': '',
		'birthname': 'Test',
		'givenname': 'Author'
	},
	'workload': {
		'bonus': {
			'count': 0
		},
		'normal': {
			'count': 0
		}
	},
	'transcriptBonus': {
		'cardset_id': 'bonusCardset',
		'card_id': 'bonusCard',
		'user_id': 'bonusUser',
		'date': 1537650325474,
		'dates': [1537650325474],
		'lectureEnd': '9999999900000',
		'deadline': 17520,
		'deadlineEditing': 999,
		'enabled': true
	}
};
module.exports = {
	normalCardset,
	transcriptBonusCardset
};
