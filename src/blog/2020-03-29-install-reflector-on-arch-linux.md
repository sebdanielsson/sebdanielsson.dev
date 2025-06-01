---
title: Install Reflector on Arch Linux
description: Learn to install and set up Reflector, a Python tool that automatically updates your Arch Linux mirrorlist for faster package downloads.
pubDate: '2020-03-29'
slug: install-reflector-on-arch-linux
tags: [reflector, pacman, mirrors, python, arch, linux, tutorial, guide]
heroImage: '../src/assets/blog/server-rack.webp'
---

Reflector is a small Python3 script that sort through the Arch Linux mirrors based on parameters of your choice and updates your mirrorlist.

<!--truncate-->

**_More info:_** [Reflector - ArchWiki](https://wiki.archlinux.org/index.php/Reflector) | [Project website - xyne](https://xyne.archlinux.ca/projects/reflector/)

## Installation

```shell
pacman -S reflector
```

## Usage

`reflector --help` will show you the available commands and their options.

The following command will update your mirrorlist with the 50 fastest mirrors that have support for both HTTPS and IPV6.

```shell
reflector --verbose --completion-percent 100 --ipv6 --protocol https --score 50 --sort rate --save /etc/pacman.d/mirrorlist
```

## Service

Reflector can run automatically in the background at chosen intervalls. The default timer will run reflector once a week.

If you want the options from the example earlier make the following changes.

```plaintext title="/etc/xdg/reflector/reflector.conf"
--save /etc/pacman.d/mirrorlist
--completion-percent 100
--protocol https
--ipv6
--score 50
--sort rate
```

```shell
systemctl enable reflector.timer
systemctl start reflector.timer
systemctl start reflector.service
```
