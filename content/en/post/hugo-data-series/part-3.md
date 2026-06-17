---
date: 2022-01-19T9:32:27.000Z
title: "Hugo and Data: Advanced Transformations"
slug: manipulation-and-logic-advanced-transformations
aliases:
- /post/hugo-data-manipulation-and-logic-advanced-transformations
tags:
  - hugo
  - modules
  - JAMStack
  - logic
subjects:
  - dev
description: Hugo is well known for building pages! But do you know it's also great at structuring and manipulation data? In this final article we level up to achieve advanced data transformations!
---

## Transform!

Last time, using famous gents from Britain we covered some data manipulation, but it implied hardcoding of lot of gent's info.

Usually your data comes from a source you lack control of like an API, or a data file or most usually a user managed content file. In this new article about Hugo and Data, we'll cover how you can take data from a limited source (basic Front Matters, API endpoints) and transform it into objects better suited to your project's needs! We'll use a "transformer" partial and even some remote data fetching to complement our gent!

If you're stumbling on this article without having read through [this one]({{< relref "post/hugo-data-series/part-2" >}}), I strongly suggest you go back to it as it covers the basics of two very important data types which we'll use a lot here: Slice and Maps.

For this illustrative context, our data source will be markdown files and our gents will be structured this way:

```yaml
---
# content/gent/john-lennon.md
title: John Lennon
date: 1940-10-09
bands:
- Beatles
instruments:
  - Piano
  - Guitar
  - Vocals
---

John Lennon was an English singer, songwriter, musician and peace activist who achieved worldwide fame as the founder...
```

Up there is our source, our input. We'll want to transform it into this data object:

```text
"fullname" String
"firstname" String
"lastname" String
"birthdate" Date
"city" String
"age" Int
"instruments" Map
  "number" int
  "string_rep" String
  "list" Slice
"songs" Slice
```

## Transform with a range

Let's range on our gents and create a new slice with the transformed entries:

```go-html-template
{{ $new_gents := slice }}
{{ range site.RegularPages ".Type" "gent" }}
  {{ $new_gents = $new_gents | append (dict
    "fullname" .Title
    "firstname" (index 0 (split .Title " "))
    "lastname" (index 1 (split .Title " "))
    "birthdate" .Date
    "city" "Liverpool"
    "instruments" (dict
      "list" .instruments
      "string_rep" (delimit .instruments ", " "and")
      "number" (len .instruments)

    )
  )
  }}
{{ end }}
```
### Name

```go-html-template
"fullname" .Title
"firstname" (index 0 (split .Title " "))
"lastname" (index 1 (split .Title " "))
```

First thing of note is that we only have a fullname under the file's `.Title`. We add it as `fullname` because it makes much more sense.

If you've followed the first part well you should be able to see what's happening next.
We're using `split` a function which does the opposite of `delimit`. It takes a string as first parameter and creates a slice with all the substrings delimited by the second parameter --- here a whitespace between our two words.
Of course, the firstname will be the first entry at 0 and lastname the second one at 1. We use `index` to retrieve those.

### Birthdate

```go-html-template
"birthdate" .Date
```

We also pass the entry's `.Date` as `birthdate`.

### City

```go-html-template
"city" "Liverpool"
```

We know the city is always "Liverpool"!

### Instruments

```go-html-template
"instruments" (dict
  "list" .instruments
  "string_rep" (delimit .instruments ", " "and")
  "number" (len .instruments)

)
```

We've also created an `instruments` maps with various informations that we could use.
Under `.list` we have the raw list from our content file.
Under `string_rep` we have a string representation of the list built with the now familiar `delimit`.
And finally, under `.numbers` the numbers of instruments. `len` is a useful function evaluating the length of a slice!

Now if our project needs to sort out gents by the number of instruments they play, it would be just as easy as:

```go-html-template
{{ $gents := sort $new_gents "instruments.number" }}
```

## Transform with a partial

That's really good, but we should really isolate our transforming operations in a returning partial so the above is cleaner:

```go-html-template
{{ $new_gents := slice }}
{{ range $gents }}
  {{ $new_gents = $new_gents | append (partial "gent_transformer" .) }}
{{ end }}
```

And from that partial we'd return a simple map of our new transformed gent.

```go-html-template
{{/* /layouts/partials/transform_gent.html */}}
{{ return dict
    "fullname" .Title
    "firstname" (index 0 (split .Title " "))
    "lastname" (index 1 (split .Title " "))
  [etc...]
}}
```

## Inside our transformer

Nice. Now let's focus on the content of `partials/transform_gent.html`. It's really unsafe of us to assume all those keys are filled.

What if there is no instruments? Then we should probably do not use `delimit`, and simply return an empty slice!

What if there is no "lastname"? Then our `index` will definitely fail and break our build as a result.

