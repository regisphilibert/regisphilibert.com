---
title: "From WordPress to Hugo, a mindset transition"
slug: from-wordpress-to-hugo-a-mindset-transition
date: 2019-01-30T13:44:20-05:00
lastmod: 2019-02-07T08:40:27-05:00
draft: false
toc: true
tags:
 - Hugo
 - WordPress
 - JAMStack
twitter_card: summary_large_image
description: This post is not about migrating your WordPress site to Hugo, it’s about transitioning from your WordPress mindset to Hugo’s so you can quickly grasp this new environment.

---

This post is not about migrating your WordPress site to Hugo, it’s about transitioning from your WordPress mindset to Hugo’s! 

By cautiously comparing Hugo's concept and vocabulary to some you’re already familiar with, we might be able to smooth out this learning curve for you!

So let’s bring up the `the_post()`, `the_loop` and the Template Hierarchy in order to better understand Hugo’s own construct!

<!--more-->

## From WordPress to Hugo

As WordPress makes 80% of the web these days, it’s a fair assumption that many readers are familiar if not experts of that very famous CMS.
It is also what I came from, my previous major if you will, before I got hooked up on Hugo.

And for a long time, I was stuck in its logic. Discovering Hugo, I constantly tried to juxtapose its vocabulary and concepts with WordPress’ own.

I soon realized this systematic comparison was a bad idea. Hugo’s own lexicon and logic are unique and very different from WordPress. 
But it stroke me that a more cautious parallel study could have helped me learn Hugo faster and without too many costly errors along the way.

So if you’re starting your Hugo journey and know your way around WordPress, you may benefit from reading what follows.

## Everything is a Page

This blunt affirmation is quintessential to further understand the concept of Hugo, especially when it comes to template logic. 

Hugo sees a page as a markup file being compiled and added to your public directory. In this sense, a post, a page, a list of posts, a list of taxonomy terms: those are pages.

Think of it this way, if it has a URL, it’s a page!

If everything is a page for Hugo, there are comprehensible distinctions to make. Among them are __Types__ and __Kinds__.

### Type 

In a framework like WordPress, every entry is a __post__ of different types. A post is a post of type `post`, a page is a post of type `page` and a recipe is a post of custom post type `recipe` (or whatever you chose to name it).

In Hugo, every entry or content file is a regular __page__ of a different type. And because there is no built-in type, every type is your own custom type. The way you create a page of a certain type is

1. Add the Front Matter `type` and set it to that desired type.
2. Or most often, let the first level directory of the content file decide of its type.

So in order to create a page of type recipe, you can either use Front Matter:

```Markdown
title: Delicious Cupcake
type: recipe
---
```

Or let the directory structure work its magic:

```
content
  ├── post
  └── recipe
      └── delicious-cupcake.md
```


### Kind
In WordPress we can differentiate layouts with the templates. That landing page for your post entries being built from `archive.php`, it's called an Archive. And the landing page for your single post entry being built from `single.php`, that is called it a Single.

Hence the following boolean function `is_single()`, `is_archive()`!

In Hugo, again, everything is a page. And to determine what they’re supposed to show, we use the word Kind.

Here are the different page Kinds in Hugo:

- The landing page for your website is the only page of kind `homepage` 
- The landing page for all your recipes is a page of kind `section`
- The landing page for your recipes categorized as _chocolate_ is a page of kind `taxonomy`
- The landing page for all your recipes’ categories (chocolate among them) is a page of kind `taxonomyTerm`
- Finally the landing page for that one recipe is a page of the most common kind: `page`

## Template and Hierarchy

