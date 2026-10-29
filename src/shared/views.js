// Pure helpers shared by the dashboard (browser) and the config server (Vite plugin, Node).

// A Solution is the same page as its Future with nothing commented out. It stays out of the
// walked order: the header links to it quietly.
export const MODE_LABELS = {
  classic: 'Classic',
  future: 'Future',
  solution: 'Solution',
  bonus: 'Bonus',
  experiment: 'Experiment',
};

/**
 * Every view of every feature, in order, with a label and a slug
 * (`<feature id>/<mode>[-<step>]`, used for the config URL).
 * @param {object[]} features feature.js default exports, each with `dir` added
 */
export function listPages(features) {
  return [...features]
    .sort((a, b) => a.order - b.order)
    .flatMap((feature) => {
      const steps = {};
      return feature.views.map((view) => {
        const step = (steps[view.mode] = (steps[view.mode] ?? 0) + 1);
        const several = feature.views.filter((v) => v.mode === view.mode).length > 1;
        const prefix = MODE_LABELS[view.mode] + (several ? ` ${step}` : '');
        return {
          feature,
          view,
          prefix,
          label: view.label ? `${prefix}: ${view.label}` : prefix,
          slug: `${feature.id}/${view.mode}${several ? `-${step}` : ''}`,
        };
      });
    });
}

const EDITORS = { markup: 'html', style: 'css', script: 'javascript' };

// Shared preview files, added to each view's own hidden files.
const FRAME_CSS = '/shared/preview/frame.css';
const UNSUPPORTED_JS = '/shared/preview/unsupported.js';
const list = (names) => [names ?? []].flat();

/**
 * Builds the LiveCodes config for one view. A view lists file names relative to the feature
 * directory, or relative to src/ when they start with "/" (a string or an array that is
 * concatenated in order):
 *   hidden:  supporting code, evaluated but never shown in an editor
 *   visible: the code shown in the editors
 * Hidden content is prepended to the visible content, unless it contains LiveCodes'
 * {{__livecodes_editor_content__}} placeholder, which marks where the visible content goes.
 * {{images}} in any file becomes `imagesUrl`.
 * @param {{feature: object, view: object, label: string}} page
 * @param {(name: string) => string} readFile reads a file of the feature directory (or of src/)
 * @param {{ imagesUrl: string }} options
 */
export function buildConfig({ feature, view, label }, readFile, { imagesUrl }) {
  const read = (names) =>
    names?.length ? [names].flat().map((n) => readFile(n).replaceAll('{{images}}', imagesUrl)).join('\n') : undefined;

  const hidden = { ...view.hidden, style: [FRAME_CSS, ...list(view.hidden?.style)] };
  // Modern views say so in the preview when the browser lacks the feature.
  let supportCall = '';
  if (view.mode !== 'classic' && feature.support) {
    hidden.script = [...list(view.hidden?.script), UNSUPPORTED_JS];
    supportCall = `\nshowUnsupported(${JSON.stringify({ feature: feature.title, ...feature.support })});\n`;
  }
  const visible = view.visible ?? {};
  const editor = (id) => {
    let hiddenContent = read(hidden[id]);
    if (id === 'script' && supportCall) hiddenContent += supportCall;
    return {
      language: EDITORS[id],
      content: read(visible[id]) ?? '',
      ...(hiddenContent != null && { hiddenContent }),
      hideTitle: !visible[id],
    };
  };
  return {
    title: `${feature.title} – ${label}`,
    description: view.note ?? '',
    activeEditor: view.activeEditor,
    markup: editor('markup'),
    style: editor('style'),
    script: editor('script'),
  };
}

// User settings are not taken from a project config by the full LiveCodes app,
// so they go into the URL.
// CodeJar: a light editor without validation. Monaco's CSS validator flags newer properties
// (anchor-name, position-area, …) as unknown.
// recoverUnsaved: false – reloading a view after editing it would otherwise ask
// "Recover unsaved project?".
export const URL_PARAMS = { theme: 'dark', editor: 'codejar', recoverUnsaved: false };
