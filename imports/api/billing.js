import { Paid } from './paid.js';
import { Cardsets } from './cardsets.js';

// Define gateway variable
var gateway;

Meteor.startup(function () {
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
  getClientToken: function (clientId) {
    var generateToken = Meteor.wrapAsync(gateway.clientToken.generate, gateway.clientToken);
    var options = {};

    if (clientId) {
      options.clientId = clientId;
    }

    var response = generateToken(options);
    return response.clientToken;
  },
  subscribeToPlan(nonce, plan) {
    const customer = Meteor.wrapAsync(gateway.customer.create, gateway.customer);
    const subscription = Meteor.wrapAsync(gateway.subscription.create, gateway.subscription);
    const plans = Meteor.wrapAsync(gateway.plan.all, gateway.plan);
    const plansResult = plans().plans;

    const planId = plansResult.find((planObject) => {
      return planObject.name === plan;
    }).id;

    const email = Meteor.user().email;

    const customerResult = customer({
      email,
      paymentMethodNonce: nonce,
    });

    if (customerResult.success) {
      const token = customerResult.customer.paymentMethods[0].token;
      const subscriptionResult = subscription({
        paymentMethodToken: token,
        planId,
      });

      if (subscriptionResult.success) {
        // Set / check the correct role for your user
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

        return true;
      }
    }
  },
  btCreateCustomer: function(){
    var user = Meteor.user();

    var customerData = {
      email: user.email
    };

    // Calling the Braintree API to create our customer!
    gateway.customer.create(customerData, function(error, response){
      if (error){
        console.log(error);
      } else {
        // If customer is successfuly created on Braintree servers,
        // we will now add customer ID to our User
        Meteor.users.update(user._id, {
          $set: {
            customerId: response.customer.id
          }
        });
      }
    });
  },
  createTransaction: function(nonceFromTheClient, cardset_id) {
    var user = Meteor.user();
    var amount = Cardsets.findOne(cardset_id).price;

    gateway.transaction.sale({
      amount: amount,
      paymentMethodNonce: nonceFromTheClient, // Generated nonce passed from client
      customer: {
        id: user.customerId
      },
      options: {
        submitForSettlement: true, // Payment is submitted for settlement immediatelly
        storeInVaultOnSuccess: true // Store customer in Braintree's Vault
      }
    }, function (err, success) {
      if (err) {
        console.log(err);
      } else {
        // When payment's successful, add "paid" role to current user.
        //Roles.addUsersToRoles(user._id, 'paid', Roles.GLOBAL_GROUP)
          Meteor.call('addPaid', cardset_id, amount);
      }
    });
  }
});
