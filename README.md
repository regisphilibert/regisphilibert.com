# Hugo Project Template Repo

This template repo should be used upon starting a new Hugo Project. It uses our own modules and project structure plus loads some useful templates.


## Setup

### 1. Download Hugo binary:
1. Update Package.json "hugo.version" key with latest or desired Hugo Version symver. Warning: It should always match `netlify.toml`'s `HUGO_VERSION` environment variable.
2. `$ npm run gethugo`

### 2. Setup Hugo Module
Where `repo_url` is GitHub's repo url without protocole: Ex: `github.com/theNewDynamic/thenewdynamic.com` 
1. `$ REPO={repo_url} npm run modinit`

### 3. Install required NPM modules
1. `$ npm run modpack` to update package.json with Hugo Modules' required npm modules.
2. `$ npm install`

### 4. Multilingual sites
If the site shall be multilingual:

1. Update [`config/_default/languages.yaml`](https://github.com/theNewDynamic/hugo-project-template/blob/2c154bfdafb093d3fa5177174d8d50d464b12b4e/config/_default/languages.yaml#L8-L12
) to add more languages.
2. Add localized content files to directories matching the extra language's `contentDir` settings. (Ex: `content/fr`)
3. Add string localization files under the `118n` directory matching the extra languages' codes with needed strings. (Ex: `/i18n/fr.yaml`)


## NPM Scripts

- `$ npm run start`: Run Hugo in a local dev server environment -> http://localhost/1313.
- `$ npm run deploy`: Deploy site and process ressources.
- `$ npm run hugo-cms`: Runs NetlifyCMS and Hugo

## CSS

Project uses TND Styles module to manage TailwindCSS and fonts.

### Configurations

- Tailwind Configuration is at `assets/css/config/tailwind.config.js`.
- Purge Configuration is at `assets/css/config/purge.config.js`.
- See `assets/css/tailwind/utilities.css` for declaring Tailwind custom utilities.

### CSS Files
`assets/css/style.scss` holds all relative imports. 
SCSS syntax can be used in any files alongside Tailwind's own methods. `@apply` etc...

### Font files
Font files should live under `assets/fonts`. The TND Style module will handle every thing fonts from `@fontface` decleration to preloading.
User should declare fonts using the TND Styles Module API in its section of the `/config/params.yaml` file. See https://github.com/theNewDynamic/hugo-module-tnd-styles#fonts

## JS
Javascripts is built with Hugo's `js.Build` and can handle `jsx` as long as all the files' extension are `jsx`.

### JS Files
`assets/js/index.js` holds the relative imports.

## Assets Processing

All assets are built by Hugo, their subsequent tags are loaded using the TND Styles module solution.

`$ npm run deploy` will process the assets and commit style related resources so that `production` does not compile the assets. (Thus gaining a good 3s of PostCSS)

## Multilingual

The template is setup as Multilingual. Check the `config/languages.yaml` file to remove/edit other languages.

String translations are handled via the `i18n`.

## Media

We're using TND MEDIA and its DX.

See [Settings](https://github.com/theNewDynamic/hugo-module-tnd-media#settings) and [Get function](https://github.com/theNewDynamic/hugo-module-tnd-media#get)

```
{{ $args := dict 
  "path" "/uploads/an-image.jpg" 
  "width" 1024 
  "height" 100 
}}
{{ with partial "tnd-imgix/Get" $args }}
  <img src="{{ .RelPermalink }}" alt="Something nice" />
{{ end }}
```

# Google Analytics

See `config/_default/config`'s `googleAnalytics` key.

# Redirects

The netlify app domain redirection should be added through the params.tnd_redirects once code lives at final domain.