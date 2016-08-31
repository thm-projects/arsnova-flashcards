ARSnova Cards
---

ARSnova Cards is a digital recreation of a classic learning tool. The service offers students a modern and intuitive access to one of the most successful proven learning methods.

## Initial setup

1. [Install Meteor](https://www.meteor.com/install)
2. Clone this repo `git clone https://git.thm.de/arsnova/flashcards.git`

### Settings

1. For development you can use  `settings.json`
2. Change it according to your needs
3. Set your initial admin user

> Warning: Never publish your production settings file!

### Authentication setup
1. [Create your Google api keys](https://console.developers.google.com/)
2. [Create your Facebook api keys](https://developers.facebook.com/)
3. [Create your Twitter api keys](https://apps.twitter.com/)


### Braintree setup
1. [Create a Braintree sandbox account](https://www.braintreepayments.com/get-started)
2. [Login](https://sandbox.braintreegateway.com/login) to the braintree sandbox
3. Retrieve your api keys (navigate to: My User > View Authorizations)
4. Insert the keys into `settings.json`
5. Inside Braintree sandbox, navigate to Plans from left menu under `Reccuring Billing`
6. Create one plan with id "pro" and your preferred price (lowercase for Plan ID, Plan Name's should be "Pro")


## Getting Started

To start ARSnova Cards on localhost use `meteor --settings settings.json` inside the repository. You can then access ARSnova Cards from your host machine by opening http://localhost:3000.

## CI Pipeline

[![build status](https://git.thm.de/arsnova/flashcards/badges/staging/build.svg)](https://git.thm.de/arsnova/flashcards/commits/staging)


- [Staging](http://cards-staging.mni.thm.de)
- [Production](https://arsnova.cards)


## Credits

ARSnova Cards is powered by Technische Hochschule Mittelhessen - University of Applied Sciences.
