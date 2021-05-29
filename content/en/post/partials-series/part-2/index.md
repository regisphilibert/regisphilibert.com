---
title: "The Full Partial Series Part 2: Returning partials!"
date: 2019-12-17T11:24:56-04:00
slug: hugo-partial-series-part-2-functions-with-returning-partials
toc: true
serie: partials
twitter_card: summary_large_image
description: To me the greatest improvement in @GoHugoIo of 2020 was unquestionably the returning partials! All of a sudden you could turn partials into powerful reusable functions to be consumed by any template files!
twitter_description: "Did you know @GoHugoIo partials can return typed value? It can and it will change the way you build and maintain your Hugo projects!

In part 2 of The Full Partial Series, we cover in depth 1 of the greatest Hugo addition of 2020: returning partials!

#SSG #JAMStack #golang"
tags:
- Hugo
- partials
- functions
- caching

---

As we covered in several articles before including this series' [first part]({{< relref "part-1" >}}), Hugo as a template engine focuses mainly on building template files. As a result, even its most valued partials, while very good at printing stuff, were until this year unable to return typed value. 

It all changed with Hugo 0.55.0 when the `return` statement was introduced to the partial API! Then all of a sudden partials became powerful reusable functions to be consumed by more conventional template files!

In the second part of our Full Partial Series we'll first cover the fundamentals of this partials' feature before getting into some pretty detailed code use cases!

### Before `return`

Before `return`, when partials could only print, a lot of people still relied on them to create reusable pieces of code that served other purposes than simple templating. For example, you could turn a relative image url to its S3 counterpart like so:

```go-html-template
# layouts/partial/FormatURL.html
{{- $S3Domain := site.Params.s3Domain -}}
{{- printf "%s/%s" $S3Domain . | safeHTMLAttr -}}
```

```go-html-template
# layout/_default/single.html
{{ with .Params.image }}
<img src="{{ partial "FormatURL.html" . }}" />
{{ end }}
```

The above `{{- -}}` made sure nothing else got printed alongside the URL string, no whitespace, no line-break etc.

You could even get further and print jsonified data to be interpreted by the partial call.
```go-html-template
# layouts/partial/GetSEOData.html
{{- with . -}}
  {{- $title := .Title -}}
  {{- $description := .Summary -}}
  {{- with .Params.seo.title -}}
    {{- $title = . -}}
  {{- end -}}
  {{- with ..Params.seo.description -}}
    {{- $description = . -}}
  {{- end -}}
  {{- dict "title" $title "description" $description | jsonify -}}
{{- end -}}
```

```go-html-template
# layouts/partial/head.html
{{ $seo := partial "GetSEOData.html" . | transform.Unmarshal }}
{{ with $seo }}
  # seo tags...
{{ end }}
```
But the above trickery was limited to basic parseable types like strings or integer and slices or maps of the later. There was no way to safely return a complex object like a Page or a File and certainly no collection of pages.

Then came Hugo 0.55.0, the `return` statement and _returning partials_! 

## A few things of note.

Before we dive into the code there is a few do's and don'ts we should really cover.

### 🚫 No return inside clauses
```go-html-template
{{ if gt .Params.temperature 70 }}
  {{ return 😎 }}
{{ end }}
```
This ☝️ will ignore the value of `.Params.temperature` and systematically return 😎. A partial will just return anything that follows a `return` statement, regardless of its position in the code. 

```go-html-template
{{ with .Params.temperature }}
  {{ return . }}
{{ end }}
```
Same with this one ☝️, `return` must live at the root and cannot be called from a nested context.

### 🚫 No multiple return statements

```go-html-template
{{ if gt .Params.temperature 70 }}
  {{ return 😎 }}
{{ else }}
  {{ return ⛸️ }}
{{ end }}
```
The above is not going to work! You cannot  have multiple return statements.

### 👍 One _returning variable_

Reviewing the above big no-nos of _returning partials_ one universal rule emerges: __One `return` at the root__.

I find the best way to comply with this is to focus our attention on one single _returning variable_.

The _returning variable_ is the base of your work on which to add upon and eventually return.

1. 🍽️ Init a variable with a default value,
2. 🔪 work it,
3. 💁‍♂️ and return it at the end.

