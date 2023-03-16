import 'normalize.css';
import './styles/main.scss';
import { getCorrectDate, createBlur } from './utils';

const getSlctr = (cls) => document.querySelector(cls);

window.onload = function () {
  const form = getSlctr('.search__form');
  const inputField = getSlctr('.search__input');
  const searchField = getSlctr('.search__field');
  const list = getSlctr('.repo-list');

  let arrRepo = [];
  let error;

  inputField.onfocus = function () {
    this.style.width = '400px';

    if (searchField.classList.contains('invalid')) {
      let hint = document.querySelector('.hint');
      searchField.classList.remove('invalid');
      hint.remove();
    }
  };

  inputField.onblur = createBlur;

  form.onsubmit = async function getRepo(e) {
    e.preventDefault();

    if (inputField.value.trim() === '') {
      if (searchField.classList.contains('invalid')) {
        let hint = document.querySelector('.hint');
        searchField.classList.remove('invalid');
        hint.remove();
      }

      searchField.classList.add('invalid');

      let hint = document.createElement('div');
      hint.classList.add('hint');
      hint.innerHTML = 'Введите имя репозитория';
      document.body.append(hint);

      let hintCoords = {
        top: Math.round(
          searchField.getBoundingClientRect().top + hint.offsetHeight - 5
        ),
        left: Math.round(searchField.getBoundingClientRect().left),
      };

      hint.style.top = `${hintCoords.top}px`;
      hint.style.left = `${hintCoords.left}px`;
      return;
    }

    const response = await fetch(
      `https://api.github.com/search/repositories?q=${inputField.value}&per_page=10`
    );

    if (!response.ok) {
      error = response.status;
    } else {
      const data = await response.json();
      arrRepo = data.items;
    }

    inputField.value = '';
    inputField.style.width = '260px';
    inputField.blur();

    renderRepositories();
  };

  function renderRepositories() {
    let renderRepo = '';

    if (error) {
      list.innerHTML =
        renderRepo += `<h2 class='repo-list__error'>${error}</h2>`;
    } else if (arrRepo.length === 0) {
      list.innerHTML = `<h2 class='repo-list__error'>Ничего не найдено</h2>`;
    }

    arrRepo.forEach(function (repo) {
      renderRepo += `
      <li class="repo-list__item">
        <div class="repo-list__header">
          <i class="fa-solid fa-book-bookmark"></i>
          <a class="repo-list__link" href="${repo.html_url}" target="_blank">
            ${repo.full_name}
          </a>
        </div>
        <p class="repo-list__description">${repo.description}</p>
        <div class="repo-list__footer">
          <span class="repo-list__score"><i class="fa-regular fa-star">
            </i>${repo.stargazers_count ? repo.stargazers_count : ''}
          </span>
          <span class="repo-list__create">
            Updated on ${getCorrectDate(repo.updated_at)}
          </span>
        </div>
      </li>`;
      list.innerHTML = renderRepo;
    });
  }
};
