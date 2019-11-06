#!/bin/bash
# first pulls the needed docker image
# then run the integration errors in the docker container

if [ "$1" = "" ]
then
	echo "Parameter 1 needed: location of postman collection"
	exit 1
fi

docker pull postman/newman:ubuntu

docker run --network="host" -v $1:/etc/newman -t postman/newman:ubuntu run "SystematischerSoftwaretest.postman_collection.json" -e "SystematischerSoftwareTestEnv.postman_environment.json"
