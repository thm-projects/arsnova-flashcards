import { Paid } from './paid.js';
import { Cardsets } from './cardsets.js';

var Future = Npm.require('fibers/future');
var Fiber = Npm.require('fibers');

// Define gateway variable
var gateway;

Meteor.startup(function() {
    var env;
    // Pick Braintree environment based on environment defined in Meteor settings.
    if (Meteor.settings.public.env === 'Production') {
        env = Braintree.Environment.Production;
    } else {
        env = Braintree.Environment.Sandbox;
    }
    // Initialize Braintree connection:
    gateway = BrainTreeConnect({
        environment: env,
        publicKey: Meteor.settings.public.BT_PUBLIC_KEY,
        privateKey: Meteor.settings.private.BT_PRIVATE_KEY,
        merchantId: Meteor.settings.public.BT_MERCHANT_ID
    });
});

Meteor.methods({
    getClientToken: function(clientId) {
        var generateToken = Meteor.wrapAsync(gateway.clientToken.generate, gateway.clientToken);
        var options = {};

        if (clientId) {
            options.clientId = clientId;
        }

        var response = generateToken(options);
        return response.clientToken;
    },

    createTransaction: function(nonceFromTheClient, cardset_id) {
        var user = Meteor.user();
        var cardset = Cardsets.findOne(cardset_id);

        gateway.transaction.sale({
            amount: cardset.price,
            paymentMethodNonce: nonceFromTheClient, // Generated nonce passed from client
            customer: {
                id: user.customerId
            },
            options: {
                submitForSettlement: true, // Payment is submitted for settlement immediatelly
                storeInVaultOnSuccess: true // Store customer in Braintree's Vault
            }
        }, function(err, success) {
            if (err) {
                console.log(err);
            } else {
                // When payment's successful, add "paid" role to current user.
                Meteor.call('addPaid', cardset_id, cardset.price);
                Meteor.call('increaseUsersBalance', cardset.owner, cardset.reviewer, cardset.price);
            }
        });
    },

    btSubscribe: function(nonce, plan) {
        var thisCustomer = new Future();

        // Create our customer.
        Meteor.call('btCreateCustomer', nonce, function(error, btCustomer){
          if (error) {
            console.log(error);
          } else {
            var customerId = '';
            if (btCustomer === undefined) {
              customerId = Meteor.user().customerId;
            } else {
              customerId = btCustomer.customer.id;
            }

            // Setup a subscription for our customer.
            Meteor.call('btCreateSubscription', customerId, plan, function(error, response){
              if (error) {
                console.log(error);
              } else {
                try {
                  var customerSubscription = {
                    customerId: customerId,
                    subscription: {
                      plan: plan,
                      status: response.subscription.status,
                      billingDate: response.subscription.nextBillingDate
                    },
                    visible: true
                  }

                  // Perform an update on this user.
                  Meteor.users.update(Meteor.user(), {
                    $set: customerSubscription
                  }, function(error, response){
                    if (error){
                      console.log(error);
                    } else {
                      // Once the subscription data has been added, return to Future.
                      thisCustomer.return(Meteor.user());
                    }
                  });

                  const currentRoles = Roles.getRolesForUser(Meteor.userId());
                  currentRoles.forEach((role) => {
                      if (role === plan) {
                          throw new Meteor.Error('400', 'User already subscribed to this plan');
                      } else if (role === 'standard' || role === 'pro') {
                          Roles.removeUsersFromRoles(Meteor.userId(), role);
                      }
                  });

                  // add new subscription
                  Roles.addUsersToRoles(Meteor.userId(), plan);

                } catch(exception) {
                  thisCustomer.return(exception);
                }
              }
            });
          }
        });
        return thisCustomer.wait();
    },

    btCreateCustomer: function(nonce) {
        var user = Meteor.user();

        Meteor.call('btFindCustomer', user.customerId, function(error, result) {
          if (result) {
            return undefined;
          } else {
            var customerData = {
                email: user.email,
                paymentMethodNonce: nonce,
            };

            var btCustomer = new Future();

            // Calling the Braintree API to create our customer!
            gateway.customer.create(customerData, function(error, result) {
                if (error) {
                    btCustomer.return(error);
                } else {
                    // If customer is successfuly created on Braintree servers,
                    // we will now add customer ID to our User
                    Meteor.users.update(user._id, {
                        $set: {
                            customerId: result.customer.id
                        }
                    });
                    btCustomer.return(result);
                }
            });
            return btCustomer.wait();
          }
        });


    },

    btFindCustomer: function(customerId) {
        //check(customerId, String);
        var btCustomer = new Future();

        gateway.customer.find(customerId, function(error, result) {
            if (error) {
                btCustomer.return(error);
            } else {
                btCustomer.return(result);
            }
        });

        return btCustomer.wait();
    },

    btCreateSubscription: function(customerId, plan) {
        //check(customerId, String);
        //check(plan, String);
        var btSubscription = new Future();

        // fetch customer data.
        Meteor.call('btFindCustomer', customerId, function(error, result) {
            if (error) {
                btSubscription.return(error);
            } else {
                var subscriptionRequest = {
                    paymentMethodToken: result.paymentMethods[0].token,
                    planId: plan
                };

                // create subscription
                gateway.subscription.create(subscriptionRequest, function(error, result) {
                    if (error) {
                        btSubscription.return(error);
                    } else {
                        btSubscription.return(result);
                    }
                });
            }
        });

        return btSubscription.wait();
    },

    btFindUserSubscription: function(customerId) {
        //check(customerId, String);
        var btUserSubscription = new Future();

        // find customer
        gateway.customer.find(customerId, function(error, result) {
            if (error) {
                btUserSubscription.return(error);
            } else {
                // get customer's last subscription
                var subscriptionId = result.paymentMethods[0].subscriptions;
                var last = subscriptionId.slice(-1)[0];

                btUserSubscription.return(last);
            }
        });

        return btUserSubscription.wait();
    },

    btCancelSubscription: function() {
        var btCancelSubscription = new Future();

        var user = Meteor.userId();
        var getUser = Meteor.users.findOne({
            "_id": user
        }, {
            fields: {
                "customerId": 1
            }
        });

        Meteor.call('btFindUserSubscription', getUser.customerId, function(error, customerSubscription) {
            if (error) {
                btCancelSubscription.return(error);
            } else {
                // cancel the active subscription
                gateway.subscription.cancel(customerSubscription.id, function(error, result) {
                    if (error) {
                        btCancelSubscription.return(error);
                    } else {
                        Meteor.users.update(Meteor.userId(), {
                          $set: {
                            "subscription.status": "Canceled",
                            "subscription.ends": customerSubscription.paidThroughDate
                          }
                        }, function(error, response){
                          if (error) {
                            btCancelSubscription.return(error);
                          } else {
                            btCancelSubscription.return(response);
                          }
                        });

                        Roles.removeUsersFromRoles(Meteor.userId(), 'pro');
                        Roles.addUsersToRoles(Meteor.userId(), 'standard');
                    }
                });
            }
        });

        return btCancelSubscription.wait();
    }
});
