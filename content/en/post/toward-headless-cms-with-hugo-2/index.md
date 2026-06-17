---
draft: false
authors:
  - persons/regis-philibert.md
date: 2021-12-20T08:32:27.000Z
title: "Toward using a Headless CMS with Hugo: Building Pages from an API"
slug: toward-using-a-headless-cms-with-hugo-part-2-building-from-remote-api
comments: https://github.com/theNewDynamic/thenewdynamic.com/discussions/196
tags:
  - hugo
  - headless-cms
  - api
  - JAMStack
subjects:
  - dev
twitter_description: |-
  Ho ho ho! This holiday season, we have a nice little gift for @GoHugoIO users out there! 🎁

  How to build pages from a remote API using Hugo and Hugo alone?

  Go unwrap your present at https://www.thenewdynamic.com/article/toward-using-a-headless-cms-with-hugo-part-2-building-from-remote-api/

#gohugo #JAMStack #SSG #headlesscms

description: How to build pages from a remote API using Hugo and Hugo alone? In this article we uncover how Hugo can fetch data with its resources.GetRemote feature, write its own markdownfiles with resources.FromString and consume them in a subsequent build!
seo:
  image: /uploads/toward-using-a-headless-cms-with-hugo-part-2-building-from-remote-api.png
---


We'll use a straignt forward workaround. It consists of using Hugo to grab our data from a remote source using `resources.GetRemote` --- Hugo's own `fetch` API ---, keep using Hugo to generate markdown files using its `resources.FromString`, and finally build our Hugo project with the aforementioned content files.

## Building pages from a remote source

With Hugo's famous limitation, the only way to efficiently build pages from data (local or remote) while preserving the powerful Page API of Hugo has been to split your build into two steps.

__Step 1__ uses whatever script and tooling you're comfortable with to fetch the remote data and generate markdown files to feed to Hugo.

__Step 2__ simply runs a Hugo project using the markdown files generated during __Step 1__.

There are lot of ways to implement __Step 1__: Netlify, for instance, has a "build" plugin solution you can run before your build. It is currently limited to NodeJS and requires jumping through several hoops when building locally, but is an option.

CloudCannon on the other hand reads a `prebuild` file on your repo which can include any script to be run before the build.

All of this is good and all, but what if I told you that Hugo, in itself, while not able to build pages from data is perfectly capable of:
- Fetching an API and process its response
- Write markdown files

__So Hugo can very well run both steps!__

In this article, we'll see how we can safely use the same Hugo binary to run __Step 1__ and __Step 2__ and have Hugo and Hugo alone build pages from a remote source.

## The project


It's a [monsterspotting site](https://monsterspotting.netlify.app)! With its 500 spotted monsters of 10 different generations, it bears a home page, a monsters page with pagination and detail pages for each monster.

It grabs its monsters from an API located at https://monsters-api.netlify.app/ and create pages for all of them.

During this article, you'll be able to mount the monsters on any project of your choosing though.

### Prerequisite
If you want to play along and build a monster site from our remote API:

You should have Hugo `0.91.0` running.
You should have a Hugo project set up. Does not need to be too complex. A `layouts/index.html` and a `layouts/_default/single.html` will do!

Or you can just read along!

Here we go!

{{% aside %}}

__Hugo to generate content files, isn't there a better tool for that?__

Always up for debate but we've tested this with 10,000 entries fetched from a paginated API (100 pings) and had the 10,000 markdown files built and written in 2 seconds. So speed is not a problem even if this runs on every build.

The only preferable solution could be a Go script of course, but you will need to carefully choose your CI in order to set it up properly and, you need to know Go.

The advantage of running Hugo here is that you are using the same framework that you know well and benefit from its caching logic for the endpoints. There is no extra setup: just one more configuration file and one more template file.

This also means this setup will work on any host out there, regardless of their build, pre-build features.
{{% /aside %}}

## Step 1

