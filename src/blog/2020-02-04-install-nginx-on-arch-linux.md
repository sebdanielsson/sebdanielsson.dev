---
title: Install NGINX on Arch Linux
description: Step-by-step guide to installing NGINX with HTTP/2 and Let's Encrypt TLS certificates on Arch Linux, including automatic certificate renewal.
pubDate: '2020-02-04'
slug: install-nginx-on-arch-linux
tags: [nginx, reverse proxy, arch, linux, tutorial, guide]
heroImage: './images/nginx.webp'
heroImageAlt: 'NGINX logo.'
author: Sebastian Danielsson
draft: false
---

Fast and easy tutorial for installing a NGINX web server with HTTP/2 and TLS certificates from Let's Encrypt on Arch Linux.

<!--truncate-->

## Installation

```shell
pacman -S nginx-mainline certbot certbot-nginx
```

The default page served at [http://127.0.0.1](http://127.0.0.1) is located at `/usr/share/nginx/html/index.html`.

## Configuration

DigitalOcean has provided a tool for configuring your web server over at [nginxconfig.io](https://nginxconfig.io), use it and follow the instructions to create a site. Then proceed with the instructions below.

### Disable the default site

If you want to disable the default site and create a new one, instead of adding your site to the default webroot, you can disable it by removing the symlink.

```shell
rm /etc/nginx/sites-enabled/default
```

## Automatically renew the certificates

### Create a systemd service

```systemd title="/etc/systemd/system/certbot.service"
[Unit]
Description=Let’s Encrypt renewal

[Service]
Type=oneshot
ExecStart=/usr/bin/certbot renew —quiet —agree-tos —deploy-hook “systemctl reload nginx.service”
```

### Create a timer

Make it run twice a day at random times to help reduce load on Let's Encrypt servers

```systemd title="/etc/systemd/system/certbot.timer"
[Unit]
Description=Twice daily renewal of Let’s Encrypt’s certificates

[Timer]
OnCalendar=0/12:00:00
RandomizedDelaySec=1h
Persistent=true

[Install]
WantedBy=timers.target
```

### Start and enable the service

```shell
systemctl start certbot.timer
systemctl enable certbot.timer
```

## Run NGINX

```shell
systemctl start nginx
systemctl enable nginx
```

## Live

Your website should now be live at [https://yourdomain.com](https://yourdomain.com).
