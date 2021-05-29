---
title: "The Full Partial Series Part 1: Caching!"
date: 2019-12-02T11:24:56-04:00
slug: hugo-partial-series-part-1-caching-with-partialCached
toc: true
serie: partials
tags:
 - Hugo
 - partials
 - caching
 - build time
twitter_card: summary_large_image
description: "Partials are very handy to maintain reusable code but can take up on build time if processed by Hugo more than neeeded.

In this article we'll cover how their own caching solution can help reduce the build time!"
description_twitter: "It seems that build time could save you money these days 👛! So how about we speed it up with caching some template files! 

Today we kickoff a new @GoHugoIO series: The Full Partial Series! Part 1 covers their very own caching solution: partialCached"
---

Partials are one of the most used and maintained Hugo template files. They are our components, our includes, our bits, and recently even became our functions.

In this series we’re not going to cover the basics of [partials](https://gohugo.io/templates/partials/#readout) such as their "context" as it's already discussed in depth [here]({{< relref "hugo-context" >}}).

Nope for this Christmas, we’re going to push partials way beyond your basic includes. We’re going to see how you can have Hugo cache your partials to speed up the build time, use partials as functions, and finally see the best organizing and commenting practices to make sure they last!

So without further ado, let's kick off the series with partial's own caching solution: [`partialCached`](https://gohugo.io/functions/partialcached/)

## Why use partialCached?

As you know the purpose of a partial is to wrap frequently addressed template code inside one reusable file.

If like me you hate `copying/pasting` identical lines of code accross your projects, you must be using partials a lot!

The markup rendered by your partial might be the same on a majority of pages and differ only for a few, or it could be completely different from one page to the next. The latter scenario will rarely benefit from caching so let’s focus on the first one.

Think about your header for example. 

Your header will almost always print the same markup! Same logo, same URL pointing to home, same navigation, same social links.
It will be printed throughout the site on every single page.

If your Hugo project needs to create one thousand HTML files, then, on every build, Hugo will have to look for your menu configuration, your social configuration and process the exact same markup a thousand times.

With a `partialCached` you can inform Hugo that this piece of code will never change, and can therefor be processed once, cached and reused:

```go-html-template
{{ partialCached "header.html" . }}
```

That’s 999 times when Hugo will not have to bother interpreting that partial’s code. Depending on the complexity of your navigation, __you potentially saved a lot of precious milliseconds__ ⏱️!

But is our header really going to be the same for every page?

No as it most likely will underline or highlight some links from the main menu depending on where your visitors are on the site.

Our Hugo menu code might contain something like: 

```go-html-template
<nav>
{{ range .Site.Menus.main }}
  <a 
    class="{{ if $currentPage.Section .Page.Section }} active {{ end }}"
    href="{{ .URL }}"
  >
    {{ .Name }}
  </a>
{{ end }}
</nav>
```

The above code is pretty straightforward. Our projects bears a simple five item menu, each linking to a section of the site. In order to make __Blog__ menu item appear active when visiting a page from the Blog section, we compare the `$currentPage.Section` with the menu item's own `.Page.Section`. 


Now with our current `{{ partialCached "header.html" . }}`, Hugo will run this `if` clause once and apply its result to every subsquent pages it builds regardless of their section. That’s not good! 

Enter partials' `variants`.

## Partial variants

We know that the header is only going to change five times, depending on the current page's `.Section`. We therefor need to tell Hugo to cache a different `variant` of the partial depending on this factor.

Contrary to `partial`, `partialCached` list of arguments is not limited to context. 

In our simple use case, the obvious variant is the current page `.Section` so we can drop this:

```go-html-template
{{ partialCached "navigation.html" . .Section }}
```

🎉 That's 995 times when Hugo will not have to bother interpreting that partial’s code.

Good. That’s one variant down, but what if something else has to change, and it's not connected to the section?
For example on this very site, the social links are very prominent in the contact page, so when on that page, the header does not "repeat" them.

Code goes something like this:

```go-html-template
{{ if ne .Layout "contact" }}
  {{ range site.Socials }}
    {{/* you got the picture */}}
  {{ end }}
{{ end }}
```

So we need 2 variants now, the `.Section` variant and the `Is it the contact page?` variant. 

Lucky for us, the number of variants argument is limitless, so here we go:

```go-html-template
{{ partialCached "navigation.html" . .Section "contact" }}
```

That was for easy reading but let’s face it, you’ll most likely need something more « dynamic »

```go-html-template
{{ $layout := cond (eq .Layout "contact") "contact" "other" }}
{{ partialCached "navigation.html" . .Section $layout }}
```

🎉 That's 994 times when Hugo will not have to bother interpreting that partial’s code.


## Stepping variants up a notch 💪

Let’s dive into something a little bit more complex. 

Our blog has an « authors » box. We have three authors on site, so this box will either list one, or a combination of them based on an array in our post’s Front Matter. It’s safe to say, that out of our 1000 articles, many will share the same combination.

Here, the ideal variant would therefor be our list of authors in a consistent order, so we'd be tempted to just run:

```go-html-template
	{{ partialCached "authors-box.html" . .Params.authors }}
```

Unfortunately for the time being, variant arguments passed to `partialCached` must be __strings__ 🤷. 

In order to pass this requirement, we need to turn this array into a string before using it, and the safest way to do this is, as often, using [`printf`](https://gohugo.io/functions/printf/#readout) and the right [verb](https://golang.org/pkg/fmt/#hdr-Printing). Personally I like `%x` as it will produce a base-16 string representation of a value, regardless of its type.

Assuming with have:
```
authors:
  - Bud Parr
  - Frank Taillandier
  - Régis Philibert
```

```go-html-template
{{ $variant := printf "%x" .Params.authors }}
```
🖨️👇
`[4275642050617272 4672616e6b205461696c6c616e64696572 52c3a9676973205068696c6962657274]`

Now we have a string we can pass as a partial variant:

```go-html-template
{{ with .Params.authors }}
	{{ $authors := sort . }}
	{{ $variant := printf "%x" $authors }}
	{{ partialCached "authors-box.html" . $variant }}
{{ end }}
```

{{< notice title="Why sorting the authors?" >}}
 If our partial always lists the authors in the same alphabetical order, we should make sure the random order the editors might have added them in does not create unnecessary cached variants.
{{< /notice >}}

{{< notice title="warning" >}}
This variant solution works for simple slices and maps. You should run some tests before using it with more complex data structure.
{{< /notice >}}

With all of the above, we can be sure that Hugo will only build the author’s box, once per combination of authors. 

## What about languages? 🇫🇷🇬🇧

In a multilingual context, and thinking back to our header partial, we might have a language switch in there and be tempted to add yet another variant:

```
{{ partialCached "navigation.html" . .Section .Lang }}
```

But you don’t have to do that, as Hugo will build as many cached partial as languages by default. So in our current use case, Hugo will compute our header’s markup ten times. 

{{< notice title="🧮" >}}
The golden rules to figure out the number of partial « compute » is:

`partial X variants X languages`
{{< /notice >}}

## Improving your build time ⏱️

For the projects you have built yourself, it might be fairly easy to go though your `partials` directory and quickly identify those which could be cached. But for projects you inherited or built a long time ago, there are two CLI flags you can run. `hugo --templateMetrics --templateMetricsHints`.

The first flag ran alone is already very helpful as it will list every template file and give you information about the duration of their building. Not everything in there can be cached though, only partials.

The second one adds an extra column which prints that file's "cache potential" in percentage. 

Those commands will help identify any big clogs, but you should always ask yourself these three questions:

1. How complex is the partial and what its cumulative duration might add up to.
2. How many times will it be processed compared to its potential number of variants.
3. How can I adapt my code to make it easily cacheable. (identifying variants early on will save a lot of refactoring later)

## Conclusion

When building a new Hugo project or maintaining one you should always  keep in mind that every line of code could slow your build. Let Hugo do the heavy-lifting a few times rather than every time! 

So go look for those partial files, make up your own variants and start saving time and money by heavily making those `partialCached`!
