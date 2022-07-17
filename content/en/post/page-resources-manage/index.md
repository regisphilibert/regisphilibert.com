---
title: "Hugo Page Resources"
date: 2018-01-09T13:03:53-05:00
lastmod: 2018-03-17T11:44:00-05:00
slug: hugo-page-resources-and-how-to-use-them
subtitle: and how to use them...
toc: true
tags:
 - Hugo
 - Resources
 - Shortcodes

description: In this article we'll cover Hugo 0.32's Page Resources and its impact on the way we structure our content folders, what methods and properties it offers, how to use it in our templates and markdown and finally its newly metadata logic!
---
Hugo 0.32 launched just before the new year and it brought along two massive improvements. __Page Resources__ and Image Processing. Then Hugo 0.33 followed closely with a __metadata__ management for the __Page Resources__

In this article we'll cover __Page Resources__ and its impact on the way we structure our content folders, what __methods__ and __properties__ it offers, how to use it in our templates and markdown and finally its newly __metadata__ logic!

## What are Page Resources?

Pages can now have their own images, `.md` files or any files stored in their own content folder or __Bundle__. You can then use those files in your templates with a special method called: `.Resources`.

## How to Manage them?

### Before Page Resources

1. You had to store the files you would need for one page or post in the static folder of either your theme or your hugo install. 
2. Then you had to call for this image relative url in your markdown.
3. You had to reference them in your Front Matter so your templates knew where to look.

I personnaly used to store them under a directory named after their respective Type so I could dynamically build a path in my templates.

~~~nohighlight
.
├── content
│   ├── post
│   │   ├── i-love-eating-cupcakes.md
│   │   └── i-hate-baking-cupcakes.md
│   └── page
└── static
    └── post
        ├── yummpy-cupcake.jpg
        ├── shiny-glaze.jpg
        ├── overcooked-dough.jpg
        └── sloppy-icing.jpg
~~~

### After Page Resources: Hello Page Bundles
Now since Hugo 0.32, with Resources, you have a better option.

The content folder is a bit more clustered but every images/files are stored within their post directory Bundle. And their url will follow the posts' too.

~~~nohighlight
.
└── content
    ├── post
    │   ├── i-love-eating-cupcakes
    │   │   ├── index.md // That's your post content and Front Matter
    │   │   └── images
    │   │       ├── yummy-cupcake.jpg
    │   │       └── shiny-glaze.jpg
    │   └── i-hate-baking-cupcakes
    │       ├── index.md // That's your post content and Front Matter
    │       └── images
    │           ├── overcooked-dough.jpg
    │           └── sloppy-icing.jpg
    └── recipes
~~~

