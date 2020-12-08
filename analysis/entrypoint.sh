#!/bin/bash

if [[ $(curl -s -o /dev/null -w "%{http_code}" -u admin:admin -X POST http://sonarqube:9000/api/qualitygates/list) != 200 ]]; then
  echo "Sonarqube has not finished startup yet."
  echo "Please try again later..."
  exit 0
fi

if [[ $(curl -s -o /dev/null -w "%{http_code}" -u admin:admin -X POST -F 'id=2' http://sonarqube:9000/api/qualitygates/show) == 404 ]]; then

  # quality gate does not yet exist
  echo "creating quality gate..."

  # create the gate
  curl -u admin:admin -X POST -F 'name=cards' http://sonarqube:9000/api/qualitygates/create
  # create the conditions
  curl -u admin:admin -X POST -F 'error=80' -F 'gateId=2' -F 'metric=coverage' -F 'op=LT' http://sonarqube:9000/api/qualitygates/create_condition
  curl -u admin:admin -X POST -F 'error=3' -F 'gateId=2' -F 'metric=duplicated_lines_density' -F 'op=GT' http://sonarqube:9000/api/qualitygates/create_condition
  curl -u admin:admin -X POST -F 'error=1' -F 'gateId=2' -F 'metric=sqale_rating' -F 'op=GT' http://sonarqube:9000/api/qualitygates/create_condition
  curl -u admin:admin -X POST -F 'error=1' -F 'gateId=2' -F 'metric=reliability_rating' -F 'op=GT' http://sonarqube:9000/api/qualitygates/create_condition
  curl -u admin:admin -X POST -F 'error=1' -F 'gateId=2' -F 'metric=security_rating' -F 'op=GT' http://sonarqube:9000/api/qualitygates/create_condition
  # set newly created gate as default
  curl -u admin:admin -X POST -F 'id=2' http://sonarqube:9000/api/qualitygates/set_as_default
fi

gradle sonarqube -Dsonar.host.url=http://sonarqube:9000
