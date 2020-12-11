import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Braintree, BrainTreeConnect } from 'meteor/patrickml:braintree';
import { Cardsets } from '../subscriptions/cardsets.js';

// eslint-disable-next-line no-undef
const Future = Npm.require('fibers/future');

// Define gateway variable
let gateway;

Meteor.startup(function() {
  let env;
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
    merchantId: Meteor.settings.public.BT_MERCHANT_ID,
  });
});

Meteor.methods({
  getClientToken(customerId) {
    check(customerId, String);
    const btClientToken = new Future();
    gateway.clientToken.generate({ customerId }, function(error, response) {
      if (error) {
        btClientToken.return(error);
      } else {
        btClientToken.return(response.clientToken);
      }
    });
    return btClientToken.wait();
  },

  btGetPaymentMethod() {
    const btPayment = new Future();
    const user = Meteor.users.findOne(this.userId);
    Meteor.call('btFindCustomer', user.customerId, function(error, customer) {
      if (error) {
        btPayment.return(error);
      } else {
        btPayment.return(customer.paymentMethods);
      }
    });
    return btPayment.wait();
  },

  btUpdatePaymentMethod(nonceFromTheClient) {
    check(nonceFromTheClient, Number);

    const btUpdatePayment = new Future();
    Meteor.call('btCreateCustomer', nonceFromTheClient, function(error, btCustomer) {
      if (error) {
        btUpdatePayment.return(error);
      } else {
        let customerId;
        if (btCustomer === undefined) {
          customerId = Meteor.user().customerId;
        } else {
          customerId = btCustomer.customer.id;
        }

        gateway.paymentMethod.create({
          customerId,
          paymentMethodNonce: nonceFromTheClient,
          options: {
            makeDefault: true,
          },
        }, function(createError, createResult) {
          if (createError) {
            btUpdatePayment.return(createError);
          } else {
            btUpdatePayment.return(createResult);
          }
        });
      }
    });
    return btUpdatePayment.wait();
  },

  btCreateTransaction(nonceFromTheClient, cardsetId) {
    check(nonceFromTheClient, Number);
    check(cardsetId, String);

    const cardset = Cardsets.findOne(cardsetId);
    const btCreateTransaction = new Future();
    // Create our customer.
    Meteor.call('btCreateCustomer', nonceFromTheClient, function(error, btCustomer) {
      if (error) {
        btCreateTransaction.return(error);
      } else {
        let customerId;
        if (btCustomer === undefined) {
          customerId = Meteor.user().customerId;
        } else {
          customerId = btCustomer.customer.id;
        }
        gateway.transaction.sale({
          amount: cardset.price,
          paymentMethodNonce: nonceFromTheClient, // Generated nonce passed from client
          customerId,
          options: {
            submitForSettlement: true, // Payment is submitted for settlement immediatelly
            storeInVaultOnSuccess: true, // Store customer in Braintree's Vault
          },
        }, function(saleError, saleResponse) {
          if (saleError) {
            btCreateTransaction.return(saleError);
          } else {
            Meteor.call('addPaid', cardsetId, cardset.price);
            Meteor.call('increaseUsersBalance', cardset.owner, cardset.reviewer, cardset.price);
            btCreateTransaction.return(saleResponse.clientToken);
          }
        });
      }
    });
    return btCreateTransaction.wait();
  },

  btCreateCredit(nonceFromTheClient) {
    check(nonceFromTheClient, Number);

    const user = Meteor.users.findOne(this.userId);
    const btCreateCredit = new Future();
    // Create our customer.
    Meteor.call('btCreateCustomer', nonceFromTheClient, function(error, btCustomer) {
      if (error) {
        btCreateCredit.return(error);
      } else {
        let customerId;
        if (btCustomer === undefined) {
          customerId = Meteor.user().customerId;
        } else {
          customerId = btCustomer.customer.id;
        }

        // Make new credit
        gateway.transaction.credit({
          amount: user.balance,
          paymentMethodNonce: nonceFromTheClient, // Generated nonce passed from client
          customerId,
          options: {
            submitForSettlement: true, // Payment is submitted for settlement immediatelly
            storeInVaultOnSuccess: true, // Store customer in Braintree's Vault
          },
        }, function(creditError, creditResponse) {
          if (creditError) {
            btCreateCredit.return(creditError);
          } else {
            btCreateCredit.return(creditResponse.clientToken);
          }
        });
      }
    });

    return btCreateCredit.wait();
  },

  btSubscribe(nonce, plan) {
    check(nonce, Number);
    check(plan, String);

    const thisCustomer = new Future();

    // Create our customer.
    Meteor.call('btCreateCustomer', nonce, function(error, btCustomer) {
      if (error) {
        thisCustomer.return(error);
      } else {
        let customerId;
        if (btCustomer === undefined) {
          customerId = Meteor.user().customerId;
        } else {
          customerId = btCustomer.customer.id;
        }
        // Setup a subscription for our customer.
        Meteor.call('btCreateSubscription', customerId, plan, function(subscriptionError, response) {
          if (subscriptionError) {
            thisCustomer.return(subscriptionError);
          } else {
            try {
              const customerSubscription = {
                customerId,
                subscription: {
                  plan,
                  status: response.subscription.status,
                  billingDate: response.subscription.nextBillingDate,
                },
                visible: true,
              };
              // Perform an update on this user.
              Meteor.users.update(Meteor.user(), {
                $set: customerSubscription,
              }, function(updateError) {
                if (updateError) {
                  thisCustomer.return(updateError);
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
            } catch (exception) {
              thisCustomer.return(exception);
            }
          }
        });
      }
    });
    return thisCustomer.wait();
  },

  btCreateCustomer(nonce) {
    check(nonce, Number);

    const user = Meteor.user();
    Meteor.call('btFindCustomer', user.customerId, function(error, result) {
      if (result) {
        return undefined;
      }
      const customerData = {
        email: user.email,
        paymentMethodNonce: nonce,
      };
      const btCustomer = new Future();
      // Calling the Braintree API to create our customer!
      gateway.customer.create(customerData, function(createError, createResult) {
        if (createError) {
          btCustomer.return(createError);
        } else {
          // If customer is successfuly created on Braintree servers,
          // we will now add customer ID to our User
          Meteor.users.update(user._id, {
            $set: {
              customerId: createResult.customer.id,
            },
          });
          btCustomer.return(createResult);
        }
      });
      return btCustomer.wait();
    });
  },

  btFindCustomer(customerId) {
    check(customerId, String);

    const btCustomer = new Future();

    gateway.customer.find(customerId, function(error, result) {
      if (error) {
        btCustomer.return(error);
      } else {
        btCustomer.return(result);
      }
    });

    return btCustomer.wait();
  },

  btCreateSubscription(customerId, plan) {
    check(customerId, String);
    check(plan, String);

    const btSubscription = new Future();

    // fetch customer data.
    Meteor.call('btFindCustomer', customerId, function(error, result) {
      if (error) {
        btSubscription.return(error);
      } else {
        const subscriptionRequest = {
          paymentMethodToken: result.paymentMethods[0].token,
          planId: plan,
        };

        // create subscription
        gateway.subscription.create(subscriptionRequest, function(createError, createResult) {
          if (createError) {
            btSubscription.return(createError);
          } else {
            btSubscription.return(createResult);
          }
        });
      }
    });

    return btSubscription.wait();
  },

  btFindUserSubscription(customerId) {
    check(customerId, String);

    const btUserSubscription = new Future();

    // find customer
    gateway.customer.find(customerId, function(error, result) {
      if (error) {
        btUserSubscription.return(error);
      } else {
        // get customer's last subscription
        const subscriptionId = result.paymentMethods[0].subscriptions;
        const last = subscriptionId.slice(-1)[0];

        btUserSubscription.return(last);
      }
    });

    return btUserSubscription.wait();
  },

  btCancelSubscription() {
    const btCancelSubscription = new Future();

    const user = Meteor.userId();
    const getUser = Meteor.users.findOne({
      '_id': user,
    }, {
      fields: {
        'customerId': 1,
      },
    });

    Meteor.call('btFindUserSubscription', getUser.customerId, function(error, customerSubscription) {
      if (error) {
        btCancelSubscription.return(error);
      } else {
        // cancel the active subscription
        gateway.subscription.cancel(customerSubscription.id, function(cancelError) {
          if (cancelError) {
            btCancelSubscription.return(cancelError);
          } else {
            Meteor.users.update(Meteor.userId(), {
              $set: {
                'subscription.status': 'Canceled',
                'subscription.ends': customerSubscription.paidThroughDate,
              },
            }, function(updateError, response) {
              if (updateError) {
                btCancelSubscription.return(updateError);
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
  },
});
