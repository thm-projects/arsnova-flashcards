import "./license.html";

Template.cardsetLabelsItemLicense.helpers({
	isLicenseSet: function (licenses) {
		return licenses && licenses.length > 0;
	},
	getLicenseClass: function (licenses) {
		const licenseClass = [];
		for (let i = 0; i < licenses.length; i++) {
			if (licenses[i] === "nc") {
				licenseClass.push({
					"name": TAPi18n.__("cardset.info.license.nc"),
					"class": "nc-eu"
				});
			} else {
				const id = licenses[i];
				licenseClass.push({
					"name": TAPi18n.__("cardset.info.license." + id),
					"class": id
				});
			}
		}
		return licenseClass;
	}
});
