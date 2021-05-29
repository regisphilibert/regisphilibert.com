---
title: "The New Web"
date: 2018-12-19T13:44:20-05:00
draft: true
toc: true
---

# Where is the web going?

What’s a Static Site Generator? What’s the JAMStack. What’s a CDN?

It’s hard to fully grasp the importance of technologies when our understanding is limited to being a user, a content editor, a webmaster and a developer. 
Yes I can see it’s fast or slow, but is it secure, easy to build and maintain? And why would I or my organization benefit from any fancy new word thrown at me during a sales pitch?

This post will try and vulgarize some modern web concepts commonly and rightfully praised as the 20’s are slowly dawning up on us.

## Yesterweb
Before talking about the future of the web, let’s go back to how it began. Let’s say late 90’s when you started your first blog.

Back then, any website consisted of a lot of files, each one pertaining to one particular page. Those files were a bunch of weird glyphs intended for the browser to read and interpret. This was the introduction of the modern Markup language: HTML, a variant of its older cousin XML.

{{% aside title="Markup 101" %}}

Markup: a standardized set of notations used to annotate a plain-text document's content to give information regarding the structure of the text or instructions for how it is to be displayed (wikipedia)

Handwritten markup from the old days:
Cute Cat Outfit 1997! 👈 that’s a big **h**eading!
The Best Cat Outfits of the year! 👈 that’s a **p**aragraph 
Spring Cat outfit!  👈 that’s a smaller **h**eading

HTML language markups a document so the browser outputs it with the desired structure while CSS gives art direction. Together they feed the browser everything it needs to paint a read-only webpage.

```html
<style>
/* CSS */
.important{
  color: red;
}
</style>

<h1>Cute Cat Outfit 1997!</h1> 
<p class="important">The Best Cat Outfits of the year!</p>
<h2>Spring Cat outfit!</h2> 👈 that’s a smaller <h>eading
```

{{% /aside %}}

Now even though the structure, the markup will be consistent for every HTML files, the content will change. By content we mean the title, the description, the images, all of which is unique to a page. That’s why you needed one markup file for every page. 

{{< img name="images/html-1997.png" caption="That Markup file from 1997!" >}}

The step to creating a new post would involve creating a new HTML file, copying the same markup structure of the other, insert the unique sentences and other values in it.
And if you had to change the tagline in the header of your site, you would have to update it on every single HTML file!

Also, and this is important, each file needed to be stored in a directory reflecting the desired URL.
If your new post were to made available at `http://cutecatawards.com/best--christmas-cat-outfits-of-1997/`, you needed it to be stored on disk at `mydocuments/site/cutecatawards/best-christmas-cat-outfits-of-1997/index.html` 

This was rather tedious to maintain, but on the bright side, when a visitor's browser would go to the page, it would simply download the corresponding `index.html` file, interpret its markup and bring the result on screen, that's it!

The server would simply have to transfer a file from its disk to your visitors' while you would do the tedious work of managing those many markup files and keeping their directory structure aligned with your URL schemes. 

### Dynamic revolution

As the web grew, the time consuming and error prone of a web developer, had be simplified. The solution was found in a new breed of servers, which would on top of delivering files, would build the markup themselves.

Those server no longer needed one HTML file for every page. All they needed was a few PHP files which would build the needed markup file every time a visitor needed using a unique set of values grabbed from a data storage. How so ?

Well, few years later when a visitor would go to `http://cutecatawards.com/posts/best-christmas-cat-outfit-of-2003/` the server would interpret this URL as a pattern of some sort:

It means, go fetch a __post__ identified as `best-christmas-cat-outfit-of-2003` in the data storage, like then, an SQL database.

Now grab the `header.php` file, the `footer.php` file, stitch them together and fill in the blanks with the unique info you found in the database for that particular post! 

Following those simple instructions, your server would prepare, on the fly, one tailor made HTML file for this one visitor's browser to download, interpret and push on screen! 
Voilà!  Your visitor could read your Best Christmas Cat Outfit post like its 2003!

{{< img name="images/php-2003.png" caption="That Markup file from 2003!" >}}

This process made a programmers's life so much easier by shifting the burden of markup and HTML files to the server! 

Now the server would take care of the heavy duty of markup building and maintaining by producing a unique tailor made HTML file for the visitor to download on each page load! 
All of a sudden, the markup went Dynamic, and developers would only maintain a few conveniently organized PHP files. 

Dynamic markup brought along the possibility of displaying realtime information like the today’s date, and with it, real time interaction. 

Like comments!

You could now have your visitors fill up a comment form below the content of your post! The server would grab the values entered and store those in the database as a new comment.
And because every HTML files was assembled live, after saving the data, the sever could rebuild a file including the new comment, and have the visitor’s browser reload the page to use the new markup.
Tada! Your visitor would see its comment within a second of submitting it! Along with everyone visiting the page after that.