So to turn a page into a Page Bundle, you just make it a directory and an `index.md` at its root. Every other files in there will be considered its Resources.
{{< notice >}}
You need to add Resources to a page of Kind `section` or `taxonomy`? Go on and head down [there](#what-about-bundles-for-sections)
{{< /notice >}}
## What are their methods and properties?

### Available methods for .Resources

#### .Resources.ByType (func)

Allow to retrieve all the page resources by type.
```go-html-template
{{ with .Resources.ByType "image" }}
	<div class="Image">
	{{ range . }}
		<img src="{{ .RelPermalink }}">
	{{ end }}
	</div>
{{ end }}
```


#### .Resources.Match (func)

Introduced in 0.34 `.Match` allows you to retrieve resources by [Glob matching](https://en.wikipedia.org/wiki/Glob_(programming))
Along the lines of our example above, it would go this way.
```go-html-template
{{ with .Resources.Match "images/carousel/*" }}
	<div class="Carousel__slide">
	{{ range . }}
		<img src="{{ .RelPermalink }}">
	{{ end }}
	</div>
{{ end }}
```

##### Glob matching?
To illustrate Glob let's say you are looking for that sweet letter you got last year. Let's see which glob would find this prose stored as `letters/DearJohn.doc`:

- `.Resources.Match "letters/Dear*"` ✅ 
- `.Resources.Match "letters/*.doc"` ✅
- `.Resources.Match "**.doc"` ✅ 
- `.Resources.Match "**/dearjohn.doc"` 🚫
- `.Resources.Match "*.doc"` 🚫


#### .Resources.GetMatch (func)

Same as above but will only return the first matching resource.

#### <del>ByPrefix, GetByPrefix (func)</del>
Those 2 are deprecated (yep Hugo moves fast). But if you really still have to use them. They find resources using another form of matching, understand the begining of your filename.

### Available properties for one resource.
What to do when I found it?

#### .ResourceType / .MediaType 

You have serveral option to retrieve the [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types) of the resource, but it also comes with a few methods to pinpoint what you really need[^1]. 

If our resource was a PDF this is what you could get using `.MediaType`

- `.ResourceType` 👉 `pdf`
- `.MediaType` 👉 `application/pdf`
- `.MediaType.MainType` 👉 `application`
- `.MediaType.SubType` 👉 `pdf`
- `.MediaType.Suffixes` 👉 `[pdf]` (a slice of suffixes)

{{< notice type="warning" title="Be cautious of what you test!" >}}
Do not get fooled by this extension looking subtype, it does not return the file extension. When trying to identify a file type you should get extra cautious as explained below.
{{</ notice >}}

#### .Name (string)
By default this is the base filename (including the extension).
It can be overriden with the resource's Front Matter metadata.

#### .Title (string)
Same default as .Name except for Resource of type page you can expect it to return their .Title.
For resources other than pages, it can be overriden with Resources Metadada covered below.

#### .Permalink (string)
The absolute URL of the resource.

#### .RelPermalink (string)
The relative URL of the resource.

## How to use them?

Now. How can it benefit my coding? 

### In my templates?
Well from your template you can now easily retrieve the resources bundled with a post to say create a gallery in your single.html:

```go-html-template
{{ with .Resources.ByType "image" }}
	<div class="Gallery">
		{{ range . }}
			<div class='Gallery__item'>
				<img src="{{ .RelPermalink }}" />
			</div>
		{{ end }}
	</div>
{{ end }}
```

Now all you will have to do is drop your images in the post bundle directory and _voilà_!

Metadata offer a simpler way, which we will cover later.

### In my markdown?

You can also create a __shortcode__ which will retrieve a particuliar resource by its matching filename.

```go-html-template
# shortcodes/img.html
{{ $img := $.Page.Resources.GetMatch (.Get 0)}}
<figure>
	<img src="{{ $img.RelPermalink }}" alt="(.Get 1)" />
	<figcaption>(.Get 1)</figcaption>
</figure>
```

And in your markdown:

~~~Markdown
{{</* img "*overcooked-dough*" "Those cupcakes are way overcooked!" */>}}
~~~

This is a pretty simple shortcode we'll get deeper into the possibilites in another article.

## Any kind of files

You can use any file type, but knowing what you're dealing with is important. Trying to retrieve .Width of a PDF will result in an error.

Don't be fooled `.MediaType.SubType` it does not hold a file extension. 
For exemple, a `docx` file will return a `.SubType` of `vnd.openxmlformats-officedocument.wordprocessingml.document` making it impossible to safely test it.

Depending on why you are testing the file type for, I find the most simple and safest way to tell what is what is to use `in` or `intersect` in conjunction with `.MediaType.Suffixes` as illustraded below:

```go-html-template
{{ with .Resources.ByType "application" }}
  <ul>
  {{ range . }}
    <li>
      <a href="{{ .RelPermalink }}">
        {{ if (in .MediaType.Suffixes "pdf") }}
          Check out this PDF!
        {{ else if (intersect .MediaType.Suffixes (slice "docx" "docm")) }}
          Check out this Wordish Document!
        {{ else }}
          Check out this... Thing!
        {{ end }}
      </a>
    </li>
  {{ end }}
  </ul>
{{ end }}
```

- For PDFs, we only have one possible extension, so using [`in`](https://gohugo.io/functions/in/#readout), we just check if the `pdf` string is in the slice returned by `.MediaType.Suffixes`.
- Word documents can either be `docx` or `docm` so we use [`intersect`](https://gohugo.io/functions/intersect/#readout) to check if any of the two is included in the suffixes slice.

## Page Resources Metadata

[@bep](https://github.com/bep) has worked hard so we can manage metadata for our resources[^2][^3].

Since Hugo 0.33, you can assign metadata directly from the bundle's `index.md` Front Matter.
You will add an array called `resources`

This is how it looks like in the front matter. Those * in the src param look familiar? More below.

~~~yaml
resources:
- src: "*/yummy-cupcake.jpg"
  title: "Yummy Cupcake"
  name: cupcake-1
- src: "*/shiny-cupcake.jpg"
  title: "Shiny Glaze"
- src: "*/*.jpg"
  params: 
    credits: Myself the cook!
~~~

### Target one or multiple files using `src`

Each item is targeted by its `src` parameter. 

The `src` parameter will use the name of the file relative to the bundle to target which resource this metadata belongs to. Along the `.Match` Globbing mechanism, you can use the `*` to build that src.

Trying to match `images/yummy-cupcakes.jpg` : 

~~~yaml
src: 'images/yummy-cupcake.jpg' ✅
src: '*/yummy-cupcake.jpg'      ✅
src: 'images/*.jpg' 			✅
src: 'images/*-cupcake.jpg' 	✅
src: '*.jpg' 					✅

src: 'yummy-cupcake.jpg' 		🚫
src: 'yummy-cupcake' 			🚫
~~~

From our Front Matter exemple above we can see that `yummy-cupcake.jpg` and `shiny-cupcake.jpg` are getting respective titles.
On the other hand, every jpg images in the bundle including our two cupcakes will have a custom param `credits`

### Metadata parameters

`src` is not really a parameter, you got that.

#### name

Name is the name of your file. This doesn't seem much but it is very important. 

I write it in lowercase, for this is the way in you Front Matter but you should really see it as `.Name`.

We already reviewed its [default](#name-string), now you can overwrite it.

Now remember those functions `.Match` and `.GetMatch`? This is what they use, the `.Name`. So once we apply a custom `name` to yummy-cupcake.jpg, you will have to .Match this new name and not the filename. In our case, trying to match yummy-cupcake.jpg:

- `.Resources.Match "*/yummy-*"` 🚫
- `.Resources.Match "*/cupcake-*"` ✅

Using Front Matter resources metadata we changed the name of yummy-cupcake, it is now called `cupcake-1` and will only respond when called by its new name even by `.Match`.

This may seem weird but it is actually very useful. If your image filename end up being some very complicated hash, you may simplify their targeting by specifying a name in the front matter and use .Match on that.

#### title 
More like `.Title`, it holds the same default value as name, now you can overwrite it. This time, it won't break anything.

#### params

This is an object for you to store anything you want, like for Page params, you retrieve them like so:

```go-html-template
{{ range $.Page.Resources.Match "**.jpg" }}
<figure class="Figure">
	<img src="{{ .Permalink }}" alt="{{ .Title }}">
	{{ with .Params.credits }}
	<div class="Credits">
		{{ . }}
	</div>
	{{ end }}
</figure>
```

### More on metadata.
Obviously there are plenty use cases for them. Already I can think of adding a draft param to some files I want to exclude from a particular range.

```go-html-template
{{ if not (.Params.draft) }} // Check that the Resource is not marked as draft
```

Another use case is the building of a manifest shortcode to list certain files from your bundle right in your content.

## What about Bundles for sections?

You can turn pages of any [Kind](https://gohugo.io/templates/section-templates/#page-kinds) into a Bundle so it benefits from Page Resources: sections, taxonomy even the home page. 

__But those take an `_index.md` instead of `index.md`__. 

If you inadvertently drop an _underscoreless_ `index.md` in there, Hugo will mistake it for a single page's Bundle.

Hugo terminology speaks of a __Branch Bundle__, as oppose the single page or Regular Page's __Leaf Bundle__ we've been covering so far.

Let's go back to our structure example and focus on a Bundle for a section containing recipes.

~~~nohighlight
├── post
└── recipes
    ├── _index.md // That's your Section markdown and Front Matter 
    ├── recipes_header.jpg    // This is a resource of the section's Bundle.
    ├── all_recipes_print.pdf // Same as above.
    ├── chocolate-cupcakes.md // This a Regular Page inside the section.
    └── vanilla-cupcakes      // This is a Regular Page with a Bundle inside the section.
        ├── index.md
        ├── vanilla_cupcakes_print.pdf
        └── header.jpg
~~~

{{< notice icon="external-link-square-alt" title="More on Section Bundles">}}
Want to learn more about Leaf Bundle vs. Branch Bundle in Hugo? You should start by the [doc](https://gohugo.io/content-management/page-bundles/#readout) and keep on reeding this thorough [piece](https://scripter.co/hugo-leaf-and-branch-bundles/) by [@kaushalmodi](https://github.com/kaushalmodi)
{{< /notice >}}

## Practice: Page manifest using Resources and Metadata

Let's try and put in action what we learned. We'll build a page that lists important files to download and print. Each file will of course be Resources from the page's Bundle.

First we create a page.
~~~markdown
---
title: "Bogus Application"
date: 2018-01-10
---

Hey there! Please fill the files below and send them back to us.

::FILE LIST WILL GO HERE::

Thanks!
~~~


After adding the files, our page bundle structure should look like this

~~~nohighlight
bogus-application
├── index.md
└── documents (grouping them in a dir is optional)
    ├── guide.pdf
    ├── checklist.pdf
    ├── photo_specs.pdf
    └── payment.docx
~~~


Then we add some resources metadata to the Front Matter

~~~yaml
---
title: "Bogus Application"
date: 2018-01-10T10:36:47-05:00

resources:
- src: 'documents/guide.pdf'
  name: Instruction Guide
  params:
    ref: '90564568'
- src: 'documents/checklist.pdf'
  name: Document Checklist
  params:
    ref: '90564572'
- src: photo_specs.pdf
  name: Photo Specifications
  params:
    ref: '90564687'
- src: 'documents/payment.docx'
  name: Proof of Payment
# Now our shared values
- src: '*.pdf'
  params:
    icon: pdf
- src: '*.docx'
  params:
    icon: word
~~~

Then we create a shortcode so we can add the file list anywhere in your content.

All its needs to do is to `range` on the resources stored in the document directory.

```go-html-template
// shortcodes/manifest.html
<ul>
	{{ range .Resources.Match "documents/*" }}
	<li>
		<a target="_blank" href="{{ .Permalink }}">
			<i class="far fa-file-{{ .Params.icon }}"></i> {{ .Title }} <small>{{ with .Params.ref }}(Ref.{{ . }}) {{ end }}</small>
		</a>
	</li>
	{{ end }}
</ul>
```


And voilà! The result is [here]({{< relref "/bogus/application" >}})

We could improve the shortcode with some parameters, but for the sake of this article, we'll keep it simple.

Now all you have to do is drop the shortcode in the page.

~~~Markdown
---
title: "Bogus Application"
date: 2018-01-10T10:36:47-05:00
draft: true
---

Hey there! Please fill the files below and send them back to us.

{{</* manifest */>}}

Thanks!

~~~

## Conclusion

Page Resouces is still an early feature in the Hugo universe and is bound to improve. 

Since I first published the article __.Resources.Match__ and __metadata__ have landed! Think of what's coming ahead at this pace!

### Use cases
There's plenty of use cases to think about.

Of course a __gallery__ comes to mind or a __carousel__, using the Front Matter metadata techniques for adding an image description or a carousel slide text and title.

Another use case could be to add rich full width __sections__ to a page. Big title, big background images, critical CTA, all modern websites need those sectionned pages. Before Page Resources you had to use complicated attributes overstuffed "section" shortcodes in the single `index.md` file or worse too many ocean deep Front Matter objects. But now, all you have to do is drop some cleverly named `.md` files in your bundle with the minimum Front Matter and Markdown content. Then loop on them in your template, and voilà! You build your sections!

Feel free to suggest improvements, use cases or your own discoveries in the comments! 

[^1]: Since [Hugo .46](https://github.com/gohugoio/hugo/commit/dea71670c059ab4d5a42bd22503f18c087dd22d4) and Hugo Pipe's overall files improvements in Hugo.

[^2]: As of Hugo 0.34

[^3]: Special thanks to [@bep](https://github.com/bep) for being patient with my pestering in the [Hugo Discource](https://discourse.gohugo.io/) and his amazing work on improving the already impressive Hugo.

