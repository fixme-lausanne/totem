# Web Manager

The Web Manager is currenly written with Meteor. Thus said, a Dockerfile is avaiable to run it with Docker.

## Meteor

- https://www.meteor.com/install

## Run with Docker

You may need to install [Docker Compose](https://docs.docker.com/compose/install/).

Then build the image and run it:

```shell
docker build -t fixme-lausanne/totem . # build the Docker image
docker-compose up # add -d to run it in daemon mode 
```
