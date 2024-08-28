/** @typedef {import('prismjs')}  */

const getMarked = () => {};

const icons = {
  default:
    'https://raw.githubusercontent.com/OperationSpark/mocha-style/main/img/icons/mocha.ico',
  pass: 'https://raw.githubusercontent.com/OperationSpark/mocha-style/main/img/icons/pass.ico',
  fail: 'https://raw.githubusercontent.com/OperationSpark/mocha-style/main/img/icons/fail.ico'
};

const updateFavicon = failures => {
  const useDefault = typeof failures !== 'number';

  /**@type {HTMLLinkElement | null} */
  let favicon = document.querySelector('link[rel="icon"]');

  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }

  if (useDefault) {
    favicon.href = icons.default;
    return;
  }

  favicon.href = !failures ? icons.pass : icons.fail;
};

const getScriptAttribute = name => {
  const attribute = document.currentScript?.getAttribute(name);
  if (attribute === 'true' || attribute === '') return true;
  if (!attribute || attribute === 'false') return false;

  return attribute;
};

const scriptConfig = {
  runMocha: getScriptAttribute('runMocha')
};

if (scriptConfig.runMocha && typeof mocha !== 'undefined') {
  mocha.setup('bdd');
}

const cdn = {
  stylesheets: {
    dark: 'https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-vsc-dark-plus.min.css',

    light:
      'https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-vs.min.css'
  },
  javascript:
    'https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-javascript.min.js',
  markdown:
    'https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-markdown.min.js',

  prism: 'https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/prism.min.js'
};

const scriptExists = src => {
  const scripts = Array.from(document.querySelectorAll('script'));
  return scripts.some(el => el.src === src);
};

const appendScript = async src => {
  if (!src) return console.error('No script provided');
  if (scriptExists(src)) return;
  try {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;

      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  } catch (err) {
    console.error(`Error appending script: ${src}`);
  }
};

const appendStylesheet = async href => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;

    link.onload = resolve;
    link.onerror = reject;

    document.head.prepend(link);
  });
};

const removeStylesheet = href => {
  document.querySelectorAll('link').forEach(el => {
    if (el.href.includes(href)) {
      el.remove();
    }
  });
};

const replaceStyles = async darkMode => {
  const styles = [cdn.stylesheets.dark, cdn.stylesheets.light];

  darkMode && styles.reverse();

  const [oldStyle, newStyle] = styles;

  removeStylesheet(oldStyle);
  await appendStylesheet(newStyle);
};

const highlightBlocks = () => {
  const preBlocks = document.querySelectorAll('.test pre');

  preBlocks.forEach(preBlock => {
    const $code = preBlock.querySelector('code');

    const classList = [...preBlock.classList, ...($code?.classList ?? [])];
    // Already highlighted
    if (classList.includes('language-javascript')) return;

    if (!$code?.textContent) return;

    $code.className = 'language-javascript';

    try {
      const code = Prism.highlight(
        $code.textContent,
        Prism.languages.javascript,
        'javascript'
      );

      $code.innerHTML = code;
    } catch (err) {
      console.error(err);
    }
  });
};

const highlightDescriptions = () => {
  document.querySelectorAll('.test h2').forEach(el => {
    const text = el.childNodes[0]?.textContent;
    const alreadyHighlighted = el.querySelector('.test-description');

    if (!text || alreadyHighlighted) return;
    try {
      const html = Prism.highlight(text, Prism.languages.markdown, 'markdown');

      const d = document.createElement('span');

      d.className = 'test-description';
      d.innerHTML = html;

      d.querySelectorAll('.token.code.keyword').forEach(el => {
        if (el instanceof HTMLElement) {
          el.innerText = el.innerText.slice(1, -1);
          el.className = 'prism-code';
        }
      });
      d.querySelectorAll('.token.bold').forEach(el => {
        if (el instanceof HTMLElement) {
          el.innerText = el.innerText.slice(2, -2);
          el.className = 'prism-bold';
        }
      });
      d.querySelectorAll('.token.italic').forEach(el => {
        if (el instanceof HTMLElement) {
          el.innerText = el.innerText.slice(1, -1);
          el.className = 'prism-italic';
        }
      });

      d.childNodes.forEach(el => {
        if (el instanceof HTMLElement && !el.className?.startsWith('prism-')) {
          el.outerHTML = el.innerText;
        }
      });

      el.replaceChild(d, el.childNodes[0]);
    } catch (err) {
      console.error(`Error parsing text: "${text}"`);
    }
  });
};

