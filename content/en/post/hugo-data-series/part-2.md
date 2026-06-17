---
date: 2022-01-06T9:32:27.000Z
title: "Hugo and Data: Advance manipulation with Slices and Maps"
slug: manipulation-slices-and-maps
aliases:
  - /post/hugo-data-manipulation-slices-and-maps
comments: https://github.com/theNewDynamic/thenewdynamic.com/discussions/194
tags:
  - hugo
  - data
  - modules
  - JAMStack
  - logic
subjects:
  - dev
description: Hugo is well known for building pages! But do you know it's also great at structuring and manipulation data? In this article we cover advanced data manipulation in Hugo with Slices and Maps! We learn to fitler their content and shape up their structure while reviewing some critical functions and Hugo concept.
---

Building or manipulating data to one's need from a raw source --- like an API endpoint or a Markdown file --- is not often discussed in the Hugo community and may seem daunting for many users.

Yet masterting data with Hugo can prove critical especially [when building pages from a remote source]({{< relref "post/toward-headless-cms-with-hugo-2" >}})!

How can Hugo and Go Template turn your massive wall of JSON or an editor friendly Front Matter into just what your HTML needs? In this article we'll cover advanced data manipulation in Hugo with Slices and Maps types. We'll learn how to filter their content and shape up their structure while reviewing some critical functions and concepts of Hugo.

## Prerequisite

You'll need an intermediate understanding of Go Template in Hugo. If you're unsure, it might be a good idea --- it's always a good idea --- to review the basics from this earlier article: [Hugo and Data: The Basics]({{< relref "post/hugo-data-series/part-1" >}})

Having a Hugo running on your local machine is a plus, as you'll be able to experiment with the code examples! But if not, just read along and imagine a cocktail in your hand!

## Slices

Slices are arrays, they can be made of strings, maps, Pages etc...

### Creating a slice

We create a slice using the `slice` function:

```go-html-template
{{ $gents := slice "John" "Paul" }}

{{ range $gents }}
  I love {{ . }}
{{ end }}
```

The above will print:

```html
I love John I love Paul
```

### Adding to a slice, or append.

We use the `append` function. It takes two parameters:
- First parameter, is what we add to the slice,
- second parameter is the slice in question.

```go-html-template
{{ $gents = append "Ringo" $gents }}
```

In plain english: **_Append Ringo to the Gents_**

Note that if your first argument is a another slice, it'll add all its entries!

```go-html-template
{{ $gents = append (slice "Ringo" "George") $gents }}
```

**_Append Ringo and George to the Gents_**

Now we'll have:

```html
I love John I love Paul I love Ringo I love Ringo I love George
```

Oops, Ringo's been added twice, once as a lone `string` argument and once as part of that [Ringo George] `slice`; no sweat we can use `uniq` to ensure there's no duplicate:

```go-html-template
{{ $gents = uniq $gents }}
```

### Prepend?

Sure, there's no `prepend` function, but `append` will do. Instead of adding Ringo (1st argument) to the slice [John, Paul] (2nd argument) we want to add the slice [John, Paul] to the slice [Ringo]... We just revert the argument order and make sure Ringo is wrapped in a slice:

```go-html-template
{{ $gents = append $gents (slice "Ringo") }}
```

Or in plain english: **_Append the Gents to Ringo_**

{{< notice >}}
Go Template has that pipe thing that allows to chain functions. The offsetting thing is that the left part will be passed as the last argument of the chained function. And when you append to a slice, the order matter.

```go-html-template
{{ $gents = $gents | append "Ringo" }}
```

Actually means: **_Append "Ringo" to the Gents_** or **_The Gents are taking Ringo in..._** 🤷
{{< /notice >}}

### Index

If you want to retrieve the index from a range on a slice, you can actually store it alongside the value at cursor like this:

```go-html-template
{{ range $index, $gent := $gents }}
  {{ $gent }} is at index {{ $index }}
{{ end }}
```

Will print:

```text
John is at index 0
Paul is at index 1
Ringo is at index 2
George is at index 3
```

Yep, pretty much like in any programming language, the index starts at 0.
{{< notice >}}
Even though our value is now stored in a `$value` variable, it remains available in the `.`.

```go-html-template
{{ range $index, $value := $gents }}
  {{ . }} is at index {{ $index }}
{{ end }}
```

{{< /notice >}}

### First, Last

What if we only want our first 2 gents? Or the last 3? We can use `first` or `last`. Both functions take two parameters, an integer and a slice.

```go-html-template
{{ $first_two := first 2 $gents }}

{{ $last_three := last 3 $gents }}
```

This reads nicely don't you think? Now both functions always return a slice, even if it contains a lone gent like `{{ $first := first 1 $gent }}`

### The other `index`.

