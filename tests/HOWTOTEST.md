## How to test the application with chimp and cucumber

### Please follow the folling procedure
#### Enter the project directory
`cd flashcards`
#### Run Meteor
`meteor --settings settings_test.json`
#### Clear the current database
Enter mongo shell with `meteor mongo`
`use meteor`
`db.dropDatabase()`
Exit mongo shell
#### Load the test data
`mongorestore -h 127.0.0.1 --port 3001 -d meteor tests/dump/meteor`
#### Run the tests
`chimp --ddp=http://localhost:3000 --watch --path=tests`


# Important
For the tests, please login with the user "testuser"