const appendCopyButton = el => {
  const hasCopyBtn = el.querySelector('button.copy-button');
  const isPending = el.parentElement.classList.contains('pending');
  if (hasCopyBtn || isPending) return;

  el.setAttribute('collapsed', 'true');
  el.addEventListener('click', () => {
    const state = el.getAttribute('collapsed') === 'true' ? false : true;
    el.setAttribute('collapsed', `${state}`);
  });

  const copyButton = document.createElement('button');
  copyButton.textContent = '⎘';
  copyButton.classList.add('copy-button');
  el.appendChild(copyButton);

  copyButton.addEventListener('click', e => {
    const text = el.childNodes[0].textContent;
    if (!text) return;
    e.preventDefault();
    e.stopPropagation();
    el.classList.add('copying');
    navigator.clipboard.writeText(text).then(() => {
      const initialStyles = {
        fontSize: copyButton.style.fontSize,
        boxShadow: copyButton.style.boxShadow,
        color: copyButton.style.color,
        cursor: copyButton.style.cursor,
        padding: copyButton.style.padding
      };
      const copyStyles = {
        fontSize: '0.7rem',
        boxShadow: '0 0 1px 1px var(--mocha-pass-icon-color)',
        color: 'var(--mocha-pass-icon-color)',
        cursor: 'default',
        padding: '0 0.5rem'
      };
      copyButton.textContent = 'Copied!';

      Object.entries(copyStyles).forEach(([key, value]) => {
        copyButton.style[key] = value;
      });

      setTimeout(() => {
        copyButton.textContent = '⎘';
        Object.entries(initialStyles).forEach(([key, value]) => {
          copyButton.style[key] = value;
        });

        el.classList.remove('copying');
      }, 1000);
    });
  });
};

const init = async () => {
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)');

  darkMode.addEventListener('change', e => replaceStyles(e.matches));

  replaceStyles(darkMode.matches);
  highlightDescriptions();
  setTimeout(highlightBlocks, 0);

  document.querySelectorAll('li h2').forEach(appendCopyButton);
};

const load = cb => {
  return () => {
    updateFavicon();

    cb?.();

    var afterTest =
      window['after'] || window['afterAll'] || (fn => setTimeout(fn, 0));

    afterTest(init);

    if (
      scriptConfig.runMocha &&
      typeof mocha !== 'undefined' &&
      // @ts-expect-error - _state exists on mocha if defined
      mocha._state !== 'running'
    ) {
      try {
        mocha.setup('bdd');
        mocha.run(updateFavicon);
      } catch (err) {
        console.error(
          'Mocha instance already running. If you did not intend to have mocha run automatically [mocha.run()] and instead are running manually in the app, remove the `runMocha` attribute from the script tag.'
        );
      }
    }
  };
};

/**
 * @typedef {{
 *  init: () => void;
 *  load: (cb?: () => void) => () => void;
 *  updateFavicon: (failures?: number) => void;
 *  appendCopyButton: (el: HTMLElement) => void;
 *  highlightDescriptions: () => void;
 *  highlightBlocks: () => void;
 *  start: (failures?: number) => void;
 * }} InjectStyles
 */

/** @type {InjectStyles} */
var injectStyles = {
  init,
  load,
  updateFavicon,
  appendCopyButton,
  highlightDescriptions,
  highlightBlocks,
  start: failures => load(() => updateFavicon(failures))()
};

(async () => {
  await appendScript(cdn.prism);
  await appendScript(cdn.javascript);
  await appendScript(cdn.markdown);

  window.onload = load(window.onload);

  window['injectStyles'] = injectStyles;
})();
