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
`code.html` and `screen.png` are the original Stitch export, `feature-source.jpg` is the
photo the ASCII band is generated from, and `asciify.py` is the generator.

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

## The ASCII backdrop

The character art behind your name is real text in a `<pre>`, not an image. That way it
inherits `color` (so it works in both themes from one source), stays crisp at any zoom, and
sizes to exactly 100vw because monospace width is just `columns x 0.6em`.

It sits inside `.hero` as an absolutely-positioned layer behind the copy. Two mask layers
are composited together: a radial ellipse that clears a hole behind the text so it stays
readable, and a vertical gradient that fades the art in below the nav and out again before
the project cards.

To regenerate it from a different photo:

```
python3 design/asciify.py <image> <cols> <lo%> <hi%> <gamma>
python3 design/asciify.py design/feature-source.jpg 220 0 100 2.2   # current settings
```

Write stdout to a file (the script prints its stats to stderr, so they will not contaminate
the art) and paste the result between the `<pre>` tags in `index.html`. Notes:

- The source is **cropped to a panoramic slice first** — the full 1400x787 frame produces a
  block ~800px deep that runs over the cards. The current art comes from `y=250..760`.
- **Gamma controls density.** Higher is denser. 2.2 gives ~82% ink coverage, which is what
  makes the art clearly visible; below ~1.0 it reads as faint dust.
- The script normalises contrast before mapping. The source is very flat (68% near-white,
  darkest pixel 110), so without that step it renders as a barely-visible ghost.
- Keep the column count at 220 or update `font-size: calc(100vw / 132)` in `css/styles.css`
  to match — that divisor is `columns x 0.6`.
- Visibility is tuned with the `color` alpha on `.ascii pre`, not the gamma.

The backdrop is `aria-hidden` because it is decorative; a screen reader would otherwise read
out thousands of punctuation characters.

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
