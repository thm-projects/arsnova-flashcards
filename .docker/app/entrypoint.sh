#!/bin/sh

export NODE_ENV=production
export PORT=3000
export METEOR_SETTINGS="`cat settings_docker.json`"

node /usr/app/bundle/main.js
