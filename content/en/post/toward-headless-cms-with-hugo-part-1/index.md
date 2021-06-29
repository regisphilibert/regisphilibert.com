---
title: 'Toward using a Headless CMS with Hugo: Building Pages from Data'
date: 2021-06-24T08:32:27.000Z
disable_comments: true
_build:
  render: never
tags:
 - Hugo
 - Modules
 - Git
original: 
  url: https://www.thenewdynamic.com/article/toward-using-a-headless-cms-with-hugo-part-1/
  plateform: theNewDynamic
---

At The New Dynamic we love Hugo, the framework we use to build many of our websites. Through the years there has been no objective, no client request, no challenge we were not able to meet with this amazing tool. But there is one limitation that can be tedious to circumvent: Hugo cannot build distinct pages from data sources outside of individual files! No section of a site can be safely populated from an external API such as a headless CMS.

Over the course of this two part series, we'll get into details as we conceptually build a Monsterspotting website that will publish one page for each of its "file-less" monsters and a paginated listing page!