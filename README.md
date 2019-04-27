arsnova🍅cards
---
The [Progressive Web App](https://en.wikipedia.org/wiki/Progressive_web_app) arsnova🍅cards offers students a modern and intuitive access to one of the most successful and evidence based learning methods, i.e., [spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition).

arsnova🍅cards uses Meteor as application framework. Download and install [Meteor](https://www.meteor.com/) to get the app running in your local development environment.

## System requirements
- 4 GB RAM

## Initial setup
1. Install [Meteor](https://www.meteor.com/)
2. Install git `sudo apt install git`
3. Install python 2 `sudo apt install python`, Ubuntu only ships with python 3
4. install the g++ build-essential `sudo apt install g++ build-essential`
2. Make sure that you've added a [SSH key](https://git.thm.de/profile/keys)
3. Clone the remote repository `git clone git@git.thm.de:arsnova/cards.git`
4. Install the npm package dependencies inside the local repository **"cards folder"** `meteor npm install`

### Settings (These steps are only required if you want to deploy 🍅cards on a server)
1. Set your initial admin user in `settings.json` (cas account)
2. Change `settings.json` according to your needs

> Warning: Never publish your settings file!

## Meteor updates
A simple update to the latest Meteor version is not always possible. Please do not update Meteor to the latest version and leave this to the owners of the repository.

## Migrate a local Meteor 1.6 🍅cards database to Meteor 1.8
1. Make sure that you meet following requirements:
   - You've selected the staging branch `git checkout staging`
   - Your staging branch is up to date `git pull`
   - Meteor is running
   - Your terminal is inside the repository **cards folder**
1. Move to your staging branch `git checkout staging`
1. Install the mongodb-tools: `sudo apt-get install mongo-tools`
1. Set your repository to the latest Meteor 1.6 version `git checkout 29db2ca369d25fa2f9dab2d964a3f131eeba1aa4`
1. Dump your current Meteor 1.6 database `mongodump -h "localhost" --port "3001" -d "meteor" -o ~/cardsBackup/`
   - Make sure that mongodump created the folder and files
1. Stop meteor
1. Reset the meteor configuration `meteor reset`
1. Move back to the latest staging branch version `git checkout staging`
1. Update your node packages `meteor npm install`
1. Start meteor
1. Restore your backup `mongorestore --drop -h "localhost" --port "3001" -d "meteor" ~/cardsBackup/meteor`

## Starting the app
Use one of the following commands inside the repository (cards folder), to start arsnova🍅cards:

- For development (Use this if you run a local installation):
  - `meteor --settings settings_debug.json`
  - Access the app from your host machine by visiting http://localhost:3000
  - Use the Backdoor Login "Erstanmeldung / First Login" from the drop-down list if you're going to export and submit cards to moodle

- For production:
  - `meteor --settings settings.json`


## Loading the Test Database
1. Make sure that you've installed the [MongoDB Community Tools](https://docs.mongodb.com/manual/administration/install-community/)
2. Start the server with the development settings

> Warning: The following step will delete all of your 🍅cards content

3. Open a new terminal in the cards folder and load the Test Database with: `./tests/loadTestDatabase.sh`

## Optional features

### Authentication setup (For Google+, Facebook and Twitter logins)
1. [Create your Google+ api keys](https://console.developers.google.com/)
2. [Create your Facebook api keys](https://developers.facebook.com/)
3. [Create your Twitter api keys](https://apps.twitter.com/)


### Braintree setup (For PayPal payments)
1. [Create a Braintree sandbox account](https://www.braintreepayments.com/get-started)
2. [Login](https://sandbox.braintreegateway.com/login) to the braintree sandbox
3. Retrieve your api keys (navigate to: My User > View Authorizations)
4. Insert the keys into `settings.json`
5. Inside Braintree sandbox, navigate to Plans from left menu under `Reccuring Billing`
6. Create one plan with id "pro" and your preferred price (lowercase for Plan ID, Plan Name's should be "Pro")


### Firebase setup (For web notifications)
1. [Create a Firebase project](https://console.firebase.google.com/)
2. Get the FCM api key from Firebase project (project settings > cloud messaging > server key)
3. Insert the key into `settings.json` (`FCM_API_KEY`)

## Contribution guide
The contribution guide can be found [here](https://git.thm.de/arsnova/cards/blob/staging/CONTRIBUTING.md).

## Documentation
The documentation can be found [here](https://staging.arsnova.cards/jsdoc/).

### UML Diagrams
- [Activity](https://git.thm.de/arsnova/cards/wikis/uml---activity-diagram)
- [Domain model](https://git.thm.de/arsnova/cards/wikis/uml---domain-model-diagram)
- [Use case](https://git.thm.de/arsnova/cards/wikis/uml---use-case-diagram)

## CI Pipeline
| Server | Status|
|--------|----------------|
|[Staging](https://staging.arsnova.cards)| [![build status](https://git.thm.de/arsnova/cards/badges/staging/build.svg)](https://git.thm.de/arsnova/cards/commits/staging)|
|[Production](https://thm.cards)| [![build status](https://git.thm.de/arsnova/cards/badges/master/build.svg)](https://git.thm.de/arsnova/cards/commits/master)|
|[Linux](https://linux.cards) |[![build status](https://git.thm.de/arsnova/cards/badges/master/build.svg)](https://git.thm.de/arsnova/cards/commits/master)|

## Credits
arsnova🍅cards is powered by Technische Hochschule Mittelhessen - University of Applied Sciences.
