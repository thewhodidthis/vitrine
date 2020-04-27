<!doctype html>
<html prefix="og: http://ogp.me/ns#" lang="en" id="root" class="is-waiting">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <meta name="description" content="{{description}}">
    <meta name="theme-color" content="#000000">
    <meta name="msapplication-TileColor" content="#000000">
    <meta name="msapplication-TileImage" content="tile.png">
    <meta property="og:url" content="{{homepage}}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="{{config.title}}">
    <meta property="og:description" content="{{description}}">
    <meta property="og:image" content="{{homepage}}/poster-1x.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="1200">
    <title>{{config.title}}</title>
    <link rel="canonical" href="{{homepage}}">
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="apple-touch-icon.png">
    <link rel="icon" href="favicon.png">
    <link rel="preload" href="loader.css" as="style">
    <link rel="stylesheet" href="loader.css">
    <script src="index.js" defer></script>
    <style><?php readfile('public/index.css'); ?></style>
  </head>
  <body>
    <figure>
      <figure id="figure">
        <a id="zoom" href="#image" title="Toggle fullscreen" hidden></a>
        <img
          id="image"
          src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
          height="300"
          width="500"
          alt=""
          hidden>
      </figure>
      <figcaption>
        <h1>{{config.title}} ~ <span id="poll" title="Peeps">0</span></h1>
        <p>Freely drag 'n drop images onto this live image roll. <a href="#more" title="Read more" hidden>More &rsaquo;</a></p>
      </figcaption>
    </figure>
    <aside id="more">
      <div>
        <a href="#root" title="Close" hidden>&times;</a>
        <blockquote>
          <picture>
            <source srcset="thumb-001.webp" type="image/webp">
            <source srcset="thumb-001.jpg" type="image/jpg">
            <img src="thumb-001.jpg" alt="" width="250" height="150">
          </picture>
          <picture>
            <source srcset="thumb-002.webp" type="image/webp">
            <source srcset="thumb-002.jpg" type="image/jpg">
            <img src="thumb-002.jpg" alt="" width="250" height="150">
          </picture>
          <p>As a means to get back at some loanshark neighbours, I ran this little projection serving trash out my Athens storefront early 2013. <a href="https://youtu.be/ef5UHa9kRtM" title="Watch on youtu.be">Wrap up video &rsaquo;</a>
          </p>
        </blockquote>
        <ul>
          {{#repository}}
            <li><a href="{{url}}" title="Browse source code">Git log</a></li>
          {{/repository}}
          {{#author}}
            <li><a href="{{url}}" title="Visit author homepage">More &rarr;</a></li>
          {{/author}}
        </ul>
        <footer>
          <p>
            <span>&copy; {{config.date}}</span>
            {{#author}}
              <br><a href="mailto:{{email}}" title="Contact author" target="_blank" rel="noopener noreferrer">{{name}}</a>
            {{/author}}
          </p>
        </footer>
      </div>
    </aside>
    <noscript>please enable javascript</noscript>
  </body>
</html>
