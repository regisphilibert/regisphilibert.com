---
title: 'Utility First and CSS Components: a reconciliation'
toc: true
---

It seems those two worlds should never collide.

Yet I'd like to question that by first comparing the two systems in casual scenarios. The famous Button pratical example will guide us though that journey.

Then, we'll try and imagine a <del>world></del> setup where those two systems can cohabit.

## Life of a button in a CSS Component system.

Any design systems will bear buttons. You usually end up with three or four variations of those plus sizes so:

- `.Button` 
- `.Button--primary`
- `.Button--secondary`
- `.Button--ghost`
- `.Button--lg`
- `.Button--xl`

Some variations are more impactful than others, but  contrary to utility classes none of those only bear one property declaration.
`.Button--lg` for example is not just about applying a font size to the button, it adapts its `padding`, `border-radius`, `border-width` as those can not always be proportional to the font’s size.

Now, as `.Button` is used as a base, in the markup you usually end up with: 
```html
<a href="/cancel" class="Button Button--secondary">Cancel</a>
```

Note that with the right CSS, we make sure those classes can be used on any HTML tag and still achieve the aimed styling.
```html
<!-- for forms -->
<input type="submit" class="Button Button--primary" value="Submit" />
<button class="Button Button--primary">Submit</button>
<!-- The following is often used with user input content 
where a shortocde may wrap a WYSIWYG link -->
<div class="Button Button--primary">
  <a href="/submit">Submit</a>
</div>
```

### Maintaining buttons as CSS Components.
If you need to update the styling of one or several buttons, the process to be chosen revolves arounds a few questions:

- Should all your buttons be impacted?
- Should only one variation be impacted?
- Should only this newly created button be impacted?

Answering those questions will ultimately make you realize which CSS rule needs to be updated or if you need to create a new variation of your button.

Once you settle with the rightful decision, the update will happen in your CSS alone and be automatically applied to all your markup's existing buttons or only the ones using your new or updated variation.

### Adding a new primary button to the markup

