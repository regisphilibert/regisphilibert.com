---
title: "Hugo Pipes Revolution"
date: 2018-07-19T17:28:14-04:00
subtitle: A Hugo built-in asset pipeline
slug: hugo-pipes-and-asset-processing-pipeline
description: Hugo's just got itself a built-in set of asset processing methods. From now on, Hugo will take care of bundling, minifying, fingerprinting our assets and even compiling our sass files! All of this without any external build tools 🤩. In this post we’ll cover how easy it is to implement a basic Hugo Pipes asset pipeline and finally turn to more advanced useage, involving relinquishing some Sass and JS variables to our editors.
tags:
 - Hugo
 - Sass
 - Assets
 - Build tools
toc: true
twitter_card: summary_large_image
---


```go-html-template
{{ $style := resources.Get "main.scss" | toCSS | minify | fingerprint }} 
<link rel="stylesheet" href="{{ $style.Permalink }}" emotion="🤩">
```

Hugo's roadmap got itself a new milestone when .43 delivered Hugo Pipes, a built-in set of asset processing methods.

From now on, Hugo will take care of bundling, minifying, fingerprinting our assets and even compiling our sass files! All of this without any external build tools.

In this post we’ll go through Hugo Pipes methods to cover how easy it is to implement a basic Hugo Pipes asset pipeline before turning to more advanced use cases, involving relinquishing some Sass and JS variables to our editors.

<!--more-->

## What does it change?

Let’s pause for a minute to process the changes brought by Hugo Pipes and how they’ll impact me, and hopefully you too.

I’m using version control and I want to keep my processed sources (distributed) out of my repository! 

This means I have to fill my `README.md` with instructions on how to `npm install`, `npm run dev`, `grunt watch` etc… I have to educate collaborators and content editors alike on command line and nodejs install, risking much frustration on the other side.

