#1 How to import testdata locally
1. Start meteor
2. mongorestore -h 127.0.0.1 --port 3001 -d meteor tests/dump/meteor
3. Login as "testuser" to be the owner of two cardsets.