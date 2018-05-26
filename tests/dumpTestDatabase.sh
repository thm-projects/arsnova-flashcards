#!/bin/bash

DIRECTORY=`dirname $0`
CALLED_FROM_SCRIPT=true

source $DIRECTORY/helpers/scriptSettings.sh

checkDirectory

declare -a BLACKLISTEDFILES=("adminSettings.bson" "colorThemes.bson" "cronHistory.bson" "webPushSubscriptions.bson" "roles.bson"
"meteor_accounts_loginServiceConfiguration.bson" "meteor_oauth_pendingCredentials.bson"
"meteor_oauth_pendingRequestTokens.bson")

#Dump the Test-Database
echo -e $GREEN"Dumping the Test-Database..." $NC
if ! mongodump --quiet -h "$MONGO_HOST" --port "$MONGO_PORT" -d "$MONGO_DB" -o $dumpDir 1> /dev/null; then
	echo -e $RED"mongodump failed!" $NC
	exit 2
fi
rm $restoreDir/*.json
for files in "${BLACKLISTEDFILES[@]}"; do
    rm $restoreDir"/$files"
done
echo -e $GREEN"Dumped Test-Database." $NC
exit 0