That was the future!

### Leading to this date

This days, your website grew in both popularity and content.
So much that on Christmas day, a famous YouTuber just brought up this years’s Christmas Cat Outfit post on his show! The sum of your annual visitors plus this influx of new cat lovers are already rushing on `cutecatawards.com/posts/best-christmas-cat-outfit-of-2018/`.   
Gladly browsing the gallery, they discover at each click, a new image with its own set of profitable advertising. 
And so on this fine Christmas morning 2018, humming the marshmallow sent of your hot cocoa, you’re reflecting on the your life as a happy blogger!

Your server on the other hand has a lot of work to do. It must now continuously build thousands of tailor made markup files of the same page, one for each visitor. This means, a million calls to the database which is probably working from the same computer and using the same CPU.

Each click on the « Next Image » leads to the building of yet another dedicated HTML file and new database queries! 
Querie**s** because to build this single Cat picture page, your server needs so much information: 
The suggested related posts, the image caption and metadata, the user comments on the cat outfit (many  of those already complaining about the slow load time today).

Now, your server is making a 100 000 database queries per second, it is building 10 000 files per second and this is a lot of memory, disk and CPU usage! 
This is certainly why your site is suffering heavy slow downs this morning and finally that dreaded 500, when the server's workload becomes so unbearable that it quits!  🤯
It quits! On Christmas day! 🎄 🔥 🚒 😫

### What if?

Later this evening, resting your feet on the ottoman, mulling over this horrendous Christmas day you spent on the phone with your hosting provider and worried sponsors, you wonder what if…. 
What if you could go back to those static days, when your website was just a bunch of HTML files ready to be downloaded away.

What if your server only had to transfer markup files, rather than building them by itself, on the fly, and for every visit?

Today, you think, having your modern day server suddenly transfer some files a million times rather than the usual thousand, would have just made it an interesting day. There would have be no stress, no hustle, no slow downs, no 500! Just some millions of giddy visitors laughing at a series funny cats.

Oh boy, don't you wish you could go back to your static days ?

And why not?

## Static Markup ≠ Static Website

As a lot of stuff grew more complex in the World Wide Web others got way easier. And as it turns out, maintaining static websites is part of the former.

Maintaining quasi-identical HTML files and keeping them organized so their path aligned with our desired URLs was the biggest challenge of our old static way of handling markup files.  But all that changed with Satic Site Generators.

Those, instead of working on every visit will do their job of markup building once, and for every single page!

If next year you add a new Christmas Outfit post, a Static Site Generator will grab your site’s content, be it from a database or a bunch of special files and generate,  in a few seconds (footnotes: hugo’s speed) all the markup files your website needs.

They will stitch the headers and the footers a thousand times over and fill in the blanks with the prefetch information.
They will organize the generated files according to your URL predefined scheme.
They will resize those images for your to save your visitor’s bandwidth.
They will rebuilt your Holiday Archive pages to include this new post you just added and readjust its pagination : Now the new post is at the top pushing the last one to `category/cat-outfit/page/13`, a page which did not exist yesterday. 
They will also rebuild the home page markup file to include the latest post in the recent post widget. 
Oh and they will also rebuild every posts by the way, cuz they also sport the recent post widget in the sidebar.

But again, and this is important to stress this: they’ll do all of this complex process once, save the files on your server’s disk and all of this won’t take more than a few seconds.

Then, until you need to add or edit a post again, your markup files will be there unchanged, static, ready for the taking (downloading) by the millions of visitors thrilled by the holiday spirit.

Your Static Site Generator will get busy only a few times a day and relieve the server of one of the most important and consuming task of the serving of a website: Markup Generation.

Awesome! But even though this looks way more convenient than before, by going back to static, won’t we be removing all of the interactive aspect of the website, like comments, contact forms etc… ?

Your __Markup__,  those myriads of HTML files,  will be static, yes. But on its own, markup rarely constitutes a website, it’s just a part of it.

The confusion has been infused by years of using the Static Site Generator label to qualify tools whose responsibility was limited to the markup and was never supposed to extend to a full fledge website!

So first we’ll call them what they really are Static Markup Generators, and move on to the next part of a modern website, the one turning it fully interactive!

## JavaScript == Interaction

Let’s say we are now in a not so distant future where you have switched to a Static Markup Generator for handling everything markup.

Your thousands of posts are conveniently turned into thousands of markup files several times a day by your state of the art Static Markup Generator. 
Every time a visitor hits one of your page, their browser simply downloads that HTML file and put it on screen.

Brilliant! 🙌

