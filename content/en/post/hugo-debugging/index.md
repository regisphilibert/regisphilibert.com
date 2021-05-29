---
title: "Debugging in Hugo"
date: 2018-01-09T17:21:05-05:00
draft: true
---

It is not really easy to debug in Hugo. There is not as of now a nice way to output the content of an object. What the Doc recommands is this:

~~~go
{{ printf "%#v" $whatever }}
~~~

Now this will output a string just fine, but an Object... not so much.

What can help is to create a debug.html layout in your themes `layout/_default/debug.html`
in it you add those ugly printf on the . or the .Site or whatever you might need to glance at on a particular page or post.
Then all you have to do to check those information is to briefly and locally set the layout to your post' front matter like this:

~~~yaml
title: "Debugging in Hugo"
date: 2018-01-09T17:21:05-05:00
draft: true

layout: debug
~~~