First and last is good, but what if we want just the 3rd one. Well we could do:

```go-html-template
{{ $third := first 3 $gents | last 1 }}
```

We could but...should we? We'd rather use `index`. This function takes two parameters, a slice (or a map, more on that later) and an integer for the index. So to find the third gent:

```go-html-template
{{ $third := index $gents 2 }}
```

Two because, the index starts at zero!
{{< notice >}}
We'll often find ourselves using `index . 0` to single out a lone element wrapped in a slice.
{{< /notice >}}

## Maps

Maps are associative arrays, meaning you've got key and value pairs.

### Creating a Map

To create a map we use the `dict` function. It takes an unlimited sets of even parameters: odds are keys, evens are values.

```go-html-template
{{ $gent := dict "firstame" "John" "lastname" "Lennon" }}
```

Since [Hugo 0.81.0](https://github.com/gohugoio/hugo/releases/tag/v0.81.0) we can break lines within "curlies". This enables more readable declarations.

```go-html-template
{{ $gent := dict
  "firstname" "John"
  "lastname" "Lennon"
}}

Firsname: {{ $gent.firstname }}
Lastname: {{ $gent.lastname }}
```

Beautiful!

The above will print:

```text
Firstname: John
Lastname: Lennon
```

### Add to a map

The simplest way is to use the merge function:

{{% aside %}}
The simplest but not the fastest! For very big projects, you shoud rely on `sratch` for Map manipulation to save on build time. We'll cover this in the next article.
{{% /aside %}}

The merge function takes two parameters, two maps which will be merged into one together. By creating a new map with its own pair of key values and merging it on top of the existing one, we add to a map or edit the value an existing pair:

```go-html-template
{{ $gent = merge $gent (dict "birth" "1940") }}
```

### Browsing the map

We range on the map the same way we do a slice. Index is also available, although this time it holds our key.

```go-html-template
{{ range $key, $value := $gent }}
  {{ $key }}: {{ $value }}
{{ end }}
```

Will print:

```text
birth: 1940
firstame: John
lastname: Lennon
```

You'll notice that the order does not follow the one we used. That's because Hugo (Go) systematically [re-order pairs by their keys](https://stackoverflow.com/questions/9619479/go-what-determines-the-iteration-order-for-map-keys). Slice on the other hand will always keep their defined order.

Ok! Now that gent played several instruments with his band, and we'll break lines to make it a bit more elegant.

```go-html-template
{{ $gent = merge $gent (dict
  "instruments" (slice
    "Piano"
    "Guitar"
    "Vocals"
  )
) }}
```

Now our `range` will print:

```text
birth: 1940
firstame: John
instruments: [Piano Guitar Vocals]
lastname: Lennon
```

The instruments value does not look so good though! We should test if our value is a slice, and have it behave appropriately. We'll use `delimit` to join the slice's value into a string with a comma as delimiter.

As for testing, for now Hugo can only test for two types with the following self explanatory functions: `reflect.IsSlice` and `reflect.IsMap`.

Here we go:

```go-html-template
{{ range $key, $value := $gent }}
<div>
{{ $key }}:
  {{ if reflect.IsSlice $value }}
    {{ delimit $value ", " }}
  {{ else }}
    {{ $value }}
  {{ end }}
</div>
{{ end }}
```

Will print:

```text
birth: 1940
firstame: John
instruments: Piano, Guitar, Vocals
lastname: Lennon
```

### The other `index`.

We covered `index` as a function for slices, but it also works on maps. Only this time the second parameter is a string holding a key from the map.

```go-html-template
{{ $firstname := index $gent "firstname" }}
```

This function will prove very valuable on maps, when the key in question is stored in a variable:

```go-html-template
{{ $basis := "lastname" }}

{{ if eq $relation "friend" }}
  {{ $basis = "firstname" }}
{{ end }}

Good day {{ index $gent $basis }}!
```

Or a range:

```go-html-template
{{ range slice "firstname" "lastname" }}
  {{ . }}: {{ index $gent . }}
{{ end }}
```

## Slices of Maps

Now let's mix slices and maps!

We'll create a slice of maps. We already have one gent so we "instantiate" our slice with him:

```go-html-template
{{ $gents := slice $gent }}
```

Now we can add a new gent in a readable way with linebreaks and pipes:

```go-html-template
{{ $gents = $gents | append (dict
  "firstname" "Paul"
  "lastname" "McCartney"
  "birth" "1942"
  "instruments" (slice
    "Bass Guitar"
    "Guitar"
    "Vocals"
    )
) }}
```

And in order to add the last gents, we can append a slice of the two:

```go-html-template
{{ $gents = $gents | append (slice
  (dict
    "firstname" "Ringo"
    "lastname" "Starr"
    "birth" "1940"
    "instruments" (slice
      "Drums"
      "Vocals"
    )
  )
  (dict
    "firstname" "George"
    "lastname" "Harrison"
    "birth" "1943"
    "instruments" (slice
      "Guitar"
      "Sitar"
      "Vocals"
    )
  )
) }}
```

### Browsing

And now to browse our gents:

```go-html-template
{{ range $gents }}
<p>
  {{ .firstname }} {{ .lastname }} was born on {{ .birth }}, he played {{ delimit .instruments ", " " and " }}
</p>
{{ end }}
```

Will print:

```text
John Lennon was born on 1940, he played Piano, Guitar and Vocals

McCartney was born on 1942, he played Bass Guitar, Guitar and Vocals

Ringo Starr was born on 1940, he played Drums and Vocals

George Harrison was born on 1943, he played Guitar, Sitar and Vocals
```

### Filtering

People are using `where` clause all the time to filter out pages and if you're not familiar you should give it glance in the [doc](https://gohugo.io/functions/where/#readout), but you can use it on any kind of collections, slices as well.

**Let's find all gents born in 1940**

As you know, `where` returns a slice empty or not, so it's safe to use range/else on it.

```go-html-template
{{ range where $gents ".birth" "1940" }}
  <p>{{ .firstname }}, {{ .birth }}</p>
{{ else }}
  No gents 🤷!
{{ end }}
```

**Now all the gents not born in 1940**

```go-html-template
{{ $gents := where $gents ".birth" "!=" "1940" }}
```

**Or born in or after 1942**

```go-html-template
{{ $gents := where $gents ".birth" ">=" "1942" }}
```

As you'll have noticed by now `where` takes a set of parameters.

- The first, `$gents` is the collection.
- The second is the key we're evaluating in the collection's entries `".birth"`. (dot is optional, but I find it helps instantly identify the "key" argument).
- The third is the operator in use.
- The fourth is the value we're trying to match.

If you omit number two, the operator defaults to `"=="`

I woudn't go as far as writing a javascript comparison but... Ok just one!

```javascript
gents = gents.map((gent) => gent.birth >= 1942);
```

{{< notice >}}
Type must be the same in Hugo, here we're using strings for the years. Had we been using integers for our gents' birth we should have used `1942` (int) as matching value.
{{< /notice >}}

**Back to playing: Born in 1942 OR 1940?**

```go-html-template
{{ $gents := where $gents ".birth" "in" (slice "1940" "1942") }}
```

Here we can use `"in"` to find gents whose birth year is included in ["1940", "1942"]

###### **Now we want all gents playing the Guitar!**

It's different that with `"in"` as we want to find gents whose instruments' list includes "Guitar".

We'll use the `"intersect"` operator. It compares a slice from the entries with a given slice, and only returns the entries where both slices "intersect".

[Guitar, Piano] and [Bass, Guitar] intersects! They have **Guitar** in common!
[Guitar, Piano] and [Drums, Vocals] do not intersect! Nothing in common!
[Guitar, Vocals] and [Drums, Vocals] do intersect, but with **Vocals**, not Guitar.

Now we only need one intersection, Guitar, so:

```go-html-template
{{ $gents := where $gents ".instruments" "intersect" (slice "Guitar") }}
```

And if we wanted to find the gents who played Guitar and Vocals --- **two** intersections --- we'd:

```go-html-template
{{ $gents := where $gents ".instruments" "intersect" (slice "Guitar" "Vocals") }}
```

### Sorting

Some of you might be familiar with the way [pages are sorted with Hugo](https://gohugo.io/templates/lists/#order-content) but this is only for pages, not any kind of colletions, like our gents.

For those there is a `sort` function.

Let's sort our gents by age using their `birth` year:

```go-html-template
{{ $gents := sort $gents ".birth" }}
```

`sort` takes a first parameter, the key we'll sort the collection by, and an optional second for the direction. It defaults to ascending.

To reverse the order and have them younger to older, we add a third parameter, `desc` for --- you guessed it --- descending.

```go-html-template
{{ $gents := sort $gents ".birth" "desc" }}
```

Again the `.` in the key parameter is optional.

## To reality and beyond!

Ok, that is all well and good, but let's be honest, hardcoding your data this way can be useful for defining defaults or re-usable bases but not much more.
Usually your data comes from a source you lack control of like an API, or a Data file or most usually a user managed content file.

In the follow up article [Hugo and Data: Advanced Transformations]({{< relref "post/hugo-data-series/part-3" >}}) we'll cover how you can take data from a limited source (basic Front Matters, API endpoints) and transform it to data which better suit your project's needs. We'll use a lot of stuff covered above, but also more advanced ones so you can code safely with readablity, scalablity and build time in mind!