Now what about the comments made on your Christmas Cat Outfit gallery? Those are being added every minutes! 
Remember our server does not handle markup anymore, it cannot modify the files every time a new comment is posted.

We’ll have to rely on some other party than the server or the Static Markup Generator to make those comments dynamic.

The server is out, but the visitor, the client, on the other hand uses a browser which is pretty capable on its own. 

Downloading a sole HTML file from a modern website does not in itself allow the browser to paint a whole web page. It interprets this HTML file, then some CSS files and and interprets those for art directions. Only then, can it fully paint the page the way it was designed to be.

Another language the browser is really good at interpreting is JavaScript. 

When HTML is really about content and CSS is really about style, Javascript is about pretty much everything. 
One of the main use of JavaScript is to edit markup on the fly, right in the browser! 
Editing the markup can involve something as small as changing a class attribute to make the header slicker when scrolling down, or generate a whole new markup element and inject it in the page, like a tooltip when clicking a question mark.

### Please explain slowly, with the cats!

Let’s go back to the joyous context of our Cat Outfit gallery and how we can add dynamic comments to its static markup with JavaScript.
 
When a new cat enthusiast will visit the gallery, their browser, upon reading the static HTML file, will be notified that it must download, alongside the images and other content files, a JavaScript file. It will then read the code it contains (the script), and run it.

This script will fetch the current comments from a remote source, create an HTML element with their content, and inject it dynamically to the page’s static markup.

It will also take care of saving any new comment from this visitor to the remote source, and while at it, display the comments to everyone else without them reloading the page.
Through this script, a __dynamic__ comment module, in charge of reading but also writing new comments, will be added to the __static__ markup of your site and your server won’t even sweat, thanks to your visitor’s own CPU.

Again the dynamic has been shifted __from__ the server. Here to the client’s browser and so we’re talking of client-side dynamic!

Yeah!

The server has been released of yet another task, the interactivity or dynamic! This brings the number of relieves to :
- Static Markup
- Dynamic Javascript (the only kind)

There is one last thing left to the server though. I hurriedly mentioned a remote source linked to database without giving it much context.

Those comments have to be stored somewhere for your JavaScript module to fetch and use them. Stored somewhere yes, but not necessarily where your website lives.

## API = Data storage

Remember WordPress ? This guy gets the content (including comments) from the database every time a user hit a page. (note on caching).

A database is the core of a content system. It is a lot of rows and cells each bearing a different name and a different type. There’s a lot of database solution out there, SQL being the most famous. 
But if your website grabs its info directly from the database, there’s a fair chance the slightest modification in it, the name of that row, or the type of cell will most surely break your site. 
Try running your WordPress blog after renaming the `post_title` column from the database into `title` and… yeah.

With the years came the need of a front or interface for this content pulled from the database. 
This way it could remain constant no matter what happens behind it. 
In other words we needed something that would systematically outputs `title: "Best Christmas Cat Outfit of 2018"`, no matter what happens to the column name storing the title.

This wished-for interface would only be read by machines, so it did not need to be human readable. It would be a sort of ugly website displaying raw content for other websites or apps, an application programming interface if you will or API.

It’s another website, very dynamic this one and whose sole concern is data storage.

It grabs data from our database like good old WordPress and make sure the ugly block of text spewed to its fellow machine constantly bear the same structure no matter how things evolves behind. 
And again, because it can focus solely on retrieving and managing data, it is super fast and reliable, unlike WordPress which does anything and everything.

We know how the script of our Best Christmas Cat Outfit builds the comments and add them to the markup, but we left behind a critical part: where does it fetch them from?

Well, before doing anything else the script will call our API, specifically the page outputting the comments of our cat outfits gallery.
Like any other website, the URL fetched will indicate which page we need. The page listing all the comments of the Happy New Year 2019 page will likely live at `https://cutecatawards-api.com/comments/best-christmas-cat-outfit-of-2019/` which would look something like this: 

(API output example of comments)

Upon reading this, the script can grab all the fields and their values and build the dynamic markup to be injected into the static one. It can also call that endpoint every few seconds or so to make sure, new comments are integrated right into the page.

APIs are not read only. Our script will also be able to pass user entered values to the call in order for the comment to be saved in storage.


## The JAMStack

JavaScript
API
Markup

I love the JAM word but the order of the letters, contrary to three preceding chapters does not reflect the criticality of each stack. You can build a website with only markup. But no interaction.

|Read only|Interactive|Read and Write|
|----|----|----|
|Markup|Markup|Markup |
| | JavaScript|JavaScript|
| | |API
## Static Site (Markup!) Generators out there

There are quiet a few and way more informed website than mine provide that list.

I’m a fan of Hugo for speed! Those few seconds I promise, only Hugo can build a 1000 posts website’s markup files in less than 3 seconds!