We cannot simply declare our `dict` in one shot anymore. We have to increment the additions of key/value pairs based on certain conditions.

Adding to a map? Awesome, we've covered it in the [last article]({{< relref "post/hugo-data-series/part-2#add-to-a-map" >}})!

Well... We've covered one way to do it with `merge`. But there is one serious problem with the `merge` technique: it's pretty slow. And understandably as for every addition, it invokes two functions, `merge` and the creation of a new map with `dict`.

If you only have a few hundred gents, it should be okay, but if you need to transform thousands of them, you'll end up bumping your build time considerably.
The reasonable approach is `Scratch`. Scratch is seldom used these days but it remains the best solution to modify maps!

{{< notice >}}
We'll limit ourselves to the [`.SetInMap` scratch method](https://www.regisphilibert.com/blog/2017/04/hugo-scratch-explained-variable/#scratchsetinmap). It takes three parameters, the map to modify, the concerned key and the value. If the key exists, it overwrites its value, if it does not exist, it creates it with the given value.
{{< /notice >}}

Let's start... from `.Scratch`!

```go-html-template
{{/* /layouts/partials/transform_gent.html */}}
{{ $s := newScratch }}
{{ $s.Set "gent" dict }}

{{ return $s.Get "gent" }}

```

1. First, we store our scratch instance in a `$s` variable (short for... Scratch!). All its methods and data will be stored in there.
2. Then we store an empty map in our scratch called `"gent"`
3. Right after that we'll proceed to our various conditions and data manipulations.
4. At the end, we return the `"gent"` map stored in the `$s` Scratch.

Ok let's start safely transforming our gents and improve our code while we're at it!

### Name

First let's improve that firstname/lastname thing. Currently it will only work with the most "two words" names like _John Lennon_ but what if a zealous editor entered `title: John Winston Lennon`. Now our little concoction would use the wrong substring as `lastname`. Another problem could occur if the editor enters `title: Ringo`. This time we have a broken build as `index . 1` does not exist!

First we need to make sure we have at least 2 strings seperated by a whitespace. We'll use `len` to retrieve the number of strings contained in the slice returned by `split`.

```go-html-template
{{ with split .Title " " }}
  {{ if gt (len .) 1 }}
    🎉
  {{ end }}
{{ end }}
```

Having more than one does not mean we have two, there could be 3 or 5 words in there. Let's use `first` and `last` on the resulting slice! This way we'll be sure to only get the first and last strings. Because we're always using `with`, it's safe to use `index`.

```go-html-template
{{ with split .Title " " }}
  {{ if gt (len .) 1 }}
    {{ with first 1 . }}
      {{ $s.SetInMap "gent" "firstname" (index . 0) }}
    {{ end }}
    {{ with last 1 . }}
      {{ $s.SetInMap "gent" "lastname" (index . 0) }}
    {{ end }}
  {{ end }}
{{ end }}
```

Finally we'll decide what to do if we only have one word in there. I guess it could be the firstname...

```go-html-template
{{ with split .Title " " }}
  {{ if gt (len .) 1 }}
  [...]
  {{ else }}
    {{ $s.SetInMap "gent" "firstname" (index . 0) }}
  {{ end }}
{{ end }}
```

{{< notice >}}
If it's your first time seeing `gt` or `with`, you should probably hit {{< link "post/hugo-data-series/part-1" >}}! It's a great refresh or introduction on everything Go Templates!

First time seeing `first` or `last`? You've missed the second part: {{< link "post/hugo-data-series/part-2" >}}!
{{< /notice >}}

### City

Now we need to improve that city assumption. Yes for now we only have gents from Liverpool! But our gents project is bound to scale to more gents and bands!

For now we could simply default to Liverpool but still check for a `city` Front Matter value.

This is tempting:
```go-html-template
{{ $city := "Liverpool" }}
{{ with .Params.city }}
  {{ $city = . }}
{{ end }}
{{ $s.SetInMap "gent" "city" $city }}
```
There's much more simpler though with the `default` function! It takes two parameters, first one is the default value to be used, second one is the input whose value will be tested before using the default.

```go-html-template
{{ $s.SetInMap "gent" "city" (default "Liverpool" .Params.city) }}
```

With the above, if `.Params.city` is missing from the Front Matter or equals to `false` or is an emtpy string, our transformed gent's city will read `Liverpool`, otherwise, it'll be whatever the editor wanted it to be!

### Birthdate and Age

Nothing new for the birthdate except we condition its addition on the existence of a `.Date`.

```go-html-template
{{ with .Date }}
  {{ $s.SetInMap "gent" "birthdate" . }}
{{ end }}
```

Easy!

For the age, we'll perform one easy calculation with the `sub` function discussed [earlier in the series]({{< relref "post/hugo-data-series/part-1#numbers" >}}) and the `now` function. The `now` function simply returns the current time in the form of a Go Date object with among many a `.Day`, `.Month` and `.Year` methods.

