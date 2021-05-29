---
date: 2017-04-03T10:13:39-04:00
lastmod: 2018-01-12T10:13:39-04:00
draft: true
title: "Hugo .Scratch explained [revision-0]"
slug: hugo-scratch-explained-variable-rev-0
description: Working variables in Hugo can be complicated when coming from classic languages. The only way to override variables or attach any kind of value to a .Page object is to use .Scratch.
---

Working variables in Hugo can be complicated when coming from classic languages.

What you usually do :

~~~php
$greetings = "Good Morning";
if($sky == "dark"){
	$greetings = "Good Night";
}
// Or even better:
$greetings = $sky == "dark" ? "Good Night : Good Morning";

~~~

That next bit of code would be tempting :
~~~go
{{ $greetings := "Good Morning" }}
{{ if eq $sky "dark" }}
	{{ $greetings := "Good Night" }}
{{ end }}
{{ $greetings }}
~~~

But that won't happen 😞

The only way to override variables or attach any kind of value to a *.Page* object is to use *.Scratch* 

.Scratch is a life saver but its [documentation](https://gohugo.io/extras/scratch/) is a bit light if, like me, you are not comfortable with the Go language.

Here is my take about **Hugo's .Scratch** and how it can help you.
<!--more-->
## We need .Scratch!

.Scratch was added to manage just that and more. It comes with several methods.

### .Scratch.Set

You use *Set* to store a value and maybe later perform a simple override. 
Taking our PHP exemple above, we'd have something like that:

~~~go
{{ .Scratch.Set "greetings" "Good Morning" }}
{{ if eq $sky "dark" }}
	{{ .Scratch.Set "greetings" "Good Night" }}
{{ end }}

{{ .Scratch.Get "greetings"}}
~~~

### .Scratch.Add

This will deal with adding or pushing multiple value to the same variable or key.

~~~go
//For strings.
{{ .Scratch.Add "greetings" "hello" }}
{{ .Scratch.Add "greetings" "goodbye" }}

{{ .Scratch.Get "greetings" }}
//Will output : hellogoodbye
~~~

Using add with _slice_, will append one or more values to an array/slice.

~~~go
{{ .Scratch.Add "greetings" (slice "hello") }}
{{ .Scratch.Add "greetings" (slice "goodbye") }}
{{ .Scratch.Add "greetings" (slice "aloha" "buenos dias") }}
~~~

### .Scratch.Get

Now to get it.

~~~go
//With range
{{ range .Scratch.Get "greetings" }}
<ol>
	<li>
		{{ . }}
	</li>
</ol>
{{ end }}
//Will output that ordered list with our 4 greetings.

//Or with delimit
{{ delimit (.Scratch.Get "greetings"), ", " }}
//Will output : hello, goodbye, aloha, buenos dias
~~~ 


## Watch out for scope...

.Scratch is for the page objet or the shortcode object. You cannot use it on any other element. 

Say if you are in the middle of a "range" on say some terms or menu items, .Scratch is not going to help you. 

I would love to think as .Scratch as a universal way to attach variables to any kind of Go Template objects but we're not there yet.

Remember that if you are inside a range on your index page, then your index page's Scratch will be $.Scratch while the page you are currently rangeing on, will be .Scratch. 

## A bit of context

I find it convenient to attach classes to my body element to allow css/javascript adjustments according to context.

I found this to be very tedious to achieve with Hugo until I understood .Scratch.

What I want to do is add "rp-body" css class to all my pages as well as the .Section value to my classes.

Also only the home page should have the "rp-home" class. 

I could do that work once, in the partial or template which includes the opening body tag but... I may need that list of classes elsewhere in my code for some ajax magic. Say as a javascript object. 

How do I build this list, modify it if I'm on the home page, and store it to my .Page object for future use ?

~~~go
//Before my body tag I can store my first and universal class.
{{ .Scratch.Add "classes" (slice "rp-body") }}

//Then my section. That printf allows me to to prepend the .Section Value with my prefix.
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
We could perform a lot more checking and scratching but eventually, in our layout we drop that beauty:
~~~go
<body class='{{ delimit (.Scratch.Get "classes") " " }}'>
~~~

And for javascript we can create our object anywhere needed.

~~~go
<script>
	let bodyClasses = [{{ range .Scratch.Get "classes" }}"{{ . }}", {{end}}];
</script>
~~~

###### Final notes: *$.Scratch* from inside a partial
I was not able to retrieve my top level scratch (**$.Scratch**) while using partials and page range loops. I still cannot understand why to this day... 

~~~go
	{{ range where .Data.Pages }}
	    <h1>{{ .Title }}</h1>
	    {{ $.Scratch.Get "index_page_color" }}
	{{ end }}
	// Will  display that color.
	// But...
	{{ range where .Data.Pages }}
	    {{ partial "loop.html" . }}
	{{ end }}
	// Won't be able to retrieve the color from the loop.html partial even though the . was passed along...
~~~
How to fight this ?

The only way I found is to pass your meta as a param to the partial using **dict**. But this means your page object ( . ) will have to be a param as well.
~~~go
	{{ $meta := $.Scratch.Get "index_page_color" }}
	{{ range where .Data.Pages }}
	    {{ partial "loop.html" (dict "page" . "color" $meta) }}
	{{ end }}
~~~
And inside that partial
~~~go
	<h1>{{ .page.Title }}</h1>
    {{ .color }}
~~~

If anybody has a better way, please let me know in the comments!