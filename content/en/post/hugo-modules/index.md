---
title: 'Hugo Modules: everything you need to know!'
date: 2020-08-30T17:28:14-04:00
disable_comments: true
tags:
 - Hugo
 - Modules
 - Git
---

Back in July 2019 Hugo 0.56.0 introduced a powerful Module system. Pretty much like any package solution it allowed any Hugo project defined as a Module, be it a full website or a theme or a component to use any files stored on a repository somewhere and mount it as its own. It also enabled any Hugo project to become a full fledge Hugo Modules with its own config and dependencies which any other project could mount.

In this article, we’ll see how any Hugo project can use files stored on a distant repository and make them its own using the Module **imports** and **mounts** logic.

Then, we’ll dive into what exactly constitute a Hugo Module by creating our own!

### Init the project as a Module

{{% aside %}}
#### Everything is a Module!

It's important to understand that anything importing repo files or Hugo Modules must become a Hugo Module istelf.
{{% /aside %}}

Before you can import a repository and use its files, your project will need to be initiated as a Hugo Module.


For this, you need to reference a repository.

We'll assume your Hugo project already has a GitHub repo which lives at `https://github.com/me-me-me/my-repo`

Using the terminal for your project root directory:

```bash
hugo mod init github.com/me-me-me/my-hugo-project
```

☝️ The above when successful will generate a file called `go.mod` at the root. It should look something like the following:

```go
module github.com/me-me-me/my-hugo-project

go 1.14
```

It will also have created a `go.sum` file. We won't concern ourselves with that one.

### Import a distant repository

For this very basic examples, we'll try and incoporate the icons made available by the Bootstrap team through their repo at [https://github.com/twbs/icons](https://github.com/twbs/icons).

Everything happens in your project `config.yaml` using the reserved `module` key and its `imports` array.

```yaml
module:
  imports:
    - path: github.com/twbs/icons
```

Now if you run `hugo` you will notice a new file has been dropped, `go.sum` but we won't concern ourselves with it. On the other end, our `go.mod` file just got a new line.

```go
module github.com/me-me-me/my-hugo-project

go 1.14

require github.com/twbs/icons v1.0.0 // indirect
```

That's good but it does not tell Hugo what to do with those files.

With the `mounts` key, attached to our Bootstrap import, we'll give Hugo more directions:

```yaml
module:
  imports:
   - path: github.com/twbs/icons
     mounts:
     - source: icons
       target: assets/icons
```

Mounts are unlimited but for now we just added one with the following settings:

- `source` param points to the location of the mounted files in the distant repo. Here we're pointing to the `icons` directory at the root of the repo.
- `target` param points to the location the files should be mounted into our Hugo's union file system.

With that mount in place, we will be able to access the icons svgs just like any other files in our project:

```go-html-template
{{ with resources.Get "icons/cart.svg" }}
  <div class="fill-current w-4">
    {{ .Content | safeHTML }}
  </div>
{{ end }}
```

That's it!

We can safely print this cart SVG without copying it to our project's directory.

And in the off chance that this particular cart icon needs to be customized we can rely on Hugo's union file system!

All we'd have to do is create an homonymous icon file in our project at  `assets/icons/cart.svg` to have it being used in place of Bootstrap's own cart icon.

**or...**

We could even go crazier and use the icon from another distant repo just for that cart icon... 🤩

```yaml
- path: github.com/refactoringui/heroicons
    mounts:
    - source: src/solid/shopping-cart.svg
      target: assets/icons/cart.svg
- path: github.com/twbs/icons
	  mounts:
    - source: icons
      target: assets/icons
```

☝️ Here we are importing two repos, with their own `mounts` settings.

{{% notice %}}
Note that regardless of the files mounted, Hugo will have to download the whole repository, so you might think twice before importing a 5MB repo for one of its svgs.
{{% /notice %}}

### Upgrading

What if the repo is updated? The default behaviour of Hugo Module is, on the first import, to grab the latest release, or if no release is found, the latest head on the default branch. That's why Hugo wrote `v1.0.0` after the require directive.

If `github.com/twbs/icons` releases `v1.1.0` and you want that new release you can:

```bash
hugo mod get -u github.com/twbs/icons
```
This should update your `go.mod` file with the latest release.

