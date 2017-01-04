Meteor.startup(function () {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/serviceWorker.js').then().catch(error => console.log(error));
	}
});
