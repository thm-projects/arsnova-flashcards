arsnova🍅cards - Docker Instructions
---

## Prerequisites
You must have Docker and Docker Compose installed. In most cases, Docker Compose is already included in Docker. Get it from [»here«](https://docs.docker.com/install). When using docker, make sure, you are **not** connected to any VPN.

**We strongly recommend that you use Linux.** If you still want to use Windows, follow these instructions: [🍅cards on Docker for Windows](./docker_win_readme.md). But be warned: despite many optimizations, cards doesn't run nearly as fast on Windows as it does on Linux!

## Getting started (fast)
You can start using arsnova.cards or linux.cards locally by just downloading and running a docker-compose file. The app will then be available on [localhost](http://localhost:3000) at port 3000.

Download your docker-compose file:
- [arsnova.cards](.docker/docker-compose-cards.yml)
- [linux.cards](.docker/docker-compose-linux.yml)

Then run it with
```bash
sudo docker-compose -f <path-to-downloaded-file> up -d
```

No need to clone a repository or to build anything.

---

**The default port for the app is Port 3000. If your Port 3000 is already in use, you may configure the forwarded Port in the downloaded docker-compose.yml file.**

---

**To stop the app, run**
```bash
sudo docker-compose -f <path-to-docker-compose-file> stop
```

to resume:
```bash
sudo docker-compose -f <path-to-docker-compose-file> start
```

---

**To stop the app and remove the containers, run**
```bash
sudo docker-compose -f <path-to-docker-compose-file> down
```

to restart:
```bash
sudo docker-compose -f <path-to-docker-compose-file> up -d
```

---

**To stop the app and remove the containers and remove the volumes, run**
```bash
sudo docker-compose -f <path-to-docker-compose-file> down -v
```

to restart:
```bash
sudo docker-compose -f <path-to-docker-compose-file> up -d
```

---

**To pull new image versions, run**
```bash
# first stop the app and remove containers as described above, then run

sudo docker-compose -f <path-to-docker-compose-file> pull

# then restart the app as described as above
```

---

## Image overview
There are two stages and two variations for which you could build and run the app. All in all you will find three dockerfiles and four docker-compose in this repository. We will go into what is for what now.

**You can build/run the app in two stages: _production_ and _develop_.**

The production stage will be precomiled and you will not be able to see any changes you make in the code, unless you rebuild the image. This stage is made for **using** the app and not for developing.

The develop stage will compile the app on the fly and you will see changes immediately. This stage is made for **developing** the app.

**You can build/run the app in two variants: _arsnova.cards_ and _linux.cards_.**

To switch the variant, you may specify the settings file used to build the Image. You may pass it to the container when creating it.

---

**What are those Dockerfiles for?**
```bash
./.docker/develop/Dockerfile
  # this Dockerfile is used to build the app locally for development

./.docker/app/Dockerfile
  # this Dockerfile is used to build the app locally for production

./.docker/kaniko/Dockerfile
  # this Dockerfile is needed for the automated deployment via CI - do not change it unless you know what you are doing
```

**What are those docker-compose files for?**
```bash
./docker-compose.yml
  # starts the app for development - code changes are visible immediately

./.docker/docker-compose.yml
  # builds the production image locally and starts the app

./.docker/docker-compose-cards.yml
  # starts the prebuild arsnova cards app

./.docker/docker-compose-linux.yml
  # starts the prebuild linux cards app
```

---

## Developing with Docker
You can build and run the development version of cards with docker. Therefore you can use the docker-compose in the projects root directory.
1. Clone the project
2. From your project directory run `sudo UID_GID="$(id -u):$(id -g)" docker-compose up -d`\
2.1 You can view the log output with the command `docker-compose logs -f`
2.1 `UID_GID="$(id -u):$(id -g)"` sets the environments variable `UID_GID` for docker-compose. This is necessary for handling correct permissions. If you do not provide it, it will use `1000` for both as default. This default value will most likely fit your system, but not with certainty.
3. This brings up the app on Port 3000 - you may change this port in the docker-compose.yml file\
3.1. The first time you run this, it may take a (long) while\
3.2. If you like to start the containers detached, use command option `-d`\
3.3. You may run the app with a custom `settings.json`-File by adding it in the docker-compose file as `command`
4. The app is now available on **localhost:\<desired-port\>**, default [localhost:3000](http://localhost:3000).

## Building production images yourself
1. Clone the project
2. From your project root directory run `sudo docker build -f .docker/app/Dockerfile -t <your-custom-tag> .`

## Bringing up the productive application and self-build images automatically
1. Clone the project
2. From your project directory run `sudo docker-compose -f .docker/docker-compose.yml up --build`\
  2.1. If your local port 3000 is already in use, you can change it in `.docker/docker-compose.yml`\
  2.2. You may also start the containers detached by using the `-d` option. Beware: you then won't see any output from the containers; at least for the first start of the app it is recommended to start the containers in foreground
3. The app is now available on [localhost](http://localhost:3000)
