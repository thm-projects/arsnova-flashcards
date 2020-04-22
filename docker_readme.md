arsnova🍅cards - Docker Instructions
---

## Prerequisites
You must have Docker and Docker Compose installed. In most cases, Docker Compose is already included in Docker. Get it from [»here«](https://docs.docker.com/install).

## Getting started (fast)
You can start using arsnova.cards or linux.cards locally by just downloading and running a docker file. The app will then be available on [localhost](http://localhost).

Download your docker file:
- [arsnova.cards](.docker/docker-compose-cards.yml)
- [linux.cards](.docker/docker-compose-linux.yml)

Then run it with
```bash
sudo docker-compose -f <path-to-downloaded-file> up -d
```

No need to clone a repository or to build anything.

As a Linux User, you can also download and run the app in one step without downloading a file:
```bash
# for arsnova.cards
wget -qO- https://raw.githubusercontent.com/thm-projects/arsnova-flashcards/master/.docker/docker-compose-cards.yml  | sudo docker-compose -f - up -d

# for linux.cards
wget -qO- https://raw.githubusercontent.com/thm-projects/arsnova-flashcards/master/.docker/docker-compose-linux.yml  | sudo docker-compose -f - up -d
```

To stop the app temporary, run
```bash
sudo docker-compose -f <path-to-docker-compose-file> stop
```

To stop the app persistent, run
```bash
sudo docker-compose -f <path-to-docker-compose-file> down
```

For the Linux Users who run the app in one single step:
```bash
wget -qO- <choosen-url>  | sudo docker-compose -f - stop
# or
wget -qO- <choosen-url>  | sudo docker-compose -f - down
```

**The default port for the app is Port 80. If your Port 80 is already in use, you may configure the forwarded Port in the downloaded docker-compose.yml file.**

## Building production images yourself
1. Clone the project
2. From your project root directory run `sudo docker build -f .docker/app/Dockerfile -t <your-custom-tag> .`

## Build the proxy yourself
1. Clone the project
2. From your project root directory run `sudo docker build -t <your-custom-tag> .docker/proxy`

## Bringing up the application and self-build images automatically
1. Clone the project
2. From your project directory run `sudo docker-compose -f .docker/docker-compose.yml up -d --build`\
  2.1. If your local port 80 is already in use, you can change it in `.docker/docker-compose.yml`
3. The app is now available under [localhost](http://localhost)

## Developing with Docker
You can build and run the development version of cards with docker. Therefore you can use the standard Dockerfile in the projects root directory.
1. Clone the project
2. From your project directory run `sudo docker build -t <your-tag> .`
3. Then run the container with `sudo docker run -it -v $PWD:/usr/app -p <desired-port>:3000 <your-custom-tag>`\
  3.1. The first time you run this, it may take while\
  3.2. With the -v argument you share the host project directory with the docker container - this is important because otherwise you would have to rebuild the container after each change\
  3.3. If you like to start the container detached, use command option `-d` instead of `-it`\
  3.4. You may run the app with a custom `settings.json`-File via `sudo docker run -it -v $PWD:/usr/app -p <desired-port>:3000 <your-custom-tag> <custom-settings-file>`.
4. The app is now available under **localhost:\<desired-port\>**
