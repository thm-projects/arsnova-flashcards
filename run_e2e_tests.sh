CALLER_WORKDIR=${PWD##*/}
EXPECTED_CALLER_WORKDIR="cards"

DOCKER_IMAGE_NAME="e2e_image"
DOCKER_CONTAINER_NAME="e2e_container"

TEST_REPORTS_DIR="$(pwd)/tests/e2e_tests/robotframefork/reports/e2e_tests/"
TEST_REPORTS_DIR_IN_DOCKER_CONTAINER="/cards/tests/e2e_tests/robotframefork/reports/e2e_tests"

if [ "$CALLER_WORKDIR" != "$EXPECTED_CALLER_WORKDIR" ]; then
    echo "ERROR: Script should be called from the /cards root directory of the project!"
    exit -2
fi

echo "Cleaning old containers & images if existent"
docker rmi -f ${DOCKER_IMAGE_NAME} > /dev/null 2>&1
docker rm -f ${DOCKER_CONTAINER_NAME} > /dev/null 2>&1

echo "Building docker image"
docker build -t "${DOCKER_IMAGE_NAME}" .

if [ "$?" != "0" ]; then
    echo "ERROR: Building docker image failed, exiting..."
    exit $?
fi

echo "Running docker image"
docker run -td \
--name="$DOCKER_CONTAINER_NAME" \
-v "$TEST_REPORTS_DIR":"$TEST_REPORTS_DIR_IN_DOCKER_CONTAINER" \
--cap-add "SYS_ADMIN" \
"$DOCKER_IMAGE_NAME"

if [ "$?" != "0" ]; then
    echo "ERROR: running docker container failed, exiting..."
    exit $?
fi

echo "Running E2E-Tests inside docker image"
docker exec -t "${DOCKER_CONTAINER_NAME}" \
    robot -d "tests/e2e_tests/robotframefork/reports/e2e_tests" \
    -P "tests/e2e_tests/robotframefork/lib" \
    -i "e2e" \
    -v ENV_USE_GUI_BROWSER:"False" \
    -v ENV_BROWSER_TIMEOUT:"30" \
    -v ENV_LOAD_TESTDB_PATH:"./tests/loadTestDatabase.sh" \
    -v ENV_DEBUG_MODE:"False" \
    -v ENV_CARDS_URL:"http://localhost:3000" \
    "tests/e2e_tests/robotframefork/tests"

TEST_STATUS="$?"

if [ "$TEST_STATUS" != "0" ]; then
    echo "E2E Tests finished: Test Status: FAILED!"
else
    echo "E2E Tests finished: Test Status: SUCCESS!"
fi

echo "You can view the testresults in: '${TEST_REPORTS_DIR}'"

echo "Cleaning up docker space"
docker rmi -f ${DOCKER_IMAGE_NAME} > /dev/null 2>&1
docker rm -f ${DOCKER_CONTAINER_NAME} > /dev/null 2>&1
docker image prune

exit "${TEST_STATUS}"
