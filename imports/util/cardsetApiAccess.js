/*
* function to automatically generate the mongo modifier for an update.
* checks which attributes have changed.
*/
export function mongoReplacementModifier(keep, change) {
	var $unset = {};
	for (var key in change) {
		if (keep[key] === undefined) {
			$unset[key] = "";
		}
	}
	var copy = _.clone(keep);
	delete copy._id;
	return {$set: copy, $unset: $unset};
}