We need to configure a minimal Hugo project. This is the project which will just get the monsters data and write the markdown files.

We could use the root directory of the main project, but it's much more convenient to use a sub directory.

Let's create a `/prebuild` directory to handle everything "pre-build".

In your terminal you can already `cd` into this directory as you'll have to run `hugo` from there throughout __Step 1__.

### Our files

For Hugo to build a project, it only needs two files. We'll add those.
1. `prebuild/config.yaml`
2. `prebuild/layouts/index.html`

### Configuring our minimal project

Technically an empty `config.yaml` would be okay, but while we're at it, we can pass some settings to make sure Hugo does not output too many useless files alongside our markdown files.

```yaml
# config.yaml
disableKinds:
- sitemap
- taxonomy
- term
outputs:
  home:
  - html
```

### Fetching the remote data

First let's look at what our endpoint at `https://monsters-api.netlify.app/` returns to get an idea of what we'll be getting.
```json
[
  {
    "content": "Condim uisque curae duis...",
    "generation": 1,
    "id": "bryan-plastic-1",
    "img": "https://monsters-api.netlify.app/png_4526566859420692809.png",
    "league": "Teal",
    "spotted": "Gandara",
    "title": "Bryan Plastic the First"
  },
  {
    "content": "Itur erdiet pretium quisque sapien lacinia ullamcor. Disse bibendu fusce suspendi...",
    "generation": 1,
    "id": "gus-vinyl-1",
    "img": "https://monsters-api.netlify.app/png_7480160596753705284.png",
    "league": "Fuscia",
    "spotted": "Reserva",
    "title": "Gus Vinyl the First"
  },
  [...]
]
```

__Looks good? Let's start fetching!__

We'll now focus on our minimal project's `layouts/index.html`. Hugo will only have one template to read, but for what we're trying to achieve it's plenty.

This template file will be in charge of fetching the API data, ranging on the returned monsters and create the markdown files.

