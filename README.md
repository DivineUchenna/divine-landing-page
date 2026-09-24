# Divine Uchenna Amakiri — personal landing page

A single page to put in the link-in-bio on Instagram, LinkedIn and X. Someone taps the
link, sees who you are and what Flowlyy does, and books a call.

Static HTML, CSS and a little vanilla JavaScript. No build step, no framework.
Open `index.html` in a browser to preview it.

## Structure

```
index.html          the page
css/styles.css      all styles, light and dark, tokens on :root
js/script.js        theme toggle, about dialog, copy-email
assets/
  founder/          your photo (used in the about dialog and the preview card)
  logo/             Flowlyy favicon (also used as the dock icon)
  og-image.png      1200x630 link preview card
design/             the original Google Stitch export, kept for reference
```

`design/` holds build inputs and reference, none of which the live page loads:
`code.html` and `screen.png` are the original Stitch export; `feature-source.jpg` and
`asciify.py` are from the old ASCII backdrop, which has been removed.

## Before you share the link

Three things, in order of how much they matter:

1. **Set the real URL.** `index.html` has a `TODO` above the `<link rel="canonical">`.
   Replace `https://www.flowly.org.uk/divine` in `canonical`, `og:url` **and** `og:image`
   with the page's real address. Link previews on LinkedIn and X need `og:image` to be a
   full absolute URL — a relative path will not render once it is live.
2. **Check the email.** `js/script.js` copies `divine@flowly.org.uk` when someone clicks
   the envelope in the dock. Change `EMAIL` at the top of that file if you want a
   different address. It is deliberately not your personal Gmail.
3. **Confirm flowly.org.uk resolves.** The "Visit Flowlyy" link and the dock's Flowlyy
   icon both point at it. It was not resolving when this page was built.

Then paste the live URL into the
[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) and
[X Card Validator](https://cards-dev.twitter.com/validator) to confirm the preview card
renders.

## The profile photo

The circle above your name is a file picker. Click it, choose a photo, and it is cropped to a
centred square and saved in that browser (localStorage). The default is
`assets/founder/divine.jpg`. To change it for every visitor, replace that file.

## Editing the content

- **Headline and intro** — `.hero__title` and `.hero__lede` in `index.html`.
- **The three cards** — `.cards` in `index.html`. Card 01 is Flowlyy. Cards 02 and 03 are
  "Coming soon" placeholders styled with `.card--soon`; replace the contents with real
  case studies and swap the class to `card--live` when they are ready.
- **The about dialog** — the `#aboutModal` block, including the pricing rows.
- **Colours and type** — the `:root` block at the top of `css/styles.css`. Dark mode
  values are redefined twice, once under `@media (prefers-color-scheme: dark)` and once
  under `:root[data-theme="dark"]`; change both together.

## Regenerating the preview image

`assets/og-image.png` was generated from an SVG with `rsvg-convert`. To change it, edit
the card in an image tool at 1200x630 and overwrite the file, keeping those dimensions.