```go-html-template
{{ with sub now.Year .Date.Year }}
  {{ $s.SetInMap "gent" "age" $age }}
{{ end }}
```

### Now some songs?
Wouldn't it be nice to list all the songs attributed to those creative gents even though we don't have that information in our content files?

Now that we are very confortable with handling data, we can try get it from the cloud using `.GetRemote`!

I set up yet another Beatles API at `https://ya-beatles-api.netlify.app/songs`. This endpoint will return a JSON array of songs formatted like so:

```json
[
  {
    "name": "A Day in the Life",
    "songwriters": [
      "John Lennon",
      "Paul McCartney"
    ],
    "year": 1967
  },
  {etc...}
]
```

We want to fetch this data, and list the song names attributed to each of our gents. This should be fun and a nice recap of what we've been learning over the course of this series.

```go-html-template
{{ with resources.GetRemote "https://ya-beatles-api.netlify.app/songs" }}
  {{ with .Content | unmarshal }}
    {{ $songs := slice }}
    {{ with where . "songwriters" "intersect" (slice $.Title) }}
      {{ range . }}
        {{ $songs = $songs | append .name }}
      {{ end }}
    {{ end }}
    {{ with $songs }}
      {{ $s.SetInMap "gent" "songs" . }}
    {{ end }}
  {{ end }}
{{ end }}
```

1. We use [resources.GetRemote](https://github.com/regisphilibert/ya-beatles-api) to fetch the API endpoint.
2. We turn its content into Hugo data with `unmarshal`.
3. We create an emtpy [slice]({{< relref "post/hugo-data-series/part-2#creating-a-slice" >}}) for our songs.
4. Using [with]({{< relref "post/hugo-data-series/part-1#with-the-other-condition" >}}), [where]({{< relref "post/hugo-data-series/part-2#filtering" >}}) and [intersect]({{< relref "post/hugo-data-series/part-2#now-we-want-all-gents-playing-the-guitar" >}}) we filter all the songs form the API to only keep the ones whose `.songwriters` includes the name of our gent.
5. Using [range]({{< relref "post/hugo-data-series/part-2#creating-a-slice" >}}), we loop on our filtered songs and [append]({{< relref "post/hugo-data-series/part-2#adding-to-a-slice-or-append" >}}) our `$songs` array with the `.name` of the song at cursor.
5. Using `with` again, we make sure the above did populate our `$songs` array and if so, store its value in our local scratch's "songs" key.
6. Done!

## One more thing to "apply"!

Remember at the beginning of this article when we applied the transformations to our gents with a `range`:

```go-html-template
{{ $new_gents := slice }}
{{ range $gents }}
  {{ $new_gents = $new_gents | append (partial "gent_transformer" .)
{{ end }}
```

It is not ideal! There is an underated Hugo function called [apply](https://gohugo.io/functions/apply/#readout) we can use instead.
It takes as first argument a slice and as second the "function" to apply. All subsequent arguments are passed to the applied function.

For example we could do:

```go-html-template
{{ $gents := slice "John" "Paul" "George" "Ringo" }}
{{ $gents = apply $gents "printf" "I love %s" "." }}
```

And our `$gents` array would now hold the following strings:

```text
[I love John, I love Paul, I love George, I love Ringo]
```

Now, using `apply`, we can apply our transformations without a `range`.
```go-html-template
{{ $new_gents := apply $gents "partial" "transform_gent" "." }}
```

## Finally outputing our data!

Now that we're done formatting or data we can keep the Hugo logic in our template to the minimum. And after reading this series on Hugo and Data, you should be perfectly capable of understanding the following without any help:

```go-html-template
<h2>Gents from Britain</h2>
{{ $gents_pages := where site.RegularPages "Type" "gent" }}
{{ $gents := apply $gents_pages "partial" "transform_gent" "." }}
{{ range $gents }}
  <details>
    <summary>{{ .fullname }}</summary>
    <dl>
      {{ range $key, $value := . }}
      <dt>{{ $key }}</dt>
      <dd>
        {{ if reflect.IsSlice . }}
        <ul>
          {{ range . }}
          <li>{{ . }}</li>
          {{ end }}
        </ul>
      {{ else }}
        {{ . }}
      {{ end }}
      </dd>
      {{ end }}
    </dl>
  </details>
{{ end }}
```


## Conclusion

I hope this has been a fun and detailed way to cover everything there is to know about Hugo and Data to start or complement existing data-heavy Hugo projects.

The final code resulting in our series is available to look at at https://github.com/regisphilibert/gents-from-britain
The code for the Beatles API  (built with Hugo) is available here: https://github.com/regisphilibert/ya-beatles-api