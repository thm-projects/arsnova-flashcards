arsnova🍅cards - Docker Instructions
---

## Prerequisites
You must have Docker and Docker Compose installed. In most cases, Docker Compose is already included in Docker. Get it from here: [https://docs.docker.com/install/](https://docs.docker.com/install).

## Getting started fast
You can start using arsnova.cards locally by just running the following command:
```
wget -qO- https://raw.githubusercontent.com/thm-projects/arsnova-flashcards/master/.docker/docker-compose-cards.yml  | sudo docker-compose -f - up -d
```

or linux.cards by running:
```
wget -qO- https://raw.githubusercontent.com/thm-projects/arsnova-flashcards/master/.docker/docker-compose-linux.yml | sudo docker-compose -f - up -d
```

No need to clone a repository or to build anything.

## Building production images yourself
1. Clone the project  
2. From your project root directory run `sudo docker build -f .docker/app/Dockerfile -t <your-custom-tag> .`  

## Build the proxy yourself
1. Clone the project  
2. From your project root directory run `(cd .docker/proxy && sudo docker build -t <your-custom-tag> .)`  

## Bringing up the application and self-build images automatically
1. Clone the project  
2. From your project directory run `sudo docker-compose -f .docker/docker-compose.yml up -d --build`  
  2.1. If your local port 8080 is already in use, you can change it in `.docker/docker-compose.yml`  
3. The app is now available under **localhost:8080**

## Developing with Docker
You can build and run the development version of cards with docker. Therefore you can use the standard Dockerfile in the projects root directory.
1. Clone the project  
2. From your project directory run `sudo docker build -t <your-tag> .`  
3. Then run the container with `sudo docker run -d -p <desired-port>:3000 <your-custom-tag>`  
4. The app is now available under **localhost:\<desired-port\>**  

## Managing running containers
### docker-compose
If you have brought your app up with docker-compose, you can bring it down again with `docker-compose -f <your-used-file> down`. For example, if you have used the hosted docker-compose file, you may run:

```
wget -qO- <url-to-hosted-file>  | sudo docker-compose -f - down
```

### docker
You may start and stop containers by their ids. List your containers with `sudo docker container ls`. Then you can use `sudo docker [start|stop] <container-id>`.