Now that we covered Types and Kinds, we can dive into Hugo’s Template Logic.

 Everything dropped in the `layouts` directory of either your project or your theme will be subject to Hugo’s own _Template Hierarchy_ or in Hugo terms: [Template Lookup](https://gohugo.io/templates/lookup-order/). 

In addition to using filenames, Hugo also uses directory structure to choose the right template files.
{{< notice >}}
As mentioned above, while WordPress expects `archive.php` to template the landing page for your blog posts’ list. Hugo expects `list.html` to fill this role.
{{</ notice >}}
Many parameters, including Kind, Type, Output Format, Language, Taxonomy term, can help determine which template will be used for a given page.

{{< notice type="warning" title="⚠️">}}
There's no better approach to understanding Hugo's template logic than reading its [doc](https://gohugo.io/templates/lookup-order/).
{{</ notice >}}

### Custom Page Templates

It’s one of the most archaic WordPress [stuff](https://developer.wordpress.org/themes/template-files-section/page-template-files/#creating-custom-page-templates-for-global-use). 

If you want your editor to manually choose a layout for a given page, you have to create a template file, put it anywhere in your theme directory and include this ugly scribble:
```php
<?php /* Template Name: Custom 🤮 */ ?>
```

With Hugo, you can assign any content file a custom layout with a single Front Matter param, `layout`.

Then just drop a file bearing that same name in your `layouts/_default` and you're good!

```
---
title: About
layout: about
---
About me!

```


```
layouts
  └── _default
      └── about.html

``` 

### Includes

Good practice in WordPress is to use `get_template_parts` to include a file from your theme. It will inherit the globals defined by WordPress core (`$post`, `$wp_query`, etc…) but not much more.

In Hugo we talk about Partials. Those are files stored in `layouts/partials` which will be loaded using the `partial` function.

The catch here is that this needs a scope or context to be passed as parameter. By default, nothing from your page will be handed out to this « included » partial.

A partial is called this way:

```go-html-template
{{ partial "post-head" . }}
```

That dot above .............☝️ is your page. 

The Page context includes all the page variables you'll need to use in your partial and every templates, but more on that later.

{{< notice type="warning" title="📖" >}}
Understanding Hugo's Context notion is key. If that's still mysterious to you 👉 [Hugo, the scope, the context and the dot]({{< relref "hugo-context" >}})
{{</ notice >}}
## The Loop and Data

### Pages Variables
In WordPress, every post data is made available from the template files through some functions or methods `the_permalink()`, 
`the_title()`, `the_content()`, `the_date()` etc… 

Hugo on the other hand gives you an object of [variables and methods](https://gohugo.io/variables/page/#readout) referred to as the Page Context and stored in that dot mentioned above.

So, translating the above WordPress lingo to Hugo you get `.Permalink`,  `.Title` , `.Content`, `.Date`.

Remember that partial we talked about earlier? Well once that dot is safely lodged in it, you've got all your page variables from there:

```go-html-template
{{/* layouts/partials/post-head.html */}}
<div class="post-head">
  <h1><a href="{{ .Permalink }}">{{ .Title }}</a><h1>
  <time>{{ .Date }}</time>
</div>
```

### The Loop with `range`

Browsing through posts in order to build your archive pages or a _Recent Posts_ widget is essential in any template engine!

Depending on which template you are, WordPress will always give you an array of « posts » to loop through, even if this is only the one post to show in your single page.

So wether you’re on the template file for the archive of blog posts or the template file for the archive of recipes of the chocolate category, you get those posts or recipes in your _Loop_, paginated.

In Hugo, when in a list template, pages are served as a _Collection_ and are available through `.Pages`.

So if you’re on a list template for the recipe section, `.Pages` will return the collection of pages included in it: recipes.

If you’re on a taxonomy list, you’ll get the pages using the taxonomy through `.Pages`, plus this taxonomy's information in `.Data`. as `.Data.Singular`, `.Data.Plural` and [more](https://gohugo.io/variables/taxonomy/).

One thing to remember though, contrary to WordPress, when on a single page in Hugo, `.Pages` will be empty (duh) as all the information you need is right there in the root context `.`

### Loop comparison by example

This is our beloved WordPress loop

```php
// theme/archive.php
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
  <!-- post -->
  <h2>
    <a href="<?php the_permalink(); ?>"><?php the_title() ?></a>
  </h2>
  <h6><?php the_date(); ?></h6>
  <p>
    <?php the_excerpt(); ?>
  </p>
  <hr>
<?php endwhile; ?>
<?php else: ?>
<!-- no posts found -->
<?php endif; ?>
```

Converted into beautiful Hugo

```go-html-template
//layouts/_default/list.html
{{ range .Pages }}
  <h2>
    <a href="{{ .Permalink }}">{{ .Title }}</a>
  </h2>
  <h6>{{ .Date.Format "January, 02 2006" }}</h6>
  <p>
    {{ .Summary }}
  </p>
  <hr>
{{ else }}
<!-- no posts found -->
{{ end }}
```

### What about other pages?

To retrieve pages on a global scale and from any template, WordPress has you construct your own query. 

In Hugo you simply invoke the `.Site.Pages` collection. But remember that everything is a page, so this global collection will include regular pages, sections, taxonomies, the homepage, you name it. To only retrieve what WordPress peeps would call _posts_, you use `.Site.RegularPages`.

This is a more advanced query in WordPress for building a _Recent Recipes_ widget ordered by a custom parameter, and used from any template:

```php
<?php  
$recents = new WP_Query(
  [
    'post_type'=>'recipe',
    'posts_per_page'=>5,
    'orderby'   => 'meta_value_num',
    'meta_key'  => 'rating',
  ]
);
 if ( $recents->have_posts() ) : while ( $recents->have_posts() ) : $recents->the_post(); ?>
  <h2>
    <a href="<?php $recents->the_permalink(); ?>"><?php $recents->the_title() ?></a>
  </h2>
<!-- post -->
<?php endwhile; ?>
<?php else: ?>
<!-- no posts found -->
<?php endif; ?>
?>
```

Let’s see its elegant Hugo variant:

```go-html-template
{{ $recents := (where .Site.RegularPages "Type" "recipe").ByParam "rating" }}
{{ range first 5 $recents }}
  <h2>
    <a href="{{ .Permalink }}">{{ .Title }}</a>
  </h2>
{{ end }}
```
{{< notice >}}
For more details on how to filter and order collections of pages in Hugo, you’ll need to read about [range](https://gohugo.io/templates/introduction/#example-1-using-context), [where](https://gohugo.io/functions/where/#readout) and [ordering](https://gohugo.io/templates/lists/#order-content).
{{</ notice >}}

## Shortcodes
In WordPress, shortcodes are "output returning" functions managed by adding several `add_shortcode` to your `functions.php` 

Hugo also sports [shortcodes](https://gohugo.io/templates/shortcode-templates/), and those are created by adding particular template file under `layouts/shortcodes/`. 
You retrieve its content with `.Inner` and its parameters with `.Get`!  

Contrary to WordPress those don’t necessarily have to be named.

- When named 👉 `.Get "title"`.
- When positional 👉 `.Get 0`.

### Shortcode comparison by example

This is a WordPress shortcode example from the doc[^1]. It takes a class parameter defaulting on `caption` and an inner content.

[^1]: [WordPress Shortcode API](https://codex.wordpress.org/Shortcode_API#Enclosing_vs_self-closing_shortcodes) containing shortcode example.

```php
<?php 
function caption_shortcode( $atts, $content = null ) {
  $a = shortcode_atts( array(
    'class' => 'caption',
  ), $atts );

  return '<span class="' . esc_attr($a['class']) . '">' . $content . '</span>';
}
add_shortcode( 'caption', 'caption_shortcode' );
```

In your editor:

```html
[caption class="headline"]My Caption[/caption]
```

Now let's read Hugo's one line response:

```go-html-template
{{/* layouts/shortcodes/caption.html */}}
<span class="{{ default "caption" (.Get 0) }}">{{ .Inner }}</span>
```

And in your markdown file:
~~~Markdown
{{%/* caption "headline" */%}}My Caption{{%/* /caption */%}}
~~~

We went the _positional_ way because... one parameter 🤷

{{< notice title="📖" >}}
[Leverage shortcodes in Hugo](https://jpescador.com/blog/leverage-shortcodes-in-hugo/) | [Julio Pescador](https://twitter.com/julio_pescador)
{{< /notice >}}


## Settings

WordPress has a lot of setting pages in the dashboard. You navigate those, usually going back and forth between _Reading_ and _Writing_ so you can set your permalinks, your site title, your pagination, your comments etc...

Hugo's [configuration](https://gohugo.io/getting-started/configuration/), like its content editing, is all about files! And so as not to leave anyone left out, it gives you a choice of languages to fill those:

- YAML
- TOML
- JSON

If you don't know about those (yeah that last one you know!), you can take a look a this [config example](https://gohugo.io/getting-started/configuration/#example-configuration) with which you can toggle languages and check their syntaxes.

Those settings live in a `config.yaml` file or in a dedicated [directory](https://gohugo.io/getting-started/configuration/#configuration-directory) which gives you a cleverer way of grouping them and allows environment overwrites.

## Output formats
What’s that ? 

Exactly, WordPress certainly did not introduce you to those.

Let's say that for every page you have an HTML file at `that-page/index.html` and that’s a given. With Hugo you can make sure every page also has a JSON version and an [AMP](https://www.ampproject.org/docs/) version on top of that. They would live alongside their HTML brother at`that-page/index.json` and `that-page/index.amp.html` respectively[^2]. 

[^2]: For clarity we ommitted that Hugo will save AMP files at `/amp/that-page/index.html`

To make this happen, all you have to do, through the settings introduced above, is tell Hugo to add such formats to the desired __Kinds__ and add the expected template files.

In short:

```yaml
# config.yaml
outputs:
  homepage:
    - HTML
    - JSON
  page:
    - HTML
    - AMP
```

```
layouts
  ├── _default
  │   └── about.html
  ├── index.html
  ├── index.json
  └── recipes
      └── single.amp.html

```

That's it! Providing you filled those template files with sensible code, your homepage will have both an HTML and a JSON output while your recipes will serve HTML and AMP!


I strongly suggest your read the doc on [Output Formats](https://gohugo.io/templates/output-formats#readout) for, thanks to those, you’ll be able to add an API layer to your site, or a `.ics` file to your events or whatever is required on any given project!

{{< notice title="📖" >}}
[Build a JSON API With Hugo's Custom Output Formats](https://forestry.io/blog/build-a-json-api-with-hugo/)
{{</ notice >}}

## Assets processing

WordPress really has no solution for that, you'll use your own task manager and their asset processing packages.

Hugo on the other hand sports its own asset processing pipeline! 
-- Whaaaaaat? 
-- Yep! It's called [Hugo Pipes](https://gohugo.io/hugo-pipes/) and __without any node dependency__ you can:

- Minify 🗜️
- Bundle your files 📦
- Compile your [SASS/SCSS](http://sass-lang.com/) 👓
- Fingerprint and SRI 🔑

With a few dependencies you can:

- Run [PostCSS](https://postcss.org/) on your styles  

All of this with the same elegance you're now accustomed to:

```go-html-template
{{ $style := resources.Get "main.scss" | toCSS | minify | fingerprint }} 
<link href="{{ $style.Permalink }}" emotion="🤩" rel="stylesheet">
```

Hugo will also make sure those assets are compiled and published only if you call their `.Permalink` in your templates.

### Images transformation
WordPress default image processing happens once, on upload! 

It later stores all newly created size formats of the media alongside the original file. When calling your image, no matter which function, you will use an argument to fetch the right size variation.

Hugo on the other hand [processes](https://gohugo.io/content-management/image-processing/#image-processing-methods) those when you need them, meaning you will only get this thumbnail version of this post header if you called for `.Fit` or `.Resize` on it in your template.


```go-html-template
{{ $img := resources.Get "header.jpg" | .Resize "600x" }}
<img src="{{ $img.Permalink }}" alt="">
```

I know! I too never seem to get tired of those two liners!

You can process images, either using Hugo Pipes or [Page Resources](https://gohugo.io/content-management/page-resources/#readout).

{{< notice title="📖">}}
- [Hugo Pipes Revolution]({{< ref "hugo-pipes" >}})
- [Processing Responsive Images with Hugo](https://laurakalbag.com/processing-responsive-images-with-hugo/) | [Laura Kalbag](https://twitter.com/laurakalbag)
- [Cache-bust and concatenate JS/SCSS files with Hugo](https://blog.fullstackdigital.com/how-to-cache-bust-and-concatenate-js-and-sass-files-with-hugo-in-2018-9266fd3c411e) | [Ben Bozzay](https://twitter.com/BenBozzay)
- [Hugo Page Resources]({{< ref "page-resources-manage" >}})

{{</ notice >}}

## Themes and Plugins VS Theme Components
 
WordPress uses themes and plugins extensively and sometime for exchangeable purposes in order for you to skin your sites and add functionalities with minimum code work.

Regarding themes, WordPress only gives you two layers of customization. 
You can create a parent theme, and put many generic stuff in there. And then create a child theme which will, for every homonymous files shared with its parent, conveniently override those.

If you need another layer of customization on top of those two, like a set of shortcodes or an AMP Output Format, you’ll have to use plugins.

In Hugo, you won’t talk about Plugins and Themes but rather of Components. 

You can add as many of those as you want. 

Template files, javascript, scss, images, data files, `i18n` strings (those two we'll cover below), almost everything is subject to the homonymous files overriding logic and the order of precedence is for you to define. 

Think of this as unlimited _child themes_!

Some components may be full fledge themes with many template files. Some may only be a small variation of your main theme adding its own set of custom templates for example. Some others could simply add a few shortcode definitions, a new set of SASS variables or an extra Output Format.

### Themeing by example

Let’s use an imaginary project for a dental clinic, where one does not want to meddle too much with code. What you need is:

- A main health oriented theme 👩‍⚕️
- A dental oriented extension of the main theme 🦷
- A season skinning extension of the main theme 🎄
- A solution to build rich mega menus
- A set of medical shortcodes to be used by editors
- A JSON for each <del>single</del> regular page.

In a WordPress environment you would need:

- Themes
  - Health Theme
  - Health Theme Dental Child Theme
- Plugins
  - Health Theme Season Plugin
  - Mega Menu Plugin
  - Medical Shortcodes Plugin
  - REST API Plugin

Note that if, on top of this, you want to create your own template file to override the Parent theme’s and the Child theme’s… well as far as I know, you cannot. 🤷‍♂️

In Hugo, you’ll drop those directories in your `themes` directory and assign them to you project from the `config.yaml` file.

```yaml
theme:
  - health-theme
  - health-theme-dental-extension
  - health-theme-season-extension
  - mega-menu-component
  - medical-shortcodes-component
  - json-api-component

output:
  page:
    - HTML
    - JSON
```

The above declares the theme components along with their order of precedence. Also, as covered before, we make sure the JSON _Output Format_ is added to the pages of kind `page`.

That’s it. If you need to override any of the components' template files, you can do so by placing a homonymous file in the `layouts` directory at the root of your project! (providing path matches of course)

{{< notice title="📖">}}
[Tips and tricks for building a theme in Hugo](https://medium.com/@jeffmcmorris/tips-and-tricks-for-building-a-theme-in-hugo-4806bdd747d7) | [Jeff McMorris](https://medium.com/@jeffmcmorris)
{{</ notice >}}

## Are we going to talk about CMS UI?

Yes! 

As you know it’s not happening out of the box with Hugo. But there are tons of solutions out there including the amazing [Forestry.io](https://forestry.io) which lets you hook a beautiful and customizable CMS UI on top of your Hugo project's repo!

Believe me, any of those are so much faster and better designed than the good old Dashboard.

## Other random features of note

Before we finish, let's review in no particular order how WordPress and Hugo handle common requested features.

### Multilingual

Bye bye WPML! 🥳

Hugo handles [Multilingual](https://gohugo.io/content-management/multilingual/#readout) on its own and out of the box, including `i18n` string localization.

This [post]({{< ref "multilingual-series/part-1" >}}) and its [follow up]({{< ref "multilingual-series/part-2" >}}) get deep into Hugo Multilingual!

### Menus

Wordpress Menus are super powerful but are not this easy to tame from a developer standpoint. Their output is managed through a function called a _Walker_ which is not easy to read/understand when diving into multilevel menus. 

Hugo [menu solution](https://gohugo.io/content-management/menus/#readout) lets you assign any page to a menu as well as any external url.

In short, assuming you have two menus in your site, you assign a given page to a menu this way:

```
# /content/about.md
title: About
menu:
  main: 
    name: Who am I?
    weight: 2
  footer:
    weight: 1
```

If you need to add a non-content url to the `main` menu, that happens in your site config:

```
# /config.yaml
menus:
  main:
    - name: Blog
      url: https://blog.tumblr.com
      weight:3
  footer:
    - name: Blog
      url: https://blog.tumblr.com
```

With what's above, your menu item linking to your about page will appear in second position in your `main` menu and read _Who am I?_ It will also appear in your `footer` in first and read the page name: About.
On top of that, both your `main` and `footer` menus will include an item pointing to your old school tumblr which will read _Blog_.

Contrary to WordPress there is no concept of `menu_location`. You call your menu object from wherever from the template using `.Site.Menus.main`, `.Site.Menus.footer` or `.Site.Menus.whatever` and <del>loop</del> range through its items.

Go check out the [doc](https://gohugo.io/templates/menu-templates/#readout) on writing menus in your templates, it's a big leap from good old _Walkers_ (more like 🏃‍♀️).



### Custom Fields

With WordPress unless you like spending hours reinventing the wheel, you [ACF](https://www.advancedcustomfields.com/) all the way to fetch and edit those post metas.

Hugo, like Jekyll and other markdown based editors, relies on [Front Matter](https://gohugo.io/content-management/front-matter/#readout) to handle everything "custom".
It stores any unreserved  parameters in your Page context under the `.Params` object.

So from your template, instead of:

```php
<?php if ($subfield = get_field('subfield')){ echo $subfield; } ?>
```

You'll go:

```go-html-template
{{ with .Params.subtitle }}{{ . }}{{ end }}
```
.................................................... ☝️ You'll love that dot!


### Site Options

What about those global options unrelated to any particular page?

Well, again, if you're doing WordPress passed 2013, you're most likely relying on ACF to handle that part, because serioulsy, adding option fields of your own in WordPress is quite a pain!

Hugo offers two ways to treat those. You can add custom `.Params` objects to your site's configuration and retrieve them using `.Site.Params.tagline` for example.

Or to handle more complex sets of data, you can add any `yaml|toml|json` files to the `data/` directory. Anything in there will be merged into one handy object accessible throughout your templates using `.Site.Data`.

So if you need your editors to manage some social links and general options you could drop two files in `data`.

```yaml
# data/socials.yaml
- title: Facebook
  icon: fb
  url: https://facebook.com/hugo_rocks
- title: Twitter
  icon: tw
  url: https://twitter.com/hugoRocks
```

```yaml
# data/options.yaml
socials: true
tagline: Hugo rocks!
```

And in your partial...

```go-html-template
{{/* layouts/partials/socials.html */}}
{{ if .Site.Data.options.socials }}
<ul class="socials">
  {{ range .Site.Data.socials }}
    <li>
      <a href="{{ .url }}"><i class="icon icon-{{ .icon }}></i> {{ .title }}</a>
    </li>
  {{ end }}
</ul>
{{ end }}
```
{{< notice title="📖" >}}
[How to use Data Files in Hugo: an example](https://novelist.xyz/tech/hugo-data-files/) | [Peter Y. Chuang](https://twitter.com/peterychuang)
{{</notice >}}
### Comments
I doubt many of you still use WordPress’ built-in comments in 2019… But, chances are you still need some form of discussion on your posts.

As a Static Site Generator, Hugo produces static markup, so you’ll have to turn to a tier to handle your comments. 

Luckily there is a Hugo built-in [Disqus](https://disqus.com/) implementation you can use [out of the box](https://gohugo.io/content-management/comments/#add-disqus).

And if Disqus does not cut it for you, there are many other comment solutions out there which often only require a simple script tag + matching markup.
{{< notice title="📖" >}}
- [Replacing Disqus with Github Comments](http://donw.io/post/github-comments/) | [Don Williamson](https://twitter.com/Donzanoid)
- [Hugo + Staticman: Nested Replies and E-mail Notifications](https://networkhobo.com/2017/12/30/hugo-staticman-nested-replies-and-e-mail-notifications/) | [ Dan C Williams](https://twitter.com/dancwilliams)
{{</notice >}}
{{< todo >}}
### Forms

Again, SSG! There's a lot of options for you though, most of them free.

- TypeForm
- Netlify's
{{< /todo >}}
### Related Content
Producing « You might also like » suggestions in WordPress relies solely on external plugins or your own customized post query.

Hugo does it all by itself, and like a champ, using its built-in and highly configurable [Related Content feature](https://gohugo.io/content-management/related/#readout).

### Search
Just like comments, this is an SSG we're writing about, so no out of the box search. Which is kind of like WordPress search if you want my opinion. Now there are dozens of tier services which will handle the perfect search for you, among them:

- [Lunr.js](https://github.com/olivernn/lunr.js) 🆓
- [Algolia](https://www.algolia.com/) and their amazing [InstantSearch.js](https://community.algolia.com/instantsearch.js/) (kinda 🆓)


{{< notice title="📖" >}}
- [Bleve Search with Hugo](http://blevesearch.com/news/Site-Search/)
- [Client side searching for Hugo.io with Fuse.js](https://gist.github.com/eddiewebb/735feb48f50f0ddd65ae5606a1cb41ae) | [Eddie Webb](https://twitter.com/edwardawebb/)
{{</ notice >}}
## Conclusion
This article is not set in stone, a lot of things will evolve in Hugo, and so many of the comparisons written above may lose part of their sense. 

But hopefully by using a long entrenched and rarely questioned WordPress mindset, we may have helped some of WordPress users better grasp Hugo's own concepts and logic and, who knows, convince them to do the JAMStack jump in 2019! 🏃

As always, feel free to use the comments to drop questions, grievances or suggestions for more examples of WordPress to Hugo concept illustrations!