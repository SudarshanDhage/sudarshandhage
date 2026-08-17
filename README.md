<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/SudarshanDhage/sudarshandhage/main/assets/banner-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/SudarshanDhage/sudarshandhage/main/assets/banner-light.svg">
  <img alt="Sudarshan Dhage — software engineer" src="https://raw.githubusercontent.com/SudarshanDhage/sudarshandhage/main/assets/banner-dark.svg" width="100%">
</picture>

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-sudarshan--dhage-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/sudarshan-dhage)
[![Email](https://img.shields.io/badge/Email-sudarshan096k@gmail.com-10B981?style=flat-square&logo=gmail&logoColor=white)](mailto:sudarshan096k@gmail.com)
[![X](https://img.shields.io/badge/X-@DhageSudarshan__-000000?style=flat-square&logo=x&logoColor=white)](https://x.com/DhageSudarshan_)

</div>

## What I do

I build products end to end — the Flutter interface someone taps, the Node.js service behind it, and the data model holding it together. Lately a lot of that work involves putting language models to real use: not demos, but features with validation, fallbacks, and a sensible failure story.

Three things I hold to, regardless of the stack:

**Model the domain first.** Clear types and honest contracts prevent more bugs than any amount of defensive code.
**Assume production will ask questions.** Structured logs, metrics, and traces belong in the first version, not the postmortem.
**Move fast, then earn it.** AI-assisted development is only an advantage when the review discipline keeps up with the output.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/SudarshanDhage/sudarshandhage/main/assets/marquee-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/SudarshanDhage/sudarshandhage/main/assets/marquee-light.svg">
  <img alt="Technologies I work with" src="https://raw.githubusercontent.com/SudarshanDhage/sudarshandhage/main/assets/marquee-dark.svg" width="100%">
</picture>

## Where my attention is

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/SudarshanDhage/sudarshandhage/main/assets/bento-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/SudarshanDhage/sudarshandhage/main/assets/bento-light.svg">
  <img alt="Current focus areas" src="https://raw.githubusercontent.com/SudarshanDhage/sudarshandhage/main/assets/bento-dark.svg" width="100%">
</picture>

## About these graphics

Everything above is an animated SVG this repository generates itself — no image editor, no third-party widget service, no runtime dependencies.

```
data/profile.json        One source of truth for every word on this page
scripts/build.mjs        Renders each asset in a dark and a light variant
scripts/lib/banner.mjs   Header: hairline texture, sweeping sheen, staggered meta column
scripts/lib/marquee.mjs  Two counter-scrolling tech rows, edges masked with a gradient
scripts/lib/bento.mjs    Auto-sized tile grid with a cascading reveal
scripts/lib/text.mjs     Glyph-class width estimation for wrapping and alignment
```

Nothing is positioned by hand. Text widths are estimated per character class, so chips size themselves, copy wraps to the column, tiles settle on a shared height, and the scrolling rows compute their own loop distance and duration. Change a line in `data/profile.json`, rebuild, and the layout re-solves.

```bash
npm run build   # regenerates assets/ for both themes
```

A GitHub Actions workflow runs the same build whenever the data or renderers change, so what's committed always matches its source.

<div align="center">

---

**Open to interesting problems** — mobile and backend engineering, or making AI genuinely useful inside a product.

[LinkedIn](https://linkedin.com/in/sudarshan-dhage) · [Email](mailto:sudarshan096k@gmail.com) · [X](https://x.com/DhageSudarshan_)

</div>
