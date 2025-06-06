---
title: Get started with Docker
description: "Beginner's guide to Docker: install, pull images, run containers, and manage with Docker Compose."
pubDate: '2020-05-30'
slug: get-started-with-docker
tags: [docker, container, arch, linux, tutorial, guide]
heroImage: './images/docker.webp'
heroImageAlt: ''
author: Sebastian Danielsson
draft: false
---

I just tried out Docker for a small project and now I get all the hype around it. While searching for good guides I stumbled upon this excellent tutorial by [Prakhar Srivastav](https://prakhar.me): [A Docker Tutorial for Beginners](https://docker-curriculum.com). If you want a deeper understanding of Docker and how it works, and not only how to spin up a container and leave it running, I highly recommend reading it. He also go through the basics of writing your own Docker image which helped me a lot.

<!--truncate-->

## Documentation

- [Docker Documentation - Docker Engine](https://docs.docker.com/engine/)
- [Docker Documentation - Docker Compose](https://docs.docker.com/compose/)
- [ArchWiki - Docker](https://wiki.archlinux.org/title/Docker)

## Install

```shell
pacman -Syu docker docker-compose
systemctl start docker
systemctl enable docker
docker info
```

## Usage

| Function                                                    | Command                                                                                                                                                                                        |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pull image                                                  | docker pull `image`                                                                                                                                                                            |
| Remove image                                                | docker image rm `image`                                                                                                                                                                        |
| List images                                                 | docker image ls                                                                                                                                                                                |
| Run container                                               | docker run --name `container` `options` `image`                                                                                                                                                |
| List containers                                             | docker container ls                                                                                                                                                                            |
| Stop container                                              | docker container stop `container`                                                                                                                                                              |
| Remove container                                            | docker container rm `container`                                                                                                                                                                |
| Remove inactive containers                                  | docker container prune                                                                                                                                                                         |
| Switch to container shell                                   | docker exec -ti `container` /bin/sh                                                                                                                                                            |
| Exit container shell                                        | exit                                                                                                                                                                                           |
| Build image                                                 | docker build --no-cache -t `username`/`image`:`tag` .                                                                                                                                          |
| Delete stopped containers, networks, images and build cache | docker system prune -a                                                                                                                                                                         |
| Delete dangling volumes                                     | docker volume prune                                                                                                                                                                            |
| Rename volume                                               | docker volume create --name `new_volume` && <br/> docker run --rm -it -v `old_volume`:/from -v `new_volume`:/to alpine ash -c "cd /from ; cp -av . /to" && <br/> docker volume rm `old_volume` |

### Docker Compose update images

If you're using Docker compose and want to update the images to the latest versions you can run the following when in the same directroy as `docker-compose.yaml`

```shell
docker-compose up --force-recreate --build -d
docker image prune -f
```
