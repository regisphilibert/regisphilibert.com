---
title: "Hugo, the scope, the context and the dot"
date: 2018-02-05T15:32:27-05:00
lastmod: 2019-08-16T17:32:27-05:00
description: Moving from old regular template languages where the scope is rarely an issue, you may have a hard time wrapping your head around Go Template scoping constraints. Why is my variable not available here or there? Let's see how. Let's try and understand the impact of the scope/context within our templates and partials.
slug: 'hugo-the-scope-the-context-and-the-dot'
toc: true
twitter_card: summary_large_image
tags:
 - Hugo
 - Variables
 - Scratch
 - Dot
 - Scope
 - Go Template
 - Context

---

__Why is my variable not available here or there?__ 🙄

Moving from old regular template languages where the scope is rarely an issue, you may have a hard time wrapping your head around Go Template scoping constraints. 

In this article we’ll try and understand the impact of the scope/context within our templates and partials and how to juggle with the dot 🤹.
<!--more-->

## The context and the dot

I’m using the word scope in the title here, because it’s what first come to mind when dealing with the issue and I guess what people will eventually seek help for. But I suppose we’ll be talking more about the « context »

The scope is really what is available to you at a certain point in your code. From inside a function or a class for exemple.

But in Hugo Templates, most of the time, only one object is available to you: __the context__. 
And it is stored in a dot.

Yep, that dot. `{{.}}` 

So you end up using the properties of this object like so:
 `.Title`, `.Permalink`, `.IsHome`

## The Page dot.

The root context, the one available to you in your `baseof.html` and layouts will always be the Page context. Basically everything you need to build this page is in that dot. 
`.Title`, `.Permalink`, `.Resources`, you name it.

Even your site’s informations is stored in the page context with `.Site` ready for the taking. 

But in Go Template the minute you step into a function you lose that context as your precious dot or context is replaced by the function's own... dot. 

Let's dive into a template file!

### With

~~~go-html-template
{{ with .Title }}
 	{{/* Here the dot is now .Title */}} 
	<h1>{{ . }}</h1>
{{ end }}
~~~
From within this `with` you’ve lost your page context. The context, the dot, is now the title of your page. For now that's exactly what we want!

### Range

Same goes here, once you’ve opened an iteration with range the context is the whatever item the cursor is pointing to at the moment. You will lose your page context in favor of the the range context.

~~~go-html-template
{{ range .Data.Pages }}
	{{/* Here the dot is that one page 'at cursor'. */}} 
	{{ .Permalink }}
{{ end }}
~~~


~~~go-html-template
{{ range .Resources.Match "gallery/*" }}
	{{/* Here the dot is that one image. */}} 
	{{ .Permalink }}
{{ end }}
~~~

~~~go-html-template
{{ range (slice "Hello" "Bonjour" "Gutten Tag") }}
	{{/* Here the dot is that one string. */}} 
	{{ . }}
{{ end }}
~~~

### The top level context 💲

Luckily Hugo stores the root context of a template file in a `$` so no matter how deeply nested you are within `with` or `range`, you can always retrieve the top context. In basic template file, it will generally be your page.

#### One level nesting
~~~go-html-template
{{ with .Title }}
	{{/* Dot is .Title */}} 
	<h1>{{ . }}</h1>
 	{{/* $ is the top level page */}} 
	<h3>From {{ $.Title }}</h3>
{{ end }}
~~~

#### Three level nesting
~~~go-html-template
{{/* 1. Dot is the top level (list) page */}} 
<h1>{{ .Title }}</h1>
{{ range .Data.Pages }}
	<article>
		{{/* 2. Dot is the page at cursor */}} 
		<h3>{{ .Title }}</h3>
		<hr>
		{{ range .Resources.Match "images/.*" }}
			<figure>
				{{/* 3. Dot is that Resource */}}
				<img src="{{ .Permalink }}">
				{{/* $ is the top level page */}}
				<caption>{{ .Title }} from  post {{ $.Title }}</caption>
			</figure>		
		{{ end }}
	</article>
{{ end }}
~~~

## Partials

Partials, by default don't pass on any context.
But it takes one parameter just for that. This object will be available within the partial and be referred to as, you guessed it, the dot.

So for simple partials you will only need your page context. Your page’s __dot__. 

~~~go-html-template
	{{ partial "page/head" . }}
~~~

The partial function here has for parameter your context, most probably your Page’s if you're not in a `range` or a `with` or another partial.

~~~go-html-template
	<h1>
		{{ .Title }}
	</h1>
	<h3><time datetime="{{ .Date }}">{{ dateFormat "Written on January 2, 2006" .Date }}</time></h3>
~~~


