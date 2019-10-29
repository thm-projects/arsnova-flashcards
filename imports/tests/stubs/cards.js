let normalCard = {
	'subject': 'TestSubject',
	'cardset_id': 'testCardset',
	'content1': 'Test content 1',
	'content2': 'Test content 2',
	'content3': 'Test content 3',
	'content4': 'Test content 4',
	'content5': 'Test content 5',
	'content6': 'Test content 6',
	'centerTextElement': [false, false, false, false],
	'alignType': [0, 0, 0, 0, 0, 0],
	'date': new Date(),
	'learningGoalLevel': 0,
	'backgroundStyle': 0,
	'bonusUser': false
};

let transcriptBonusCard = {
	'_id': 'bonusCard',
	'subject': 'TestSubject',
	'difficulty': 2,
	'front': 'Test text front',
	'back': 'Test text back',
	'hint': 'Test hint',
	'cardset_id': 'bonusCardset',
	'cardType': 19,
	'owner': 'bonusUser',
	'centerTextElement': [
		false,
		false,
		false,
		false
	],
	'learningGoalLevel': 0,
	'backgroundStyle': 0,
	'date': 1513612598530,
	'learningIndex': '0',
	'originalAuthorName': {
		'legacyName': 'Test, Author'
	},
	'alignType': [
		0,
		0,
		0,
		0,
		0,
		0
	]
};

module.exports = {
	normalCard,
	transcriptBonusCard
};
