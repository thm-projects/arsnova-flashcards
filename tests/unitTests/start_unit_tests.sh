#!/usr/bin/env bash

cd ../../

set -e
BABEL_ENV=COVERAGE COVERAGE=1 COVERAGE_OUT_LCOVONLY=1 COVERAGE_OUT_HTML=1 COVERAGE_APP_FOLDER=$PWD/ meteor test --driver-package meteortesting:mocha --once

cd errors/unitTests
