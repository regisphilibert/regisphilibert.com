---
date: 2022-01-02T9:32:27.000Z
title: "Hugo and Data: The Basics"
slug: manipulation-and-logic-the-basics
aliases:
- /post/hugo-data-manipulation-and-logic-the-basics
tags:
  - hugo
  - data
  - modules
  - JAMStack
  - logic
subjects:
  - dev
description: This article simply addresses the basics of the Go Template, along with some critical functions Hugo offers to complement it. If you're starting your Hugo journey, or simply feel like several concepts remain obscure to you after years of Hugo, read on!
---

Hugo is built with [Go](https://go.dev/?gclid=Cj0KCQiAw9qOBhC-ARIsAG-rdn7THucmaRhNs4pAP_KAa2ic7wC2ar9smJR2I5WAl_PIxhmVTOCkICIaAq6xEALw_wcB) but as users, we only get to modify template files using Go's templating language: Go Template. Go Template concepts are different than its more commonly used counterparts and can be intimidating for new comers.

This article addresses the basics of the language, along with some critical functions Hugo offers to complement it. If you're starting your Hugo journey, or simply feel like several concept remains obscure to you after years of Hugo, this useful recap is for you!

## Variables

Hugo variables are always prefixed with a `$` sign. However, variables are initialized and then assigned differently.

Initialization is simply the first time we store anything into a variable. Here we initialize the variable:

```go-html-template
{{ $gent := "John" }}
```

Here we've assigned a new value (John Lennon) to our pre-initialized variable:

```go-html-template
{{ $gent = "John Lennon" }}
```

This will mostly be used in the context of a conditional "overwrite."

## Loops

There is only one kind of loop in Go Template, its called `range`.

```go-html-template
{{ range $beatles }}
  This member is {{ . }}
{{ end }}
```

Above the dot holds the value at cursor. So ranging on a list of strings, like say, names of gentleman forming a band, that dot will be their name.

```html
This member is John
This member is Paul
This member is Ringo
This member is George
```

## Conditions

Go Template only knows `if` and `if else` as conditionals proper. Everything beyond them are functions in Hugo.

### Comparing functions

```go-html-template
{{ if eq $gent "John" }}
  We're missing a lastname
{{ else if eq $gent "John Lennon" }}
  We have a full name
{{ else }}
  Not sure!
{{ end }}
```

Above, `if` is the condition, and `eq` is a function (short for equal) which takes an infinite number of parameters. It compares the first parameter with any of the subsequent ones.

If `$gent` is either equal to "John Lennon" or "Paul McCartney" we have a Beatle!

```go-html-template
{{ if eq $gent "John Lennon" "Paul McCartney" }}
  We have a Beatle!
{{ end }}
```

Hugo sports several other "comparing" functions. Unlike `eq` they only take two parameters. The first one would sit on the left of the operator, the second one the right.

| function | short for                                                    | other language equivalence |
| -------- | ------------------------------------------------------------ | -------------------------- |
| eq       | first parameter is Equal to any other parameters             | `==`                       |
| ne       | first parameter is Not Equal to second parameter             | `!=`                       |
| gt       | first parameter is Greater Than second parameter             | `>`                        |
| ge       | first parameter is Greater than or Equal to second parameter | `>=`                       |
| lt       | first parameter is Lower Than second parameter               | `<`                        |
| ge       | first parameter is Lower than or Equal to second parameter   | `<=`                       |
| in       | first parameter Contains second parameter                    |
{.condition-examples}

### OR and AND

Just like comparison, `or` and `and` are also functions. They take two parameters whose value will be evaluated.

```go-html-template
{{ if and (in $gent "John") (in $gent "Lennon") }}
  That must be John Lennon
{{ end }}
```

Above we're using the `and` function to test two conditions. Those conditions are using `in` which tests if a given substring is contained within a string.

## With, the other condition

Another useful action in Hugo is `with`.

```go-html-template
{{ with $gent }}
  {{ . }} is the gent.
{{ else }}
  We have no gent.
{{ end }}
```

It is followed by a function or a variable whose value is evaluated. Upon success, the code inside `with` is executed, and, the context shifts to the successfully evaluated value. It can take an optional `else` to be executed upon failure. Note that the context does not shift on failure.

{{< notice >}}
**Context shifting in Hugo** cannot be covered in one paragraph. For a more detailed article on one of the most useful, yet puzzling Hugo concept you should give a read to [Hugo, the scope, the context and the dot](https://www.regisphilibert.com/blog/2018/02/hugo-the-scope-the-context-and-the-dot/) by yours truly.
{{< /notice >}}

## A word on Go Template

By now you will have noticed some peculiarities with the Go Template syntax.

**1. Function parameters are not delimited by commas or wrappped in parenthesis like most languages.**

```go-html-template
{{ print "Hello" "john" " and " "paul" }}
```

Now if you are to include functions as argument, then you wrap them in parenthesis like so:

```go-html-template
{{ print "Hello" (upper "john") " and " (upper "paul") }}
```

**2. Every code action stands within double curlies**

```go-html-template
{{ if eq $gent "John" }}
  Hello John
{{ else if eq $gent "Paul" }}
  Hello Paul
{{ else }}
  Hello You
{{ end }}
```

**3. Some actions shifts the contet.**

{{< notice >}}
Shouldn't `eq $gent "John"` be wrapped into parenthesis?
No necessarily. Because `if` is at the root of your curlies, Go Template can perfectly identify it for what it is, while still properly evaluating the following word and its potential followers as a function and its arguments.
{{< /notice >}}

## Basic Types

### Strings

Strings are very important when dealing with templating. We'll need to format them or transform them a lot. One of the most useful function will be `printf`. It takes an unlimited number of parameters. First one is a string wich includes "verbs", subsequent ones are any variables or else whose value needs to replace the "verbs"

```go-html-template
{{ printf "%s was a famous song writer." $gent }}
```

Above we have a sentence whose verb `%s` will be replaced by the value of our `$gent`. Note that the verbs must match the type of the variable value. [Here is a list of available verbs](https://pkg.go.dev/fmt#hdr-Printing).

Another useful printing function is `print`. This one does not use any verb, it just takes a infinite list of parameters and concatenate their values.

```go-html-template
{{ print $gent " was a famous song writer for " $band }}
```

### Numbers

Hugo can use many types of numbers, integer, floats etc... Just like for conditions, their computing is made through the use of functions. First parameter sits on the left side of the conventional operator, second parameter on the right side.

| function | short for                                            | other language equivalence |
| -------- | ---------------------------------------------------- | -------------------------- |
| add      | first parameter is Added to second parameter         | `+`                        |
| sub      | second parameter is Substracted from first parameter | `-`                        |
| mul      | first parameter is Multiplied by second parameter    | `*`                        |
| div      | first parameter is Divided by second parameter       | `/`                        |
{.condition-examples}

These are just the basics but [more are available](https://gohugo.io/functions/math/#readout) for advanced usage.

## Conclusion

Congratulation for reviewing the basics of Go Template in Hugo! By reviewing the basics for variables, conditions, loops, strings and numbers, we might have shed some lights on some everyday concepts that remained obscure even to advance users!

You can keep on learning with the next article [Hugo and Data: Advance manipulation with Slices and Maps]({{< relref "post/hugo-data-series/part-2" >}}) which goes deeper into Go Template and Hugo by manipulating its more advanced data types: Slices and Maps.
