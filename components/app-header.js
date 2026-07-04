(function () {
const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: block;
      border-bottom: 1px solid var(--border-color, #30363d);
      background: var(--bg-secondary, #161b22);
    }

    .header {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--text-color, #c9d1d9);
    }

    .tagline {
      font-size: 0.85rem;
      color: var(--text-secondary, #8b949e);
    }
  </style>
  <div class="header">
    <span class="brand"></span>
    <span class="tagline"></span>
  </div>
`;

class AppHeader extends HTMLElement {
  static get observedAttributes() {
    return ['brand', 'tagline'];
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
    this.shadowRoot.querySelector('.brand').textContent = this.getAttribute('brand') || '';
    this.shadowRoot.querySelector('.tagline').textContent = this.getAttribute('tagline') || '';
  }
}

customElements.define('app-header', AppHeader);
})();
