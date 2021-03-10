#!/bin/bash

DIRECTORY=`dirname $0`
CALLED_FROM_SCRIPT=true

source $DIRECTORY/helpers/scriptSettings.sh

checkDirectory

#Dump the Test-Database
echo -e $GREEN"Dumping the Test-Database..." $NC
if ! mongodump --quiet --archive="./tests/testDatabaseDump/debug.cards-database.gz" -h "$MONGO_HOST" --port "$MONGO_PORT" -d "$MONGO_DB" --gzip 1> /dev/null; then
	echo -e $RED"mongodump failed!" $NC
	exit 2
fi
echo -e $GREEN"Dumped Test-Database." $NC
exit 0
