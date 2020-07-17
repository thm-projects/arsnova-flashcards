import {Meteor} from "meteor/meteor";

/**
 * Returns the degree, the givenname and the birthname from the author of a cardset
 * @param owner - The database ID of the author
 * @param lastNameFirst - Display the last name first
 * @param onlyFirstName - Return only the first name, used for E-Mail Notifications
 * @param backendList - Returns a special string if true
 * @param profile - Provided name data, skips the database search
 * @returns {*} - Degree + givenname + birthname
 */
export function getAuthorName(owner, lastNameFirst = true, onlyFirstName = false, backendList = false, profile = undefined) {
	let author = {};
	let profileIncomplete = false;
	if (profile === undefined) {
		author = Meteor.users.findOne({"_id": owner});
	} else {
		author = profile;
	}
	if (author) {
		if (backendList && (author.profile.birthname === "" || author.profile.birthname === undefined || author.profile.givenname === "" || author.profile.givenname === undefined)) {
			return TAPi18n.__('admin.profileIncompleteBackendList');
		}
		let name = "";
		if (onlyFirstName) {
			if (author.profile.givenname) {
				return author.profile.givenname.split(" ", 1);
			} else {
				profileIncomplete = true;
			}
		}
		if (lastNameFirst) {
			if (author.profile.birthname) {
				name += author.profile.birthname;
			} else {
				profileIncomplete = true;
			}
			if (author.profile.givenname) {
				name += (", " + author.profile.givenname);
			} else {
				profileIncomplete = true;
			}
			if (author.profile.title) {
				name += (", " + author.profile.title);
			}
		} else {
			if (author.profile.title) {
				name += author.profile.title + " ";
			}
			if (author.profile.givenname) {
				name += author.profile.givenname + " ";
			} else {
				profileIncomplete = true;
			}
			if (author.profile.birthname) {
				name += author.profile.birthname;
			} else {
				profileIncomplete = true;
			}
		}
		if (profileIncomplete) {
			return author.profile.name + " (" + TAPi18n.__('leitnerProgress.user.missingName') + ")";
		} else {
			return name;
		}
	} else {
		return TAPi18n.__('admin.deletedUser');
	}
}

export function getOriginalAuthorName(originalAuthorName, lastNameFirst) {
	if (originalAuthorName.birthname === undefined) {
		return originalAuthorName.legacyName;
	}
	let name = "";
	if (lastNameFirst) {
		if (originalAuthorName.birthname) {
			name += originalAuthorName.birthname;
		}
		if (originalAuthorName.givenname) {
			name += (", " + originalAuthorName.givenname);
		}
		if (originalAuthorName.title) {
			name += (", " + originalAuthorName.title);
		}
	} else {
		if (originalAuthorName.title) {
			name += originalAuthorName.title + " ";
		}
		if (originalAuthorName.givenname) {
			name += originalAuthorName.givenname + " ";
		}
		if (originalAuthorName.birthname) {
			name += originalAuthorName.birthname;
		}
	}
	return name;
}
export function exportAuthorName(owner) {
	let author = Meteor.users.findOne({"_id": owner});
	return {
		title: author.profile.title,
		birthname: author.profile.birthname,
		givenname: author.profile.givenname
	};
}
