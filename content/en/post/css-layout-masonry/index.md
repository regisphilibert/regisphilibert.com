---
date: "2017-12-15T18:58:30-04:00"
tags: ["css", "masonry", "cssgrid", "columns", "flexbox"]
draft: false
title: 'Pure CSS Masonry in 2018?'
slug: pure-css-masonry-layout-with-flexbox-grid-columns-in-2018
description: "With those awesome css layout systems now available (Flexbox, Multi-column, Grid), one must wonder if they cannot help us build the masonry grid every client has been asking for the last couple of years. Let's review what a masonry layout is and how those modern options could help us build it"
featured: small
---

## The state of CSS bricklaying.

2017 brought along the last item needed for the perfect CSS Layout : CSS Grid.

And now that [CSS Grid](https://www.w3.org/TR/css-grid-1/) is supported by all modern browsers this gives 3 main layout systems to choose from when trying to build the perfect layout:

* [CSS Grid](https://www.w3.org/TR/css-grid-1/)
* [CSS Multi-column](https://www.w3.org/TR/css-multicol-1/)
* [CSS Flexible Box](https://www.w3.org/TR/css-flexbox/) (more commonly known as Flexbox)

One must wonder if they cannot help us build the masonry grid every client has been drooling for for the last couple of years.

> I want that Pinterest thing to list my cupcakes! &mdash; <strong>A Happy Client</strong>

Sure you can! There's plenty of articles out there about Pure CSS Masonry solutions... 

Cough cough, before throwing all arms in the air, let's review the requirements of a Masonry layout.

## What is a masonry layout?
We’re all familiar with what it should look like : a wall of bricks of different heights. But there are 3 important technical requirements to take into acount when building it. __And every "Pure CSS Masonry" solutions out there ignores the °2__.

{{< figure src="/posts/masonry.png" caption="A masonry layout follows 3 requirements illustrated above and listed below" title="Masonry layout" >}}


#### 1. Every block has a different height.
That’s the perk, your bricks don’t have to share the same height, no matter where they are painted on the page. They contain an image, every ratio of those being unique, every height of their parent is also unique.  Be yourself little brick, be different and proud!

#### 2. The bricks are listed horizontally.
Even though those items appear to be stacked on top of each other in their respective columns, they should not be ordered within this column. Check the image above, that is how the order should flow: horizontally within the viewport so recent elements live on top. Why you ask?

> What do you mean my 4th most popular cupcake is below the fold?
> &mdash; **An Angry Client**

Seriously though, Pinterest would have never introduced the Masonry layout had they not been able to present it with an horizontal flow.

#### 3. The number of columns is controlled and defined
You don’t want those columns to shrink or overflow the available space in your container. They have to be contained. My masonry has 5 columns, each taking 20% of the viewport or so and I should be able to easily change those parameters according to the viewport width.

__With those 3 requirements in mind, let’s see our modern options.__

## With CSS Grid?
**CSS Grid** is the best thing that happened to CSS since __box-sizing: border-box;__
You can control the order, you can set the width and/or height of the gutter, heck you can even define the space an element will take on the grid: spans 2 columns, span 3 rows. There are tons of tutorials out there including the amazing [Rachel Andrew](https://twitter.com/rachelandrew)'s [Grid by Exemple](https://gridbyexample.com/).

This modest <a class="no-ajax" target="_blank" href='{{< fakeref "about" >}}#skill-grid'>skill grid</a> by yours truly has been coded in minutes and adapts beautifuly.

It looks like CSS Grid gives us even more options than we initially required 🤘!

But its very own _raison d’être_ is a major drawback masonry-wise, for it is after all __a grid__.
A grid is made of lines which supports each other. Each rectangular form drawn by those lines inevitably share a common horizontal and vertical line.
So every form or brick of the same row share the same height as their taller buddy.

{{< figure src="/posts/grid.png" caption="CSS Grid is a grid, each bricks have the same height as their taller 'row mate'. That won't cut it." title="Using CSS Grid" >}}

__grid-auto-flow:dense__ sounds like it could help, but it won't. It will rearrange the items to avoid any gap your source may leave in your grid but this doesn't solve our same height problem.

{{% orange %}}CSS Grid flunked requirement n°1, it’s out.{{% /orange %}}

## With Flexbox?
Now Flexbox with __flex-direction__ set to __columns__ is kind of promising because you can control the order like CSS Grid.

Providing you knew the number of items on the page, with a time saving SASS __@for loop__ you could target every so and so element and maybe rework the ordering from there to make sure that 4th cupcake is not below the fold.

What you don’t control though is the number of columns you will end up with.

In Flexbox you have to set a __height__ to your container so that columns wrap. Otherwise you just end up with one endless column.

With any masonry layout, as discussed in requirement n°1 you have no way to know the height of each individual brick. Because every image they hold usually has a different ratio. Therefore you cannot predict the amount of space they will take vertically.

You cannot safely predefine the height of your container without risking ending up with too many columns.

In short: in a 900px tall container, 9 elements may generate 3 columns or 6 columns, no way to know. Hello overflow!

{{< figure src="/posts/flexbox.gif" caption="Flexbox generates an unpredictable number of columns often resulting in an unwanted overflow." title="Using Flexbox" >}}

In Firefox you can use __page-break-before: always;__ and set it on every nth elements with an nth-child rule to control the number of items per columns. So if you know the number of items on your page, you could control the number of columns and not set a height to your container. But this is Firefox only and still needs a lot of additional work.

{{% orange %}}Flexbox is out.{{% /orange %}}

## With Multi-column?
*Multi-column * seems to be the perfect tool to build a masonry. You can set the number of columns (or just their width), every element has its own height etc… You cannot for now have an item span more than 1 column (it is either 1 or all), but it is not in our requirement so we can move on to our main problem : 
The content flows in one direction only, vertically.

Multi-column spec has not been drafted to build a grid, but columns of text much as in a newspaper. This is designed to contain flowing elements inside one common parent.

You have your perfect masonry except requirement n°2 is undeniably flunked. That 4th cupcake is going to live below the fold, less visible than its older brothers…

{{< figure src="/posts/columns.png" caption="Everything looks great but for the ordering of the elements. I can see brick 15 and 21 but not 4. This is not good." title="Using Multi-column" >}}

To counter this issue you would have to either :

- Build a complex templating logic on the source which would order your bricks in a certain way as to make them appear flowing horizontally.
- Use javascript to redistribute the elements based on their height and available space. But because columns are not identifiable DOM elements, this will be *very* tricky. Might as well use an already existing Javascript solution.

## Conclusion 🤷‍♀️
**Nope.** 

Despite all the demo you’ve seen out there a Pure CSS Masonry layout that satisfies both your designer **and** your content manager is not coming anytime soon.

That being said, beside the obvious order problem, *Multi-column* solves most of the challenges bound to a masonry layout.

You can set a gutter and a rule and style their respective colors.
You can define the column number or just set a width and let them adjust.  
And who knows ? You may be part of the lucky few who don't have requirement n°2 in your project, and in this case, your champion is undeniably Multi-column and its impressive [browser compatibility](https://caniuse.com/#feat=multicolumn). 
And all it would take is this :
~~~css
.wall{
	columns:4;
    column-gap: 1em;
}
.brick{
	margin-bottom:1em;
	/* No cross browser 'break-inside' property being supported yet: */
	display:inline-block;
}
~~~

For the rest, and until someone builds a lighter JavaScript library which relies on Multi-column rather than absolute positioning, you can still use [David DeSandro](https://desandro.com/)'s [Masonry.js](https://masonry.desandro.com/) or its filtering silbing [Isotope.js](https://isotope.metafizzy.co/)

Happy bricklaying!
