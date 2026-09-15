const repositoryList = document.querySelector('#repository-list');
const repositoryCount = document.querySelector('#repository-count');

const formatDate = (date) => new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
}).format(new Date(`${date}T00:00:00`));

const formatStars = (stars) => new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
}).format(stars);

const renderRepositories = (repositories) => {
  repositoryCount.textContent = `${repositories.length} ${repositories.length === 1 ? 'repository' : 'repositories'}`;

  if (repositories.length === 0) {
    repositoryList.innerHTML = '<li class="status-message">No starred repositories yet.</li>';
    return;
  }

  repositoryList.innerHTML = repositories.map((repository) => `
    <li class="repository">
      <div class="repository-topline">
        <div>
          <h3 class="repository-name"><a href="${repository.url}">${repository.name}</a></h3>
          <p class="repository-owner">${repository.owner}</p>
        </div>
        <time datetime="${repository.starredAt}">${formatDate(repository.starredAt)}</time>
      </div>
      <p class="repository-description">${repository.description}</p>
      <p class="repository-meta">
        <span class="language">${repository.language}</span>
        <span>${formatStars(repository.stars)} GitHub stars</span>
      </p>
    </li>
  `).join('');
};

const loadRepositories = async () => {
  try {
    const response = await fetch('events.json');

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    renderRepositories(await response.json());
  } catch (error) {
    repositoryCount.textContent = '';
    repositoryList.innerHTML = '<li class="status-message">The repository log could not be loaded.</li>';
    console.error('Unable to load starred repositories:', error);
  }
};

loadRepositories();