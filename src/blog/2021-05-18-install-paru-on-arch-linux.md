---
title: Install paru on Arch Linux
description: Learn how to install paru, the newest AUR helper written in Rust that lets you install packages from the Arch User Repository with the same ease as pacman.
pubDate: '2021-05-18'
slug: install-paru-on-arch-linux
tags: [paru, aur, aur helper, rust, arch, linux, tutorial, guide]
heroImage: '../src/assets/blog/server-rack.webp'
---

Paru is the newest and hottest AUR Helper. From one of the developers of yay and written is Rust this project has gained a lot of traction in the Arch commuinty. This guide will walk you through the steps for installing this AUR Helper which lets you install packages from the AUR (Arch User Repository) in the same way you install packages from the Arch repos with pacman.

<!--truncate-->

**Read more:** [paru - GitHub](https://github.com/Morganamilo/paru)

## Installation

```shell
pacman -S --needed base-devel
git clone https://aur.archlinux.org/paru.git
cd paru
makepkg -si
```

## Usage

| Command      | Function                                                             |
| ------------ | -------------------------------------------------------------------- |
| paru -Ss foo | Searches for package foo on the repos or the AUR.                    |
| paru -Si foo | Get information about a package.                                     |
| paru -S foo  | Installs package foo from the repos or the AUR.                      |
| paru -d foo  | Remove a package from the local repo.                                |
| paru -Syu    | Update package list and upgrade all installed repo and AUR packages. |
| paru -Sua    | Update all currently installed AUR packages.                         |
| paru -Qua    | Print available AUR updates.                                         |
| paru -c      | Uninstall unneeded dependencies.                                     |
