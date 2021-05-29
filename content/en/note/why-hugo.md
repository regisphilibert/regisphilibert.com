---
title: "Why a static website with Hugo?"
date: 2018-08-20T14:44:35-05:00
type: note
outputs:
  - html
  - markdown
---


## Static pros are better!

### Fast 🏎️

Visitors don't have to wait on the servers while it builds the HTML file on the fly. 
The file has been there all along, ready to serve!

__As a result, loading speed is super fast even on low bandwidth!__

### Safe 🔐

No Database. No SQL injection. No potentially exposed data is stored anywhere but on in your core files. 

__There's only one gate to keep, your file server.__ 🧙

### Reliable 💪

A static website does not need any work from server beside serving HTML and media files. It's pretty much like serving a bunch of tiny pictures everytime a visitor lands on the site.

No risk of the sever slowing down or heating up during peak traffic.

__Bye bye Error 501!__


#### A visit walkthrough...

{{% notice %}}

__WordPress or any classic dynamic website__

1. Visitor lands on the page
2. File Server connects to database
3. Database server returns the required data
4. File serveur uses the retrieved data to build an HTML file on the fly.
5. Vistor's browser downloads the HTML file and put it on screen.

__Static site__

1. Visitor lands on the page
5. Vistor's browser downloads the HTML file and put it on screen.

{{% /notice %}}

## CMS Solution ✏️

A database free CMS? Yes can do!

![Forestry](https://regisphilibert.com/note/forestry.png)

[Forestry.io](https://forestry.io/#/) is a Canadian company (🇨🇦❣️) which offers a reliable CMS solution for static website!

### 👉 Forestry.io Demo

1. Add/Edit page
1. Add a media
1. Add blocks
1. Preview unpublished changes
1. Shortcode/Snippet

## Why Hugo rather than other static gen out there?

[Hugo](https://gohugo.io/) is in the top three Static Site Genrators[^1], and easily wins ranks number one in velocity 🥇.

[^1]: https://www.netlify.com/blog/2017/05/25/top-ten-static-site-generators-of-2017/

### Build speed

A static generator must be able to build every HTML pages the instant the content is edited.
If you intend on updating the content often, then the build speed becomes undeniably very critical.

__Hugo can build 10,000 pages in less than 10 seconds 😱__

#### Gimme facts! 📈[^2][^3]

StatGen | 1,000  |  10,000
:----------|--------|---
__Hugo__   🚀  | 0.65s  | 7.46s   
Gatsby 🏃  | 7.4s   | 74s (> 1 minute)  
Jekyll 🐌  | 18.42s | 218s (> 3 minutes) 

            
[^2]: https://forestry.io/blog/hugo-vs-jekyll-benchmark/
[^3]: https://github.com/gatsbyjs/gatsby/pull/6226/

__Think about that for your editors 🤔__


Within the 5 long seconds it usually takes WordPress to reload the page after hitting "save", Hugo will have rebuilt the website and deployed the thousands newly generated files live! And all of that while allowing the editor to keep on queuing new changes!

Or... you could just programmatically set automatic builds every 5 minutes without a sweat.

{{% notice %}}
You don't need 1000 posts or pages in your content to end up with 1000 HTML files. An average numbers of categories, assigned to an average number of posts and your StaticGen will need to build many category archives, with several pages each (Page 1, Page 2 etc…)
{{% /notice %}}

##  Technically... How does that work? 🤓

Any editor be through a CMS like Forestry.io or directly from within a content file edit a page of the website.

This update will trigger a build or compilation of the the HTML files from Hugo.

During the build, Hugo will read every Markdown files from the content directory and generate the HTML files using their data.

#### Content Directory structure example

```
└── content
    ├── about.md
    ├── contact.md
    ├── team.md
    ├── posts
    │   ├── a-new-initiative.md
    │   └── speaker-intro.md
    └── projects
	      ├── city-museum.md
	      └── warehouse-redesign.md
```

#### Markdown file example:

👇 Let's look at a simple Markdown file:

```Markdown
---
title: Une nouvelle initiative
date: 2018-08-07
image: intitiatve.jpg
categories:
- Entreprise
- Solutions
---

## La nouvelle initiative en question

Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Vestibulum id ligula porta felis euismod semper. Donec id elit non mi porta gravida at eget metus. Aenean lacinia bibendum nulla sed consectetur. Sed posuere consectetur est at lobortis.

1. Débuter
2. Continuer
3. Perseverer

## Conclusion

Pour en savoir plus [c'est par là](https://liens-utiles.org)

```

👉 We can __also__ at the Mardkdown code from this very page [here](markdown.html).