Since Hugo 0.91.0, you can fetch remote resources using [`resources.GetRemote`](https://gohugo.io/hugo-pipes/introduction/#get-resource-with-resourcesget-and-resourcesgetremote).
Here we're looking for a JSON response, but bear in mind you could fetch images, documents, svgs, anything out there is yours to get and manipulate with Hugo's [resources feature](https://gohugo.io/hugo-pipes/).

{{% aside %}}
There are various settings this `resources.GetRemote` can use like "headers" (useful for authorizations) or `method` and `body`. It even sports a `.Err` method. Our monsters API is static and open, so we won't get into it now but will in a future article.

{{% /aside %}}

Let's dive in with some plain code:


```go-html-template
{{/* prebuild/layouts/index.html */}}
{{ with resources.GetRemote "https://monsters-api.netlify.app/" }}
  {{ $monsters := . }}
{{ end }}
```

With the above, we are able to retrieve our Monsters.

But that will not be enough, the `$monsters` variable does not contain a list of monsters yet. For now it's just a resource: a file which has been fetched. The content of the response, in our case 500 monsters trapped into a jsonified array is available at `.Content`.

And in order to turn this JSON string into an object Hugo understands, we'll use the `transform.Unmarshal` function, aliased `unmarshal`. This takes any string, `json`, `yaml` or `toml` and turns it into "Hugo data".

One more time:

```go-html-template
{{/* prebuild/layouts/index.html */}}
{{ with resources.GetRemote "https://monsters-api.netlify.app/" }}
  {{ $monsters := unmarshal .Content }}
  {{ range $monsters }}
    I love {{ .title }}
  {{ end }}
{{ end }}
```

Great, now we know how to handle our response and turn it into data we can use in templates!

But while we do love our monsters, proclaiming our love is not the point here. We want to create files, markdown files!


### Create the markdown files

What we now want to do for each monster, is use the retrieved data to create a markdown file.

For this we'll use the Hugo Pipes `resource.FromString` method. What it does is take a string and generate a Hugo resource from it at the desired destination.

```go-html-template
{{ $love := resources.FromString "monsters/love.txt" "I love Monsters" }}
```
The above will create a resource with "I love Monsters" for content, and `monsters/love.txt` as a filename.

But it will not publish it! If you're familiar with Hugo Pipes, you'll know that anything it produces will only be published if its `.RelPermalink` or `.Permalink` method is invoked.

```go-html-template
{{ $love := resources.FromString "monsters/love.txt" "I love Monsters" }}
{{ $file := $love.RelPermalink }}
```

That extra line will be enough for Hugo to publish it and won't print anything, as we're storing it in a variable.

Now, finally, on to creating markdown files!

This is a conventional markdown file using YAML:

```yaml
# monsters/gus-vinyl.md
---
title: Gus Vinyl the First
league: Fuscia
spotted: Reserva
---

Itur erdiet pretium quisque sapien lacinia ullamcor. Disse bibendu fusce suspendi...
```

We could spend a bit more time formatting something like that, but Hugo also supports `json` as Front Matter. A JSON Front Matter markdown file's content is just a JSON object followed by the content:

```json
{"title":"Gus Vinyl the First", "league":"Fuscia", "spotted":"Reserva"} Lorem ipsum monster yaya...
```

For now, our monsters content will be stored as Front Matter key! This makes it easy then:

```go-html-template
{{/* prebuild/layouts/index.html */}}
{{ with resources.GetRemote "https://monsters-api.netlify.app/" }}
  {{ $monsters := unmarshal .Content }}
  {{ range $monsters }}
    {{/* 1. */}} {{ $string := jsonify . }}
    {{/* 2. */}} {{ $filename := printf "monster/%s.md" (urlize .title) }}
    {{/* 3. */}} {{ $resource := resources.FromString $filename $string }}
    {{/* 4. */}} {{ $file := $resource.RelPermalink }}
  {{ end }}
{{ end }}
```
1. We create the JSON version of our monster
2. We create its filename by urlizing its title and using `printf` to include a directory
3. We generate the markdown resource using `resources.FromString`
4. We make sure it's published.

That's it? ... __That's it!__

Now we can run `hugo` from the `/prebuild` directory:

```bash
my-computer:prebuild mememe$ hugo
Start building sites …
hugo v0.91.0+extended darwin/amd64 BuildDate=unknown

                   | EN
-------------------+-----
  Pages            |  0
  Paginator pages  |  0
  Non-page files   |  0
  Static files     |  0
  Processed images |  0
  Aliases          |  0
  Sitemaps         |  0
  Cleaned          |  0

Total in 1057 ms
```


As you can see Hugo did not build any pages per say but it did write markdown files! We should get a fresh `prebuild/public/monster` directory full of monsters!

And just like that, we've wrapped up __Step 1__!

## Step 2.

This will be much easier. Let's `cd` back one directory, up to our main project.

### Configuring our main project

First, for Hugo to read the markdown files from below, we need to mount the `prebuild/public/monster` directory into our project. For this we head to our project's module config and update its mounts settings:

```yaml
# config.yaml
module:
  mounts:
  - source: content
    target: content
  - source: prebuild/public/monster
    target: content/monster
```

{{< notice >}}
With a mount target on a sub directory it's always safer to redeclare the mount of its parent. Hence our fist content > content mount.
{{< /notice >}}

Now on our main project, we just need to make sure our templates are using the proper Front Matter keys.

For example our `layouts/monster/list.html` will look like that:

```go-html-template
{{ define "main" }}
  {{ range .Pages }}
    <a href="{{ .RelPermalink }}" title="{{ .Title }}">
      <img src="{{ .Params.img }}" title="Portrait of {{ .Title }}" />
      <strong>{{ .Title }}</strong>
      <p>Last spotted in {{ .Params.spotted }}</p>
    </a>
  {{ end }}
{{ end }}
```
Tada!

If you have already ran `hugo` from the `prebuild` direrctory, you can safely run `hugo serve` from the main one, and see how our monsters look.

## Step 1 && Step 2

Running both builds locally can be okay, but we need to make sure this will be viable in the cloud, when our site is deployed and hosted.

As we covered lengthily we need to run it from first on the `prebuild` directory and then at the root, on the main project's directory.

The `--source` flag (abreviated `-s`) will point to the source folder to use for the first buid.

```bash
hugo -s prebuild && hugo
```
☝️ That will do it!

#### Deployement and Hosting

The great advantage of this is you don't need to wonder how your hosting and deployement service will handle the two steps, you just need to update the build command to navigate your directories.

For Netlify for example your `netlify.toml` will look something like this:

```toml
# netlify.toml
[build]
publish = "public"
command = "hugo -s prebuild && hugo"
```

#### Caching

Our Monsters API is static, built with Hugo so quiet reliable. But even so, it's always safer to cache your API responses so you're not stressing those endpoints at every build.

Hugo has a nice `caches` settings which allows to control how long any given resource is saved. It bears several caches key, but the one that matters to us is `getresource`.

```yaml
# prebuild/config.yaml
caches:
  getresource:
    maxAge: 6h
```

With the above we are effectively informing Hugo that any response obtained with `resources.GetRemote` should be cached for 6 hours. That is 6 hours during which the API can REST! 🥁.

## Before you go...

We've covered API fetching, mardkown files writing, content files mounting, website deploying and hosting and caching! But there are more to this we can quickly glance at.

### Data transformation

The data from our Monsters is easy to handle but you'll mostly want to transform the data from the API into something more aligned with your project.

We're covering everything there is to know about the way to manipulate data with Hugo in this article: {{< link "/article/hugo-data/part-2" >}}.

That will allow us to create transformers for our data and prep those markdown files nicely!

### Adding .Content
What about `.Content` and how can we make the generated files look good?

Front Matter --- in our example, a simple JSON object --- goes first, the body comes second. So translated into Hugo:
```go-html-template
{{ $string := print (jsonify $monster) $monster.content }}
```
Then you've got a complete Markdown file with a content handled in the template via `.Content`.

### Other Front Matter than JSON?
In most cases you won't need a fancy formatting for your "imported" markdown files, JSON Front Matter should always do. After all, there are for Hugo's eyes only...

But there are some use case where you might want to create nice readable files.

Maybe to make your life easier for debuging the output of the __Step 1__ logic. Or you might want to use what we've learned today to handle a database migration to git based content. In this case, the produced files must be perfect.

Whatever the use case, we could make those files look good by using [`resources.ExecuteAsTemplate`](https://gohugo.io/hugo-pipes/resource-from-template/#readout). This useful resource method will take a filepath destination as first argument, a context as second and the template's filepath to use as third.

For yaml you could create a `/prebuild/assets/monster.yaml` file like so:
```go-html-template
---
{{ range $key, $value := . -}}
{{- if ne $key "content" -}}
{{- $key }}: {{ $value }}
{{ end -}}
{{- end -}}

---

{{ .content }}
```

And update the file creation in your `remote/layouts/index.html` to:
```go-html-template
{{ $yaml_template := resources.Get "monster.yaml" }}
{{ $file = resources.ExecuteAsTemplate $filename $monster $yaml_template }}
```

## See in action

The full project is located in this repo: [https://github.com/regisphilibert/monsterspotting-remote.com](https://github.com/regisphilibert/monsterspotting-remote.com).

Feel free to fork it and play around. It's running Tailwind and PostCSS, so you will need to hit `npm install` before playing!

The API lives at https://monsters-api.netlify.app/

It bears one end point with a generation parameters

`https://monsters-api.netlify.app` > All 10 generations of monsters (500 👾)
`https://monsters-api.netlify.app?generations=1` > Just one generation of monsters (50 👾)
[...]
`https://monsters-api.netlify.app?generations=9` > Nine generations of monsters (450 👾)

