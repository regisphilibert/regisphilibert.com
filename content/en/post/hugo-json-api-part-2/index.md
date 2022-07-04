---
title: "Enhance Your Hugo JSON API Using Custom Output Formats and Netlify Redirects"
date: 2018-05-25T08:32:27.000Z
disable_comments: true
_build:
  render: never
tags:
 - Hugo
 - API
 - Output Formats
original: 
  url: https://forestry.io/blog/hugo-json-api-part-2/
  platform: forestry.io
---

Hugo makes it super easy to build simple APIs with its built-in output formats. In [my previous article](https://forestry.io/blog/build-a-json-api-with-hugo/), we built a fully functional JSON API. Today we’re going to extend the capabilities of this API and improve the user experience with better URLs.

At the moment our API can look up specific items, but can’t look at them in relation to each other. Say you want to know what players are in a specific team: with our current API, you can’t do that easily. To solve this, we’ll use Custom Output Formats to create another JSON route to read and use these relationships.