Now, let's say you build a partial to render your fancy framed image, you only need its path so that would be your context.

~~~go-html-template
{{ partial "img" $path }}
~~~

And in your partials/img.html

~~~go-html-template
<figure class="Figure Figure--framed">
	<img src="{{ . }}" alt="">
</figure>
~~~

The dot is that `$path` value.

That is a simple case though. Most of the time, we'll need more values than that.

It's ok, we can use the `dict` function to pass an object as parameter. `dict` creates a map or as I more commonly know it, an associative array.
See the [doc](https://gohugo.io/functions/dict) or my own take on it [here]({{< ref hugo-translator >}}#associative-arrays).

~~~go-html-template
{{ partial "img" (dict "path" $path "alt" "Nice blue sky") }}
~~~

From within the partial the dot will hold that object, so we prefix our keys with `.`

~~~go-html-template
<figure class="Figure Figure--framed">
	<img src="{{ .path }}" alt="{{ .alt }}">
</figure>
~~~

You can choose to .Capitalize your keys so they look more "Hugo", but I like having them lowercase. This way from within that partial, I instantly identify the keys as from a custom context rather than the page one.

### Top level $ from partial

Contrary to `range` and `with`, your page context will not be available in `$`, `$` will simply hold your partial's context.

No fret, we'll just add the page context to our `dict`.

You can use any name for that important key, a lot of people use "Page" resulting in `.Page.Title`. Whatever suits you, but try to be consistent with it.

~~~go-html-template
{{ partial "img" (dict "Page" . "path" $path "caption" "Nice blue sky") }}
~~~

~~~go-html-template
<figure class="Figure Figure--framed">
	<img src="{{ .path }}" alt="{{ .alt }} from {{ .Page.Title }}">
</figure>
~~~

Now, if we were to excercise some caution by wrapping our `alt` code in a `with` statement, we would need `$` to invoke the partial's top level context from inside that `with`!

~~~go-html-template
<figure class="Figure Figure--framed">
	<img src="{{ .path }}"
		{{ with .alt }}
			alt="{{ . }} from {{ $.Page.Title }}"
		{{ end }}
	>
</figure>
~~~

## Shifting to your own level

One drawback of context shifting is that you might often need to do something like this:

```go-html-template
{{ with .Params.character }}
  {{ $character := . }}
  {{ with .city }}
    {{ $character.name }} is living in {{ . }}
  {{ end }}
{{ end }}
```
But you can actually create your variable in the same statement and gain in readability:

```go-html-template
{{ with $character := .Params.character }}
  {{ with .city }}
    {{ $character.name }} is living in {{ . }}
  {{ end }}
{{ end }}
```

And because this `$character` variable is only available as this `with`'s context, there is no risk of stepping on another homonymous variable being declared outside of it. The following:

```go-html-template
{{ $character := "Hugo Baskerville" }}

{{ with $character := .Params.character }}
  {{ with .city }}
    {{ $character.name }} is living in {{ . }}
  {{ end }}
{{ end }}

{{ $character }} was living in Devonshire
```

will print:

```
Sherlock Holmes is living in London

Hugo Baskerville was living in Devonshire
``` 

For what it's worth, and only if you don't need the template file's root context in there, you could even use `$` just like Hugo itself!

Elementary! 🕵️‍♂️ 

## Final <del>point</del> dot!

That dot becomes super friendly and convenient once you know how to juggle with it! And to prove it, I leave you with a comparison between two code blocks.

The first shows how readable and easily maintainable Go Template code is since the context can happily shift from one dot to another. 
The one on the right, attempts to show what your code would look like if the context could did not shift. 

__Shifting Context VS Unshifting Context__

{{< grid >}}
	{{% grid_item %}}
~~~go-html-template
{{ with .Params.author }}
	<h3>{{ .firstname }} {{ .surname }}</h3>
	<p>{{ .bio }}</p>
	{{ with .posts }}
		<ul>
			{{ range . }}
				<li>
					<a href="{{ .Permalink }}">{{ .Title }}</a>
				</li>
			{{ end }}
		</ul>
	{{ end }}
{{ end }}
~~~
	{{% /grid_item %}}
	{{% grid_item %}}
~~~go-html-template
{{ with .Params.author }}
	<h3>{{ .Params.author.firstname }} {{ .Params.author.surname }}</h3>
	<p>{{ .Params.author.bio }}</p>
	{{ with .Params.author.posts }}
		<ul>
			{{ range .Params.author.posts as post }}
				<li>
					<a href="{{ post.Permalink }}">{{ post.Title }}</a>
				</li>
			{{ end }}
		</ul>
	{{ end }}
{{ end }}
~~~
	{{% /grid_item %}}
{{< /grid >}}
