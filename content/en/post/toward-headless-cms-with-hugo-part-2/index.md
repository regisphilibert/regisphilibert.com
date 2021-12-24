---
title: 'Building Pages from an API with Hugo'
date: 2021-12-20T08:32:27.000Z
disable_comments: true
_build:
  render: never
tags:
 - Hugo
 - API
original: 
  url: https://www.thenewdynamic.com/article/toward-using-a-headless-cms-with-hugo-part-2-building-from-remote-api
  plateform: theNewDynamic
---

In this article we cover a workarkound to build pages from a remote API wth Hugo. It consists of using Hugo to grab our data from a remote source using `resources.GetRemote` --- Hugo's own `fetch` API ---, keep using Hugo to generate markdown files using its `resources.FromString`, and finally build our Hugo project with the aforementioned content files.