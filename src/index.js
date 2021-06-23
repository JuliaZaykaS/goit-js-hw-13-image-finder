import '@pnotify/core/dist/BrightTheme.css';
const { defaults } = require('@pnotify/core');
const { error, notice, Stack } = require('@pnotify/core');
const debounce = require('lodash.debounce');
// const basicLightbox = require('basiclightbox');
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

const myStack = new Stack({
  dir1: 'down',
  dir2: 'left',
  firstpos1: 25,
  firstpos2: 25,
  spacing1: 36,
  spacing2: 36,
  push: 'bottom',
  context: refs.formEl,
});

const imagesAPIService = new ImagesAPIService();
// console.log(imagesAPIService);

const options = {
  rootMargin: '50px',
  threshold: 0.5,
};

const onEntry = entries => {
  if (entries[0].intersectionRatio <= 0) return;
  console.log('hello world');
  // imagesAPIService.query = e.target.value;
  if (imagesAPIService.query === '') {
    clearMarkupForNewImages();
    return;
  }
  fetchAndRender();
};

const observer = new IntersectionObserver(onEntry, options);

observer.observe(refs.hiddenPointEl);

function renderGallery(array) {
  refs.listEl.insertAdjacentHTML('beforeend', galleryMarkup(array));
}

refs.formEl.addEventListener('input', debounce(onInputChange, 1500));
console.log(imagesAPIService);

function onInputChange(e) {
  e.preventDefault();
  imagesAPIService.query = e.target.value;
  // console.log(e.target.value);
  // console.log(imagesAPIService.query);
  if (imagesAPIService.query === '') {
    clearMarkupForNewImages();
    return;
  }
  // checkEmptyRequest();
  console.log(imagesAPIService);
  imagesAPIService.resetPage();
  clearMarkupForNewImages();
  fetchAndRender();
  // imagesAPIService.incrementPage();
  // scroll();
}

function fetchAndRender() {
  imagesAPIService
    .fetchImages()
    .then(images => {
      console.log(images);
      getNotice();
      renderGallery(images);
      return images;
    })
    .then(data => {
      console.log(data);
      console.log(data.hits);
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

function getNotice() {
  const myNotice = notice({
    text: 'Please wait, loading...',
    stack: myStack,
  });
}

function openModal(data) {
  const arrayOfLargeURL = data.hits.map(elem => {
    return {
      src: elem.webformatURL,
      largeUrl: elem.largeImageURL,
    };
  });
  console.log(arrayOfLargeURL);
  refs.listEl.addEventListener('click', e => {
    if (!e.target.classList.contains('image')) return;

    // console.log(e.target);
    arrayOfLargeURL.find(elem => {
      if (elem.src === e.target.src) {
        console.log(elem.largeUrl);
        const instance = basicLightbox.create(`<img src = "${elem.largeUrl}">`);
    // console.log(instance);
    instance.show();
        // return elem.largeUrl;
      }
    });
    // console.log(findUrl.largeUrl);
    // console.log(findUrl);
    // const instance = basicLightbox.create(`<img src = "${findUrl.largeUrl}">`);
    // // console.log(instance);
    // instance.show();
  });
}


