const cdn = {
  stylesheets: {
    dark: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/atom-one-dark.min.css',
    light:
      'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/atom-one-light.min.css'
  },
  hljs: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/highlight.min.js',
  javascript:
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/languages/javascript.min.js'
};

const appendScript = src => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;

    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const appendStylesheet = async href => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;

    link.onload = resolve;
    link.onerror = reject;

    document.head.appendChild(link);
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
    el.classList.add('hljs');
    el.classList.add('language-javascript');

    el.innerHTML = hljs.highlight(el.textContent, {
      language: 'javascript'
    }).value;
  });
};

const appendCopyButton = el => {
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
  await appendScript(cdn.hljs);
  await appendScript(cdn.javascript);

  const darkMode = window.matchMedia('(prefers-color-scheme: dark)');

  darkMode.addEventListener('change', async e => {
    await replaceStyles(e.matches);
  });

  replaceStyles(darkMode.matches);
  highlightBlocks();

  document.querySelectorAll('li h2').forEach(appendCopyButton);
};

(() => {
  const existingWinLoad = window.onload;
  window.onload = () => {
    existingWinLoad?.();

    setTimeout(init, 250);
  };
})();
