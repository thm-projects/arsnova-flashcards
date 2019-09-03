COUNTER="1"
MAX_RETRIES="30"
HOSTNAME="http://localhost:3000"

while [ [ ! ping -c1 ${HOSTNAME} /dev/null 2>&1 ] && "$COUNTER" ]; do
    echo "Waiting for Host [${COUNTER}/${MAX_RETRIES}]";
    sleep 1
done ;

if [ ! ping -c1 ${HOSTNAME} > /dev/null 2>&1 ]; then
    echo "Server did not respond within ${MAX_RETRIES} seconds!"
    exit -1
fi

echo "Server up and running!"
exit 0
