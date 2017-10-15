# Installing chimp and other required software

## Linux Steps (Ubuntu)
1. Install the npm package dependencies inside the local repository **"flashcards folder"** `meteor npm install`
1. Install the mongodb-tools: `sudo apt-get install mongo-tools`
1. Check if Node.js is installed with `node -v `and install the recommended version if this isn't the case
1. Update the OpenJDK `sudo apt-get install openjdk-9-jdk`
1. Create a symbolic link to the conf files, if your openjdk version is lower than 9~b177-2
     > cd /usr/lib/jvm/java-9-openjdk-amd64   
     sudo ln -s lib conf

## Windows Steps
1. Install the npm package dependencies inside the local repository **"flashcards folder"** `meteor npm install`
1. [Install git for Windows (Shell integration)](https://git-scm.com/download/win)
1. [Install the latest Version of NodeJS](https://nodejs.org/en/)
1. [Install MongoDB](https://www.mongodb.com)
1. Add your MongoDB bin folder to your `PATH enviormental variable` to gain access to mongodump.exe and mongorestore.exe
1. Install the latest Version of Firefox

## Running a test

### Enter the project directory
    cd flashcards

### Run Meteor
Start meteor (from your project root / flashcards folder):  

    meteor --settings settings_test.json

## Following commands are executed in a shell that isn't running meteor (from your project root / flashcards folder):
### Run all chimp tests
    ./tests/runTests.sh

#### Run a single chimp test
    ./tests/singleTest.sh

### Dump the Test-Database
    ./tests/dumpTestDatabase.sh

### Load the Test-Database
    ./tests/loadTestDatabase.sh

## Logins
You can use following user strings for the login:

(Backend Access)
- "adminLogin"
- "editorLogin"

(Frontend only)
- "standardLogin"
- "universityLogin"
- "lecturerLogin"
- "blockedLogin"
- "firstLogin"

## Helpers
Include the **helper_functions.js** for common functions.

    import {login, logout} from "../helper_functions"

now you can use the helper functions:

    login("LOGINSTRING");
    ...
    logout();

## Useful links
- [General info about chimp](https://chimp.readme.io/docs/introduction)
- [Chimp cheat sheet](https://chimp.readme.io/docs/cheat-sheet)
- [Chimp github page](https://github.com/xolvio/chimp)
- [Webdriver the API](http://webdriver.io/api.html)
