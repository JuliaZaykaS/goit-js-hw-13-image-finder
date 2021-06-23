import '@pnotify/core/dist/BrightTheme.css';
const { defaults } = require('@pnotify/core');
const { error, notice, Stack } = require('@pnotify/core');
const debounce = require('lodash.debounce');

import * as basicLightbox from 'basiclightbox';

import galleryMarkup from './templates/gallery.hbs';
import css from './css/style.css';
import ImagesAPIService from './apiService';

const refs = {
  buttonEl: document.querySelector('#load-more-btn'),
  formEl: document.querySelector('#search-form'),
  listEl: document.querySelector('.gallery'),
  scrollPointEl: document.getElementById('gallery-container'),
  hiddenPointEl: document.getElementById('hidden-point'),
};

const myStack1 = new Stack({
  dir1: 'down',
  dir2: 'left',
  firstpos1: 25,
  firstpos2: 25,
  spacing1: 36,
  spacing2: 36,
  push: 'bottom',
  context: refs.formEl,
});

const myStack2 = new Stack({
  dir1: 'down',
  dir2: 'left',
  firstpos1: 25,
  firstpos2: 25,
  spacing1: 36,
  spacing2: 36,
  push: 'bottom',
  context: refs.hiddenPointEl,
});

const imagesAPIService = new ImagesAPIService();

function infinityScroll(render, notice) {
  const options = {
    rootMargin: '50px',
    threshold: 0.5,
  };
  const onEntry = entries => {
    if (entries[0].intersectionRatio <= 0) return;

    if (imagesAPIService.query === '') {
      clearMarkupForNewImages();
      return;
    }
    render();
    notice(myStack2);
  };

  const observer = new IntersectionObserver(onEntry, options);

  observer.observe(refs.hiddenPointEl);
}

infinityScroll(fetchAndRender, getNotice);


function renderGallery(array) {
  refs.listEl.insertAdjacentHTML('beforeend', galleryMarkup(array));
}

refs.formEl.addEventListener('input', debounce(onInputChange, 1500));
console.log(imagesAPIService);

function onInputChange(e) {
  e.preventDefault();
  imagesAPIService.query = e.target.value;

  if (imagesAPIService.query === '') {
    clearMarkupForNewImages();
    return;
  }
  imagesAPIService.resetPage();
  clearMarkupForNewImages();
  fetchAndRender();
  getNotice(myStack1);
}

function fetchAndRender() {
  imagesAPIService
    .fetchImages()
    .then(images => {
      // getNotice(myStack1);
      renderGallery(images);
      return images;
    })
    .then(data => {
      openModal(data);
    })
    .catch(getError)
    .finally(() => {
      refs.scrollPointEl.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    });
}

// refs.buttonEl.addEventListener('click', e => {
//   imagesAPIService.query = e.target.value;
//   if (imagesAPIService.query === '') {
//     clearMarkupForNewImages();
//     return;
//   }
//   // checkEmptyRequest();
//   fetchAndRender();
// });

function clearMarkupForNewImages() {
  refs.listEl.innerHTML = '';
}

function getError() {
  const myError = error({
    text: 'Ooops, something went wrong',
    stack: myStack,
  });
}

function getNotice(stack) {
  const myNotice = notice({
    text: 'Please wait, loading...',
    stack: stack,
  });
}

function openModal(data) {
  const arrayOfLargeURL = data.hits.map(elem => {
    return {
      src: elem.webformatURL,
      largeUrl: elem.largeImageURL,
    };
  });
   refs.listEl.addEventListener('click', e => {
    if (!e.target.classList.contains('image')) return;
    arrayOfLargeURL.find(elem => {
      if (elem.src === e.target.src) {
        const instance = basicLightbox.create(`<img src = "${elem.largeUrl}">`);
        instance.show();
      }
    });
  });
}
