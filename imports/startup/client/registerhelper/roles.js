
Template.registerHelper("getRoles", function (roles, returnCount = false) {
	roles.sort();
	let translatedRoles = "";
	let count = 0;
	for (let i = 0; i < roles.length; i++) {
		switch (roles[i]) {
			case 'admin':
				translatedRoles += (TAPi18n.__('admin.superAdmin') + ", ");
				count++;
				break;
			case 'editor':
				translatedRoles += (TAPi18n.__('admin.admin') + ", ");
				count++;
				break;
			case 'lecturer':
				translatedRoles += (TAPi18n.__('admin.lecturer') + ", ");
				count++;
				break;
			case 'pro':
				translatedRoles += (TAPi18n.__('admin.pro') + ", ");
				count++;
				break;
			case 'university':
				translatedRoles += (TAPi18n.__('admin.university') + ", ");
				count++;
				break;
		}
	}
	if (returnCount) {
		return count;
	} else if (translatedRoles.length > 1) {
		return translatedRoles.substring(0, translatedRoles.length - 2);
	} else {
		return TAPi18n.__('admin.free');
	}
});
