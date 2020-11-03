#!/bin/bash

export PATH=$HOME/.meteor:$PATH

mkdir -p /home/node/local/db
rm -rf /home/node/app/.meteor/local
ln -fs /home/node/local /home/node/app/.meteor/local

rm -rf /home/node/app/node_modules
ln -fs /home/node/node_modules /home/node/app/node_modules

cd app

meteor npm install
meteor --settings $1
