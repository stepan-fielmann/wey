# Modern Browser Features – workshop lab

Local playground for the five workshop features. Each feature has two views to walk through –
**Classic** (the traditional implementation) and **Future** (the same page with the modern lines
commented out, written together) – plus a **Solution**: the Future with nothing commented out. The
solution stays out of the walked order; the header links to it quietly next to Future. A view is a
page of this app: a slim header (the feature's views on the left; its number, Can I use and arrows to the previous or
next feature on the right) with the LiveCodes playground below it; the view's name is
the playground's own project title. Demos, styles and the Classic code come from
`../Lunch and Learn Simple/` (their classic pages → Classic, future → Solution; for Grid Lanes the
fallback page is the Future view).

## 1. Install

Requires Node 22+, npm, git and an internet connection (see "LiveCodes" below).

```sh
npm run setup          # npm install + clone/install/build the local LiveCodes app
```

## 2. Local LiveCodes instance

`npm run setup:livecodes` (part of `setup`) follows the official
[self-hosting guide](https://livecodes.io/docs/features/self-hosting/) ("Build from Source"):

- shallow-clones `live-codes/livecodes` at tag **v49** into `.tooling/livecodes/` (git-ignored, separate from the app),
- `npm ci --ignore-scripts` + `patch-package` (the upstream postinstall would also install the docs site,
  storybook and docker server, which are not needed),
- `npm run build:app` with `DOCS_BASE_URL=null` (app only; doc links go to livecodes.io/docs).

The tag is pinned in `scripts/livecodes.config.mjs`; keep it compatible with the `livecodes` SDK
version in `package.json` (0.14.1 ↔ v49). Re-running the script is safe.

`npm run livecodes` serves it, like upstream `npm run serve` but without opening a browser:

- app: http://localhost:8080/
- result sandbox: http://127.0.0.1:8085/ (the app hard-codes this sandbox when served from localhost)

Note: the self-hosted app still loads editor/language modules (editors, TypeScript libs, …) from
jsDelivr / typescriptlang CDNs by upstream design, so an internet connection is needed. The app shell,
links (`appUrl`) and the preview sandbox are local; the hosted livecodes.io is never used. The dashboard
shows whether the local instance is reachable. To point at another instance, set `VITE_LIVECODES_URL`
(e.g. in `.env.local`).

## 3. Start

```sh
npm run dev            # LiveCodes (8080 + 8085) and Vite (5173) together
# or separately:
npm run livecodes
npm run dev:app
```

`npm run build` builds the dashboard and all view configs to `dist/` (`npm run preview` serves it on
:4173; the views still need `npm run livecodes`).

## 4. URLs

- Start screen: http://localhost:5173/ – a title and one Start button, so nobody sees the whole
  programme in advance. The presenter's list of every view, and the check that the local LiveCodes is
  running, are at http://localhost:5173/?list.
- A view: `http://localhost:5173/?view=<id>/<mode>` (ids: `anchor`, `popover`, `select`,
  `scroll-state`, `grid-lanes`; modes: `classic`, `future`, `solution`, `bonus`), e.g. `?view=anchor/classic`. Where a
  feature has several views of one mode they are numbered in the order they are listed, e.g.
  `?view=select/classic-1`.
- Inside it, an iframe loads the local LiveCodes app with the view's config URL, built with the SDK's
  `getPlaygroundUrl`: `http://localhost:8080/?config=http://localhost:5173/configs/<id>/<mode>.json`
  plus `theme=dark`, `editor=codejar` and `recoverUnsaved=false` (user settings are not taken from a
  project config; without the last one LiveCodes asks "Recover unsaved project?" on reload).
- The view's title is the LiveCodes project title; its description is in Project → Project Info
  and in the link tooltip on the dashboard.

| Feature | Classic | Future / Solution edits |
| --- | --- | --- |
| Anchor Positioning | JS positioning | CSS |
| Popover API | JS popup | HTML (+ a Bonus page: three `popover="manual"` popovers and the top layer) |
| Customizable Select | styled native select, custom dropdown | CSS + HTML |
| Scroll-state queries | sentinel + IntersectionObserver | CSS |
| Grid Lanes | JS masonry | CSS |

The start screen and the view header use one fixed dark palette (the system theme is ignored),
matching the dark LiveCodes playground.

## 5. Files

```
src/features/<dir>/
  feature.js          id, title, support check and the list of views (which files are hidden/visible)
  look.css            hidden: the demo's looks, the same in every view
  markup.html         hidden markup, where the views share it (anchor, scroll-state, grid lanes)
  drag.js / sentinel.js / more.js   hidden demo helpers
  classic/            Classic code shown in the editors (script.js, style.css, markup.html)
  future.* / solution.*             modern code shown in the editors (.css and/or .html)
  experiments/        presenter experiments (popover, grid-lanes); kept on disk but not listed as
                      views – add a { mode: 'experiment', … } entry in feature.js to bring one back
src/shared/preview/   hidden in every view: frame.css (fonts, .stage) and unsupported.js (the
                      "isn't supported in this browser" note in modern views)
src/shared/           dashboard, the view page (view-page.js: header + iframe), view list + config
                      builder (views.js), links (routes.js), page.css
public/images/        scene and avatar images; files use {{images}}/… and get an absolute URL
scripts/              LiveCodes setup/serve, the combined dev script, the config-serving Vite plugin
```

Each feature has one Classic view – the most complete traditional solution that behaves like the modern
one (no invented complexity), on the same scene, so the contrast is in the code only. Customizable
Select has two: styling the closed control and living with the native list, then the fake dropdown. Popover's Classic
adds two things to the Lunch and Learn version to match `popover="auto"`: the button toggles, and the
popup it was opened from is remembered, so focus can go back to it. Its page is bare on purpose – one
button and one popup – so nothing competes with the popover.

Images are served by this app (`http://localhost:5173/images` in dev). For `npm run build`, set
`IMAGES_URL` to where `public/images` will be reachable (default `http://localhost:4173/images`).

## 6. Changing supporting code

Edit any file directly, then reload the LiveCodes tab: in dev, the config JSON is built from the files
on disk at every request (`scripts/vite-livecodes-configs.mjs`). Reloading also discards edits made in
the LiveCodes editors and restores the original code.

## 7. How views work

`buildConfig` in `src/shared/views.js` turns a view of `feature.js` into a LiveCodes config:

```js
{
  mode: 'classic', label: 'JavaScript positioning', note: '…', activeEditor: 'script',
  hidden:  { markup: 'markup.html', style: 'base.css', script: 'interactions.js' },  // evaluated, never shown
  visible: { style: 'classic/tooltip.css', script: 'classic/tooltip.js' },                  // editor content
}
```

Values are a file name or an array of names (concatenated). Hidden files go to
`markup/style/script.hiddenContent`, visible files become the editor `content`; editors without
visible content are hidden (`hideTitle`). All views of a feature use the identical hidden
files. Hidden content is prepended to visible content, unless it contains LiveCodes' placeholder
`{{__livecodes_editor_content__}}`, which marks where the visible content goes (used for the HTML
wrappers). The
placeholder works in LiveCodes v49 but is not in the public docs – re-check after upgrading.

Edits are not saved. Note: LiveCodes applies CSS-only edits without re-running scripts.

## 8. Browser support

Target browser: latest stable Chrome (tested with Chrome 155).

| Feature | Needs | Chrome 155 |
| --- | --- | --- |
| Anchor Positioning | `anchor-name`, `position-area`, `position-try-fallbacks` | yes |
| Popover API (+ implicit anchor) | `popover`, `popovertarget` | yes |
| Customizable Select | `appearance: base-select`, `<selectedcontent>` | yes |
| Scroll-state queries | `container-type: scroll-state` | yes |
| Grid Lanes | `display: grid-lanes` | **no** (flag only) → the Solution falls back to a grid, the exercise page stacks |

## 9. Known limitations

- Anchor: once a fallback was used, Chrome remembers it ("last successful position"), so after flipping
  below the tooltip stays below until that no longer fits (the Classic code keeps its last side the same
  way). Near the left/right edges it stays above and shifts inward (`position-area: top` spans all
  columns), so the `left`/`right` fallbacks only apply when neither top nor bottom fits.
- Customizable select: in base-select mode the arrow keys open the picker.
- The Classic fake select is not production-grade (not screen-reader tested, no RTL).
- Console noise from upstream LiveCodes: 404s for TypeScript lib files from playgroundcdn.typescriptlang.org.
  They do not affect the views.
