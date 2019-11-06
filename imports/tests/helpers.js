//mode 0 = lower than
//mode 1 = lower equal
//mode 2 = equal
//mode 3 = greater equal
//mode 4 = greater
function matchAny(array, checkValue, mode) {
	for (let i = 0; i < array.length; i++) {
		switch (mode) {
			case 0:
				if (array[i] < checkValue) {
					return true;
				}
				break;
			case 1:
				if (array[i] <= checkValue) {
					return true;
				}
				break;
			case 3:
				if (array[i] >= checkValue) {
					return true;
				}
				break;
			case 4:
				if (array[i] > checkValue) {
					return true;
				}
				break;
			default:
				if (array[i] === checkValue) {
					return true;
				}
		}
	}
	return false;
}

module.exports = {
	matchAny
};
