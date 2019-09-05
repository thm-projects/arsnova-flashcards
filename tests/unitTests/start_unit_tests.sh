#!/usr/bin/env bash

cd ../../

BABEL_ENV=COVERAGE COVERAGE=1 COVERAGE_OUT_HTML=1 COVERAGE_APP_FOLDER=$PWD/  meteor test --driver-package meteortesting:mocha --once

cd tests/unitTests
