---
date: 2017-04-10T18:58:30-04:00
lastmod: 2018-01-15T14:15:30-04:00
tags: ["hugo", "Go Template", "Front End", "Go"]
draft: false
toc: false
title: Hugo Translator
slug: hugo-cheat-sheet-go-template-translator
subtitle: a cheat sheet
aliases: 
    - blog/2017/04/hugo-go-template-translator-explained-understanding
description: "Go Template is the templating language used by Hugo. It is a far stretch from those well known Templating languages out there... Using comparison with more familiar syntaxes, I wrote this modest cheat sheat article to try and help unveil the misteries of Go Template."
---

Go Template is the templating language used by Hugo and other Go systems. Now it is not Twig or Blade or Liquid, don't get fooled by the familiar curlies. It is a far stretch from those well known Templating Languages out there...

~~~go
{{ printf "Hello %s %s. %s" $firstname (slicestr $middlename 0 1) $lastname }}
~~~
What is this  😨

~~~go
{{ if or (eq firstname "George") (eq firstname "Daniel") }}
~~~
or that ? 😱


The first time you're gonna stumble on the syntax above may be a bit deconcerting if you come from more conventional languages. 

I spent a lot a time trying to figure out how best to use Go Template.

Using comparison with more familiar syntaxes, I wrote this modest cheat sheat article to try and help unveil the misteries of Go Template 
<!--more-->
## Arguments

Go Template functions don't use any parentheses to contain arguments, nor commas to seperate such arguments

From
~~~php
<?php printf("Hello %s %s", $firstname, $lastname); ?>
~~~
To
~~~go
{{ printf "Hello %s %s" $firstname $lastname }}
~~~

We can use a function as an argument, that's when parentheses come handy.
~~~go
{{ printf "Hello %s %s. %s" $firstname (slicestr $middlename 0 1) $lastname }}
~~~
## Concatenation

`printf` is your friend.

From
~~~php
$fullname = $firstname . ' ' . $lastname
~~~
To
~~~go
{{ $fullname := printf "%s %s" $firstname $lastname }}
~~~

{{< notice >}}
###### Concatenation hacks

`add` joins two strings together but it is limited to two.

[`delimit`](#helpers) brings easy readability and an unlimited number of strings. But the common delimiter may bring issues on more complex sentences. Oh and yeah, it's a __hack__.
{{< /notice >}}
## Conditions

Conventional templating languages systematically offer an intuitive syntax for conditions. Go Template does not. It gives you some bool functions to use in place of conditions.


### bool (the simple one)
| from | to |
|:------|:-----|
|{{< highlight twig >}}{% if firstname %}{{< / highlight >}} |{{< highlight go >}}{{ if $firstname  }}{{< / highlight >}}|

### !bool
 from | to 
:------|:-----
{{< highlight twig >}}{% if !firstname %}{{< / highlight >}}|{{< highlight go >}}{{ if not $firstname  }}{{< / highlight >}}

### ==
 from | to 
:------|:-----
{{< highlight twig >}}{% if firstname == "Fabien" %}{{< / highlight >}}|{{< highlight go >}}{{ if eq $firstname "Fabien" }}{{< / highlight >}}

### !=
 from | to 
:------|:-----
{{< highlight twig >}}{% if firstname != "Fabien" %}{{< / highlight >}}|{{< highlight go >}}{{ if ne $firstname "Fabien" }}{{< / highlight >}}

### >
 from | to 
:------|:-----
{{< highlight twig >}}{% if value > 3 %}{{< / highlight >}}|{{< highlight go >}}{{ if gt $value 3 }}{{< / highlight >}}

### >=
 from | to 
:------|:-----
{{< highlight twig >}}{% if value >= 3 %}{{< / highlight >}}|{{< highlight go >}}{{ if ge $value 3 }}{{< / highlight >}}

### <
 from | to 
:------|:-----
{{< highlight twig >}}{% if value > 3 %}{{< / highlight >}}|{{< highlight go >}}{{ if lt $value 3 }}{{< / highlight >}}

### <=
 from | to 
:------|:-----
{{< highlight twig >}}{% if value >= 3 %}{{< / highlight >}}|{{< highlight go >}}{{ if le $value 3 }}{{< / highlight >}}

### What about OR, AND ? 

Well... **or** and **and** are other functions which take an unlimited number of arguments. We can use the 'conditionnal' functions mentionned above inside parentheses as arguments so...

#### OR
from
~~~twig
{% if firstname == 'George' or firstname == 'Daniel' %}
~~~
to
~~~go
{{ if or (eq $firstname 'George') (eq $firstname 'Daniel') }}
~~~

#### AND
from
~~~twig
{% if $value >= 3 and $value <= 6 %}
~~~
to
~~~go
{{ if and (ge $value 3) (le $value 6) }}
~~~

### What about ternary operators, x ? x : y ? 

Yep, since Hugo .27 `cond` lets you do just that[^1].

from
~~~php
<?php echo $hour < 12 ? "Good Morning" : "Good Afternoon" ?>
~~~
to
~~~go
{{ cond (lt $hour 12) "Good Morning" "Good Afternoon" }}
~~~

## Variables

Variables in Hugo's Go Template can be useful but carries a major caveat. There is no way to simply override a variable value other than using .Scratch as explained [here]({{< ref "hugo-scratch/index.md" >}})

For clarity I prefixed my variables with the old fashioned **$** but you don't have to.

Declaring a variable, no matter its type :

~~~go
{{ $city := "Montreal" }}
~~~

### Strings

Pretty straight forwards, same exemple as above.

### Arrays

They're called slice and are declared as such:
~~~go
{{ $names := slice "John" "Paul" "Ringo" }}
~~~

### Associative arrays

Associative arrays are called maps. You can create a flat one with **dict**. 
**dict** takes an even number of arguments where odds are keys and evens values.

~~~go
{{ $beatle := dict "firstname" "John" "lastname" "Lennon" "birthplace" "Liverpool" }}
~~~

To create a mutlilevel associative array you would have to use **dict** inside **dict**
~~~go
{{ $beatles := dict "lead" (dict "firstname" "John" "lastname" "Lennon" "birthplace" "Liverpool" ) "drummer" (dict "firstname" "Ringo" "lastname" "Starr" "birthplace" "Liverpool" )}}
~~~
### Index / Getting array values

**Index** is the function you use to retrieve values from slices or maps. The first argument is the first level key/index, the following ones are they keys/index after that level.

Using our exemples from above : 

~~~go
{{ index $names 1 }}
// Paul

{{ index $beatle "lastname" }}
// Lennon

{{ index $beatles "drummer" "lastname" }}
//Starr
~~~

## Helpers

**implode**:
~~~php
<?php 
$names = ["John", "Paul", "Ringo"];
echo implode(", ", $anmes);
~~~
to
~~~go
{{ $names := slice "John" "Paul" "Ringo" }}
{{ delimit $names ", "}}
~~~

**Finding a string in a chain**:
~~~javascript
if(sentence.indexOf(thatWord) !== -1)
~~~

~~~php
<?php if(strpos($sentence, $thatWord) !== false) ?>
~~~

to
~~~go
{{ if strings.Contains $sentence $thatWord }}
~~~

###### Final notes: 
I'll keep updating the article with new notions in the mean time you can suggest some in the comments.  

[^1]: [Cameron Moore](https://github.com/moorereason) was kind enough to point to the `cond` function which is in place [since 0.27](https://github.com/gohugoio/hugo/commit/0462c96a5a9da3e8adc78d96acd39575a8b46c40).



