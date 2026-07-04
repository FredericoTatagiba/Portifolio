(function () {
  const GITHUB_API_BASE = 'https://api.github.com';
  const CACHE_KEY_PREFIX = 'gh-repos-cache:';
  const CACHE_TTL_MS = 60 * 60 * 1000;

  class GitHubApiError extends Error {
    constructor(message, status) {
      super(message);
      this.name = 'GitHubApiError';
      this.status = status;
    }
  }

  function readCache(username) {
    try {
      const raw = localStorage.getItem(CACHE_KEY_PREFIX + username);
      if (!raw) return null;

      const { timestamp, data } = JSON.parse(raw);
      const isExpired = Date.now() - timestamp > CACHE_TTL_MS;
      return isExpired ? null : data;
    } catch {
      return null;
    }
  }

  function writeCache(username, data) {
    try {
      localStorage.setItem(
        CACHE_KEY_PREFIX + username,
        JSON.stringify({ timestamp: Date.now(), data })
      );
    } catch {
    }
  }

  function normalizeRepo(repo) {
    return {
      id: repo.id,
      name: repo.name,
      description: repo.description || 'Sem descrição.',
      url: repo.html_url,
      homepage: repo.homepage || null,
      language: repo.language || null,
      stars: repo.stargazers_count,
      updatedAt: repo.pushed_at,
      isFork: repo.fork,
    };
  }

  async function fetchRepositories(username, { useCache = true } = {}) {
    if (useCache) {
      const cached = readCache(username);
      if (cached) return cached;
    }

    const response = await fetch(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`,
      { headers: { Accept: 'application/vnd.github+json' } }
    );

    if (!response.ok) {
      throw new GitHubApiError(
        `GitHub API respondeu com status ${response.status}`,
        response.status
      );
    }

    const rawRepos = await response.json();
    const repos = rawRepos
      .filter((repo) => !repo.fork)
      .map(normalizeRepo)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    writeCache(username, repos);
    return repos;
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.GitHubAPI = { fetchRepositories, GitHubApiError };
})();
