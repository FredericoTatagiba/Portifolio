(function () {
const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: block;
      border-top: 1px solid var(--border-color, #30363d);
      margin-top: 2rem;
    }

    .footer {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.25rem 1.5rem;
      color: var(--text-secondary, #8b949e);
      font-size: 0.8rem;
      text-align: center;
    }

    a { color: inherit; }
  </style>
  <div class="footer">
    <slot></slot>
  </div>
`;

class AppFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
  }
}

customElements.define('app-footer', AppFooter);
})();
