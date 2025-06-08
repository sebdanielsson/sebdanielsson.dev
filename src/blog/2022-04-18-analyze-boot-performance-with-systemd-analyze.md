---
title: Analyze Boot Performance with systemd-analyze
description: Learn how to analyze and optimize your Linux boot performance using systemd-analyze to identify bottlenecks and improve system startup times.
pubDate: '2022-04-18'
slug: analyze-boot-performance-with-systemd-analyze
tags: [linux, boot, performance, systemd, tutorial, guide]
heroImage: './images/server-rack.webp'
heroImageAlt: 'Rack mounted servers in a server room.'
author: Sebastian Danielsson
draft: false
---

systemd comes with a tool for analyzing boot times, called systemd-analyze.

<!--truncate-->

**Read more:** [plocate(1)](https://plocate.sesse.net/plocate.1.html), [plocate-build(8)](https://plocate.sesse.net/plocate-build.8.html), [updatedb(8)](https://plocate.sesse.net/updatedb.8.html), [updatedb.conf(5)](https://plocate.sesse.net/updatedb.conf.5.html)

## Update database

```shell
updatedb
```

## Check current boot time

```shell
systemd-analyze time
```

systemd will show the boot time for the kernel, all of the user space processes and the total boot time.

## List initialize time for all systemd units

```shell
systemd-analyze blame
```

Show start times for all processes. This helps you find bottlenecks in your boot process.
