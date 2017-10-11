#!/bin/bash

DIRECTORY=`dirname $0`
CALLED_FROM_SCRIPT=true

source $DIRECTORY/helpers/scriptSettings.sh

checkDirectory

# Drop and Restore the Test-Database
echo -e $GREEN"\nDropping and Restoring Test-Database ..."$NC
if ! mongorestore --quiet --drop -h "$MONGO_HOST" --port "$MONGO_PORT" -d "$MONGO_DB" $restoreDir 1> /dev/null; then
	echo -e $RED"mongorestore failed!"$NC
	exit 2
fi
echo -e $GREEN"Test-Database restored."$NC
if [ -z "$CALLED_FROM_SCRIPT" ] ; then
    exit 0
fi
