import {Meteor} from "meteor/meteor";
import {Cardsets} from "../subscriptions/cardsets.js";

var Future = Npm.require('fibers/future');

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
	getClientToken: function (customerId) {
		var btClientToken = new Future();
		gateway.clientToken.generate({customerId: customerId}, function (error, response) {
			if (error) {
				btClientToken.return(error);
			} else {
				btClientToken.return(response.clientToken);
			}
		});
		return btClientToken.wait();
	},

	btGetPaymentMethod: function () {
		var btPayment = new Future();
		var user = Meteor.users.findOne(this.userId);
		Meteor.call('btFindCustomer', user.customerId, function (error, customer) {
			if (error) {
				btPayment.return(error);
			} else {
				btPayment.return(customer.paymentMethods);
			}
		});
		return btPayment.wait();
	},

	btUpdatePaymentMethod: function (nonceFromTheClient) {
		var btUpdatePayment = new Future();
		Meteor.call('btCreateCustomer', nonceFromTheClient, function (error, btCustomer) {
			if (error) {
				btUpdatePayment.return(error);
			} else {
				var customerId;
				if (btCustomer === undefined) {
					customerId = Meteor.user().customerId;
				} else {
					customerId = btCustomer.customer.id;
				}

				gateway.paymentMethod.create({
					customerId: customerId,
					paymentMethodNonce: nonceFromTheClient,
					options: {
						makeDefault: true
					}
				}, function (createError, createResult) {
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

	btCreateTransaction: function (nonceFromTheClient, cardset_id) {
		var cardset = Cardsets.findOne(cardset_id);
		var btCreateTransaction = new Future();
		// Create our customer.
		Meteor.call('btCreateCustomer', nonceFromTheClient, function (error, btCustomer) {
			if (error) {
				btCreateTransaction.return(error);
			} else {
				var customerId;
				if (btCustomer === undefined) {
					customerId = Meteor.user().customerId;
				} else {
					customerId = btCustomer.customer.id;
				}
				gateway.transaction.sale({
					amount: cardset.price,
					paymentMethodNonce: nonceFromTheClient, // Generated nonce passed from client
					customerId: customerId,
					options: {
						submitForSettlement: true, // Payment is submitted for settlement immediatelly
						storeInVaultOnSuccess: true // Store customer in Braintree's Vault
					}
				}, function (saleError, saleResponse) {
					if (saleError) {
						btCreateTransaction.return(saleError);
					} else {
						Meteor.call('addPaid', cardset_id, cardset.price);
						Meteor.call('increaseUsersBalance', cardset.owner, cardset.reviewer, cardset.price);
						btCreateTransaction.return(saleResponse.clientToken);
					}
				});
			}
		});
		return btCreateTransaction.wait();
	},

	btCreateCredit: function (nonceFromTheClient) {
		var user = Meteor.users.findOne(this.userId);
		var btCreateCredit = new Future();
		// Create our customer.
		Meteor.call('btCreateCustomer', nonceFromTheClient, function (error, btCustomer) {
			if (error) {
				btCreateCredit.return(error);
			} else {
				var customerId;
				if (btCustomer === undefined) {
					customerId = Meteor.user().customerId;
				} else {
					customerId = btCustomer.customer.id;
				}

				// Make new credit
				gateway.transaction.credit({
					amount: user.balance,
					paymentMethodNonce: nonceFromTheClient, // Generated nonce passed from client
					customerId: customerId,
					options: {
						submitForSettlement: true, // Payment is submitted for settlement immediatelly
						storeInVaultOnSuccess: true // Store customer in Braintree's Vault
					}
				}, function (creditError, creditResponse) {
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

	btSubscribe: function (nonce, plan) {
		var thisCustomer = new Future();

		// Create our customer.
		Meteor.call('btCreateCustomer', nonce, function (error, btCustomer) {
			if (error) {
				thisCustomer.return(error);
			} else {
				var customerId;
				if (btCustomer === undefined) {
					customerId = Meteor.user().customerId;
				} else {
					customerId = btCustomer.customer.id;
				}
				// Setup a subscription for our customer.
				Meteor.call('btCreateSubscription', customerId, plan, function (subscriptionError, subscriptionResponse) {
					if (subscriptionError) {
						thisCustomer.return(subscriptionError);
					} else {
						try {
							var customerSubscription = {
								customerId: customerId,
								subscription: {
									plan: plan,
									status: subscriptionResponse.subscription.status,
									billingDate: subscriptionResponse.subscription.nextBillingDate
								},
								visible: true
							};
							// Perform an update on this user.
							Meteor.users.update(Meteor.user(), {
								$set: customerSubscription
							}, function (userUpdateError) {
								if (userUpdateError) {
									thisCustomer.return(userUpdateError);
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

	btCreateCustomer: function (nonce) {
		var user = Meteor.user();
		Meteor.call('btFindCustomer', user.customerId, function (error, result) {
			if (result) {
				return undefined;
			} else {
				var customerData = {
					email: user.email,
					paymentMethodNonce: nonce
				};
				var btCustomer = new Future();
				// Calling the Braintree API to create our customer!
				gateway.customer.create(customerData, function (customerCreateError, customerCreateResult) {
					if (customerCreateError) {
						btCustomer.return(customerCreateError);
					} else {
						// If customer is successfuly created on Braintree servers,
						// we will now add customer ID to our User
						Meteor.users.update(user._id, {
							$set: {
								customerId: customerCreateResult.customer.id
							}
						});
						btCustomer.return(customerCreateResult);
					}
				});
				return btCustomer.wait();
			}
		});
	},

	btFindCustomer: function (customerId) {
		var btCustomer = new Future();

		gateway.customer.find(customerId, function (error, result) {
			if (error) {
				btCustomer.return(error);
			} else {
				btCustomer.return(result);
			}
		});

		return btCustomer.wait();
	},

	btCreateSubscription: function (customerId, plan) {
		var btSubscription = new Future();

		// fetch customer data.
		Meteor.call('btFindCustomer', customerId, function (error, result) {
			if (error) {
				btSubscription.return(error);
			} else {
				var subscriptionRequest = {
					paymentMethodToken: result.paymentMethods[0].token,
					planId: plan
				};

				// create subscription
				gateway.subscription.create(subscriptionRequest, function (subscriptionCreateError, subscriptionCreateResult) {
					if (subscriptionCreateError) {
						btSubscription.return(subscriptionCreateError);
					} else {
						btSubscription.return(subscriptionCreateResult);
					}
				});
			}
		});

		return btSubscription.wait();
	},

	btFindUserSubscription: function (customerId) {
		var btUserSubscription = new Future();

		// find customer
		gateway.customer.find(customerId, function (error, result) {
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

	btCancelSubscription: function () {
		var btCancelSubscription = new Future();

		var user = Meteor.userId();
		var getUser = Meteor.users.findOne({
			"_id": user
		}, {
			fields: {
				"customerId": 1
			}
		});

		Meteor.call('btFindUserSubscription', getUser.customerId, function (error, customerSubscription) {
			if (error) {
				btCancelSubscription.return(error);
			} else {
				// cancel the active subscription
				gateway.subscription.cancel(customerSubscription.id, function (subscriptionCancelError) {
					if (subscriptionCancelError) {
						btCancelSubscription.return(subscriptionCancelError);
					} else {
						Meteor.users.update(Meteor.userId(), {
							$set: {
								"subscription.status": "Canceled",
								"subscription.ends": customerSubscription.paidThroughDate
							}
						}, function (userUpdateError, userUpdateResponse) {
							if (userUpdateError) {
								btCancelSubscription.return(userUpdateError);
							} else {
								btCancelSubscription.return(userUpdateResponse);
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
