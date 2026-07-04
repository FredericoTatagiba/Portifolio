// components/project-card.js
// Web Component responsável por exibir UM projeto. Não sabe de onde os dados
// vêm — recebe tudo via atributos (single responsibility).
//
// Envolvido em IIFE porque os scripts são clássicos (sem módulos) e
// compartilham o escopo global — sem isso, `TEMPLATE` colidiria com o
// mesmo identificador declarado nos outros componentes.
(function () {
const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: block;
      flex: 0 0 220px;
      width: 220px;
      scroll-snap-align: start;
    }

    a.card {
      display: block;
      height: 100%;
      padding: 0.85rem 1rem;
      border: 1px solid var(--border-color, #30363d);
      border-radius: 8px;
      text-decoration: none;
      color: inherit;
      background: var(--bg-secondary, #161b22);
      transition: border-color 0.15s ease, transform 0.15s ease;
    }

    a.card:hover,
    a.card:focus-visible {
      border-color: var(--accent-color, #58a6ff);
      transform: translateY(-2px);
    }

    .name {
      display: block;
      font-weight: 600;
      color: var(--accent-color, #58a6ff);
      margin-bottom: 0.25rem;
      overflow-wrap: anywhere;
    }

    .description {
      display: block;
      font-size: 0.85rem;
      color: var(--text-secondary, #8b949e);
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }

    .meta {
      display: flex;
      gap: 0.75rem;
      font-size: 0.75rem;
      color: var(--text-secondary, #8b949e);
      align-items: center;
    }

    .language-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--language-color, #8b949e);
      display: inline-block;
      margin-right: 0.3rem;
    }
  </style>
  <a class="card" target="_blank" rel="noopener noreferrer">
    <span class="name"></span>
    <span class="description"></span>
    <span class="meta">
      <span class="language"></span>
      <span class="stars"></span>
    </span>
  </a>
`;

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  PHP: '#4F5D95',
  'C#': '#178600',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
};
const DEFAULT_LANGUAGE_COLOR = '#8b949e';

class ProjectCard extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'description', 'url', 'language', 'stars'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback() {
    this._render();
  }

  _render() {
    const root = this.shadowRoot;
    const name = this.getAttribute('name') || '';
    const description = this.getAttribute('description') || '';
    const url = this.getAttribute('url') || '#';
    const language = this.getAttribute('language');
    const stars = this.getAttribute('stars') || '0';

    root.querySelector('.name').textContent = name;
    root.querySelector('.description').textContent = description;

    const link = root.querySelector('a.card');
    link.href = url;
    link.setAttribute('aria-label', `Abrir repositório ${name} no GitHub`);

    const languageEl = root.querySelector('.language');
    if (language) {
      const color = LANGUAGE_COLORS[language] || DEFAULT_LANGUAGE_COLOR;
      link.style.setProperty('--language-color', color);
      languageEl.innerHTML = `<span class="language-dot"></span>${language}`;
    } else {
      languageEl.textContent = '';
    }

    root.querySelector('.stars').textContent = `★ ${stars}`;
  }
}

customElements.define('project-card', ProjectCard);
})();
