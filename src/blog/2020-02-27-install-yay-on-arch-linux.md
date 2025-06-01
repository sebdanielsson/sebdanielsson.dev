---
title: Install yay on Arch Linux
description: Learn how to install yay, an AUR Helper that lets you install packages from the Arch User Repository using the same commands as pacman.
pubDate: '2020-02-27'
updatedDate: '2021-05-21'
slug: install-yay-on-arch-linux
tags: [yay, aur, aur helper, arch, linux, tutorial, guide]
heroImage: './images/yay.webp'
heroImageAlt: ""
---

This guide will walk through the steps for installing yay (Yet another Yogurt) which is an AUR Helper. This will let you install packages from the AUR (Arch User Repository) in the same way you install packages from the Arch Repo with pacman.

Update 2021-05-21:
There is a new AUR Helper that has got a lot of traction. It's called paru and works mostly the same but is written in Rust! [I have a guide for installing it as well](/install-paru-on-arch-linux).

<!--truncate-->

[yay - GitHub](https://github.com/Jguer/yay)

## Installation

Do not run `makepkg -si` as root.

```shell
pacman -S git binutils make gcc fakeroot
git clone https://aur.archlinux.org/yay-bin.git
cd yay-bin
makepkg -si
```

## Usage

| Command      | Function                                                             |
| ------------ | -------------------------------------------------------------------- |
| yay -Ss foo  | Searches for package foo on the repos or the AUR.                    |
| yay -Si foo  | Get information about a package.                                     |
| yay -S foo   | Installs package foo from the repos or the AUR.                      |
| yay -Rns foo | Remove package, its dependencies and config files.                   |
| yay -Syu     | Update package list and upgrade all installed repo and AUR packages. |
| yay -Sua     | Update all currently installed AUR packages.                         |
| yay -Qua     | Print available AUR updates.                                         |
| yay -Yc      | Uninstall unneeded dependencies.                                     |
