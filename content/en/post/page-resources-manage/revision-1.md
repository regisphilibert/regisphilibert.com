---
title: "Hugo Page Resources Revision 1"
date: 2018-01-09T13:03:53-05:00
lastmod: 2018-01-17T11:44:00-05:00
slug: hugo-page-resources-and-how-to-use-them
subtitle: and how to use them...
toc: true
tags:
 - Hugo
 - Resources
 - Shortcodes

description: In this article we'll cover Hugo 0.32's Page Resources and its impact on the way we structure our content folders, what methods and properties it offers, how to use it in our templates and markdown and finally its current limitations and how we can circumvent them with the addition of a manifest array directly in our Page's Front Matter.
summery: 
---
Hugo 0.32 launched just before the new year and it brought along two massive improvements. __Page Resources__ and Image Processing. 

In this article we'll cover __Page Resources__ and its impact on the way we structure our content folders, what __methods__ and __properties__ it offers, how to use it in our templates and markdown and finally its current limitations and how we can circumvent them with the creation of __manifest__ array direclty in our Page's Front Matter.

## What are Page Resources?

Pages can now have their own images, files or pages stored in their own content folder or "bundle". We explain more on the directory structure below.

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

The content folder is a bit more clustered but every images/files are stored within their post directory bundle. And their url will follow the posts' too.

~~~nohighlight
.
└── content
    ├── post
    │   ├── i-love-eating-cupcakes
    │   │   ├── index.md // That's your post content and Front Matter
    │   │   └── images
    │   │       ├── yummpy-cupcake.jpg
    │   │       └── shiny-glaze.jpg
    │   └── i-hate-baking-cupcakes
    │       ├── index.md // That's your post content and Front Matter
    │       └── images
    │           ├── overcooked-dough.jpg
    │           └── sloppy-icing.jpg
    └── page
~~~

## What are their methods and properties?

### Available methods for .Resources

#### .Resources.ByType (func)

Allow to retrieve all the page resources by type.
~~~go
{{ with .Resources.ByType "image" }}
	<div class="Image">
	{{ range . }}
		<img src="{{ .RelPermalink }}">
	{{ end }}
	</div>
{{ end }}
~~~


#### .Resources.GetByPrefix (func)
Allow to retrieve one resource according to the first caracters of its filename. It is handy if you don't necessarly know the right extension. __It is case senstive.__


~~~go
// To find DearJohn.doc
.Resources.GetByPrefix "Dear" ✅ 
.Resources.GetByPrefix "DearJohn" ✅
.Resources.GetByPrefix "DearJohn.doc" ✅ 
.Resources.GetByPrefix "dearjohn" 🚫
.Resources.GetByPrefix "John" 🚫
~~~


### Available properties for one resource.
What to do when I found it?

### .ResourceType (string)
The type of the resource.
Now, it is based on MIME type, but will only hand out the main type. So when MIME type will give you `application/pdf`, .ResourceType will only give you `application`. See the full list of existing MIME type [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types)

So how do I make the difference between a ZIP and a PDF, both sharing the main type `application`? We'll cover this further down.

### .Permalink (string)
The absolute URL of the resource.

### .RelPermalink (string)
The relative URL of the resource.

### .AbsSourceFilename (string)
The absolute path of the file.

## How to use them?

Now. How can it benefit my coding? 

### In my templates?
Well from your template you can now easily retrieve the resources bundled with a post to say create a gallery in your single.html:

~~~go
{{ with .Resources.ByType "image" }}
	<div class="Gallery">
		{{ range . }}
			{{ if not (strings.Contains .RelPermalink ".draft.") }} // Check that the Resource is not marked as draft
			<div class='Gallery__item'>
				<img src="{{ .RelPermalink }}" />
			</div>
			{{ end }}
		{{ end }}
	</div>
{{ end }}

~~~

Now all you will have to do is drop your images in the post bundle directory and _voilà_!

Because as seen above, a resource only hold 4 informations, I use the filename to "mark" my images. Here, I can just rename `cupcakes.jpg` to `cupcakes.draft.jpg` to exclude it from the gallery without having to remove the image all together.

### In my markdown?

You can also create a __shortcode__ which will retrieve a particuliar resource by its name.

~~~go
//shortcodes/img.html
{{ $img := $.Page.Resources.GetByPrefix (.Get 0)}}
<figure>
	<img src="{{ $img.RelPermalink }}" alt="{{ (.Get 1) }}" />
	<figcaption>{{ (.Get 1) }}</figcaption>
</figure>
~~~

And in your markdown:

~~~markdown
{{</* img "overcooked-dough.jpg" "Those cupcakes are way overcooked!" */>}}
~~~

This is a pretty simple shortcode we'll get deeper into the possibilites in a another article.

## Any kind of files

You can use any file type, but knowing what you're dealing with is important. Trying to retrieve .Width of a PDF will result in an error.

Because `.ResourceType` will only give you the main type of your file, if you need to know if this resource of type application is a ZIP or a PDF file, for now, you'll need to use `strings.Contains` on `.RelPermalink`  as illustrated below[^1].

~~~go
{{ with .Resources.ByType "application" }}
	<ul>
	{{ range . }}
		<li>
			<a href="{{ .RelPermalink }}">
				{{ if (strings.Contains .RelPermalink ".pdf") }}
					Check out this PDF!
				{{ else if (or (strings.Contains .RelPermalink ".doc") (strings.Contains .RelPermalink ".docx")) }}
					Check out this Word Document!
				{{ else }}
					Check out this... Thing!
				{{ end }}
			</a>
		</li>
	{{ end }}
	</ul>
{{ end }}
~~~

## Adding a Page Resources Manifest