```go-html-template
{{ $emoji := ⛸️ }}
{{ if gt .Params.temperature 70 }}
  {{ $emoji = 😎}}
{{ else if gt .Params.temperature 100 }}
  {{ $emoji = 🥵}}
{{ end }}
{{ return $emoji }}
```

No matter how many lines, whitespaces or linebreaks in your code, the only value produced by your partial is that single emoji which follows the magical word: `return`.

{{< notice >}}
Just like, `if`, `with`, `range` and friends, whatever follows `return` does not need to be enclosed in parenthesis.

```go-html-template
{{ return gt .Params.temperature 50 }}
```
☝️ Is valid and will return the produced boolean.
{{< /notice >}}

### 🤙 Calling our returning partials.

Just like any other partial!
```go-html-template
Emoji: {{ partial "emoji.html" . }}
```

But real power comes with storing its returned value! 
```go-html-template
{{ $emoji := partial "emoji.html" . }}
```

### 📏 Some conventions!

Or mine anyway...

To make a good distinction between my regular outputting partials and the returning ones, I usually store _returning partials_' files in a `layouts/partials/func/` directory. This has the benefit of isolating them from any other conventional partials while not adding too many characters to their "calling".

```go-html-template
{{ partial "func/emoji.html" . }}
```

Also, as Hugo will always assume `html` when a partial’s extension is absent from the path argument, I always use `.html` for my returning partial files. This way I can safely lose the extension and gain back on those 4 extra chars:

```go-html-template
{{ partial "func/emoji" . }}
```

Finally, I like to capitalize them and add some verb when applicable:

```go-html-template
{{ partial "func/GetEmoji" . }}
```

__Voilà, beautiful Hugo:__

```go-html-template
{{ with partial "func/GetEmoji" . }}
  Emoji: {{ . }}
{{ end }}
```
## Coding our returning partials

Alright, theory was interesting but it's time to crack some knuckle and hit that keyboard! Together we'll try and answer a very basic need: __Efficiently listing taxonomy terms in our Hugo projects__.

The above is not always super intuitive. Taxonomy and their terms do hold a special place in a Hugo project, but from the Page context, they're just another list of strings in your Front Matter.

```yaml
---
title: A Night at the Metropolitan Museum
tags:
  - Art
  - New York
  - Museum
---
```

In order to list them as a clickable links, you have to build said links yourself based on those `urlized` strings or retrieved their page object using `.GetPage` or `.Site.Taxonomies`. 

It would be nice if this cumbersome work could be processed from within a reusable _returning partial_ and not in our posts' template files.

As for the way we want to call such partial, it should be as simple as that:

```go-html-template
{{ range .Params.tags }}
  {{ with partial "func/GPetTagPage" . }}
    <a href="{{ .RelPermalink }}">{{ .Title }}</a>
  {{ end }}
{{ end }}
```

__🙌 ⌨️ Here we go.__

```go-html-template
{{/* 1. */}}
{{ $tag := false }}
{{/* 2. */}}
{{ with index site.Taxonomies.tags (urlize .) }}
  {{/* 3. */}}
  {{ with .Page }}
    {{/* 4. */}
    {{ $tag = . }}
  {{ end }}
{{ end }}

{{/* 5. */}
{{ return $tag }}
```
1. We start with our _returning variable_ and its default value.
2. 
  `site.Taxonomies.tags` returns a collection of all the site's tags with their `.Page` object. 
  The dot is the partial's context, our tag's name, we `urlize` it to match its key inside `site.Taxonomies.tags`.
3. Pretty sure we'll find a `.Page`, but `with` adds extra security and has the benefit of shifting the context.
4. We store the tag's page in our _returning variable_.
5. 🎉

__👍 Good work!__ 

Now what about other taxonomies like `categories`? No way we're copying/pasting this into a new partial and switch `site.Taxonomies.tags` with `site.Taxonomies.categories`. 🙅‍♀️

This is what we want:

```go-html-template
{{ range .Params.tags }}
  {{ with partial "func/GetTermPage" (dict "taxonomy" "tags" "term" .) }}
    <a href="{{ .RelPermalink }}">{{ .Title }}</a>
  {{ end }}
{{ end }}
```

## Handling arguments

For now we've been dealing with "single argument" _returning partials_ where the context only holds one thing. But here, we need two, the taxonomy and its term. Our context will now need to be a map with those two.

