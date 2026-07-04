(function () {
const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
  <style>
    :host { display: block; }

    .hero {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    img.avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      border: 2px solid var(--border-color, #30363d);
      object-fit: cover;
      background: var(--bg-secondary, #161b22);
    }

    h1 {
      margin: 0;
      font-size: 1.75rem;
    }

    p.bio {
      margin: 0;
      color: var(--text-secondary, #8b949e);
      max-width: 60ch;
      line-height: 1.5;
    }

    .specialties {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .specialties:empty {
      display: none;
    }

    .specialties li {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--accent-color, #58a6ff);
      background: var(--bg-secondary, #161b22);
      border: 1px solid var(--border-color, #30363d);
      border-radius: 999px;
      padding: 0.3rem 0.75rem;
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    a.button {
      display: inline-block;
      padding: 0.6rem 1.1rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      border: 1px solid var(--border-color, #30363d);
    }

    a.button.primary {
      background: var(--accent-color, #58a6ff);
      color: #0d1117;
      border-color: var(--accent-color, #58a6ff);
    }
  </style>
  <div class="hero">
    <img class="avatar" alt="" />
    <h1></h1>
    <p class="bio"></p>
    <ul class="specialties"></ul>
    <div class="actions">
      <a class="button primary" target="_blank" rel="noopener noreferrer">Ver perfil no GitHub</a>
      <slot name="extra-actions"></slot>
    </div>
  </div>
`;

class HeroProfile extends HTMLElement {
  static get observedAttributes() {
    return ['username', 'display-name', 'bio', 'photo-url', 'specialties'];
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
    const username = this.getAttribute('username') || '';
    const displayName = this.getAttribute('display-name') || username;
    const bio = this.getAttribute('bio') || '';
    const photoUrl = this.getAttribute('photo-url') || '';
    const specialties = this._parseSpecialties(this.getAttribute('specialties'));
    const root = this.shadowRoot;

    const avatar = root.querySelector('.avatar');
    avatar.src = photoUrl || (username ? `https://github.com/${username}.png` : '');
    avatar.alt = displayName ? `Foto de ${displayName}` : '';
    avatar.onerror = () => {
      if (photoUrl && username && avatar.src !== `https://github.com/${username}.png`) {
        avatar.onerror = null;
        avatar.src = `https://github.com/${username}.png`;
      }
    };

    root.querySelector('h1').textContent = displayName;
    root.querySelector('.bio').textContent = bio;

    const specialtiesList = root.querySelector('.specialties');
    specialtiesList.innerHTML = '';
    for (const specialty of specialties) {
      const li = document.createElement('li');
      li.textContent = specialty;
      specialtiesList.appendChild(li);
    }

    const profileLink = root.querySelector('a.button.primary');
    profileLink.href = username ? `https://github.com/${username}` : '#';
  }

  _parseSpecialties(raw) {
    if (!raw) return [];
    return raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

customElements.define('hero-profile', HeroProfile);
})();
