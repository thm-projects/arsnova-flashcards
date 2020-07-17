
Template.registerHelper("getRoles", function (roles) {
	roles.sort();
	let translatedRoles = "";
	for (let i = 0; i < roles.length; i++) {
		switch (roles[i]) {
			case 'admin':
				translatedRoles += (TAPi18n.__('admin.superAdmin') + ", ");
				break;
			case 'editor':
				translatedRoles += (TAPi18n.__('admin.admin') + ", ");
				break;
			case 'lecturer':
				translatedRoles += (TAPi18n.__('admin.lecturer') + ", ");
				break;
		}
	}
	return translatedRoles.substring(0, translatedRoles.length - 2);
});
