## How to test the application with chimp and cucumber

## Install chimp
	npm install -g chimp

### Please follow the folling procedure
#### Enter the project directory
    cd flashcards
#### Run Meteor
    meteor --settings settings_test.json
#### Clear the current database
Enter mongo shell with

    meteor mongo
    
Then

    use meteor
    db.dropDatabase()
Exit mongo shell
#### Load the test data
    mongorestore -h 127.0.0.1 --port 3001 -d meteor tests/dump/meteor
#### Run the tests
    chimp --ddp=http://localhost:3000 --watch --path=tests


## Important
For the tests, please login with the user "testuser"



## Useful links
[General info about chimp](https://chimp.readme.io/docs/introduction)  
[Chimp cheat sheet](https://chimp.readme.io/docs/cheat-sheet)  
[Chimp github page](https://github.com/xolvio/chimp)  
[Webdriver the API](http://webdriver.io/api.html)  

