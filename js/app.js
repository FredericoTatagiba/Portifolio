// js/app.js
// Ponto de entrada: aplica a configuração do site aos componentes já
// registrados (carregados via <script> no index.html, nesta ordem: este
// arquivo deve ser o último). Único arquivo que conhece o "quem sou eu" —
// trocar de dono do portfólio significa editar só o SITE_CONFIG abaixo.

const SITE_CONFIG = {
  githubUsername: 'FredericoTatagiba',
  displayName: 'Frederico Tatagiba',
  bio: 'Desenvolvedor back-end (PHP/Laravel), explorando front-end e arquitetura de software.',
  // Deixe vazio ('') para usar o avatar do GitHub automaticamente. Para usar
  // uma foto própria, coloque o arquivo em assets/photo.jpg (ou outro nome) e
  // aponte o caminho aqui, ex.: 'assets/photo.jpg'.
  photoUrl: '',
  // Lista livre de especialidades/tecnologias exibidas como tags no perfil.
  specialties: ['PHP', 'Laravel', 'JavaScript', 'Arquitetura de Software', 'SOLID'],
  brand: 'Frederico Tatagiba',
  tagline: 'Portfólio de projetos',
};

function applyConfig(config) {
  const hero = document.querySelector('hero-profile');
  hero.setAttribute('username', config.githubUsername);
  hero.setAttribute('display-name', config.displayName);
  hero.setAttribute('bio', config.bio);
  if (config.photoUrl) hero.setAttribute('photo-url', config.photoUrl);
  if (config.specialties?.length) {
    hero.setAttribute('specialties', config.specialties.join(','));
  }

  const carousel = document.querySelector('project-carousel');
  carousel.setAttribute('username', config.githubUsername);

  const header = document.querySelector('app-header');
  header.setAttribute('brand', config.brand);
  header.setAttribute('tagline', config.tagline);
}

document.addEventListener('DOMContentLoaded', () => applyConfig(SITE_CONFIG));
