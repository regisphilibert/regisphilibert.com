---
title: "Pourquoi un site statique avec Hugo?"
date: 2018-08-20T14:44:35-05:00
type: note
slug: pourquoi-hugo
outputs:
  - html
  - markdown
---


## Avantages des sites statiques

### Rapidité 🏎️

Pas besoin d’attendre que les serveurs fassent leur travail de requête de données et de construction de fichiers à la volée pour voir la page. Le fichier HTML est déjà prêt dès la connexion du visiteur. 

__On a donc une vitesse de chargement très rapide même sur les connexions en très bas débit.__

### Sécurité 🔐

Il n’y a pas de base de donnée! Aucune faille d'injection SQL possible, et surtout aucune information des éditeurs n’est donc stockée et piratable.
__Il n'y a qu'une entrée à garder, votre serveur FTP.__

### Fiablité 💪

Contrairement à un site dynamique, le serveur ne travaille pas lors d’une visite. Il sert juste des fichiers HTML qui seront téléchargés comme de simples images.

En cas de forte affluence, pas de risque de ralentissement ni de surchauffe des serveurs.

__Bye bye Erreur 501!__


#### Note comparative lors d'une visite

{{% notice %}}

__WordPress ou site dynamique classique__

1. Le Visiteur arrive sur la page
2. Le Serveur se connecte à la base de donnée
3. Le Serveur récupère les données demandées
4. Le Serveur utilise les données reçues pour construire à la volée le fichier HTML.
5. Le navigateur du Visiteur télécharge la page HTML et l'affiche

__Site statique__

1. Le Visiteur arrive sur la page
2. Le navigateur du Visiteur télécharge la page HTML et l'affiche

{{% /notice %}}

## Solution CMS ✏️

Un CMS sans base de donnée ? C’est possible!

![Forestry](https://regisphilibert.com/note/forestry.png)

[Forestry.io](https://forestry.io/#/) est une compagnie Canadienne (🇨🇦❣️) qui présente une solution de CMS pour site statique plus qu'adéquate.

### 👉 Démo Forestry.io

1. Ajout/Édition de page
1. Ajout de média
1. Ajout de bloque dans une page
1. Aperçu avant publication
1. Shortcode/Snippet

## Pourquoi Hugo plutôt qu’un autre générateur de sites statiques ?

[Hugo](https://gohugo.io/) figure parmis les trois principaux générateurs de sites statiques[^1]. Il est le grand gagnant en matière de rapidité.

[^1]: https://www.netlify.com/blog/2017/05/25/top-ten-static-site-generators-of-2017/

### Rapidité de compilation

Un site statique doit pouvoir compiler toutes les pages HTML du site dès que le contenu est modifié.   
Plus la fréquence de mise à jour est importante plus la vitesse de compilation devient critique.

__Hugo compile 10,000 pages en moins de 10 secondes 😱__

#### Quelques chiffres 📈[^2][^3]

Generateur | 1,000  |  10,000
:----------|--------|---
__Hugo__   🚀  | 0.65s  | 7.46s   
Gatsby 🏃  | 7.4s   | 74s (> 1 minute)  
Jekyll 🐌  | 18.42s | 218s (> 3 minutes) 

            
[^2]: https://forestry.io/blog/hugo-vs-jekyll-benchmark/
[^3]: https://github.com/gatsbyjs/gatsby/pull/6226/

{{% notice %}}
Pas besoin d’avoir 1000 articles de blogue pour compiler 1000 fichiers HTML. Il suffit d’avoir beaucoup de catégories assignées à beaucoup d’articles pour que le site ait à produire de nombreuses archives de catégories avec plusieurs pages chacune (Page 1, Page 2 etc…)
{{% /notice %}}


##  Comment ça marche techniquement? 🤓

Un éditeur, par l'intémédiaire d'un CMS comme Forestry.io par exemple, édite une page du site.

Cette modification va alors déclencher une recompilation des fichiers HTML par Hugo.

Lors de la compilation, Hugo va lire les fichiers Markdown du repertoire de contenu et générer les fichiers HTML avec les données récupérées.

#### Exemple de structure d'un repertoire de contenu

```
└── content
    ├── a-propos.md
    ├── contact.md
    ├── equipe.md
    ├── posts
    │   ├── une-nouvelle-initiative.md
    │   └── presentation-d-un-intervenant.md
    └── realisations
	      ├── musee-de-la-ville.md
	      └── rehabilitation-entrepot.md
```

#### Exemple de fichier Markdown:

👇 On peut observer la version simplifiée suivante:

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

👉 On peut __aussi__ consulter la version Markdown de la note qu'on vient de lire [ici](markdown.html).
