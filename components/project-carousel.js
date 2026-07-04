(function () {
const { fetchRepositories, GitHubApiError } = window.Portfolio.GitHubAPI;

const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
  <style>
    :host { display: block; }

    .carousel-container {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .carousel {
      display: flex;
      flex-direction: row;
      gap: 0.75rem;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      padding: 0.1rem 0.1rem 0.6rem;
      flex: 1 1 auto;
      min-width: 0;
      scrollbar-width: thin;
      scrollbar-color: var(--border-color, #30363d) transparent;
    }

    .carousel::-webkit-scrollbar {
      height: 6px;
    }

    .carousel::-webkit-scrollbar-thumb {
      background: var(--border-color, #30363d);
      border-radius: 3px;
    }

    .nav-button {
      flex: 0 0 auto;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid var(--border-color, #30363d);
      background: var(--bg-secondary, #161b22);
      color: var(--text-color, #c9d1d9);
      font-size: 1rem;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-button:hover {
      border-color: var(--accent-color, #58a6ff);
      color: var(--accent-color, #58a6ff);
    }

    .carousel-container:has(.state-message) .nav-button {
      display: none;
    }

    .state-message {
      color: var(--text-secondary, #8b949e);
      font-size: 0.9rem;
      padding: 1rem 0;
    }

    .state-message.error {
      color: #f85149;
    }
  </style>
  <div class="carousel-container">
    <button class="nav-button prev" type="button" aria-label="Projeto anterior">‹</button>
    <div class="carousel" role="list" aria-label="Projetos no GitHub"></div>
    <button class="nav-button next" type="button" aria-label="Próximo projeto">›</button>
  </div>
`;

class ProjectCarousel extends HTMLElement {
  static get observedAttributes() {
    return ['username'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
  }

  connectedCallback() {
    this._setupNavigation();
    this._setupInfiniteLoopCorrection();
    this._loadProjects();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const usernameChanged = name === 'username' && oldValue !== newValue;
    if (usernameChanged && this.isConnected) {
      this._loadProjects();
    }
  }

  _setupNavigation() {
    const track = this.shadowRoot.querySelector('.carousel');
    const prevButton = this.shadowRoot.querySelector('.nav-button.prev');
    const nextButton = this.shadowRoot.querySelector('.nav-button.next');

    const scrollByCard = (direction) => {
      const card = track.querySelector('project-card');
      const step = card ? card.getBoundingClientRect().width + 12 : track.clientWidth * 0.8;
      track.scrollBy({ left: direction * step, behavior: 'smooth' });
    };

    prevButton.addEventListener('click', () => scrollByCard(-1));
    nextButton.addEventListener('click', () => scrollByCard(1));
  }

  _setupInfiniteLoopCorrection() {
    const track = this.shadowRoot.querySelector('.carousel');

    const normalize = () => {
      const oneSetWidth = track.scrollWidth / 3;
      if (!oneSetWidth) return;

      if (track.scrollLeft < oneSetWidth * 0.5) {
        this._jumpScrollTo(track, track.scrollLeft + oneSetWidth);
      } else if (track.scrollLeft > oneSetWidth * 1.5) {
        this._jumpScrollTo(track, track.scrollLeft - oneSetWidth);
      }
    };

    if ('onscrollend' in window) {
      track.addEventListener('scrollend', normalize);
    } else {
      let debounceId;
      track.addEventListener('scroll', () => {
        clearTimeout(debounceId);
        debounceId = setTimeout(normalize, 120);
      });
    }
  }

  _jumpScrollTo(track, scrollLeft) {
    const previousBehavior = track.style.scrollBehavior;
    track.style.scrollBehavior = 'auto';
    track.scrollLeft = scrollLeft;
    track.style.scrollBehavior = previousBehavior;
  }

  async _loadProjects() {
    const username = this.getAttribute('username');
    const container = this.shadowRoot.querySelector('.carousel');

    if (!username) {
      this._renderMessage(container, 'Nenhum usuário do GitHub configurado.', true);
      return;
    }

    this._renderMessage(container, 'Carregando projetos…', false);

    try {
      const repos = await fetchRepositories(username);

      if (repos.length === 0) {
        this._renderMessage(container, 'Nenhum repositório público encontrado.', false);
        return;
      }

      this._renderProjects(container, repos);

      this.dispatchEvent(
        new CustomEvent('projects-loaded', { detail: { count: repos.length }, bubbles: true })
      );
    } catch (error) {
      this._renderMessage(container, this._describeError(error), true);
    }
  }

  _buildCard(repo) {
    const card = document.createElement('project-card');
    card.setAttribute('name', repo.name);
    card.setAttribute('description', repo.description);
    card.setAttribute('url', repo.url);
    card.setAttribute('stars', String(repo.stars));
    if (repo.language) card.setAttribute('language', repo.language);
    return card;
  }

  _renderProjects(container, repos) {
    container.innerHTML = '';

    const MIDDLE_SET_INDEX = 1;
    for (let setIndex = 0; setIndex < 3; setIndex++) {
      const isCloneSet = setIndex !== MIDDLE_SET_INDEX;
      for (const repo of repos) {
        const card = this._buildCard(repo);
        if (isCloneSet) card.setAttribute('aria-hidden', 'true');
        container.appendChild(card);
      }
    }

    this._jumpScrollTo(container, container.scrollWidth / 3);
  }

  _describeError(error) {
    if (error instanceof GitHubApiError && error.status === 403) {
      return 'Limite de requisições da API do GitHub atingido. Tente novamente em instantes.';
    }
    return 'Não foi possível carregar os projetos agora.';
  }

  _renderMessage(container, text, isError) {
    container.innerHTML = `<p class="state-message${isError ? ' error' : ''}">${text}</p>`;
  }
}

customElements.define('project-carousel', ProjectCarousel);
})();