[@bep](https://github.com/bep) is already [working on a way](https://github.com/gohugoio/hugo/issues/4244) to add metadata to your resources directly from your Page's Front Matter.

In the meantime we can already work with the Front Matter[^1] to build a manifest of our files.

Let's try and build a page that lists important PDF to print, fill and send for like a bogus application.

First we create a page.
~~~markdown
---
title: "Bogus Application"
date: 2018-01-10T10:36:47-05:00
---

Hey there! Welcome to a bogus application! 

::FILE LIST WILL GO HERE::

Thanks!
~~~

Then we add some user-defined variables to the Front Matter

~~~markdown
---
title: "Bogus Application"
date: 2018-01-10T10:36:47-05:00

manifest:
- prefix: guide
  name: Instruction Guide
  type: pdf
  ref: '90564568'
- prefix: checklist
  name: Document Checklist
  type: pdf
  ref: '90564572'
- prefix: photo_specs
  name: Photo Specifications
  type: pdf
  ref: '90564687'
- prefix: payment
  name: Proof of Payment
  type: word
~~~

After adding the files, our page bundle structure should look like this

~~~
bogus-application
├── index.md
├── manifest.json
└── documents (grouping them in a dir is optional)
    ├── guide.pdf
    ├── checklist.pdf
    ├── photo_specs.pdf
    └── payment.docx
~~~

Then we need a shortcode so we can add the file list anywhere in your content. I'll decompose it for better clarity and add it in its full later down.

We start by storing `$.Page.Resource` in a variable so we can use it anywhere in our shortcode no matter the scope.

~~~go
// shortcodes/manifest.html
{{ $resources := $.Page.Resources }}

// Then we can start working if the user-defined manifest variable is present.
{{ with $.Page.Params.manifest }}
	...
{{ else }}
	We coudln't find a manifest!
{{ end }}
~~~

Now all we have to do is `range` on the manifest and identify the resource by using the prefix key from the manifest.

~~~go
<ul>
	{{ range $manifest }}
		{{ $resource := $resources.GetByPrefix .prefix }}
		<li>
			<a target="_blank" href="{{ $resource.Permalink }}">
				<i class="far fa-file-{{ .type }}"></i> {{ .name }} <small>{{ with .ref }}(Ref.{{ . }}) {{ end }}</small>
			</a>
		</li>
	{{ end }}
</ul>
~~~


And voilà! The result is [here]({{< ref "bogus/application/index.md" >}})

We could improve the shortcode with some parameters, but for the sake of this article, we'll keep it simple.

Now all you have to do is drop the shortcode in the page.

~~~markdown
---
title: "Bogus Application"
date: 2018-01-10T10:36:47-05:00
draft: true
---

Hey there ! Welcome to a bogus application! 

{{</* manifest */>}}

Thanks!

~~~

A manifest is easy to build, and let you safely use Page Resources for more complex integration.

Now we end up with this full manifest shortcode code.

~~~go
// shortcodes/manifest.html
{{ $resources := $.Page.Resources }}
{{ with $.Page.Params.manifest }}
	<ul>
		{{ range . }}
		{{ $resource := $resources.GetByPrefix .prefix }}
		<li>
			<a target="_blank" href="{{ $resource.Permalink }}">
				<i class="far fa-file-{{ .type }}"></i> {{ .name }} <small>{{ with .ref }}(Ref.{{ . }}) {{ end }}</small>
			</a>
		</li>
		{{ end }}
	</ul>
{{ else }}
	We coudln't find a manifest!
{{ end }}
~~~

## Conclusion

Page Resouces is still an early feature in the Hugo universe and is bound to improve. As I mentionned earlier, a full out of the box metadata system is being put in place as well as new methods for filtering resources.

### Use cases
But already there's plenty of use case to think about.

Of course a __gallery__ comes to mind or a __carousel__, using the Front Matter metadata techniques for adding an image description or a carousel slide text and title.

Another use case could be a solution to store your post's __revisions__ directly in the Page Bundle and reference them using the soon to come `.GetByPrefix` property. Every mardownfile in the bundle starting by `revision-` could be very easily listed a the bottom of your post as reference to its past version.

Feel free to suggest improvements, use cases or your own discoveries in the comments! 

## Before you go: manifest.json alternative

An alternative if you happen to have hundreds of file to go through would be to dynamicaly create a manifest.json to be added to the Page Bundle and use it as a resource.

To do this though, you will have to target the manifest file instead of the Front Matter param

~~~go
{{ with $.Page.Resources.GetByPrefix "manifest" }}
~~~

To read its data, `{{ $manifest := getJSON .Permalink }}` is tempting but we can't rely on `.Permalink` or `.RelPermalink` because it may very well be not available on your first publish.

We need to target its path straight from the `content` folder

The resource holds `.AbsSourceFilename` which is the absolute path, but in order to use Hugos's `getJSON` on it, we need its relative path to the hugo install.

~~~go
// ... inside {{ with }}
{{ $AbsPath := strings.Split .AbsSourceFilename "/content/" }}
{{ $RelPath := printf "/content/%s" (index $AbsPath 1) }}

// We are finally able to get the json with its relative path. 
// It doesn't matter if it has already been published or not.
{{ $manifest := getJSON $RelPath }}
~~~


Then all you have to do, is use the same range code as in the Front Matter exemple. Or you could add a parameter to the shortcode to choose the Front Matter way or the json way. Up to you.



[^1]: Special thanks to [@bep](https://github.com/bep) for being patient with my pestering in the [Hugo Discource](https://discourse.gohugo.io/) and giving the `strings.Contains` suggestion as well as using the Front Matter for storing the manifest instead of the json file which, before that, was my first and only idea.