This may also lead to that dreaded [security alerts](https://blog.github.com/2017-11-16-introducing-security-alerts-on-github/) rabbit hole, the worst place for my theme users or collaborators to spend their afternoon… 🐇🕳️

Also, I’m a CI newbie, which means I don’t know how to easily set up a deployment process which would ensure my host doesn’t spend too much time installing Ruby (for SASS), node, and whatever my `packages.json` points to for every build. I know there are solutions out there, but not an « out of the box » one that I know of.

As a result, I often end up committing my `dist` directory pending someone would come and help… 😔

Turns out Hugo just did, and I’m psyched! 😇

## Enters Hugo Pipes🚰

Enough about me, let’s talk about Hugo’s newly introduced Asset Processing set of methods! 
It’s been the on the #staticgen news cycle for more than a week now so it’s time to get acquainted!

### Assets is the new static (wait... no!)

First thing of note, these methods will only be available on files living in the `assets` directory, think of it as a `static` directory except the files will not be published by default.

Much like its `static` counterpart:

- Its location is configurable with the `assetDir` key of your `config.yaml`. (will default to `assets`)
- It follows the Hugo’s file unison logic. Meaning, anything in your `project/assets` will override homonymous files of `your-theme/assets`. 

The big difference with `static` is that the files contained in `assets` will not be published unless the `.Permalink` or `.RelPermalink` of their resource object is used.

As of yet you can only define one `assets` directory.

### Hugo Pipes vs Go Pipes
We’ll be using [Go Template Pipes](https://gohugo.io/templates/introduction/#pipes) a lot in this article. They are not to be confused with the topic at hands but in a few words, they allow to chain several template functions together using the output of the former as the input of the latter.   

Turning this:
```go-html-template
{{ $teaser := markdownify (index .Params "teaser") }}
{{ safeHTML $teaser }}
```
Into that:
```go-html-template
{{ index .Params "subtitle" | mardkownify | safeHTML  }}
```

## Let's dive in! 🏊

We could simply list the methods and explain what they do, but that is perfectly done in the official [doc](https://gohugo.io/hugo-pipes/) 😊, so instead, we’ll dive right in and introduce the methods as we go along.

Here’s our imaginary Hugo project craving for a built-in asset pipeline:

1. We have a sass directory containing many sass files all imported by `sass/main.scss`. We want to apply auto-prefixing on our outputted `style.css` then minify and lastly fingerprint it for cache busting!
2. On the script side, we have our `main.js` which needs `plugins.js` on every page and `carousel.js` on the portfolio section. Also, that carousel script requires jQuery… 😒.
3. Last but not least, we’d love to let our editors customize some sass and javascript variables via their `config.yaml` or Front Matter.

### Here we .Get.
This is how you grab that asset file and turn it into a processable resource. Once you do that, every Hugo Pipes’ method will be applicable to it.

`.Get` looks in the `assets` directory of your project, so its second parameter is our filepath relative to that directory.

Let’s start with our Sass file and go `.Get` it.

```go-html-template
{{ $styleSass := resources.Get "style/main.scss" }}
```

### Sass to CSS with .toCSS
The name is pretty intuitive as `.toCSS` will compile our `sass` or `scss` file into a `css` file!

Here we go:
```go-html-template
{{ $styleCSS := $styleSass | resources.ToCSS }}
```

What we just did is use the resource we created from our asset file above and used `resources.ToCSS` on its piped in input.

Just like most of the following methods, you can pass a `dict` of [options](https://gohugo.io/hugo-pipes/scss-sass/#options) as parameter.

Here we want to specify the output path and add a source map, so we’ll use the following bit instead:

```go-html-template
{{ $styleCSS := $styleSass | resources.toCSS (dict "targetPath" "custom/style.css" "enableSourceMap" true) }}
```


{{% notice title="Only Sass ? 🤔" %}}
For now, yes and I believe it was an easy pick. Ask around, look up for user share, Sass is number one. `.ToCSS` may one day support other preprocessors, but until then it's only __Sass__ or __Scss__.
{{% /notice %}}

### Autoprefixing with .PostCSS
`resources.PostCSS` does require nodeJS to run. But shall you be ok with a touch of `npm` in your environment, you should definitely give it a spin. I’ll let go of my good-riddance-npm smirk and use it in this project so we can « autoprefix » our `style.css`.
  
Hugo will look for a PostCSS config file at the root of our theme or project under the name `postcss.config.js`. Ours is pretty straight forward and look like this:

```javascript
module.exports = {
	plugins: {
		autoprefixer: {
			browsers: [
				"last 2 versions",
				"Explorer >= 8",
			]
		}
	},
}
```

Hugo needs `postcss-cli` to process `PostCSS` so we should install it along our unique PostCSS plugin: `autoprefixer`.
Once we have happily run `npm install` ⌛, we can safely use PostCSS on our style file:

```go-html-template
{{ $styleAutoprefixed := $styleCSS | resources.PostCSS }}
```

Shall we need our PostCSS config file to live elsewhere, we could have set its path in the `.PostCSS` method’s [options](https://gohugo.io/hugo-pipes/postcss/#options)’ dict:
 
```go-html-template
{{ $styleAutoprefixed := $styleCSS | resources.PostCSS (dict "config" "config/postcss.js") }}
```

### Minifying with .Minify
We're way past 2010 these days so we obviously can’t serve our CSS file as is! Let’s turn hundreds of lines of readable code into a wall of glyphs and save some precious bandwidth in the process…

```go-html-template
{{ $styleMinified := $styleAutoprefixed | resources.Minify }}
```

### Fingerprinting with .Fingerprint
Now, we’d usually add some sort of hash after our stylesheet url for some good old cache busting. Previously it involved some `readFile` and [`sha`](https://gohugo.io/functions/sha/#prose) or `now.Unix`if you were lazy like me, but we don’t need that complexity anymore.
`.Fingerprint` will update your resource’s `.Permalink` with a `sha256` hash (or `md5` or `sha512` if passed as argument). 

```go-html-template
{{ $styleFingerpinted := $styleMinified | resources.Fingerprint }}
```

### What a style!
We’re currently done with our style file and ready to drop that `<link>`.

But before we do, let's get rid of those many lines of variable declarations. They really helped pacing our walkthrough here but they're an eye sore. Using Go Pipes we'll squash them into one happy line!
And because each Hugo Pipes transformation method uses a camel-cased alias, we can even go furter and write this beauty:

```go-html-template
{{ $style := resources.Get "sass/main.scss" | toCSS | postCSS | minify | fingerprint }} 
<link rel="stylesheet" href="{{ $style.Permalink }}" emotion="🤩">
```

### Bundling our resources with .Concat

Let’s move our attention to our scripts now. As we mentioned previously, we have several of those and we would like to concatenate them into one big file. We cannot use the same combination of files on every page though.

Let’s start by storing all our script files as independent resources.

```go-html-template
{{ $main := resources.Get "js/main.js" }}
{{ $plugins := resources.Get "js/plugins.js" }}
{{ $carousel := resources.Get "js/carousel.js" }}
{{ $jQuery := resources.Get "js/jquery.js" }}
```

For most of our pages, we’ll use `resources.Concat` to bundle `$plugins` and `$main`, in that order!

```go-html-template
{{ $defaultJS := slice $plugins $main | resources.Concat "js/global.js" }}
```

For most of the transformation methods we used with our style, the resulting filepath was guessed by Hugo Pipes. 
It usually does so by taking the original asset filepath and modifying its extension when needed. But here, we’ve got several files and filepaths and Hugo won’t take any guess so we need to set our desired filepath as argument.

Great, we have a bundled `js/global.js` for most of our pages.

Now for our portfolio section, it is a bit more complex as we need both `jQuery` and the carousel thingy.

```go-html-template
{{ $portfolioJS := slice $plugins $main $jQuery $carousel |resources.Concat "js/global-carousel.js" }}
```
Now we have two bundles to chose from: `js/global.js` and `js/global-carousel.js`.

Assuming we’re in the near future where Go Template allows variable overwrite, this would be our code:

```go-html-template
{{ $script := $defaultJS }}
{{ if eq .Section "portfolio" }}
	{{ $script = $portfolioJS }}
{{ end }}
{{ $globalJS := $script | resources.Minify | resources.Fingerprint }}
<script src="{{ $globalJS.Permalink }}"></script>
```

### Securing our script!
[Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) is not broadly adopted yet, but we’re already familiar with it…

```go-html-template
<script src="https://cdn.fancyscript.com/this.js"
integrity="sha256-3edrmyuQ0w65f8gfBsqowzjJe2iM6n0nKciPUp8y+7E="
crossorigin="anonymous"></script>
```

To use it though, all we need to do is apply `resources.Fingerprint` on our resource. Once done, Hugo will add a new property, `.Data.Integrity` to the resource object. 
Because we already `.Fingerprint`ed our script above, we can just drop this:

```go-html-template
<script src="{{ $globalJS.Permalink }}" integrity="{{ $globalJS.Data.Integrity }}"></script>
```

 Which would output in your HTML something like:
```go-html-template
<script src="/js/global.8a9b235048fd76f45b330ac0064465533974e0a56b16c8adbfe9ee05e7ec16a0.js" integrity="sha256-viNbi1/jdSKJ2RjaMNoxkJur/LU4duVn6G92KVhULfM="></script>
```

If we wanted to use integrity without a Fingerprinted `.Permalink` we’d have to isolate our fingerprinted resource from the linked one like so:
 
```go-html-template
{{ $fpJS := $script | resources.Fingerprint }}
<script src="{{ $script.Permalink }}" integrity="{{ $fpJS.Data.Integrity" }}></script>
```

{{% notice %}}
When running `hugo server` you may test [.Site.IsServer](https://gohugo.io/variables/site/#site-variables-list) before adding fingerprint, SRI and minify to your assets.
{{% /notice %}}

### Customizing our sass variables with .ExecuteAsTemplate

Let’s level up and talk advanced Hugo Piping!

Wouldn’t it be great if our users could define the colour of our theme or project’s general text, or the background colour of their header? 
All of this without writing some ugly `<style>` tags in our template, but by naturally updating our Sass variables? I know I’d love that!

This is how our `sass/main.scss` currently looks like.
```sass
$backgroundColor: #e6e4e4;
$textColor: #000000;
@import "header";
@import "main";
// Etc...
```

What we want is to replace those variables' value with some Go Template code using `.Param`.

Let’s set our variables in our `config.yaml`
```yaml
params:
	style:
		backgroundColor: maroon
		textColor: red
```

Now, let’s edit our `sass/main.scss` file with some Go Template magic:
```go-html-template
$backgroundColor: {{ .Param "style.backgroundColor" }};
$textColor: {{ .Param "style.textColor" }};
@import "header";
@import "main";
// Etc...
```

From now on, we __cannot__ use this asset file as is, it needs to be rendered with `.resources.ExecuteAsTemplate` so we’ll need to do something like this:

```go-html-template
{{ $style := resources.Get "sass/main.scss" | resources.ExecuteAsTemplate "style.scss" . }}
```

Above, we retrieved the sass file and turned it into a resource. Then using Go Pipes we applied `resources.ExecuteAsTemplate` on it.   

As first argument we set a filepath for the file. 

As a second argument, much like a `partial`, we passed a context to be used from within our file. Here, the dot is our page context from which we can use `.Param`.

Now `$style` will be written with its customizable variables into a processable Sass file. 
We'll be able compile it to CSS, minify it, fingerprint it and drop its `.Permalink` like any other resource!

### Customizing our JS variables with .FromString

Back to our javascript. Some `.Site.Params` and Front Matter needs to be exploitable from our javascript file because:  

- Our carousel lazyloads cloudinary images, we need the project’s cloudinary root url. 
- A component in our script uses a weather API to display a travel post’s city temperature. So we either need the page’s `weather_location` Front Matter, or our project’s default `.Site.Params.weather_location`.

Our configuration looks like this:

```yaml
#config.yaml
params:
	cloudinary: https://res.cloudinary.pipeit
	weather_location: "Montreal, CA"
```

One of our page’s Front Matter looks like this:
```yaml
# content/post/touring-the-apple.md
title: Touring the Apple!
weather_location: "New York City, NY, USA"
```

We want to inject those variables in a separate script tag to make sure it is available very early and for all of our scripts. This is what our code will look like:

```go-html-template
{{ $string := (printf "var cloudinary_url = '%v'; var weather_location = '%v';" (.Param "cloudinary") (.Param "weather_location") ) }}

{{ $filePath := printf "vars.%x.js" (.Param "weather_location") }}

{{ $vars := $string | resources.FromString $filePath }}

<script type="text/javascript" src="{{ $vars.Permalink }}"></script>
```

What now? 🧐

What we do above is hard to read but easy to explain.

```go-html-template
{{ $string := (printf "var cloudinary_url = '%v'; var weather_location = '%v';" (.Param "cloudinary") (.Param "weather_location") ) }}
```

First we use [`printf`](https://gohugo.io/functions/printf/) to build a string which will replace every `%v` [verb](https://golang.org/pkg/fmt/#hdr-Printing) with our properties’ respective value, producing something like the follwing.
```js
var cloudinary_url = 'https://res.cloudinary.pipeit'; var weather_location = 'Montreal, CA';
```
Next:

```go-html-template
{{ $filePath := printf "vars.%x.js" (.Param "weather_location") }}
```


Every resource sharing the same filepath will inevitably overwrites each other. Here we will have several variations of our `vars.js` throughout our site, we need to specify a unique file path for every version of it.   
We choose to use its only changing factor, `weather_location`, to ensure Hugo only builds one variation of `vars.js` per existing location. 

To make this unique string safely useable as filename, we use `printf` again but this time with the verb `%x` with will be replaced by a base 64 representation of our `weather_location`.

From now on if two pages use our default beautiful `Montréal, CA`, they’ll use the same resource, while this other page written from New York will use it’s own Manhattan style `vars.n3wy0rkc1ty.js`!


```go-html-template
{{ $vars := $string | resources.FromString $filePath }}
<script type="text/javascript" src="{{ $vars.Permalink }}"></script>
```

Those two last lines are pretty self explanatory. We create the resource from our string using `resources.FromString` while passing its unique `$filePath` as parameter. Lastly we drop its `.Permalink` as our script’s `src`.

We could even improve this by directly outputting the content of our resource in a `<script>` tag in order to save us an unnecessary request.

```go-html-template
<script type="text/javascript">{{ $vars.Content | safeJS }}</script>
```
{{% notice type="warning" %}}
Even though in this last improvement we didn’t use the resource's `.Permalink`, we still need to define a unique filepath for Hugo to correctly tell the two resource variations appart.
{{% /notice %}}
## Conclusion 🏁

By using using Hugo’s built-in asset pipeline Hugo Pipes, we were able with very few lines of code:

- To build a customizable CSS asset using SASS.
- To apply « autoprefix » on the resulting `.css` file.
- To mix our different script files into two distinct bundles ready to be called in our pages. 
- To output some Javascript user defined variables unique to several pages.
- To minify, fingerprint and SRI secure all of the above.

Even if many will still need nodeJS and `npm` because of PostCSS or any other asset pipeline not yet covered by Hugo Pipes, this asset revolution will undoubtedly change the way we built our projects. 
I know it has already heavily changed mine and hope it will soon change yours.

If it has already, feel free to share your Hugo Pipes own experiments and implementations in the comments!
