---
title: "Hugo Test Post"
date: 2018-01-10T11:07:08-04:00
draft: true
noindex: false
tags:
 - Hugo
 - Resources
 - Shortcodes
 - Something

---

## Testing...

~~~text
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

~~~yaml
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

```twig
{{ with .Resources.ByType }}
	<div class="Image">
	{{ range . }}
		<img src="{{ .RelPermalink }}">
	{{ end }}
	</div>
{{ end }}
```

<hr>

```html
{{ with .Resources.ByType }}
	<div class="Image">
	{{ range . }}
		<img src="{{ .RelPermalink }}">
	{{ end }}
	</div>
{{ end }}
```

<hr>

```go
//Before my body tag I can store my first and universal class.
{{ .Scratch.Add "classes" (slice "rp-body") }}

//Then my section. That printf allows me to to prepend the .Section Value with my prefix.
{{ .Scratch.Add "classes" (slice (printf "rp-%s" .Section))) }}

// Now is this the home page ?
{{ if .IsHome }}
	{{ .Scratch.Add "classes" (slice "rp-home") }}
{{end}}
// Is this a holyday? 🎄
{{ if isset .Site.Params "season" }}
	{{ .Scratch.Add "classes" (slice (printf "rp-body--%s" .Site.Params.season))) }}
{{ end }}
```

### shortcode
{{< highlight go >}}
{{ with .Resources.ByType "image" }}
	<div class="Gallery">
		{{ range . }}
			{{ if not (strings.Contains .RelPermalink ".draft.") }} // Check that the Resource is not marked as draft
			<div class="Gallery__item">
				<img src="{{ .RelPermalink }}" />
			</div>
			{{ end }}
		{{ end }}
	</div>
{{ end }}
{{< /highlight >}}

{{< highlight python >}}
from engine import RunForrestRun

"""Test code for syntax highlighting!"""

class Foo:
	def __init__(self, var):
		self.var = var
		self.run()

	def run(self):
		RunForrestRun()  # run along!
{{< /highlight >}}

### Trying out
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