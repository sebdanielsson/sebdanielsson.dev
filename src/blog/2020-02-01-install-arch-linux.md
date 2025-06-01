---
title: Install Arch Linux
description: Step-by-step guide to installing Arch Linux on x86-64 UEFI systems, covering partitioning, setup, configuration, and first boot.
pubDate: '2020-02-01'
slug: install-arch-linux
tags: [arch, linux, install, tutorial, guide]
heroImage: './images/arch-linux.webp'
heroImageAlt: ''
---

This is my personal step-by-step guide for installing Arch Linux on x86-64 UEFI based machines. This guide is a slimmed down and simplified version of the [Installation guide](https://wiki.archlinux.org/index.php/Installation_guide) on ArchWiki.

<!--truncate-->

## Pre-installation

Keyboard layout

```shell
loadkeys sv-latin1
```

**_More info:_** [console keymap](https://wiki.archlinux.org/index.php/Console_keymap)

Pacman mirrors

Edit `/etc/pacman.d/mirrorlist` and uncomment a couple of nearby mirrors.

**_More info:_** [mirrorlist](https://wiki.archlinux.org/index.php/Mirrors)

Verify the boot mode

```shell
ls /sys/firmware/efi/efivars
```

"Stuff" should show up.

**_More info:_** [efivars](https://wiki.archlinux.org/index.php/UEFI#UEFI_variables)

Test internet connection

```shell
ping -c 3 archlinux.org
```

**_More info:_** [ping](https://wiki.archlinux.org/index.php/Network_configuration#Check_the_connection)

Update the system clock

```shell
timedatectl set-ntp true
```

**_More info:_** [timedatectl(1)](https://jlk.fjfi.cvut.cz/arch/manpages/man/timedatectl.1)

Create and format partitions

Find your drive

```shell
fdisk -l
```

**_More info:_** [fdisk](https://wiki.archlinux.org/index.php/Fdisk)

Wipe the drive

```shell
shred --verbose --random-source=/dev/urandom --iterations=1 /dev/`yourdrive`
```

`yourdrive` should be replaced with your storage device, e.g. `sda`.

**_More info:_** [shred](https://wiki.archlinux.org/index.php/Securely_wipe_disk#shred)

Create a boot and root partition

```shell
cfdisk /dev/`yourdrive`
```

**_More info:_** [fdisk](https://wiki.archlinux.org/index.php/Fdisk) | [cfdisk](https://jlk.fjfi.cvut.cz/arch/manpages/man/cfdisk.8) | [partitioning](https://wiki.archlinux.org/index.php/Partitioning)

- Partition table: GPT
- New → Partition Size: 512 MiB → EFI System
- New → Partition Size: xxxG → Linux Filesystem

List your partitions

```shell
fdisk -l `yourdrive`
```

Format the partitions

```shell
mkfs.fat -F32 /dev/`efipartition`
mkfs.ext4 /dev/`rootpartition`
```

**_More info:_** [filesystems](https://wiki.archlinux.org/index.php/File_systems#Types_of_file_systems) | [mkfs.fat](https://jlk.fjfi.cvut.cz/arch/manpages/man/mkfs.fat.8.en) | [mkfs.ext4](https://jlk.fjfi.cvut.cz/arch/manpages/man/mke2fs.8)

Mount the partitions

```shell
mount /dev/`rootpartition` /mnt
mkdir /mnt/boot
mount /dev/`efipartition` /mnt/boot
```

**_More info:_** [mount](https://wiki.archlinux.org/index.php/Mount)

## Installation

```shell
pacstrap /mnt base base-devel linux linux-firmware dhcpcd efibootmgr grub inetutils lvm2 man-db man-pages nano netctl sudo sysfsutils texinfo usbutils vi which
```

**_More info:_** [pacstrap](https://projects.archlinux.org/arch-install-scripts.git/tree/pacstrap.in) | [base](https://www.archlinux.org/groups/x86_64/base/) | [base-devel](https://www.archlinux.org/groups/x86_64/base-devel/)

## Configure the system

Fstab

```shell
genfstab -U /mnt >> /mnt/etc/fstab
```

**_More info:_** [fstab](https://wiki.archlinux.org/index.php/Fstab)

Chroot

This will change the root directory to our new installation.

```shell
arch-chroot /mnt
```

**_More info:_** [chroot](https://wiki.archlinux.org/index.php/Change_root)

Time

Set time zone

```shell
ln -sf /usr/share/zoneinfo/Europe/Stockholm /etc/localtime
```

**_More info:_** [time zone](https://wiki.archlinux.org/index.php/Time_zone)

Set the hardware clock

```shell
hwclock --systohc --utc
```

**_More info:_** [hwclock](https://jlk.fjfi.cvut.cz/arch/manpages/man/hwclock.8)

Localization

Generate locales

Edit `/etc/locale.gen` and uncomment `en_US.UTF-8 UTF-8`.

```shell
locale-gen
```

**_More info:_** [localizations](https://wiki.archlinux.org/index.php/Localization)

Set system language

```shell title="/etc/locale.conf"
LANG=en_US.UTF-8
```

**_More info:_** [locale.conf](https://jlk.fjfi.cvut.cz/arch/manpages/man/locale.conf.5)

Set keyboard layout

For a Swedish keyboard layout, the file should contain: `KEYMAP=sv-latin1`.

```shell title="/etc/vconsole.conf"
KEYMAP=sv-latin1
```

**_More info:_** [vconsole.conf](https://jlk.fjfi.cvut.cz/arch/manpages/man/vconsole.conf.5)

Network

Hostname

This file should only contain the hostname for this device

```shell title="/etc/hostname"
yourhostname
```

**_More info:_** [hostname](https://wiki.archlinux.org/index.php/Hostname)

Hosts

```shell title="/etc/hosts"
127.0.0.1 localhost
::1 localhost
127.0.1.1 myhostname.localdomain myhostname
```

- Change `hostname` to your hostname
- If this system has a public IP address, it should be used instead of `127.0.1.1`

**_More info:_** [hosts(5)](https://jlk.fjfi.cvut.cz/arch/manpages/man/hosts.5)

DHCP

To get network access we need to enable `dhcpcd.service`.

```shell
systemctl enable dhcpcd.service
```

**_More info:_** [network managers](https://wiki.archlinux.org/index.php/Network_configuration#Network_managers) | [dhcpcd](https://wiki.archlinux.org/index.php/Dhcpcd)

Root password

```shell
passwd
```

**_More info:_** [password](https://wiki.archlinux.org/index.php/Password)

Bootloader

```shell
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=arch_grub
```

**_More info:_** [GRUB](https://wiki.archlinux.org/index.php/GRUB) | [UEFI](https://wiki.archlinux.org/index.php/Unified_Extensible_Firmware_Interface) | [grub](https://www.archlinux.org/packages/?name=grub) | [efibootmgr](https://www.archlinux.org/packages/?name=efibootmgr)

Microcode

Depending on your CPU you need to install the latest microcode.

```shell
pacman -S <intel-ucode or amd-ucode>
```

**_More info:_** [Microcode](https://wiki.archlinux.org/index.php/Microcode) | [intel-ucode](https://www.archlinux.org/packages/?name=intel-ucode) | [amd-ucode](https://www.archlinux.org/packages/?name=amd-ucode)

GRUB

```shell
grub-mkconfig -o /boot/grub/grub.cfg
```

**_More info:_** [GRUB](https://wiki.archlinux.org/index.php/GRUB)

Exit chroot

```shell
exit
```

## Finish

Reboot

Reboot your system and remove your installation media.

```shell
reboot
```