If the client needs a new submit button (project didn't have any form before), all you have to do is browse your `css/components/` directory, look for our `Button.css` component file and find the desired variation.

Then all you have to do is drop those buttons in your new form:

```html
<div class="Actions">
  <button type="submit" class="Button Button--primary">Submit!</button>
  <button class="Button Button--secondary">Cancel</button> 
</div>
```

That's it! You can be sure, even though you're not too familiar with this project, that your submit button looks just like every other primary button.

## Life of a button in a utility first system

Let’s consider the same component and scenarios but within a utility class system.

We have a lot of buttons in our projects all using a base set of utility classes. Other buttons need extra utilities to adapt their look to a desired variation. Trying and draw an equivalence with the variations cited in our CSS Component scenario, we could draft the following: 

{{% fullwidth %}}
CSS Components | Utilities
--- | ---
`Button` | `.border-1.rounded-2.px-4.py-2`
`Button.Button--primary` | `.border-1.rounded-2.text-white.px-4.py-2.bg-blue.text-white`
 `Button.Button--secondary` |  `.border-1.rounded-2.text-white.px-4.py-2.bg-blue-lighter.text-white`
`Button.Button—ghost` | `.border-1.rounded-2.text-white.px-4.py-2.bg-transparent.text-grey`
`Button.Button--primary.Button--lg` | `.border-1.rounded-2.px-6.py-3.bg-blue.text-white.text-lg`
{{% /fullwidth %}}

I did not include any necessary utility class to override default styling of certain HTML tags `<input>`, `<button>` etc...

All the buttons of the project will therefor bear as class attribute the utility classes expressed above. 


### Maintaining buttons as individual utility-class-bearing markup elements. 

As with our first example, we now need to slightly update their design following a new art direction.

We could update the Tailwind config (or other utlity class system in place), but other elements may be using the same config variable and would be impacted. Unless creating dedicated Tailwind config variables and utility classes for our buttons, we have to update every single instances of those in the markup.

With Hugo we could wrap those button instances in partials, and pass their styling variations through the context in order for our partials to print the right utility classes. But this means we must also create dedicated partials for `<a>` buttons, `<button>` buttons, `<input>` buttons etc… More to the point, this means we create partials for styling purposes only and not necessarily for ease of reusability or coding.

Writing the following:
```html
<a href="/submit" class="border-1 rounded-2 text-white px-4 py-2 bg-blue text-white">Submit!</a>
```
Can be just as cumbersome as writing
```html
{{ partial "buttons/a.html" (dict "style" "primary" "href" "submit" "text" "Submit!")
```

It is my opinion that updating the styling of a single component is more cumbersome and error prone in a utility first system than in a CSS Component system.

### Adding a new button element to the markup.

Again, a new button needs to be added to the project in our utility first sytem. That submit button from our previous example. For this task one must:

1. locate an existing button in the markup and copy/paste its utility classes onto the new one.
2. add needed utility class on the HTML element to override default style (For example, to make sure it rendered well not only on `<a>` tags but also on the new `<button>` tag.

The first part of this task is not necessarily easy on a big or even small project.

- Available buttons may not be obvious to a maintainer unfamiliar with the project (or familar depending on time since last commit).
- Looking for existing buttons in the markup is not as easy as a `Ctr+F`, you need to know what (utility) you're looking for. 
- It's hard to tell if a button found while eye browsing the site is a variation of the base button, or the base button itself to be used on the new contact form? Is it the primary button, the secondary button, do we have have those variations?

Not only this may lead to design inconsistency but it could also impede a maintainer's work.

{{< todo >}}
### Reusability among many projects.

Even tough not every project would use the same CSS declarations on any given component. We would make sure components naming, directory structures are consistent throughout our projects. 
They would work as well known and easy to navigate catalogue. 

We could even wisely conceive base css declarations on each of those components. For as if, Buttons cannot / should not share the same property values among projects, they will most likely share a a set of properties with unique values such as:
- A background
- A Border, with radius or not.
- A set of horizontal and vertical padding

They will also share variations such as
- Primary
- Secondary
- lg
- xl
etc…

So in a sense, we could craft a CSS Component system starter with common components and base properties and base variations. Along this we would of course impose strong commenting rules to make sure every component file is as verbose as need be for any new hands to jump in and take back ownership.

So I would not rule out CSS Component systems for ease of jumping on a forgotten project, or starting a new one from scratch.
{{</ todo >}}
##  Preventing conflicts in both systems

Utility first systems cannot generate any conflicts in styling as any CSS declaration is unique to a class. Therefor unwanted overriding can only happen if two utility classes using the same CSS property are unintentionnaly added to the same HTML element.

But bear in mind that a good CSS Component system is atomic to the core (pun intended ⚛️). Conflicts are therfore really scarce. Buttons will not conflict with other CSS components. Some buttons, living in the mega-hero of the homepage may be uniquely styled. But the following:
```css
.mega-hero .Button--primary{
  padding: 1.8rem 3rem;
  font-size: 3rem
}
```
Will make sure no other buttons will be impacted.

## Responsiveness in both systems

Tailwind classnaming logic makes it super easy to apply responsive declarations to an element in the markup. But as explained before, updating the design of a component and its screen variations will be hard to perform, error prone and could generate design inconsistencies. Especially if breakpoints (at which point a component’s properties must be updated) needs to be updated (from tablet to desktop).

In a CSS Component system, every responsive concern is limited to the a CSS file. Markup will never be impacted. 

```css
.Button {
  [...]
}

@media (min-width: 1100px) {
  .Button{
    [... that screen override block]   
  }
}
```

## The best of both worlds

Now, how can those two be reconciled?

One of the greatest advantage of Tailwind is the ease with which you can reuse property values. You can of course use CSS variables or SCSS variables, but the following:
```scss
.Button{
  padding-left: $padding-3;
  padding-right: $padding-3;
  background-color: $primary;
}
```
cannot beat:
```css
.Button{
  @apply px-3 bg-primary;
}
```

This also offers the advantage of allowing any design or technical staff, and this regardless of their CSS background, to help maintain and improve the design system.

It also eases up the process of incorporating « utiltity-classed » markup to the global CSS Component system once art direction has been fully locked.

From
```html
<blockquote class="mb-2 bg-green text-white p-5 text-italic">
  Utility classes, CSS Components: I love them both! ❤️
</blockquote>

<blockquote class="mb-2 bg-red text-white p-5 text-uppercase">
  What? But you <strong>must</strong> take side! 😠
  <cite>Twitter</cite>
</blockquote> 
```

To
```css
.Quote{
  @apply mb-2 bg-green text-white p-5 text-italic;
}
.Quote--angry{
  @apply bg-red text-uppercase;
}
```

```html
<blockquote class="Quote">
 Utility classes, CSS Components: I love them both! ❤️
</blockquote>

<blockquote class="Quote Quote--angry">
  What? But you <strong>must</strong> take side! 😠
  <cite>Twitter</cite>
</blockquote> 

```

From now on, wherever a quote is used in the templates, their styling will be dealt by CSS alone.

### Conflicts

As Tailwind `@apply` rule only writes a declaration block in the stylesheet. No extra conflict scenario is created.

### Responsiveness

Tailwind’s screen config applies to utility and their `@screen` rule which again, makes it super easy for any staff to help maintain the system’s responsiveness.

```css
.Button {
  [...]
}

@screen lg {
  .Button{
    [...]
  }
}
```

Any screen variation update (lg is now 1200px) will be instantly updated through all our media queries’ `@screen` references.

This is also maintainable with SCSS but less easily and with more complex logic to assimilate.

### Use case: prose from a WYSIWYG.

Let's illustrate this potential reconciliation with a peculiar, yet critical, use case. One which involves making sure the editors' "classless" markup, added through either Markdown or a good old WYSIWYG is styled in accordance with our design system. 

This is something Tailwind alone cannot help us with. 

To achieve this we must  wrap the outputed HTML in a unique parent class to make sure only the desired tags are impacted.

The following is not how you do this as it sets a global default styling incompatible with a componentized CSS Component system.

```css
h1, h2, h3{ /* NoOoOoO.... 😱 */
  text-decoration: underline;
  text-transform: uppercase;
}
a{
  text-decoration:none;
  font-weight: bold;
  color: #456568; 
}
/* 😱 ..... oOoOoOoO! */
```

So we wrap it all in a parent class (the process is made easy with SCSS)

```scss
.user-edit{ /* 💝 */
  h1, h2, h3{
    text-decoration:underline;
    text-transform: uppercase;
  }
  a{
    text-decoration:none;
    font-weight: bold;
    color: #456568;
  }
}
/* 🎀 */
```

```go-html-template
<div class="Article">
  [...]
  <div class="Article__content">
    <div class="user-edit">
      {{ .Content }}
    </div>
  </div>
</div>
```

Great! 

Yet we will often need user content markup to be styled like other components of our design system.
A `.user-edit blockquote` for example needs to look like a `.Quote` and evolve with any future alteration of the component's style. 

We don’t want to systematically copy/paste the declaration block from `.Quote` to its `.user-content` counterpart for this is error prone and hard to maintain. 
(`.Quote` is not the only module we'll have to replicate in the user content).

There are two ways to achieve this. 

#### 1. Extending classes
```css
/* In css */
.Quote, .user-edit blockquote{
  [...]
}

```

The problem with the above is that, as those two selectors  now share a common rule, they must reside in the same place. This means our `.user-edit` declaration must reside in our `.Quote` component file.

We can solve this with the SASS’s `@extend` mixin:

```scss
// modules/_user-edit
.user-edit{
  blockquote {
    @extend .Quote
  }
}
```

As both solutions, pure CSS or SCSS `@extend`, will print the exact same stylesheet, one predicament prevails: `.user-edit bockquote` selector and `.Quote` selector will be sharing the same rule and therefor reside on the same location in the final CSS file. 

This is problematic as, in CSS, you want to control the order of rules in the file for any misplacement can have drastic impact on your cascading/overriding logic.

#### 2. @apply

With Tailwind’s `@apply` rule we can simply repeat the same declaration block without extending classes:

The following will add the declaration map of `.Quote` to `.user-edit blockquote`.

```css
.user-edit blockquote {
  @apply Quote;
}
```

And will print:

```css
.Quote{
  [.Quote declarations]
}
.user-edit blockquote{
  [.Quote declarations]
}
```

We might argue that the above CSS will ultimately generate a bigger file than our extend solution, but once your asset is gzipped, [this really does not make any difference](https://sass-guidelin.es/#extend).

It is also important to note that this use case is one of the very few where the Tailwind `@apply` rule will be used to apply more than Tailwind's own utility classes. For 90% of the use cases, CSS Components rules and declarations will not be refered to or used outside of their own CSS file.

## Witch projects does this apply to? 

Again, Utility First, CSS Component, Tailwind + CSS Component, no tooling can apply to every single projects.

There are many use cases where Tailwind alone can be plenty. I’m thinking about proof of concept of course but also

- projects with a strong/slow incremental progress and no immediate vision for the future, 
- projects we need to jump in fast without the luxury of panning out in search of a global design direction, 
- projects we might want to design ourselves and for this utility first offer the best white board to build upon regardless of the number of designers, opinions, or back and forth involved! 

On the other hand, globally thought through and locked art direction applications, delivered through a complete set of files (be it in Sketch, PSD, InVision) would benefit greatly from a design system as any design component can be carefully crafted inside their own CSS component with minimal impact on markup, thus ensuring fast, secure, consistent and easy future styling updates.

But it is also my belief that, if time allows and with Tailwind’s error proof `@apply` rule, any project, once creatively « mature » can be migrated from a hard to maintain utility first design system to a full fledged highly maintainable CSS/Tailwind Component system.

## Conclusion

So yeah, I guess I disagree with the argument that CSS Components and Tailwind don’t mix. 
I think they do and gracefully so.