Now if you want a specific release rather than the latest, (we'll use another repo for that example):

```bash
hugo mod get github.com/twbs/icons@v1.4.0
```

If you want a specific commit, you'll need to @ its long hash like so
```bash
hugo mod get github.com/twbs/icons@2396edfbfeda7a3f9c5d98f67e3540f593b28e1e
```


{{% notice %}}
You should commit your `go.mod` and `go.sum` file of course, so that everybody working on the project uses the same versions!
{{% /notice %}}

{{% aside %}}
#### Module Local Development
This article does not cover local development of a module, but we have a note that does! And you should definitely go and give it a thorough read before starting your real Hugo Module journey.

👉&nbsp;[Develop Hugo Module Locally]({{< relref "/note/develop-hugo-modules-locally" >}})
{{% /aside %}}


## Create a Hugo Module

The above was interesting as we covered how we can import any repo out there and make its files part of our project. But the real power comes from using full fledge Hugo Modules as they alone can sport template files, asset files, data files, even **content** files!

And what better way to learn about them than by creating our own!

For the sake of the example, we'll create our own Icon Module. It will:

1. Import some SVG files from a distant repo
2. Create a page listing all available icons on the site.
3. Load its own `icon` partial which will ease up the printing of any icon on the project.

First we'll create a directory on our local machine. We'll give it a poor but short name: `hugo-icons`.

### 1. Imports

The first thing we need is a `config.yaml` file for our Module to register its imports.

Yes, any Hugo project, be it a website or a theme or a component can import other Modules or repo. The import tree is infinite. As we already mentioned, it's a real dependency solution!

Our imports and mounts settings will be very similar to what we did before. We'll just mount the files in a reserved directory to make sure we don't have file conflicts with other modules.

```yaml
# config.yaml
module:
  imports:
   - path: github.com/twbs/icons
     mounts:
	   - source: icons
	     target: assets/hugo-icons/icons
```

### 2. Creating the listing page

We'll need two things for that.

1. A content files to be mounted on the project.
2. A template file for Hugo to render that content file as a page.

Thanks to the `mounts` settings, those files don't have to follow the usual directory structure of a Hugo project. They can live anywhere which makes sense in the context of our componentized module.

We'll go crazy and add

- `page/layout.html`
- `page/content.md`

Getting back to our updated `config.yaml` , you'll note that the `mounts` settings we are dealing with sit at the root of the `module` map.

That's because mounting is not reserved to imports. You can assign mounting settings to the project at hand with its own `mounts` key.

```yaml
# config.yaml
module:
  mounts:
    - source: page/index.md
      target: content/hugo-icons-listing.md
      lang: en
    - source: page/template.html
      target: layouts/_default/hugo-icons-listing.html
  imports:
   [...]
```

{{% notice title="Language!" %}}
Note that the `lang` parameter only matters on multilingual site and even on those, omitting it will simply put the page under the default language site.
{{% /notice %}}

And now in those files:

```yaml
# page/index.md
---
title: Hugo Icons Archive
layout: hugo-icons-listing
---
```

```go-html-template
{{/* page/template.html */}}
{{ define "main" }}
  {{ range resources.Match "hugo-icons/icons/*.svg" }}
    <div style="fill:currentColor;width:3rem;margin:1rem 0">
    {{ .Content | safeHTML }}
    </div>
  {{ end }}
{{ end }}
```

{{% notice %}}
This will break if your project's or theme's `baseof.html` does not have a `main` block. We'll let this slide for the purpose of teaching.
{{% /notice %}}

### 3. Adding the partial

I think the partial can live under the module's `partials/icons.html` and we'll register that new mount:

```yaml
# config.yaml
module:
  mounts:
    [...]
    - source: partials
      target: layouts/partials/hugo-icons
  imports:
  [...]
```

Note we'll mount it under a reserved directory so users can safely call  `{{ partial "hugo-icons/icon" "cart" }}` . This way we won't collide with another module having its own `icon` partial.

And our very basic partial:

```text
{{/*
  icon
  Will print the icon matching the string passed as "context"

  @author @yourstruly

  @context String (.)

  @access public

  @example - Go Template
    {{ partial "hugo-icons/icon" "cart" }}
*/}}
```

```go-html-template
{{- with resources.Get (print "hugo-icons/icons/" .) -}}
  {{- .Content | safeHTML -}}
{{- end -}}
```

### Wrapping up our Module

Our Module now provides the three features we set ourselves to deliver. There's one critical thing missing from our Module's config though.

We are using `resources.Match` which was introduced in Hugo 0.57.0. Also fine tuned mounting using files and subdirectories got supported only with Hugo 0.64.0.
So 0.64.0 is the minimum version our users will need if they want to use our module or else... break!

```yaml
# config.yaml
module:
  hugoVersion:
    # We don't need extended (no sass)
    extended: false
    # We don't have a max version
    max: ''
    # We do have a min though.
    min: '0.64.0'
```

This makes our finale `config.yaml` file:

```yaml
module:
  hugoVersion:
    min: '0.64.0'
  mounts:
    - source: page/index.md
      target: content/hugo-icons-listing.md
      lang: en
    - source: page/template.html
      target: layouts/_default/hugo-icons-listing.html
    - source: partials
      target: layouts/partials/hugo-icons
  imports:
    - path: github.com/twbs/icons
      mounts:
      - source: icons
        target: assets/hugo-icons/icons
```

{{% aside %}}
#### CLI Potpourri

We've only covered `hugo mod init` and `hugo mod get -u`. But there's two useful ones:

`hugo mod clean`

This one will clean your module's cache. I usually run it when something seems amiss.

`hugo mod tidy`

This will clean up the `go.sum` file we won't discuss here.
{{% /aside %}}

## Conclusion

Hugo Module solution is the best way to import any public repo's files into your Hugo Projects and manage their versioning. And after seeing how easy it is to build one, it should really become your go-to way to manage reusuable solutions and distritube them throughout the Hugo ecosystem.

During the coming weeks we'll blog a lot about the whys-and-hows of the many [open source Hugo Modules]({{< relref "/open-source" >}}) we built. But you can already check their code now for some complex, practical and usually well commented examples of Hugo Modules implementations.

Also, if you're down for building some powerful Hugo Modules, you should definitely read our note on [Developing Hugo Modules Locally]({{< relref "/note/develop-hugo-modules-locally" >}}).

Oh and here's the finished example repo we built in this article is available [here](https://github.com/regisphilibert/hugo-module-icons).