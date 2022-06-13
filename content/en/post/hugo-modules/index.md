---
title: 'Hugo Modules: everything you need to know!'
date: 2020-08-30T17:28:14-04:00
disable_comments: true
_build:
  render: never
tags:
 - Hugo
 - Modules
 - Git
original: 
  url: https://www.thenewdynamic.com/article/hugo-modules-everything-from-imports-to-create/
  plateform: theNewDynamic
---

Back in July 2019 Hugo 0.56.0 introduced a powerful Module system. Pretty much like any package solution it allowed any Hugo project defined as a Module, be it a full website or a theme or a component to use any files stored on a repository somewhere and mount it as its own. It also enabled any Hugo project to become a full fledge Hugo Modules with its own config and dependencies which any other project could mount.

In this article, we’ll see how any Hugo project can use files stored on a distant repository and make them its own using the Module imports and mounts logic. Then, we’ll dive into what exactly constitute a Hugo Module by creating our own!
