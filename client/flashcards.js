Router.route('/', {
  template: 'welcome',
  name: 'welcome'
});
Router.route('/impressum');
Router.route('/main', {
  template: 'main',
  onBeforeAction: function(){
    if(Meteor.userId()){
      this.next();
    } else {
      this.render("welcome");
    }
  }
});

Router.route('/main/created', {
  template: 'created'
});

Router.route('/main/learned', {
  template: 'learned'
});


getUserLanguage = function () {
  return navigator.language.substr(0,2);
};

if (Meteor.isClient) {
  Meteor.startup(function () {
    Session.set("showLoadingIndicator", true);

    TAPi18n.setLanguage(getUserLanguage())
      .done(function () {
        Session.set("showLoadingIndicator", false);
      })
      .fail(function (error_message) {
        // Handle the situation
        console.log(error_message);
      });
  });
}
