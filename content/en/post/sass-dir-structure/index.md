---
date: 2017-06-25T11:07:08-04:00
tags: []
title: Sass/Less directory structure
draft: true
---

There's tons of directory structure out there to build your sass/less project.

Mine is bit different.

~~~nohighlight
stylesheets/

|-- layout/              # Layout components
|   |-- __import.scss    # Include to get all components (__ = on top)
|   |-- _header.scss     # Compnent name
|   |-- _sidebar.scss    # Etc...
|   ...
|-- modules/             # Module components
|   |-- __import.scss    # Include to get all components
|   |-- _Button.scss     # Module name
|   |-- _Menu.scss     	 # Etc...
|   ...
|
|-- base/             # Partials
|   |-- _base.sass        # imports for all mixins + global project variables
~~~