And so we update our partial:

```go-html-template
{{ $return := false }}

{{/* 1. */}}
{{ $taxonomy := "tags" }}
{{ with .taxonomy }}
  {{ $taxonomy = . }}
{{ end }}

{{/* 2. */}}
{{ with $term := .term }}
  {{ with index site.Taxonomies $taxonomy }}
    {{ with index . (urlize $term) }}
      {{ with .Page }}
        {{ $return = . }}
      {{ end }}
    {{ end }}
  {{ end }}
{{ end }}

{{/* 3. */}}
{{ return $return }}
```

1. Now that I have a `term` argument, naming the returning variable `$term` might get confusing. I'll just call it `$return` now so it really stands out as __the__ _returning variable_.
2. 
  Without a `.term` argument, the _returning variable_ should really remain empty. 
  Before going any further we use `with` to make sure `.term` is set and store its value at the init so we can access it regardless of further context shifting.
  The following lines present a great example of context shifting by the way!
3. 🎉

## Caching!

Now this is great, but I want a function that lists my page's tags and returns a slice of maps each containing some structured data. Say `.URL` and `.Name`. This way if I want to switch from `.RelPermalink` to `.Permalink` in the future, I can do it in my _returning partial_ rather than in every template file where I print those links.

It'll give us a great opportunity to call a _returning partial_  from within a _returning partial_ and cache its value.

```go-html-template
#layout/partials/func/GetTags.html
{{/* 1. */}}
{{ $return := slice }}
{{/* 2. */}}
{{ with .Params.tags }}
  {{ range . }}
    {{/* 3. */}}
    {{ with partialCached "func/GetTerm" (dict "taxonomy" "tags" "term" .) "tags" . }}
      {{/* 4. */}}
      {{ $tag := dict "URL" .RelPermalink "Name" .Title }}
      {{/* 5. */}}
      {{ $return := $return | append $tag }}
    {{ end }}
  {{ end }}
{{ end }}

{{/* 6. */}}
{{ return $return }}
```
1. We want to safely use `range` on the value of our _returning partial_ In order to make sure the returned value is of type `slice`, we make our _returning variable_ defaults to an empty one.
2. `range` fails gracefully on empty slices but breaks builds on any other types. So it's always safer to wrap our `range` calls with a `with` unless you're certain your value is a slice.
3. We're calling our previously coded _returning partial_, but this time caching it. For variants we use the value of both its arguments.
4. We create a map and store it in a variable for better readability. Because our `$tag` is declared inside the `range` context, it can not collide with another `$tag` from say, the next tag in the list.
5. We use the [`append`](https://gohugo.io/functions/append/#readout) function to add our `$tag` map to the slice we'll ultimately return.
6. 🎉

And now from our template file:

```go-html-template
# layouts/_default/single.html
{{/* 1. */}}
{{ range partial "func/GetTags" $ }}
  {{/* 2. */}}
  <a href="{{ .URL }}">{{ .Name }}</a>
{{ end }}
```

1. 
  We know for sure the value returned by our homemade _returning partial_ is a slice, empty or not. So it's safe to use `range` here.
2. We can now use the custom keys of our maps.
3. That's it!

## Room for improvement?
Sure! We could:
- Exclude some Tags from the `GetTags`'s returned slice.
- Turn `GetTags` into `GetTerms`, making it taxonomy agnostic.
- Finding the right variant for our `GetTags`'s _returning partial_ and use `partialCache`.
- Build many more _returning partials_ to cater for all our not-so-templating needs!

## Conclusion.

After covering some fundamentals, we were able to easily build two _returning partials_ which will bring great maintainability to one aspect of the site.
Shall we need some posts or all our posts to exclude certain tags? That will happen in `GetTags` and `GetTags` only! 
Shall Hugo introduce a more efficient way to handle taxonomy terms in a future release? We'll adjust our `GetTerm` function and that's it!

By bridging the gap between reusability and typed data serving, Hugo with its _returing partials_ is finally addressing the need for separation of concern between templating and data handling! 

Did I already mention it was to me the biggest game-changer of 2020?

If you have some personal experience or questions about _returning partials_ or if you just want to share what you build following based on what we discussed here, just drop a note or code blocks in the comments!

