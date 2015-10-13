Router.route('/', function (){
  this.redirect('home');
});

Router.route('/impressum');

Router.configure({
  layoutTemplate: 'main',
});

Router.route('/home', {
  name: 'home',
  template: 'cardsets',
  onBeforeAction: function(){
    if(Meteor.userId()){
      this.next();
    } else {
      this.render("welcome");
    }
  }
});

Router.route('/pool', {
  name: 'pool',
  template: 'pool'
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
