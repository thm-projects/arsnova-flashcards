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
