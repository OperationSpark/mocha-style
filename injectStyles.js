/** @typedef {import('prismjs')}  */

const getMarked = () => {};

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

const appendScript = async src => {
  if (!src) return console.error('No script provided');
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
  const codeBlocks = document.querySelectorAll('pre code');

  codeBlocks.forEach(el => {
    // const alreadyHighlighted =
    //   el.classList.contains('language-javascript') ||
    //   el.parentElement?.classList.contains('language-javascript');

    // if (alreadyHighlighted) {
    //   console.log({ alreadyHighlighted, text: el.textContent });
    //   return;
    // }
    try {
      if (!el.textContent) return;
      el.parentElement?.classList.add('language-javascript');
      el.classList.add('language-javascript');

      el.innerHTML = Prism.highlight(
        el.textContent,
        Prism.languages.javascript,
        'javascript'
      );
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

  if (hasCopyBtn) return;

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
      copyButton.textContent = 'Copied!';
      copyButton.style.fontSize = 'inherit';

      setTimeout(() => {
        copyButton.textContent = '⎘';
        copyButton.style.fontSize = '1.35rem';
        el.classList.remove('copying');
      }, 1000);
    });
  });
};

const init = async () => {
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)');

  darkMode.addEventListener('change', async e => {
    await replaceStyles(e.matches);
  });

  await replaceStyles(darkMode.matches);
  highlightDescriptions();
  highlightBlocks();

  document.querySelectorAll('li h2').forEach(appendCopyButton);
};

(async () => {
  await appendScript(cdn.prism);
  await appendScript(cdn.javascript);
  await appendScript(cdn.markdown);

  const existingWinLoad = window.onload;

  window.onload =  () => {
    // @ts-expect-error
    existingWinLoad?.();

    var afterTest =
      window['after'] || window['afterAll'] || (fn => setTimeout(fn, 0));
    after(() => setTimeout(init, 250));
  };
})();
