#!/bin/bash

DIRECTORY=`dirname $0`
CALLED_FROM_SCRIPT=true
URL='https://arsnova-uploads.mni.thm.de/cards/debug.cards-database.gz'
STATUS=0
FILE='./tests/testDatabaseDump/debug.cards-database.gz'
source $DIRECTORY/helpers/scriptSettings.sh

checkDirectory


# Checking version of Test-Database dump
if curl --output /dev/null --silent --head -faill "$URL"; then
  echo -e $GREEN"Checking online version..."$NC
  curl -z "$FILE" "$URL" --output "$FILE" --create-dirs
else
  echo -e $RED"Can't find online Test-Database."$NC
fi

if test -f "$FILE"; then
  # Drop and Restore the Test-Database
  echo -e $GREEN"Dropping and Restoring Test-Database ..."$NC
  if ! mongorestore --drop -h "$MONGO_HOST" --port "$MONGO_PORT" -d "$MONGO_DB" --gzip --archive="./tests/testDatabaseDump/debug.cards-database.gz" --nsFrom "cards.*" --nsTo "cards.*" 1> /dev/null; then
    echo -e $RED"mongorestore failed!"$NC
    exit 2
  fi
  echo -e $GREEN"Test-Database restored."$NC
  if [ -z "$CALLED_FROM_SCRIPT" ] ; then
      exit 0
  fi
else
  echo -e $RED"Can't find Test-Database."$NC
fi

