---
date: 2017-04-03T10:13:39-05:00
lastmod: 2018-08-29T10:09:47-05:00
aliases:
 - /2017/04/hugo-scratch-explained-variable
tags:
 - Hugo
 - Scratch
 - Variables
 - Go Template
title: Hugo .Scratch explained
slug: hugo-scratch-explained-variable
description: Working variables in Hugo can be complicated when coming from classic languages. For a long time, Scratch was the only way to overwrite template variables. Now it is the best way to enrich your Page or Shortcode context!
---

{{% notice %}}
Here because you need to overwrite a template variable? Rejoice, as of this day (or [Hugo .48](https://gohugo.io/news/0.48-relnotes/)), you don't need `.Scratch` for that. 
__You need it for so much more though!__
{{% /notice %}}

Hugo Page's context is not only the most important source of information for your pages, it is the main data soure for all of your templates. More often than not, you will need to add a layer of custom variables to the built in set!

With Hugo's __.Scratch__, any Page or Shortcode can be complemented with as many variables as needed on top of the default [Page](https://gohugo.io/variables/page/#readout) or [Shortcode](https://gohugo.io/variables/shortcodes/#readout) Variables.


Excited yet? Let's dive in!

<!--more-->

## What is Scratch?

Scratch was initially added as a workardound to fight a Go Template [limitation](https://github.com/golang/go/issues/10608) which prevented variable overwrites. It quickly turned into a full fledge Hugo feature which comes with serveral methods.

{{< notice >}}
To improve readability, the following snippets show comments uncomplient with Go Template. See the [doc](http://gohugo.io/templates/introduction/#comments) for proper commenting in Hugo.
{{</ notice >}}

### .Scratch.Set

You use *Set* to store a value and maybe later perform a simple overwrite. 

~~~go-html-template
{{ .Scratch.Set "greetings" "Good Morning" }}
{{ if eq $sky "dark" }}
	{{ .Scratch.Set "greetings" "Good Night" }}
{{ end }}

{{ .Scratch.Get "greetings"}}
~~~

### .Scratch.Add

This will deal with adding or pushing multiple values to the same variable or key.

~~~go-html-template
{{ .Scratch.Add "greetings" "Hello" }}
{{ .Scratch.Add "greetings" "Goodbye" }}

{{ .Scratch.Get "greetings" }}
// ☝️ Will output : HelloGoodbye
~~~

Using add with _slice_, will append one or more values to an array/slice.

~~~go-html-template
{{ .Scratch.Add "greetings" (slice "Hello") }}
{{ .Scratch.Add "greetings" (slice "Goodbye") }}
{{ .Scratch.Add "greetings" (slice "Aloha" "Buenos dias") }}
~~~

### .Scratch.Get

Now to get it.

~~~go-html-template
// With range
{{ range where .Scratch.Get "greetings" }}
<ol>
	<li>
		{{ . }}
	</li>
</ol>
{{ end }}
// ☝️  Will output that ordered list with our 4 greetings.

// Using delimit
{{ delimit (.Scratch.Get "greetings"), ", " }}
// ☝️  Will output Hello, Goodbye, Aloha, Buenos dias

~~~ 

### .Scratch.Delete[^1]


This removes the key/value pair from the context.
When using `.Scratch.Add` from within in a loop, `.Scratch.Delete` comes handy to reset a value.

~~~go-html-template
{{ .Scratch.Delete "greetings" }}
~~~

### newScratch[^2]

This is not a Scratch method but a template function which allows for the creation of a local Scratch instance.

~~~go-html-template
{{ $headerScratch := newScratch }}
{{ $headerScratch.Add "brand_image" .Params.image }}
~~~

## Working with arrays or maps

### .Scratch.SetInMap

This one allows to target a key from inside an array and assign it a new value. First parameter is your .Scratch key, second parameter is the key from within the array or map and the third one is your value.

<small>If you don't know about [dict](https://gohugo.io/functions/dict/#readout) I explain about it [here]({{< ref "hugo-translator/index.md#associative-arrays" >}})</small>

~~~go-html-template
{{ .Scratch.Add "greetings" (dict "english" "Hello" "french" "Bonjour") }}

{{ .Scratch.SetInMap "greetings" "english" "Howdy 🤠" }}

// We changed the english greeting from Hello to Howdy 🤠!
~~~


## Watch out for scope and context...

.Scratch is for the page object or the shortcode object. You cannot use it on any other element. 

Remember that if you are inside a range on your index page, then your index page's .Scratch will be __$.Scratch__ while the page you are currently rangeing on, will be __.Scratch__. 

Also remember that you can attach a key/value to .Scratch from anywhere, even whithin a partial as long as your passed the context to it. Whaaaaat? Let's use a practical scenario to walk though the perilous path of context and .Scratch

### .Scratch with class, a use case.

I find it convenient to attach classes to my body element (You from Wordpress?) to allow CSS/JavaScript adjustments according to which page we're on.

I found this to be very tedious to achieve with Hugo until I understood .Scratch.

What I want to do is add "rp-body" CSS class to all my pages as well as the .Section value to my classes.

Also only the home page should have the "rp-home" class. 

I could do that work once, in the partial or template which includes the opening body tag but... I may need that list of classes elsewhere in my code for some ajax magic. Say as a JavaScript object. 

How do I build this list, modify it if I'm on the home page, and store it to my .Page object for future use ? We'll store our classes in a array for convenience.

~~~go-html-template
// Before my body tag I can store my first and universal class.
{{ .Scratch.Add "classes" (slice "rp-body") }}

// Then my section. That printf allows me to to prepend the .Section Value with my prefix.
{{ .Scratch.Add "classes" (slice (printf "rp-%s" .Section))) }}

// Now is this the home page ?
{{ if .IsHome }}
	{{ .Scratch.Add "classes" (slice "rp-home") }}
{{end}}

// Is this a holyday? 🎄
{{ if isset .Site.Params "season" }}
	{{ .Scratch.Add "classes" (slice (printf "rp-body--%s" .Site.Params.season))) }}
{{ end }}
~~~
We could perform a lot more checking and scratching but eventually, in our layout we drop this beauty:
~~~go-html-template
<body class='{{ delimit (.Scratch.Get "classes") " " }}'>
~~~

And for JavaScript we can create our object anywhere needed.

~~~go-html-template
<script>
	let bodyClasses = [{{ range .Scratch.Get "classes" }}"{{ . }}", {{end}}];
</script>
~~~

Good use case, let's keep walking.

### *.Scratch* from within a partial

As I explained earlier, because .Scratch is part of the page object usually passed on as context to partials ([yeah that dot]({{< ref "hugo-context" >}})), you could, for readability/refactoring purposes, decide to wrap all the classname scratching from above inside a partial like so:

~~~go-html-template
// partials/scratching/body_classes.html
{{ .Scratch.Add "classes" (slice "rp-body") }}
[... blah blah blah same as above ...]
~~~
And in my layout file:
~~~go-html-template
{{ partial "scratching/body_classes.html" . }}
<body class='{{ delimit (.Scratch.Get "classes") " " }}'>
[...]
~~~

The page's .Scratch has been passed along to the partial with its context, so you can play with it from whithin, and still have it ready for the code outside the partial. Plus that's a clean layout file!

### *.Scratch* from inside a partial from inside a range 🤯
Once your inside a range, you cannot, as with partials, pass on a defined context, you end up with the context of the range, which is the behaviour you want.

~~~go-html-template
{{ .Scratch.Set "section_color" }}
{{ range where .Data.Pages}}
    <h2>{{ .Title }}</h2>
    <div class="Child Child--{{ $.Scratch.Get section_color}}">
    [...]
    <div>
{{ end }}
// Will  display that section_color.
// But...
{{ range where .Data.Pages }}
    {{ partial "child.html" . }}
{{ end }}
// The child.html partial won't be able to retrieve the index page .Scratch even though the . was passed along...
~~~

That is because the context you passed along the partial is the range context, the page your cursor is currently at, and not, as you could expect the __list__ page whose template your are coding on.

OK! But I still need to use the root page's .Scratch. from whithin this partial...

Well, you could pass along the root page's .Scratch after having stored it in a variable.
~~~go-html-template
{{ $indexScratch := .Scratch }}
{{ range where .Data.Pages }}
    {{ partial "child.html" $indexScratch }}
{{ end }}
~~~
And inside that partial
~~~go-html-template
<div class="Child Child--{{ .Get "section_color" }}">
[...]
<div>
~~~

And if you also need the context of the page you are rangeing on, then use dict
~~~go-html-template
{{ $indexScratch := .Scratch }}
{{ range where .Data.Pages }}
    {{ partial "child.html" (dict "indexScratch" $indexScratch "page" .) }}
{{ end }}
~~~
And inside that partial
~~~go-html-template
<div class="Child Child--{{ .indexScratch.Get section_color}}">
	{{ .page.Content }}
<div>
~~~


{{< notice >}}
For a more indepth look at handling __Context__ and __partials__ in  Go Template see [this piece]({{< ref "hugo-context" >}}).
{{</ notice >}}

### *.Scratch* within a partial without a Page context 

All of the above is important shall you need to access a Scratch instance attached to your page context, but with the addition of `newScratch`[^2], you can now use Scratch from anywhere, including a partial without a Page context.

Let's call a partial. Notice we don't pass any Page context, just a map from the Front Matter which holds `class`, `alt` and a potential `image_src` to overwrite our default.
~~~go-html-template
{{ partial "brand" .Params.brand }}
~~~
From within our partial, we can still use Scratch:
~~~go-html-template
{{ $brandScratch := newScratch }}
{{ $brandScratch.Set "brand_image" "default.jpg" }}
{{ with .image_src }}
	{{ $brandScratch.Set "brand_image" "." }}
{{ end }}
<div class="brand {{ .class }}">
	<img src="{{ $brandScratch.Get "brand_image" }}" alt="{{ .alt }}" />
</div>
~~~

## .Scratch after Go 1.11 
Yes, the Golang did roll out version 11 and we are now able to natively overwrite variables in Go Template but...

In many use case, I find storing a value in the Page context more helpful than not. 
For example, when using a `partial` in need of the Page Variables plus other informations, if you were to forego of `.Scratch`, you'd get stuck with a lengthy `dict` as context...

### Without .Scratch
~~~go-html-template
{{ $mood := "Happy" }}
{{ if $rain }}
	{{ $mood = "Grumpy" }}
{{ end }}
{{ partial "snowwhite/dwarf.html" (dict "mood" $mood "page" . ) }}
~~~

Using `.Scratch` to store your variable in the Page object, maintain both cleanlyness and reusability.

### With .Scratch
~~~go-html-template
{{ .Scratch.Set "mood" "Happy" }}
{{ if $rain }}
	{{ .Scratch.Set "mood" "Grumpy" }}
{{ end }}
{{ partial "snowwhite/dwarf.html" . }}
~~~

Beside, I don't think meddling with complex maps could be as convenient as it currently is with __.Scratch.SetInMap__!


[^1]: Since [Hugo 0.38](https://gohugo.io/news/0.38-relnotes/)
[^2]: Since [Hugo 0.43](https://gohugo.io/news/0.43-relnotes/)
