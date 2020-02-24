Meteor.startup(function () {
    return Tracker.autorun(function () {
        let userId = Meteor.userId();
        Meteor.Matomo.setUserInfo(userId);
    });
});