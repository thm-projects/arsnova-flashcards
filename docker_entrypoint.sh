#!/bin/bash

# Install meteor the first time
if [[ ! -d /home/node/.meteor ]]
then
  echo "----------------"
  echo "This is the first time you starting cards - going to download meteor."
  echo "Please wait..."
  echo "----------------"
  curl https://install.meteor.com/ | sh
fi

# Make the meteor executable available
export PATH=$HOME/.meteor:$PATH

# Setup correct links so local data and node_modules are not shared
mkdir -p /home/node/node_modules
mkdir -p /home/node/local/db
rm -rf /app/.meteor/local
ln -fs /home/node/local /app/.meteor/local
rm -rf /app/node_modules
ln -fs /home/node/node_modules /app/node_modules

cd /app

# Install deps if this is first time start or if package-lock has changed
if [[ ! -f /home/node/node_modules/locksum ]] || [[ ! $(md5sum /app/package-lock.json) == $(cat /home/node/node_modules/locksum) ]]
then
  echo "----------------"
  echo "This is the first time you starting cards or the package lock has changed."
  echo "Going to install npm dependecies..."
  echo "----------------"
  meteor npm ci
  md5sum /app/package-lock.json > /home/node/node_modules/locksum
fi

echo "----------------"
echo "Starting cards..."
echo "The start may take a long time the first time, depending on your Internet speed."
echo "The output may freeze after \"Started MongoDB\". Please be patient..."
echo "The app is ready when the output \"Started your app\" is visible."
echo "----------------"

meteor --settings $1
