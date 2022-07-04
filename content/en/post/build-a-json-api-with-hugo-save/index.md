---
title: "Build a JSON API With Hugo's Custom Output Formats"
date: 2018-04-13T08:32:27.000Z
draft: true
disable_comments: true
_build:
  render: never
tags:
 - Hugo
 - API
 - Output Formats
original: 
  url: https://forestry.io/blog/build-a-json-api-with-hugo/
  platform: forestry.io
---

In order to make data that is “machine friendly” like this, we can expose it with a RESTful API. Normally, the quickest way to bootstrap an API like this would be to start with a popular framework like Flask or Ruby on Rails, spin up a webserver, and connect a database. We can achieve something even simpler, however, by creating a read-only API with a static site generator. In this article, we’ll use Hugo to build a JSON API using its Custom Output Formats feature.